# Touchscreen Hardware Recovery

Recovered record of Sunny's physical 2.8-inch touchscreen hardware and the
prior ESP32 display bring-up work found on this computer (recovered
2026-08-16). **Documentation only** — the firmware itself lives in a
separate project and is NOT part of this repository (see "Architecture
separation" below).

## Confirmed hardware baseline

**ELEGOO / LCDWIKI E32R28T** — 2.8-inch, **240×320 native (portrait)**,
ILI9341 display controller, XPT2046 resistive touch, onboard
ESP32-WROOM-32E (no PSRAM, 4MB flash). ELEGOO markets it as "Elegoo CYD"
(Cheap Yellow Display family).

This corrects the earlier SunnyUI docs' claim that the 1024×600 design
reference was the onboard resolution — it is not. 1024×600 remains the
*design token reference* only.

### Viewport planning targets

| Orientation | Logical resolution | Status |
|---|---|---|
| Native portrait | 240 × 320 | Possible, but not what was tested |
| **Rotated landscape** | **320 × 240** | **Physically validated on real hardware 2026-08-08 at `setRotation(3)`** |

The prior bring-up ran the panel in **landscape 320×240 at rotation=3**
(`rotation=1` was tried first and found upside-down on the real board;
`rotation=3` is 180° from it and was confirmed right-side-up). All applied
touch calibration below was fitted **at rotation=3 landscape** — if the
UI is ever run in portrait, recalibration is required.

## Source of all recovered information

Prior work found in the (separate, untouched) firmware project:

```
/home/jeese/DOBETTERCODE/DBCODE/projects/sunny-display-esp32/
```

Key files (all paths relative to that project):

| File | Contents |
|---|---|
| `docs/DISPLAY_HARDWARE.md` | Full hardware identity, evidence-cited pin map, driver rationale, calibration bug/fix record, memory plan, roadmap |
| `include/Config.h` | Every pin definition (all CONFIRMED against the official LCDWIKI schematic) |
| `include/LGFXDevice.h` | LovyanGFX device config: SPI hosts/frequencies, panel + backlight + touch setup |
| `src/DisplayManager.cpp` | `setRotation(3)`; LVGL display creation at 320×240 logical |
| `src/TouchManager.cpp` | The applied `CAL_*` calibration constants |
| `include/Calibration.h` + `src/…` | Calibration math (per-axis linear fit) |
| `include/lv_conf.h` | Hand-written LVGL 9.5.0 config |
| `test_host/final_touch_calibration.cpp` | Regression test locking in the measured calibration dataset |
| `README.md` | Bring-up status: V1.2.1 physically validated 2026-08-08; V1.2.2 calibration fix 2026-08-09, physical retest pending |

The pin map's primary source (cited in that project): LCDWIKI's official
"2.8inch ESP32-32E E32R28T&E32N28T User Manual" schematic —
`https://www.lcdwiki.com/res/E32R28T/2.8inch_ESP32-32E_E32R28T_E32N28T_User_Manual.pdf`.

A folder/workspace named `SUNNY-ENGINEERING` was searched for and **does
not exist on this computer** (filesystem, VS Code workspace records, and
config stores all checked — the only matches were this recovery session's
own logs).

## Recovered hardware profile

### BOARD

- Model: ELEGOO ESP32 2.8" Touch Display (LCDWIKI E32R28T)
- MCU: ESP32-WROOM-32E (ESP32-D0WD-V3), no PSRAM, 4MB QSPI flash, 520KB SRAM
- Framework previously used: PlatformIO, `platform = espressif32`, `board = esp32dev`, Arduino framework

### DISPLAY

- Panel: 2.8" TFT LCD
- Controller: ILI9341, 4-wire SPI
- Native resolution: 240 × 320 (portrait)
- Working orientation: **landscape, 320 × 240 logical**
- Rotation value: **`setRotation(3)`** (physically validated; rotation=1 was upside-down)
- SPI frequency: **40 MHz write / 16 MHz read** (VSPI host, dedicated bus, DMA auto)
- Color format: RGB565, 16-bit (`LV_COLOR_DEPTH 16`); `invert = false`; `rgb_order = false` (BGR default); confirmed colors-correct on hardware

### TOUCH

- Controller: XPT2046 (resistive), on its **own fully independent SPI bus** (HSPI host — no bus sharing with the LCD)
- Touch type: resistive
- Touch CS: GPIO 33
- Touch IRQ: GPIO 36 (input-only, active-LOW on contact)
- Touch SCLK / MOSI(DIN) / MISO(DOUT): GPIO 25 / 32 / 39 (39 input-only)
- Touch SPI frequency: 1 MHz
- Calibration model: **per-axis linear fit** (scale + offset), NOT raw min/max. Raw 12-bit range 0–4095 is only the ADC range, not calibration.
- Applied constants (fitted 2026-08-09 from a 5-point measured dataset at rotation=3 landscape; from `src/TouchManager.cpp`):
  - `CAL_SWAP_AXES = true` (screenX is driven by rawY and vice versa; confirmed by Pearson correlation, corr(rawX,screenY)=0.99996)
  - `CAL_SCALE_X = 0.09019494`, `CAL_OFFSET_X = -16.02758` → screenX = scaleX·rawY + offsetX
  - `CAL_SCALE_Y = 0.06781033`, `CAL_OFFSET_Y = -18.23129` → screenY = scaleY·rawX + offsetY
- Measured dataset behind those constants (target → raw → error under the fitted model, <1.4px at all 5 points):
  - TOP-LEFT (30,30): raw (721,519), 1.4px
  - TOP-RIGHT (289,30): raw (702,3382), 1.0px
  - BOTTOM-RIGHT (289,209): raw (3365,3387), 1.0px
  - BOTTOM-LEFT (30,209): raw (3337,507), 1.0px
  - CENTER (160,120): raw (2038,1941), 1.0px
- Swap XY: true (see above). Invert X / Invert Y: not separate flags in this model — sign is carried by the fitted scale (both scales positive in the applied fit).
- Status caveat: the fitted model is host-test verified (<2px on the measured dataset) and applied in firmware, but the on-hardware **physical retest of V1.2.2 was still pending** as of the recovered record. Known-good on-hardware touch behavior was validated under V1.2.1's TAP TEST.

### DISPLAY GPIO (all CONFIRMED against the official schematic)

- MOSI: GPIO 13 · MISO: GPIO 12 · SCLK: GPIO 14
- CS: GPIO 15 · DC/RS: GPIO 2
- RST: none — tied to the module EN/system reset line (`pin_rst = -1`)
- Backlight: GPIO 21, active-HIGH via BSS138 FET, PWM-capable (12 kHz, PWM channel 7 in prior firmware), **OFF by default at power-on** — firmware must drive it

### OTHER BOARD PERIPHERALS (recovered, for completeness)

- MicroSD (SPI, shared with expansion header): CS 5, MOSI 23, SCLK 18, MISO 19
- RGB status LED (common-anode, active-LOW): R=17, G=22, B=16 (pin set confirmed; per-channel color assignment high-confidence, not re-verified)
- Audio: FM8002E amp enable GPIO 4, DAC out GPIO 26 (mono speaker terminal)
- Battery sense: GPIO 34 ADC through 100K/100K divider (multiply reading ×2)
- Only genuinely free GPIOs: 27 (bidirectional) and 35 (input-only)
- UART0 (GPIO 1/3) is shared between USB-C (CH340C) and the external serial header — not free for inter-controller links without contention

### LIBRARIES

- Display + touch library: **LovyanGFX ^1.1.16** (native `Panel_ILI9341` + `Touch_XPT2046`; chosen over TFT_eSPI — no `User_Setup.h` patching)
- LVGL: **9.5.0** (`lvgl/lvgl @ ^9.5.0`), hand-written `lv_conf.h` (`-DLV_CONF_INCLUDE_SIMPLE`)
- LVGL specifics: RGB565; `malloc`/`free` (no static pool — no PSRAM); tick from `millis()`; 30ms refresh/input periods (~33Hz); only LABEL + BUTTON explicitly enabled (force-disabling unused widgets broke the build via internal widget dependencies — documented lesson); default theme, montserrat_14
- Draw buffers: two rotating **240×15 strip buffers** (14,400 bytes total) — a 30-line buffer overflowed DRAM by 8,248 bytes at link time; do not enlarge without a clean-build re-verify
- Measured footprint: DRAM 111,224/327,680 (33.9%); flash 661,477/1,310,720 (50.5% of default app partition)

### KNOWN-GOOD TESTS

- **V1.2.1 standalone bring-up — physically validated 2026-08-08:** display init, correct rendering, colors, text, LVGL rendering, no tearing, touch init, TAP TEST button responding at the correct location (landscape, rotation=3)
- **V1.2.2 calibration fix — host-verified 2026-08-09, physical retest pending:** on-device 5-target calibration screen (diagnostic mode), TOUCH_VALIDATION boot screen, and four host-runnable pure-logic test programs in `test_host/` (`ui_state_model`, `touch_calibration`, `calibration_math`, `final_touch_calibration`) — build/run with plain g++, no hardware needed
- Prebuilt firmware exists at `.pio/build/esp32-wroom-32e/firmware.bin` (built 2026-08-09)
- Upload: via the board's own USB-C, `pio run -t upload` at 921600, monitor at 115200. **Standalone-first safety rule:** do not electrically connect this board to the Sunny body ESP32-S3 yet

## NOT YET RECOVERED

- Physical confirmation of the V1.2.2 fitted calibration on hardware (was pending when the record was written)
- Measured current draw of the display board
- Any portrait-orientation calibration (never performed)
- `SUNNY-ENGINEERING` workspace — does not exist on this machine

## Additional reference material found (not needed for calibration)

- `~/Downloads/Sunny_UI_Reference_Pack.zip` — touchscreen mockups (current boot + home screens) and Sunny character reference images (2026-08-09)
- `~/Downloads/Sunny Electrical Design V1.kicad_*` — KiCad electrical design files
- `~/Downloads/LVGL_Pro_Editor-v2.0.2-rc1-x86_64.AppImage` + CLI — LVGL Pro tooling already downloaded
- `~/.config/lvgl-editor` / `~/.config/LVGL Pro Editor` — LVGL editor config present on this machine

## Architecture separation (do not merge)

- **SunnyUI (this repo)** — React/Vite UI prototype: visual design, animation behavior, touchscreen layout reference, pv1.1 adaptation work
- **`DBCODE/projects/sunny-display-esp32` (separate project)** — ESP32 firmware: ILI9341 driver, XPT2046 touch, LVGL, hardware calibration

The web UI is the design/reference implementation; the ESP32 project is
the physical implementation. They target the same device but remain
separate codebases and separate Git histories.

## Implication for pv1.1-touchscreen work

The evidence says the physical target for layout testing is **landscape
320 × 240** (the validated orientation), with portrait 240×320 recorded as
the untested alternative. Confirm with the project owner before locking
any layout to one orientation.

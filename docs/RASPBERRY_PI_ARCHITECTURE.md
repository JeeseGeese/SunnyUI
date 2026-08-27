# Raspberry Pi 3B+ — Architecture Planning (FUTURE / NOT IMPLEMENTED)

> **STATUS: PLANNING ONLY.** No Pi wiring, firmware, or integration code
> exists. Nothing in this document has been physically validated. It
> records the intended ownership model, evaluated topologies, and the
> open questions that must be answered *before* hardware work starts.
>
> Started 2026-08-27.

Canonical board photos: [`hardware/reference/raspberry-pi-3b-plus/README.md`](hardware/reference/raspberry-pi-3b-plus/README.md)

## 1. Evidence authority

For any technical claim about the Pi:

1. **Official Raspberry Pi documentation**, and
2. **Verification against the actual physical board**

take precedence over the third-party annotated layout image. That image
is a **connector/component location aid only** — its printed
specifications are not authoritative for this project.

For claims about Sunny's existing two controllers, the authoritative
sources are the firmware repo's own living documents (`DBCODE`):

| Fact | Source |
|---|---|
| Body GPIO assignments, reserved pins | `sunflower-esp32-s3/docs/current/GPIO_MAP.md` |
| Rail layout, brownout investigation | `sunflower-esp32-s3/docs/current/POWER.md` |
| Peripheral wiring detail | `sunflower-esp32-s3/docs/current/ELECTRICAL.md` |
| Display pin map, free-pin audit | `sunny-display-esp32/docs/DISPLAY_HARDWARE.md` |
| P2 link, power hazard, dev workflow | `sunny-display-esp32/docs/DISPLAY_BODY_LINK.md` |
| Why Wi-Fi OTA was deferred | `sunny-display-esp32/docs/OTA_WORKFLOW.md` |

Statements below tagged **[CONFIRMED]** are sourced from those documents.
**[PROPOSED]** is this document's own reasoning and is unvalidated.
**[OPEN]** is an unanswered question.

## 2. Intended ownership model

Three processors, each owning what it is actually good at.

### Raspberry Pi 3B+ — services, storage, network

- canonical Audio Library / bulk storage
- networking
- future LLM / AI services
- future camera services
- possible centralized firmware/update orchestration
- heavier non-real-time processing

### Body ESP32-S3 — authoritative real-time hardware state

- LEDs
- motor
- speaker / I2S
- microphone / reactive behavior
- physical buttons
- deterministic hardware control

### Display ESP32 — UI surface

- touchscreen UI / controller
- status / diagnostics
- lightweight local runtime assets

### The rule that governs all three

**The Pi is additive. It is never a boot dependency.**

This is not a new principle — it is the existing, physically validated
Body↔Display doctrine extended to a third box. Per
`DISPLAY_BODY_LINK.md` **[CONFIRMED]**: if the link is absent, the
Display boots and runs its full standalone UI, `isBodyLinked()` reports
false, and no UI or animation path is gated on link state; the Body
keeps running buttons, LEDs, motor and audio unchanged.

Sunny must therefore still power on and behave correctly with the Pi
unplugged, unbooted, or crashed. Linux is not a real-time system and
must never sit in a hardware control loop — **real-time authority stays
on the Body**, which is exactly why the ownership split above puts
motor/LED/audio timing there and analytics/storage/network on the Pi.

## 3. Current physical baseline (what the Pi must integrate with)

All **[CONFIRMED]** from the firmware repo.

```
        Sunny 5V rail ──┬── WS2812B LEDs (36)
                        ├── MAX98357A amplifier
                        ├── DRV8833 motor driver
                        └── Display P2 pin 1 (via onboard FET Q5)

  Body ESP32-S3 ── Serial1 GPIO12(RX)/13(TX) ──┐
   │                                            │  P2, 115200 8N1
   │  CH343 USB (1a86:55d3, /dev/ttyACM*)       │  newline ASCII
   │  console UART0 = GPIO43/44                 │
   │                                            ▼
   │                              Display ESP32-WROOM-32E
   │                               P2 pin 3 TXD0/GPIO1
   │                               P2 pin 4 RXD0/GPIO3
   │                               CH340C USB-C (1a86:7523, /dev/ttyUSB*)
```

Constraints that shape every option in §4:

- **The Display's P2 link *is* UART0** — the same physical UART as its
  USB-C console. It is not an independent second port.
- **The CH340 contends with the Body's TX** on the shared RXD0 net
  whenever a USB host is actively enumerated. Physically confirmed.
- **[PHYS] Never connect the Display's USB-C and Sunny's 5V rail
  simultaneously.** P2 pin 1's raw +5V node has zero diode isolation
  from the Type-C VBUS pins; two independently-driven sources on that
  node risks backfeeding the USB host. Proven from the schematic.
- **The Display has almost no free GPIO** — effectively IO27
  (bidirectional) and IO35 (input-only). BOOT is GPIO0; RESET is a
  hardware EN line via a discrete button/RC circuit, not a GPIO.
  Neither EN nor GPIO0 is present on the P2 connector.
- **The Body's USB console is independent** of the P2 link and may stay
  connected during normal operation — but see the power caveat in §6.
- **Wi-Fi OTA on the Display is DEFERRED** on measured evidence:
  contiguous internal DRAM, not Flash. Merely *compiling* networking
  costs ~27,348 B static and drops the post-screen largest free block
  from 69,620 B to 42,996 B — below the 52,224 B display buffer. This
  is precisely why an external Pi-driven update path is attractive.

## 4. Topology evaluation

### Option A — chain: `Pi ↔ Body ↔ Display`

Pi connects only to the Body; the Display keeps its existing P2 link.

| Criterion | Assessment |
|---|---|
| Wiring complexity | **Best.** One USB cable. Zero new wires, zero board modification. |
| UART/USB | 1 Pi USB port. No Pi GPIO, no Pi UART. |
| Bandwidth | Pi↔Body good (USB CDC). Anything Pi→Display is relayed through the Body's 115200 P2 link — ~11.5 KB/s ceiling. |
| Fault isolation | **Worst.** Body is a hard single point of failure for all Pi↔Display traffic. |
| Boot independence | Fine — both ESPs already boot standalone. |
| Debugging | **Poor.** No Display console. P2 *is* UART0, so it cannot be monitored while linked. |
| Future audio transport | Good, if audio is Pi→Body. Bad if audio must reach the Display. |
| Firmware flashing | Body: easy. Display: requires the Body to act as an esptool bridge *and* drive the Display's EN/GPIO0 — a failed Body flash then destroys the only path to the Display. |
| Field serviceability | Simple cabling; poor recovery story. |

### Option B — star: `Pi ↔ Body` + `Pi ↔ Display`

The Pi is the hub; the Body↔Display P2 link is severed or repurposed.

| Criterion | Assessment |
|---|---|
| Wiring complexity | Higher — a second Pi↔Display leg that does not currently exist. |
| UART/USB | 2 Pi USB ports, or 1 USB + Pi UART on GPIO14/15. |
| Bandwidth | **Best.** Two independent links, neither relaying for the other. |
| Fault isolation | Good per-leg, but the Pi becomes the SPOF for *all* Body↔Display coordination. |
| Boot independence | **Regression risk.** Body↔Display state sync would now depend on Linux being up. |
| Debugging | **Best.** The Pi sees both consoles. |
| Future audio transport | Best. |
| Firmware flashing | Pi can flash both directly. |
| Field serviceability | Good, but discards a physically validated link. |

**The decisive objection:** the Body↔Display `LinkManager` protocol is
already physically validated (32/32 PING/PONG, 8/8 GET_STATUS, zero
desyncs) and carries *real-time* state — unsolicited `STATE` pushes when
a physical button changes body lights, `MIC_LEVEL` telemetry, record
state. Proxying that through Linux adds jitter and a boot dependency to
a path that currently has neither. Option B trades a working guarantee
for convenience.

### Option C — hybrid (RECOMMENDED): `Pi ↔ Body` + `Body ↔ Display` retained, with a *separate, later* Pi↔Display service leg

```
   Pi ──USB(CDC)── Body ESP32-S3 ──P2(UART,115200)── Display ESP32
    └╌╌╌╌╌╌ deferred service/flash leg ╌╌╌╌╌╌╌╌╌╌╌╌╌╌┘
                  (switched; never concurrent with P2 5V — see §5)
```

- Real-time Body↔Display state stays on the validated P2 link,
  untouched, with no Linux in the loop.
- The Pi attaches to the Body over USB — **safe today, zero new
  wiring**, and immediately gives esptool-based Body flashing plus
  console telemetry.
- The Pi↔Display leg is **not** a general-purpose runtime channel. It is
  a *maintenance* leg: firmware flashing and SD asset transfer, brought
  up only when needed, and mutually exclusive with the P2 connection.

**Why this ranks first:** it is the only option that adds Pi capability
without weakening a physically validated guarantee, and its first phase
costs one USB cable. It also matches the ownership model in §2 — the Pi
does not need a fast Display link, because under that model the Display
owns only lightweight local runtime assets.

### Audio transport consequence (important)

Today the Audio Library lives on the **Display's** microSD, with a
planned Display-SD → Body playback transport **[CONFIRMED]**. The
ownership model in §2 makes the **Pi** the canonical library owner. That
is a genuine re-architecture, and it favours Option C:

    16-bit 22.05 kHz mono ≈ 44 KB/s required
    P2 UART @ 115200      ≈ 11.5 KB/s      -- insufficient  [PROPOSED]
    USB CDC @ 921600      ≈ 92 KB/s        -- feasible      [PROPOSED]

Under Option C, audio flows **Pi → Body over USB**, which is both the
higher-bandwidth path and the one that reaches the processor that
actually owns the I2S amplifier. The Display's SD then keeps animation
assets only. Bit rates above are arithmetic, not measurements — the real
format, buffering and transport design are future work.

## 5. Centralized update architecture

Goal: the Pi becomes Sunny's update/programming orchestrator for Body
firmware, Display firmware, Pi software, Display SD assets, and future
controllers. Preference is for **standard ESP ROM bootloader / esptool
workflows**, not bespoke protocols.

### Body ESP32-S3 — straightforward

The Body exposes a CH343 USB bridge with a standard auto-download
circuit. The Pi runs stock `esptool.py` over `/dev/ttyACM*`. No GPIO
control, no extra wiring, no board modification. **This is the single
cleanest win available and should be prototyped first.**

### Display ESP32 — the hard case

Three requirements collide: the Display's only UART is shared with its
USB bridge; its USB VBUS must never be live at the same time as P2's
5V; and neither EN nor GPIO0 appears on P2.

**Path 1 — switched USB + power interlock [PROPOSED, RECOMMENDED]**

Use the board's existing, proven one-click auto-download circuit and
stock esptool, by guaranteeing only one 5V source is ever live:

1. Pi commands the Body to release the P2 link (tri-state its TX,
   GPIO13 → input). *Requires a small Body firmware addition.*
2. Pi opens a high-side load switch, removing P2 +5V from the Display.
3. Pi enables VBUS to the Display's USB-C. The board is now powered
   from VBUS **only** — single source, no contention.
4. Pi runs stock `esptool.py` against `/dev/ttyUSB*`.
5. Reverse the sequence; the Body re-acquires P2.

*Costs:* a per-port power-switched USB hub (or a VBUS load switch), a
load switch on P2 pin 1, one or two Pi GPIOs, and a Body firmware
command. *Benefit:* no soldering to the Display board, stock tooling.
**The two switches must be hardware-interlocked so both sources can
never be enabled simultaneously — a software-only interlock is not
acceptable against a hazard the schematic already proves.**

**Path 2 — direct UART + EN/BOOT control [PROPOSED, ALTERNATIVE]**

Pi UART → P2 pins 3/4, plus two Pi GPIOs tapped to the Display's EN and
BOOT (GPIO0) button pads, driving the reset-into-download sequence
directly. *Advantage:* the Display never leaves P2 power, so the
dual-supply hazard never arises at all — arguably the safer end state.
*Cost:* two solder taps onto a consumer board, and it still needs the
Body to release P2. Pi GPIO is 3.3 V, matching ESP32 logic **[CONFIRMED
for both, from official pin levels — verify on the board]**.

**Path 3 — Body-as-bridge [NOT RECOMMENDED]**

The user's instruction not to assume this is required is well-founded.
It puts an esptool implementation inside real-time firmware, and makes a
failed Body flash unrecoverable-without-disassembly for the Display.
Rejected unless Paths 1 and 2 both prove unworkable.

### Display SD assets

Current transport is `SFX PUT <path> <size>` over the serial link at
115200 **[CONFIRMED]**. At ~2.3 MB of animation assets that is on the
order of several minutes at best. Raising the baud rate, or moving bulk
asset transfer onto whichever Pi↔Display leg §4 settles on, is future
work. **[OPEN]**

### Recovery from a failed flash

- Both ESP32 parts have a **mask-ROM bootloader** — they cannot be
  bricked by a bad application image so long as EN/GPIO0 control works.
- **Physical USB recovery flashing must be preserved permanently**, for
  both boards. This is already the firmware project's stated rule and
  the Pi must not become the only way in.
- The Pi itself needs a recovery story too: a known-good SD image and a
  documented reflash procedure. **[OPEN]**
- Update orchestration must verify images by hash before and after
  writing — the project already hash-verifies its four USB-flashed
  images.

## 6. Power architecture — planning only

> **No supply topology is proposed here.** The questions below are the
> deliverable; answering them requires measurement, not reasoning.

### The finding that dominates this section

Sunny has an **open, unclosed brownout investigation** **[CONFIRMED]**.
`BROWNOUT_RST` resets were observed under combined LED + motor load. The
current leading hypothesis is incoming source-power capability: the
brownouts occurred on computer-USB power and did not reproduce on a
battery pack. Root cause is explicitly **not** formally closed, and the
shared 5V rail has never been characterized under simultaneous peak
load.

The project's own `POWER_STANDARD.md` states: *never power a
current-hungry peripheral from the MCU's own logic rail; use a
separately-rated supply.*

A Raspberry Pi 3B+ is a current-hungry peripheral. **Adding it to a rail
with an open brownout defect would be building on a known-unstable
foundation.** The strong prior is therefore a separate, adequately rated
supply for the Pi with a common ground — but this is stated as a
starting hypothesis to test, not a decision.

### Open questions — all UNRESOLVED

| # | Question | Status |
|---|---|---|
| P1 | How will the Pi 3B+ receive 5V — micro-USB input, or GPIO 5V pins (which bypass the board's input protection)? | **[OPEN]** |
| P2 | Will the Pi share Sunny's main 5V rail, or run from its own supply? | **[OPEN]** — see the brownout finding above |
| P3 | What current headroom is required? Official guidance for the 3B+ is a 5V/2.5A supply; actual Sunny-case draw (idle, Wi-Fi active, under LLM/camera load) is unmeasured. | **[OPEN]** |
| P4 | How will grounds be tied? Note a USB cable *already* bonds Pi GND to Body GND — ground topology exists the moment the first cable is plugged in. | **[OPEN]** |
| P5 | How do we avoid unsafe dual-power paths? The Display case is already proven hazardous; the Pi adds a third 5V source to the system. | **[OPEN]** |
| P6 | Will the ESP32 USB ports remain serviceable for recovery flashing once the Pi is mounted? | **[OPEN]** |
| P7 | **Does connecting the Pi's USB to the Body while Sunny's 5V rail is live create a dual-supply path on the Body?** The firmware docs state the Body's USB "has no equivalent sharing problem", but the evidence given for that is *UART independence*, not power isolation. The Body's VBUS-to-5V-rail isolation has not been established in any document reviewed. | **[OPEN — verify against the Body board's schematic before permanently cabling Pi→Body]** |
| P8 | Power sequencing: what happens if the Pi boots before/after Sunny's rail, or if one drops while the other stays up? | **[OPEN]** |
| P9 | Inrush at simultaneous power-on of Pi + Sunny. | **[OPEN]** |

P7 is the one that gates §5's "cleanest win" — the Pi→Body USB link is
only trivially safe if the Body's power path is genuinely isolated.

### Non-power risk worth recording here

The Pi runs from an SD card and **corrupts on hard power removal**.
Sunny is a device that will be switched off. Graceful shutdown, a
read-only root filesystem, or both, must be part of the design.

## 7. Rebuildability requirement

The Sunny disaster-recovery doctrine applies: **the Pi's configuration
must be reproducible from the repository.** A Pi that only exists as a
hand-configured SD card is an undocumented single point of failure.

Future Pi documentation must preserve:

- OS and version
- install / provisioning steps
- packages
- services
- configuration templates
- startup behavior
- firmware-update tooling
- audio-library structure
- network architecture
- backup / recovery process

Provisioning should be captured as scripts or declarative config that
can rebuild the Pi from a blank card, not as prose describing what
someone once typed.

### Secrets

Per the global NETWORKED CODE SECURITY RULE and the firmware project's
`SECURITY_SECRETS.md`, and with force — the Pi is the first
*genuinely* network-attached part of Sunny, carrying Wi-Fi credentials,
possibly SSH keys, and future LLM API keys.

- **No real credentials in Git**, in either repo.
- Committed placeholder templates + gitignored real local config, matching
  the existing `secrets.h` / `secrets.h.example` convention.
- No credentials in logs, docs, reports, prompts, or serial output.
- `git check-ignore -v <file>` must be used to verify ignores — an
  entry in `.gitignore` is not by itself proof.

## 8. What must be answered before any wiring

1. **P7** — Body USB/rail isolation, from the schematic.
2. **P2/P3** — measured Pi current draw and a decision on rail sharing.
3. Whether the brownout investigation must be closed *first*. **[OPEN]**
4. Display flash path: §5 Path 1 vs Path 2.
5. Whether the Audio Library actually moves to the Pi, since that
   reshapes the Display's SD role.

## 9. Simplest prototype plan (no Sunny hardware modification)

Deliberately scoped so nothing about Sunny changes and nothing is mounted.

**Stage 0 — bench, isolated**
Pi on its own official supply, on the bench. Sunny on its existing
supply. Single USB cable Pi → Body. Verify: `esptool.py` identifies the
Body, a known-good firmware image flashes and boots, and the Body
console is readable from the Pi. Measure Pi current draw at idle and
under load. **Answer P7 from the schematic before this cable stays
connected for any length of time.**

**Stage 1 — orchestration, still bench**
Script the Body flash end to end on the Pi: fetch image, verify hash,
flash, confirm boot, report. This is the update architecture's core loop
with the easiest target.

**Stage 2 — decide the Display path**
On the bench only, with Sunny's rail disconnected from the Display,
evaluate §5 Path 1 vs Path 2 against the real board and schematic.

No mounting, no rail sharing, no camera, and no Display wiring until
Stages 0–2 are done and the power questions are answered.

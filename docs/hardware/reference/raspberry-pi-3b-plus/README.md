# Raspberry Pi 3 Model B+ — Hardware Visual Reference

Canonical Sunny visual references for the Raspberry Pi 3 Model B+ board.
**Reference images only** — no Pi wiring, firmware or integration work has
started, and nothing here has been verified against the physical board yet.

Added 2026-08-27.

## Files

| File | Role |
|---|---|
| `sunny_raspberry_pi_3b_plus_front_top_reference.jpg` | Top / front PCB view (component side) |
| `sunny_raspberry_pi_3b_plus_rear_bottom_reference.jpg` | Rear / bottom PCB view (microSD slot side) |
| `sunny_raspberry_pi_3b_plus_labeled_component_layout.webp` | Labeled connector / component layout diagram |

The images are stored **unmodified** — original supplied bytes, renamed only.
Not resized, recompressed, cropped or annotated.

```
sha256
0e9846c1c6a75f95d2f23eeb0b269dac42624e3521b028a7730b591ea1da07f9  sunny_raspberry_pi_3b_plus_front_top_reference.jpg
f8b60b5db3ace34f4143d1facd211f8288e5201e2c80d6fde85b6a7574823b3f  sunny_raspberry_pi_3b_plus_labeled_component_layout.webp
8a74cecd08d43d5770e83f83ccf4ab85bad0934b80264f6fe84078737c6d0316  sunny_raspberry_pi_3b_plus_rear_bottom_reference.jpg
```

## Board identification

**Raspberry Pi 3 Model B+**, 2017 generation (silkscreen reads
`Raspberry Pi 3 Model B+` / `(c) Raspberry Pi 2017`).

Interfaces visible on the board:

- 40-pin GPIO header (J8)
- 4 × USB
- Ethernet
- microSD (underside)
- HDMI
- CSI camera connector
- DSI display connector
- 2.4 / 5 GHz Wi-Fi
- Bluetooth
- 5 V micro-USB power input

## Status of these facts

The list above is read off the supplied images. It is **not** a verified
inventory of the physical board in hand, and it is not a full spec sheet —
deliberately so. Anything beyond the interfaces listed (SoC part number,
clock speed, RAM, PoE header behaviour, USB current limits, exact power
requirements) has **not** been independently confirmed and should be
checked against the real board and official documentation before any
design decision depends on it.

The labeled layout image is a third-party annotated diagram carrying its
own watermark. Its callouts are useful for locating connectors; treat its
written specifications as unconfirmed.

## Intended use

These references support upcoming, not-yet-started work on:

- Sunny Raspberry Pi integration
- Pi ↔ Body ESP32 communication
- Pi ↔ Display ESP32 communication
- Centralized firmware / update architecture
- Audio Library ownership
- Future networking / LLM services
- Future camera integration
- Power and mounting planning

## Architecture separation

Consistent with `docs/TOUCHSCREEN_HARDWARE_RECOVERY.md`: this repository
holds **documentation and UI work**. Firmware lives in a separate project
and is not part of this repo.

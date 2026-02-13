
# STM32 Audio Processor

Development of a digital audio engine for real-time signal processing.

## Highlights
- Optimised Reverb and Delay algorithms.
- External DAC via I2S for high fidelity.
- Latency under 10ms.

## Software Architecture
The system utilises circular buffers and DMA interrupts to ensure the audio stream is never interrupted by interface processing.

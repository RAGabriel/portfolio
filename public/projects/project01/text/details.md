
# Industrial IoT Monitoring System

## Description
This project was developed to address the requirement for telemetry in a manufacturing plant where cabling was unfeasible. The system acts as a bridge between high-precision industrial sensors and a centralised cloud monitoring platform.

Focus was placed on **reliability** and **uptime**, ensuring that even in the case of network fluctuations, data is buffered locally and re-synchronised once the connection is restored.

## Materials
- **Processor:** ESP32-WROOM-32D (chosen for Dual-Core capabilities)
- **RF Module:** SX1276 LoRa Transceiver (868MHz)
- **Power:** Isolated DC-DC Converter (12V to 3.3V)
- **Stack:** C++ (Arduino/ESP-IDF), FreeRTOS for task scheduling
- **Enclosure:** IP67 Industrial rated with EMI shielding paint

## Results
The prototype achieved a range of **2.4km in a dense urban environment** with a packet error rate (PER) of less than 1.2%. We successfully monitored 14 different CNC machines simultaneously with a latency of < 500ms for critical alarms.

```cpp
// Example of the RTOS Task for RF Communication
void loraTask(void *pvParameters) {
  for(;;) {
    if (xQueueReceive(sensorQueue, &data, portMAX_DELAY)) {
      sendPayload(data);
    }
  }
}
```

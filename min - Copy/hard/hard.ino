#include <WiFi.h>
#include <WebServer.h>
#include <math.h>

#include "soc/soc.h"
#include "soc/rtc_cntl_reg.h"

const char* ssid = "phone";
const char* password = "11111111";

WebServer server(80);

// Pins
#define RELAY_PIN 33
#define CURRENT_PIN 34
#define VOLTAGE_PIN 35

bool relayState = false;

// Calibration
float voltageCalibration = 230.0;
float currentCalibration = 20.0;

float voltage = 0, current = 0, power = 0, energy = 0;
unsigned long lastTime = 0;

// -------- SENSOR FUNCTIONS --------
float readVoltage() {
  int samples = 500;
  float sum = 0;

  for (int i = 0; i < samples; i++) {
    float val = analogRead(VOLTAGE_PIN) - 2048;
    sum += val * val;
  }

  float rms = sqrt(sum / samples);
  return (rms * voltageCalibration) / 2048.0;
}

float readCurrent() {
  int samples = 500;
  float sum = 0;

  for (int i = 0; i < samples; i++) {
    float val = analogRead(CURRENT_PIN) - 2048;
    sum += val * val;
  }

  float rms = sqrt(sum / samples);
  return (rms * currentCalibration) / 2048.0;
}

// -------- WEB PAGE --------
String getHTML() {
  String html = "<html><body>";
  html += "<h2>Smart Meter</h2>";

  html += "<p>Voltage: " + String(voltage) + " V</p>";
  html += "<p>Current: " + String(current) + " A</p>";
  html += "<p>Power: " + String(power) + " W</p>";
  html += "<p>Energy: " + String(energy) + " kWh</p>";

  html += "<p>Bulb: " + String(relayState ? "ON" : "OFF") + "</p>";
  html += "<a href=\"/on\"><button>ON</button></a>";
  html += "<a href=\"/off\"><button>OFF</button></a>";

  html += "</body></html>";
  return html;
}

void handleRoot() {
  server.send(200, "text/html", getHTML());
}

void handleON() {
  digitalWrite(RELAY_PIN, HIGH);
  relayState = true;
  handleRoot();
}

void handleOFF() {
  digitalWrite(RELAY_PIN, LOW);
  relayState = false;
  handleRoot();
}

// -------- SETUP --------
void setup() {
  WRITE_PERI_REG(RTC_CNTL_BROWN_OUT_REG, 0); // Disable brownout crash!
  Serial.begin(115200);

  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, LOW);

  analogReadResolution(12);
  analogSetAttenuation(ADC_11db);

  // WiFi connect
  // Initialize WiFi Hardware first to avoid the Guru Panic!
  WiFi.mode(WIFI_STA);
  // THEN restrict the Power!
  WiFi.setTxPower(WIFI_POWER_8_5dBm); 
  // THEN connect!
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");

  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }

  Serial.println("\n✅ Connected!");
  
  // 🔥 PRINT IP ADDRESS HERE
  Serial.print("ESP32 IP Address: ");
  Serial.println(WiFi.localIP());

  // Start server
  server.on("/", handleRoot);
  server.on("/on", handleON);
  server.on("/off", handleOFF);

  server.begin();
}

// -------- LOOP --------
void loop() {
  server.handleClient();

  voltage = readVoltage();
  current = readCurrent();
  power = voltage * current;

  unsigned long now = millis();
  float hours = (now - lastTime) / 3600000.0;
  energy += (power * hours) / 1000.0;
  lastTime = now;

  // Serial print
  Serial.print("V: "); Serial.print(voltage);
  Serial.print(" | I: "); Serial.print(current);
  Serial.print(" | P: "); Serial.print(power);
  Serial.print(" | E: "); Serial.println(energy);

  delay(1000);
}
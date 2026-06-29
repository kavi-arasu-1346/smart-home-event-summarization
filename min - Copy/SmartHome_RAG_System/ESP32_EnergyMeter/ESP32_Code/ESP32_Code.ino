#include <WiFi.h>
#include <HTTPClient.h>
#include <LiquidCrystal_I2C.h>
#include "EmonLib.h"

LiquidCrystal_I2C lcd(0x27, 16, 2);

EnergyMonitor emon;

#define vCalibration 83.3
#define currCalibration 0.50

float kWh = 0;
unsigned long lastmillis;

/* WIFI DETAILS */
const char* ssid = "phone";
const char* password = "11111111";

/* SERVER URL */
const char* serverName = "http://10.114.227.66/energy.php";  
// Replace with your PC IP

void setup()
{
  Serial.begin(115200);

  lcd.init();
  lcd.backlight();

  emon.voltage(35, vCalibration, 1.7);
  emon.current(34, currCalibration);

  lcd.setCursor(0,0);
  lcd.print("Energy Meter");
  delay(2000);
  lcd.clear();

  /* CONNECT WIFI */
  WiFi.begin(ssid, password);

  Serial.print("Connecting to WiFi");
  lcd.setCursor(0,0);
  lcd.print("Connecting WiFi");

  int dotCount = 0;
  while (WiFi.status() != WL_CONNECTED && dotCount < 15) {
    delay(1000);
    Serial.print(".");
    
    lcd.setCursor(dotCount, 1);
    lcd.print(".");
    dotCount++;
  }

  lcd.clear();
  lcd.setCursor(0,0);
  if(WiFi.status() == WL_CONNECTED) {
    Serial.println("Connected!");
    lcd.print("WiFi Connected!");
  } else {
    Serial.println("WiFi Failed - Offline Mode");
    lcd.print("Offline Mode");
  }
  delay(2000);

  lastmillis = millis();
}

void loop()
{
  emon.calcVI(20,2000);

  kWh = kWh + emon.apparentPower * (millis() - lastmillis) / 3600000000.0;

  float voltage = emon.Vrms;
  float current = emon.Irms;
  float power = emon.apparentPower;

  Serial.print(voltage);
  Serial.print(",");
  Serial.print(current);
  Serial.print(",");
  Serial.print(power);
  Serial.print(",");
  Serial.println(kWh);

  /* LCD DISPLAY */

  lcd.clear();

  lcd.setCursor(0,0);
  lcd.print("V:");
  lcd.print(voltage,1);
  lcd.print(" I:");
  lcd.print(current,2);
  lcd.print("A");

  lcd.setCursor(0,1);
  lcd.print("P:");
  lcd.print(power,1);
  lcd.print("W ");
  lcd.print("E:");
  lcd.print(kWh,2);

  /* SEND DATA TO DATABASE */

  if (WiFi.status() == WL_CONNECTED) {

    HTTPClient http;

    http.begin(serverName);
    http.addHeader("Content-Type", "application/x-www-form-urlencoded");

    String httpRequestData = "voltage=" + String(voltage) +
                             "&current=" + String(current) +
                             "&power=" + String(power) +
                             "&kwh=" + String(kWh);

    int httpResponseCode = http.POST(httpRequestData);

    Serial.print("HTTP Response code: ");
    Serial.println(httpResponseCode);

    http.end();
  }

  lastmillis = millis();

  delay(5000);
}

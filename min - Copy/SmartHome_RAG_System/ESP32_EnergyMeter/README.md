# ESP32 Smart Home Energy Meter

This folder contains the complete standalone code needed to run your physical ESP32 Energy Monitor and save the live sensor readings directly into your local `smarthome` MySQL Database.

## Folder Structure
* `ESP32_Code/ESP32_Code.ino` - The C++ program to upload to your ESP32 board.
* `PHP_API/energy.php` - The backend API script to receive the web requests.
* `database_table.sql` - The query to run in phpMyAdmin to create the table.

## Step 1: Create the Database Table
1. Open XAMPP Control Panel and click **Admin** next to MySQL (This opens phpMyAdmin).
2. Click on your `smarthome` database.
3. Click the **SQL** tab at the top.
4. Paste and run this code:
```sql
CREATE TABLE energy_meter (
 id INT AUTO_INCREMENT PRIMARY KEY,
 voltage FLOAT,
 current FLOAT,
 power FLOAT,
 kwh FLOAT,
 timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Step 2: Deploy the PHP API
Because you are using XAMPP, your web server files must go in the `htdocs` folder.
1. Copy the `energy.php` file from the `PHP_API` folder.
2. Paste it into: `C:\xampp\htdocs\energy.php`

## Step 3: Flash the ESP32
1. Open the `ESP32_Code.ino` file in the Arduino IDE.
2. Change the WiFi credentials:
```cpp
const char* ssid = "YOUR_WIFI_NAME";
const char* password = "YOUR_WIFI_PASSWORD";
```
3. Open `cmd` on your PC and run the command `ipconfig` to find your `IPv4 Address` (Example: 192.168.1.5).
4. Update the IP address in your ESP32 code so it knows where your XAMPP server is:
```cpp
const char* serverName = "http://192.168.1.5/energy.php";  
```
5. Plug in your ESP32 and click **Upload**! 

Once running, your ESP32 will measure the voltage/current and automatically push the data into your MySQL database every 5 seconds.

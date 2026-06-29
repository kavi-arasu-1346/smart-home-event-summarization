import serial
import time
import mysql.connector

# --- CONFIGURATION ---
# IMPORTANT: Change this to whatever COM port your Arduino Uno is using!
SERIAL_PORT = 'COM4'   
BAUD_RATE = 115200

DB_HOST = "localhost"
DB_USER = "root"
DB_PASSWORD = ""
DB_NAME = "smarthome"

try:
    # 1. Connect to MySQL XAMPP Database
    db = mysql.connector.connect(
        host=DB_HOST,
        user=DB_USER,
        password=DB_PASSWORD,
        database=DB_NAME
    )
    cursor = db.cursor()
    print("[OK] Successfully connected to the MySQL database!")

    # 2. Connect to the Arduino via USB
    ser = serial.Serial()
    ser.port = SERIAL_PORT
    ser.baudrate = BAUD_RATE
    ser.timeout = 2
    ser.dtr = False
    ser.rts = False
    ser.open()
    
    print(f"[OK] Successfully listening to Arduino on {SERIAL_PORT}...")
    print("Waiting for data to arrive...\n")
    
    voltage = current = power = kwh = None

    # 3. Read data continuously
    while True:
        if ser.in_waiting > 0:
            # Read a line of text from the Arduino over the USB cable
            try:
                line = ser.readline().decode('utf-8').strip()
                # DEBUG: Print raw Arduino output so we know what is arriving!
                print(f"[Arduino] {line}")
            except UnicodeDecodeError:
                continue

            # Parse the specific text format your ESP32 code prints: "V: 230 | I: 1.5 | P: 300 | E: 0.1"
            if line.startswith("V:"):
                try:
                    parts = line.split("|")
                    if len(parts) == 4:
                        voltage = float(parts[0].replace("V:", "").strip())
                        current = float(parts[1].replace("I:", "").strip())
                        power   = float(parts[2].replace("P:", "").strip())
                        kwh     = float(parts[3].replace("E:", "").strip())
                        
                        # 1. Update the entire house energy meter
                        sql_main = "INSERT INTO energy_meter (voltage, current, power, kwh) VALUES (%s, %s, %s, %s)"
                        val_main = (voltage, current, power, kwh)
                        cursor.execute(sql_main, val_main)
                        
                        # 2. Assign this specific sensor's data to 'Room 1 Light' (device_id 103)
                        # We use 20.0 Watts as a threshold since OFF noise is ~6W and actual light ON is ~54W!
                        status = 'on' if power > 20.0 else 'off'
                        
                        current_time = time.strftime('%Y-%m-%d %H:%M:%S')
                        
                        sql_light = "INSERT INTO light (device_id, status, energy_consumption, minutes_used, timestamp) VALUES (%s, %s, %s, %s, %s)"
                        val_light = (103, status, power, 0, current_time)
                        cursor.execute(sql_light, val_light)
                        
                        db.commit()
                        print(f"[{time.strftime('%H:%M:%S')}] SAVED -> Total Power: {power:5.2f}W | Room1 Light: {status.upper()}")
                except Exception as e:
                    print(f"Failed to parse or insert data into database: {e}")

except serial.SerialException as e:
    print(f"\nERROR: Serial connection failed: {e}")
    print("-> Is the Arduino exactly on that port?")
    print("-> IMPORTANT: You MUST close the Arduino IDE Serial Monitor before running this script, or access is denied!")
except mysql.connector.Error as err:
    print(f"\nDatabase Error: {err}")
except KeyboardInterrupt:
    print("\nStopping...")
finally:
    if 'db' in locals() and db.is_connected():
        cursor.close()
        db.close()
    if 'ser' in locals() and ser.is_open:
        ser.close()

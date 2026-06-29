import mysql.connector
import os
from datetime import datetime
from db_schema_info import DATABASE_SCHEMA_DETAILS

DB_NAME = "smarthome"

def setup_database():
    conn = mysql.connector.connect(
        host="localhost",
        user="root",
        password=""
    )
    cursor = conn.cursor()
    cursor.execute(f"CREATE DATABASE IF NOT EXISTS {DB_NAME}")
    cursor.execute(f"USE {DB_NAME}")
    print(f"Created/Connected to {DB_NAME}")

    # Create tables
    for table_name, details in DATABASE_SCHEMA_DETAILS.items():
        columns = details["columns"]
        # precise column definition construction
        col_defs = []
        for col, dtype in columns.items():
            col_defs.append(f"{col} {dtype}")
        
        # Primary key assumption? None specified in schema info, usually safer to add one or just strictly follow schema
        # The schema info doesn't list constraints, but we can assume standard create.
        # However, for simplicity and to match the schema exactly, we won't add extra ID columns unless present.
        # Wait, 'device_id' is present in devices. 'timestamp' is present.
        # Let's just create as specified.
        
        create_stmt = f"CREATE TABLE IF NOT EXISTS {table_name} ({', '.join(col_defs)});"
        cursor.execute(create_stmt)
        print(f"Created table: {table_name}")

        # Insert example data
        example_data = details.get("example_entry", [])
        if example_data:
            # Construct placeholders
            placeholders = ", ".join(["%s"] * len(columns))
            cursor.executemany(f"INSERT IGNORE INTO {table_name} VALUES ({placeholders})", example_data)
            print(f"  - Inserted {len(example_data)} example rows.")

    # ---------------------------------------------------------
    # Add "Live" Data (Current Timestamp) for Dashboard Demo
    # ---------------------------------------------------------
    print("\nSeeding LIVE data for dashboard context...")
    
    current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    # 1. Device Info (Ensure we have the mapped devices)
    # The example_entry for device_information might not cover all needed for the feed location map
    # We'll explicitly ensure all devices from DEVICE_LOCATION_INFO (in logic) are present
    
    devices_to_ensure = [
        (101, 'tv', 'Room1'),
        (102, 'fan', 'Room1'),
        (103, 'light', 'Room1'),
        (201, 'washing_machine', 'Room2'),
        (202, 'fan', 'Room2'),
        (203, 'light', 'Room2'),
        (301, 'ac', 'Room3'),
        (302, 'fan', 'Room3'),
        (303, 'light', 'Room3'),
        (401, 'oven', 'Kitchen'),
        (402, 'light', 'Kitchen'),
        (501, 'light', 'Bathroom'),
        (502, 'light', 'Toilet')
    ]
    
    cursor.executemany("REPLACE INTO device_information (device_id, device_type, device_location) VALUES (%s, %s, %s)", devices_to_ensure)
    
    # 2. Latest Status for each device
    # TV (Room1)
    cursor.execute(f"INSERT INTO tv (device_id, playback, status, energy_consumption, minutes_used, timestamp) VALUES (101, 'Netflix', 'on', 1.2, 45, '{current_time}')")
    
    # Fan (Room1)
    cursor.execute(f"INSERT INTO fan (device_id, speed, status, energy_consumption, minutes_used, timestamp) VALUES (102, 3, 'on', 0.5, 120, '{current_time}')")
    
    # Light (Room1)
    cursor.execute(f"INSERT INTO light (device_id, status, energy_consumption, minutes_used, timestamp) VALUES (103, 'on', 0.1, 300, '{current_time}')")
    
    # Washing Machine (Room2) - active
    cursor.execute(f"INSERT INTO washing_machine (device_id, mode, status, energy_consumption, water_consumption, minutes_used, timestamp) VALUES (201, 'Quick Wash', 'on', 0.8, 15.0, 20, '{current_time}')")
    
    # Fan (Room2)
    cursor.execute(f"INSERT INTO fan (device_id, speed, status, energy_consumption, minutes_used, timestamp) VALUES (202, 2, 'on', 0.3, 60, '{current_time}')")

    # AC (Room3)
    cursor.execute(f"INSERT INTO ac (device_id, temperature, status, energy_consumption, minutes_used, timestamp) VALUES (301, 22, 'on', 2.5, 240, '{current_time}')")
    
    # Oven (Kitchen)
    cursor.execute(f"INSERT INTO oven (device_id, mode, status, energy_consumption, minutes_used, timestamp) VALUES (401, 'Bake', 'on', 1.5, 45, '{current_time}')")
    
    # Light (Kitchen)
    cursor.execute(f"INSERT INTO light (device_id, status, energy_consumption, minutes_used, timestamp) VALUES (402, 'on', 0.1, 120, '{current_time}')")

    # Light (Bathroom)
    cursor.execute(f"INSERT INTO light (device_id, status, energy_consumption, minutes_used, timestamp) VALUES (501, 'off', 0.0, 0, '{current_time}')")

    # 3. Sensor Data (Room1, Room2, Room3, Kitchen, Bathroom, Toilet)
    rooms_sensors = ['Room1', 'Room2', 'Room3', 'Kitchen', 'Bathroom', 'Toilet']
    import random
    
    for room in rooms_sensors:
        # Temp
        temp = round(random.uniform(18.0, 25.0), 2)
        cursor.execute(f"INSERT INTO {room}_Temperature (timestamp, temperature) VALUES (%s, %s)", (current_time, temp))
        
        # Humidity
        hum = random.randint(30, 60)
        cursor.execute(f"INSERT INTO {room}_Humidity (timestamp, humidity) VALUES (%s, %s)", (current_time, hum))
        
        # Brightness
        bright = round(random.uniform(0.0, 100.0), 2)
        cursor.execute(f"INSERT INTO {room}_Brightness (timestamp, brightness) VALUES (%s, %s)", (current_time, bright))

    
    # ---------------------------------------------------------
    # Add Historical Data for March 2024 (For testing "Events of March" queries)
    # ---------------------------------------------------------
    print("Seeding FINAL historical data for March 2024...")
    
    # Generate random dates in March 2024
    for day in range(1, 32):
        date_str = f"2024-03-{day:02d} {random.randint(0,23):02d}:{random.randint(0,59):02d}:{random.randint(0,59):02d}"
        
        # 1. Device Usage (TV, Fan, Light, etc.)
        # TV Room1
        cursor.execute(f"INSERT INTO tv (device_id, playback, status, energy_consumption, minutes_used, timestamp) VALUES (101, 'Netflix', 'on', {round(random.uniform(0.5, 2.5), 2)}, {random.randint(30, 240)}, '{date_str}')")
        # Fan Room1
        cursor.execute(f"INSERT INTO fan (device_id, speed, status, energy_consumption, minutes_used, timestamp) VALUES (102, {random.randint(1,5)}, 'on', {round(random.uniform(0.1, 0.8), 2)}, {random.randint(60, 480)}, '{date_str}')")
        # Light Room1
        cursor.execute(f"INSERT INTO light (device_id, status, energy_consumption, minutes_used, timestamp) VALUES (103, 'on', {round(random.uniform(0.05, 0.3), 2)}, {random.randint(60, 300)}, '{date_str}')")
        
        # AC Room3
        cursor.execute(f"INSERT INTO ac (device_id, temperature, status, energy_consumption, minutes_used, timestamp) VALUES (301, {random.randint(18, 24)}, 'on', {round(random.uniform(1.0, 4.0), 2)}, {random.randint(120, 600)}, '{date_str}')")
        
        # Oven Kitchen
        cursor.execute(f"INSERT INTO oven (device_id, mode, status, energy_consumption, minutes_used, timestamp) VALUES (401, '{random.choice(['Bake', 'Grill', 'Roast'])}', 'on', {round(random.uniform(1.2, 3.0), 2)}, {random.randint(30, 120)}, '{date_str}')")

        # 2. Sensor Data for all rooms
        for room in rooms_sensors:
            temp = round(random.uniform(18.0, 28.0), 2)
            cursor.execute(f"INSERT INTO {room}_Temperature (timestamp, temperature) VALUES (%s, %s)", (date_str, temp))
            
            hum = random.randint(30, 70)
            cursor.execute(f"INSERT INTO {room}_Humidity (timestamp, humidity) VALUES (%s, %s)", (date_str, hum))
            
            bright = round(random.uniform(0.0, 100.0), 2)
            cursor.execute(f"INSERT INTO {room}_Brightness (timestamp, brightness) VALUES (%s, %s)", (date_str, bright))

    # ---------------------------------------------------------
    # Add Historical Data for February 2024 (For comparisons)
    # ---------------------------------------------------------
    print("Seeding historical data for February 2024...")
    
    for day in range(1, 29): # Feb 2024 has 29 days
        date_str = f"2024-02-{day:02d} {random.randint(0,23):02d}:{random.randint(0,59):02d}:{random.randint(0,59):02d}"
        
        # Similar random data generation, slightly different pattern
        cursor.execute(f"INSERT INTO tv (device_id, playback, status, energy_consumption, minutes_used, timestamp) VALUES (101, 'Netflix', 'on', {round(random.uniform(0.5, 2.0), 2)}, {random.randint(20, 180)}, '{date_str}')")
        cursor.execute(f"INSERT INTO oven (device_id, mode, status, energy_consumption, minutes_used, timestamp) VALUES (401, 'Bake', 'on', {round(random.uniform(1.0, 2.5), 2)}, {random.randint(20, 60)}, '{date_str}')")

    # ---------------------------------------------------------
    # Add Relative Recent Data (Yesterday and Last Week)
    # ---------------------------------------------------------
    print("Seeding recent data (Yesterday, Last Week)...")
    from datetime import timedelta
    
    # Yesterday
    yesterday = datetime.now() - timedelta(days=1)
    yesterday_str = yesterday.strftime("%Y-%m-%d %H:%M:%S")
    cursor.execute(f"INSERT INTO fan (device_id, speed, status, energy_consumption, minutes_used, timestamp) VALUES (102, 4, 'on', 0.6, 200, '{yesterday_str}')") # Room1 Fan
    cursor.execute(f"INSERT INTO fan (device_id, speed, status, energy_consumption, minutes_used, timestamp) VALUES (202, 5, 'on', 0.8, 250, '{yesterday_str}')") # Room2 Fan (More usage for comparison)

    # Last Week (7 days ago)
    last_week = datetime.now() - timedelta(days=7)
    last_week_str = last_week.strftime("%Y-%m-%d %H:%M:%S")
    cursor.execute(f"INSERT INTO washing_machine (device_id, mode, status, energy_consumption, water_consumption, minutes_used, timestamp) VALUES (201, 'Heavy Duty', 'on', 1.5, 25.0, 60, '{last_week_str}')")

    conn.commit()
    conn.close()
    print("\nDatabase setup complete. 'smarthome.db' is ready.")

if __name__ == "__main__":
    setup_database()

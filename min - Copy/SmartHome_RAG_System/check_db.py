import mysql.connector

def check():
    try:
        conn = mysql.connector.connect(
            host="localhost",
            user="root",
            password="",
            database="smarthome"
        )
        cursor = conn.cursor(dictionary=True)
        
        print("\n=== 1. Checking Device Information ===")
        cursor.execute("SELECT * FROM device_information")
        for row in cursor.fetchall():
            print(f"Device ID: {row['device_id']} | Type: {row['device_type']} | Location: {row['device_location']}")
            
        print("\n=== 2. Checking Recent Entries in Light Table ===")
        cursor.execute("SELECT * FROM light ORDER BY timestamp DESC LIMIT 5")
        for row in cursor.fetchall():
            print(f"Timestamp: {row['timestamp']} | Device ID: {row['device_id']} | Status: {row['status']} | Power: {row['energy_consumption']}W")
            
        conn.close()
    except Exception as e:
        print(f"Error querying database: {e}")

if __name__ == "__main__":
    check()

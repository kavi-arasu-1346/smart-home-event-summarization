# Database schema information used for LLM Context
SCHEMA_INFO = {
    "Bathroom_Brightness": ["timestamp", "brightness"],
    "Bathroom_Humidity": ["timestamp", "humidity"],
    "Bathroom_Temperature": ["timestamp", "temperature"],
    "Kitchen_Brightness": ["timestamp", "brightness"],
    "Kitchen_Humidity": ["timestamp", "humidity"],
    "Kitchen_Temperature": ["timestamp", "temperature"],
    "Room1_Brightness": ["timestamp", "brightness"],
    "Room1_Humidity": ["timestamp", "humidity"],
    "Room1_Temperature": ["timestamp", "temperature"],
    "Room2_Brightness": ["timestamp", "brightness"],
    "Room2_Humidity": ["timestamp", "humidity"],
    "Room2_Temperature": ["timestamp", "temperature"],
    "Room3_Brightness": ["timestamp", "brightness"],
    "Room3_Humidity": ["timestamp", "humidity"],
    "Room3_Temperature": ["timestamp", "temperature"],
    "Toilet_Brightness": ["timestamp", "brightness"],
    "Toilet_Humidity": ["timestamp", "humidity"],
    "Toilet_Temperature": ["timestamp", "temperature"],
    "ac": ["device_id", "temperature", "status", "energy_consumption", "minutes_used", "timestamp"],
    "device_information": ["device_id", "device_type", "device_location"],
    "fan": ["device_id", "speed", "status", "energy_consumption", "minutes_used", "timestamp"],
    "light": ["device_id","status", "energy_consumption", "minutes_used", "timestamp"],
    "oven": ["device_id", "mode", "status", "energy_consumption", "minutes_used", "timestamp"],
    "tv": ["device_id", "playback", "status", "energy_consumption", "minutes_used", "timestamp"],
    "washing_machine": ["device_id", "mode", "status", "energy_consumption", "water_consumption", "minutes_used", "timestamp"],
    "users": ["id", "username", "email", "phone_number", "push_notifications", "password_hash"],
    "energy_meter": ["id", "voltage", "current", "power", "kwh", "timestamp"],
}

# Device-location information
DEVICE_LOCATION_INFO = [
    ('tv', 'Room1'), 
    ('fan', 'Room1'), 
    ('light', 'Room1'),
    ('washing_machine', 'Room2'), 
    ('fan', 'Room2'),
    ('light', 'Room2'), 
    ('ac', 'Room3'), 
    ('fan', 'Room3'),
    ('light', 'Room3'), 
    ('oven', 'Kitchen'), 
    ('light', 'Kitchen'),
    ('light', 'Bathroom'), 
    ('light', 'Toilet')
]

# Detailed Schema with Types and Examples
DATABASE_SCHEMA_DETAILS = {
    "Bathroom_Brightness": {
        "columns": {"timestamp": "TEXT", "brightness": "FLOAT"},
        "example_entry": [('2017-03-08 23:58:47', 0.0)]
    },
    "Bathroom_Humidity": {
        "columns": {"timestamp": "TEXT", "humidity": "BIGINT"},
        "example_entry": [('2017-03-08 23:58:47', 47)]
    },
    "Bathroom_Temperature": {
        "columns": {"timestamp": "TEXT", "temperature": "FLOAT"},
        "example_entry": [('2017-03-08 23:58:47', 19.21)]
    },
    "Kitchen_Brightness": {
        "columns": {"timestamp": "TEXT", "brightness": "FLOAT"},
        "example_entry": [('2017-03-09 06:31:25', 12.82)]
    },
    "Kitchen_Humidity": {
        "columns": {"timestamp": "TEXT", "humidity": "BIGINT"},
        "example_entry": [('2017-03-09 01:32:39', 47)]
    },
    "Kitchen_Temperature": {
        "columns": {"timestamp": "TEXT", "temperature": "FLOAT"},
        "example_entry": [('2017-03-09 01:12:35', 17.48)]
    },
    "Room1_Brightness": {
        "columns": {"timestamp": "TEXT", "brightness": "FLOAT"},
        "example_entry": [('09-03-2017 06:22', 1.83)]
    },
    "Room1_Humidity": {
        "columns": {"timestamp": "TEXT", "humidity": "BIGINT"},
        "example_entry": [('2017-03-09 01:11:35', 44)]
    },
    "Room1_Temperature": {
        "columns": {"timestamp": "TEXT", "temperature": "FLOAT"},
        "example_entry": [('2017-03-09 00:51:30', 19.53)]
    },
    "Room2_Brightness": {
        "columns": {"timestamp": "TEXT", "brightness": "FLOAT"},
        "example_entry": [('2017-03-09 06:34:26', 0.92)]
    },
    "Room2_Humidity": {
        "columns": {"timestamp": "TEXT", "humidity": "BIGINT"},
        "example_entry": [('2017-03-09 00:24:24', 44)]
    },
    "Room2_Temperature": {
        "columns": {"timestamp": "TEXT", "temperature": "FLOAT"},
        "example_entry": [('2017-03-09 00:04:19', 17.8)]
    },
    "Room3_Brightness": {
        "columns": {"timestamp": "TEXT", "brightness": "FLOAT"},
        "example_entry": [('2017-03-08 23:56:17', 0.0)]
    },
    "Room3_Humidity": {
        "columns": {"timestamp": "TEXT", "humidity": "BIGINT"},
        "example_entry": [('2017-03-09 00:46:29', 44)]
    },
    "Room3_Temperature": {
        "columns": {"timestamp": "TEXT", "temperature": "FLOAT"},
        "example_entry": [('2017-03-09 00:16:22', 17.8)]
    },
    "Toilet_Brightness": {
        "columns": {"timestamp": "TEXT", "brightness": "FLOAT"},
        "example_entry": [('2017-03-09 06:27:53', 0.92)]
    },
    "Toilet_Humidity": {
        "columns": {"timestamp": "TEXT", "humidity": "BIGINT"},
        "example_entry": [('2017-03-09 01:10:04', 49)]
    },
    "Toilet_Temperature": {
        "columns": {"timestamp": "TEXT", "temperature": "FLOAT"},
        "example_entry": [('2017-03-09 00:20:23', 16.06)]
    },
    "fan": {
        "columns": {
            "device_id": "INTEGER", "speed": "INTEGER", "status": "TEXT",
            "energy_consumption": "REAL", "minutes_used": "INTEGER", "timestamp": "TEXT"
        },
        "example_entry": [(102, 3, 'on', 0.0, 0, '2017-03-03 00:00:00')]
    },
    "light": {
        "columns": {
            "device_id": "INTEGER", "status": "TEXT",
            "energy_consumption": "REAL", "minutes_used": "INTEGER", "timestamp": "TEXT"
        },
        "example_entry": [(103,'on', 0.0, 0, '2017-03-03 00:00:00')]
    },
    "ac": {
        "columns": {
            "device_id": "INTEGER", "temperature": "INTEGER", "status": "TEXT",
            "energy_consumption": "REAL", "minutes_used": "INTEGER", "timestamp": "TEXT"
        },
        "example_entry": [(301, 17, 'on', 0.0, 0, '2017-03-03 00:00:00')]
    },
    "oven": {
        "columns": {
            "device_id": "INTEGER", "mode": "TEXT", "status": "TEXT",
            "energy_consumption": "REAL", "minutes_used": "INTEGER", "timestamp": "TEXT"
        },
        "example_entry": [(401, 'Grill', 'on', 0.0, 0, '2017-03-03 00:00:00')]
    },
    "washing_machine": {
        "columns": {
            "device_id": "INTEGER", "mode": "TEXT", "status": "TEXT",
            "energy_consumption": "REAL", "water_consumption": "REAL", "minutes_used": "INTEGER", "timestamp": "TEXT"
        },
        "example_entry": [(201, 'Heavy Duty', 'on', 0.0, 0.0, 0, '2017-03-03 00:00:00')]
    },
    "tv": {
        "columns": {
            "device_id": "INTEGER", "playback": "TEXT", "status": "TEXT",
            "energy_consumption": "REAL", "minutes_used": "INTEGER", "timestamp": "TEXT"
        },
        "example_entry": [(101, 'Hulu', 'on', 0.0, 0, '2017-03-03 00:00:00')]
    },
    "device_information": {
        "columns": {"device_id": "INTEGER", "device_type": "TEXT", "device_location": "TEXT"},
        "example_entry": [(101, 'tv', 'Room1')]
    },
    "users": {
        "columns": {
            "id": "INT AUTO_INCREMENT PRIMARY KEY",
            "username": "VARCHAR(255)",
            "email": "VARCHAR(255)",
            "phone_number": "VARCHAR(20)",
            "push_notifications": "BOOLEAN",
            "password_hash": "VARCHAR(255)"
        },
        "example_entry": []
    },
    "energy_meter": {
        "columns": {
            "id": "INT AUTO_INCREMENT PRIMARY KEY",
            "voltage": "FLOAT",
            "current": "FLOAT",
            "power": "FLOAT",
            "kwh": "FLOAT",
            "timestamp": "TIMESTAMP DEFAULT CURRENT_TIMESTAMP"
        },
        "example_entry": []
    }
}

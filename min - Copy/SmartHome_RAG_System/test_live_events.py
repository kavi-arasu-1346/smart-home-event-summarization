import requests
import json

try:
    res = requests.get("http://localhost:5003/get_live_events")
    print(f"Status Code: {res.status_code}")
    print("Response JSON:")
    print(json.dumps(res.json(), indent=2))
except Exception as e:
    print(f"Failed to fetch live events: {e}")

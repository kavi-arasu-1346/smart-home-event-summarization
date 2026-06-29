import requests
try:
    res = requests.post("http://localhost:5002/process_query", data={"question": "Analysis Summary"}, timeout=15)
    print("STATUS:", res.status_code)
    print("TEXT:", res.text)
except Exception as e:
    print("ERROR:", type(e).__name__, str(e))

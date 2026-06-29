
import requests
import json

WHAPI_TOKEN = "EdubdooT0b2FPxGItNscJdyEnnj7792A"
WHAPI_URL = "https://gate.whapi.cloud/messages/text"

def send_whatsapp_message(to_number, text):
    """
    Sends a WhatsApp message via Whapi.cloud.
    to_number: phone number in international format (e.g., '919876543210')
    text: message content
    """
    if not to_number:
        print("[WHATSAPP] No phone number provided. Skipping.")
        return False
        
    # Clean the phone number (Whapi expects it without +)
    to_number = to_number.replace("+", "").strip()
    
    payload = {
        "typing_time": 0,
        "to": to_number,
        "body": text
    }
    headers = {
        "accept": "application/json",
        "content-type": "application/json",
        "authorization": f"Bearer {WHAPI_TOKEN}"
    }

    try:
        response = requests.post(WHAPI_URL, data=json.dumps(payload), headers=headers)
        if response.status_code in [200, 201]:
            print(f"[WHATSAPP] Message sent to {to_number}")
            return True
        else:
            print(f"[WHATSAPP] Failed to send: {response.text}")
            return False
    except Exception as e:
        print(f"[WHATSAPP] Error: {e}")
        return False

def format_device_status_message(events):
    """
    Formats a short list of device statuses for WhatsApp.
    """
    msg = "🏠 *Spatial Hub Status Update*\n\n"
    for e in events[:8]: # Limit to 8 devices for brevity
        status_icon = "🟢" if e.get('status', '').lower() == 'on' else "🔴"
        name = e.get('device_type', 'Node').title()
        room = e.get('room', 'Spatial')
        msg += f"{status_icon} *{name}* ({room}): {e.get('status', 'N/A').upper()}\n"
    
    msg += "\n_Cortex Integrated Hub_"
    return msg

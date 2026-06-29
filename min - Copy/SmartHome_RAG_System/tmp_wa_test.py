
import sys
import os
sys.path.append(os.getcwd())
from whatsapp_service import send_whatsapp_message

# Test Token & Number
res = send_whatsapp_message("917558141149", "🚀 *Cortex System Check*: WhatsApp relay is operational.")
print(f"Test Status: {res}")

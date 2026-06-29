import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os

def send_bill_email(to_email, username, bill_details, total_amount):
    sender_email = os.getenv("SMTP_EMAIL", "smarthome.admin@example.com")
    sender_password = os.getenv("SMTP_PASSWORD", "")
    smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
    smtp_port = int(os.getenv("SMTP_PORT", 587))
    
    subject = "Your SmartHome Real-Time Energy Bill"
    
    body = f"""
Hello {username},

Here is the real-time energy bill based on your currently running devices:

{bill_details}

-----------------------------------
Total Bill Amount: ${total_amount:.2f}
-----------------------------------

Thank you for using SmartHome!
"""
    
    msg = MIMEMultipart()
    msg['From'] = sender_email
    msg['To'] = to_email
    msg['Subject'] = subject
    msg.attach(MIMEText(body, 'plain'))
    
    try:
        if sender_password: # Only try properly if password exists
            server = smtplib.SMTP(smtp_server, smtp_port)
            server.starttls()
            server.login(sender_email, sender_password)
            text = msg.as_string()
            server.sendmail(sender_email, to_email, text)
            server.quit()
            print(f"Bill email successfully sent to {to_email}")
            return True, "Email sent successfully"
        else:
            print(f"SMTP not fully configured. Mock sending bill to {to_email}:\n{body}")
            return True, "Email simulated successfully (SMTP not fully configured)"
    except Exception as e:
        print(f"Failed to send email: {e}")
        return False, str(e)

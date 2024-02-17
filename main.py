import pyautogui
from flask import Flask, request
from flask_cors import CORS


def press_key(key):
    pyautogui.press(key)

# API endpoint to handle incoming requests
def handle_request(request):
    key = request.get('key')
    ctrl = request.get('ctrl')
    meta = request.get('meta')
    shift = request.get('shift')
    alt = request.get('alt')

    special_keys_held = []
    if(ctrl):
        special_keys_held.append("ctrl")
    if(meta):
        special_keys_held.append("command")
    if(shift):
        special_keys_held.append("shift")
    if(alt):
        special_keys_held.append("alt")

    if(len(special_keys_held) > 0):
        special_keys_held.append(key)
        pyautogui.hotkey(*special_keys_held)
    else:
        pyautogui.press(key)

    # Successful response
    return 'Action performed', 200


# Create a Flask app
app = Flask(__name__)
CORS(app)

# Define the API endpoint
@app.route('/keypress', methods=['POST'])
def keypress_handler():
    request_data = request.get_json()
    key = request_data.get('key')
    ctrl = request_data.get('ctrl')
    meta = request_data.get('meta')
    shift = request_data.get('shift')
    alt = request_data.get('alt')    

    if not key:
        return 'Bad request', 400
    
    return handle_request({"key": key, "ctrl": ctrl, "meta": meta, "shift": shift, "alt": alt})

# Run the Flask app
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

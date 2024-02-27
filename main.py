import pyautogui
from flask import Flask, request, send_from_directory
from flask_cors import CORS


def press_key(key):
    pyautogui.press(key)

def normalize_points(point, plane1, plane2):
    x_ratio = plane2["width"] / plane1["width"]
    y_ratio = plane2["height"] / plane1["height"]

    
    x = point["x"] * x_ratio
    y = point["y"] * y_ratio
    

    return x, y

# API endpoint to handle incoming requests
def handle_key_request(request):
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

def handle_mouse_request(request):
    x = request.get('x')
    y = request.get('y')

    current_x, current_y = pyautogui.position()

    pyautogui.moveTo(current_x + x, current_y + y)

    # Successful response
    return 'Action performed', 200


# Create a Flask app
app = Flask(__name__)
CORS(app)

if __name__ == '__main__':
    app.run(debug=True)

@app.route('/')
def send_html():
    return send_from_directory('.', 'index.html')

@app.route('/js/<path:filename>')
def serve_js(filename):
    return send_from_directory('.', filename)


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
    
    return handle_key_request({"key": key, "ctrl": ctrl, "meta": meta, "shift": shift, "alt": alt})

@app.route('/mouse', methods=['POST'])
def mouse_handler():
    request_data = request.get_json()
    x = request_data.get('x')
    y = request_data.get('y')
    
    return handle_mouse_request({"x": x, "y": y})

@app.route('/mouse/click', methods=['POST'])
def mouse_click_handler():
    pyautogui.click()
    return "Action Performed", 200

# This isn't working see: https://github.com/asweigart/pyautogui/issues?q=is%3Aissue+is%3Aopen+doubleclick TODO:fix
@app.route('/mouse/dblclick', methods=['POST'])
def mouse_dblclick_handler():
    pyautogui.doubleClick()
    return "Action Performed", 200
import gradio as gr
import json
import os
import requests

USERS_FILE = "users.json"

# Load/Save Users
def load_users():
    if os.path.exists(USERS_FILE):
        with open(USERS_FILE, "r") as f:
            return json.load(f)
    return {}

def save_users(users):
    with open(USERS_FILE, "w") as f:
        json.dump(users, f)

# Init users if not exist
if not os.path.exists(USERS_FILE):
    users = {
        "physician1": {"password": "pass123", "type": "physician"},
        "patient1": {"password": "pass123", "type": "patient"}
    }
    save_users(users)


def normalize_name(name):
    return name.strip().lower()


def check_name(medication):
    url = "https://api.fda.gov/drug/label.json?search=openfda.generic_name:" + medication + "&limit=1"
    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
        if "results" in data and len(data["results"]) > 0:
            return medication.capitalize() + " found."
        else:
            return medication.capitalize() + " not found."
    except:
        return medication.capitalize() + " not found."


def analyze_interaction(med1, med2):
    med1 = normalize_name(med1)
    med2 = normalize_name(med2)

    if not med1 or not med2:
        return "Please enter both medications."
    if len(med1) > 40 or len(med2) > 40:
        return "Input too long."
    if med1 == med2:
        return "Both medications are the same."

    return check_name(med1) + "\n" + check_name(med2)


def login(username, password):
    users = load_users()
    if username in users and users[username]['password'] == password:
        user_type = users[username]['type']
        if user_type == "physician":
            return gr.update(visible=True), gr.update(visible=False), gr.update(visible=False), gr.update(visible=False), username
        else:  # patient
            return gr.update(visible=False), gr.update(visible=True), gr.update(visible=False), gr.update(visible=False), username
    else:
        return gr.update(visible=False), gr.update(visible=False), gr.update(visible=True), gr.update(visible=False), None


def signup(username, password, user_type):
    users = load_users()
    if username in users:
        return "Username already exists!"
    if user_type not in ["physician", "patient"]:
        return "Invalid user type."

    users[username] = {"password": password, "type": user_type}
    save_users(users)
    return "Signup successful! Please return to Login tab."


def logout():
    return gr.update(visible=False), gr.update(visible=False), gr.update(visible=True), gr.update(visible=False), None


def show_signup():
    return gr.update(visible=False), gr.update(visible=False), gr.update(visible=False), gr.update(visible=True)


def back_to_login():
    return gr.update(visible=False), gr.update(visible=False), gr.update(visible=True), gr.update(visible=False)


with gr.Blocks() as demo:
    current_user = gr.State(value=None)
    
    # Create all UI elements for all screens
    with gr.Group(visible=False) as physician_dash:
        gr.Markdown("# Physician Dashboard")
        physician_greeting = gr.Markdown(value="Welcome, Physician")
        med1 = gr.Textbox(label="Medication 1")
        med2 = gr.Textbox(label="Medication 2")
        result = gr.Textbox(label="Result")
        check_button = gr.Button("Check Medication Interaction")
        physician_logout = gr.Button("Logout")
    
    with gr.Group(visible=False) as patient_dash:
        gr.Markdown("# Patient Dashboard")
        patient_greeting = gr.Markdown(value="Welcome, Patient")
        med1p = gr.Textbox(label="Medication 1")
        med2p = gr.Textbox(label="Medication 2")
        resultp = gr.Textbox(label="Result")
        check_button_p = gr.Button("Check Medication Interaction")
        patient_logout = gr.Button("Logout")
    
    with gr.Group(visible=True) as login_box:
        gr.Markdown("# Medication Interaction Checker")
        gr.Markdown("## Login")
        username = gr.Textbox(label="Username")
        password = gr.Textbox(label="Password", type="password")
        login_error = gr.Markdown(visible=False, value="❌ Invalid username or password")
        login_button = gr.Button("Login")
        gr.Markdown("Don't have an account?")
        signup_btn = gr.Button("Go to Signup")
    
    with gr.Group(visible=False) as signup_box:
        gr.Markdown("# Medication Interaction Checker")
        gr.Markdown("## Signup")
        new_username = gr.Textbox(label="New Username")
        new_password = gr.Textbox(label="New Password", type="password")
        role = gr.Radio(["patient", "physician"], label="Select Role")
        signup_status = gr.Textbox(label="Status", interactive=False)
        signup_button = gr.Button("Create Account")
        back_to_login_btn = gr.Button("Back to Login")
    
    # Login functionality
    login_button.click(
        fn=login,
        inputs=[username, password],
        outputs=[physician_dash, patient_dash, login_box, signup_box, current_user]
    ).then(
        fn=lambda user: f"Welcome, {user}",
        inputs=[current_user],
        outputs=[physician_greeting]
    ).then(
        fn=lambda user: f"Welcome, {user}",
        inputs=[current_user],
        outputs=[patient_greeting]
    )
    
    # Signup navigation
    signup_btn.click(
        fn=show_signup,
        inputs=None,
        outputs=[physician_dash, patient_dash, login_box, signup_box]
    )
    
    # Back to login from signup
    back_to_login_btn.click(
        fn=back_to_login,
        inputs=None,
        outputs=[physician_dash, patient_dash, login_box, signup_box]
    )
    
    # Signup functionality
    signup_button.click(
        fn=signup,
        inputs=[new_username, new_password, role],
        outputs=[signup_status]
    )
    
    # Logout functionality
    physician_logout.click(
        fn=logout,
        inputs=None,
        outputs=[physician_dash, patient_dash, login_box, signup_box, current_user]
    )
    
    patient_logout.click(
        fn=logout,
        inputs=None,
        outputs=[physician_dash, patient_dash, login_box, signup_box, current_user]
    )
    
    # Check medication interactions
    check_button.click(
        fn=analyze_interaction,
        inputs=[med1, med2],
        outputs=[result]
    )
    
    check_button_p.click(
        fn=analyze_interaction,
        inputs=[med1p, med2p],
        outputs=[resultp]
    )

demo.launch()
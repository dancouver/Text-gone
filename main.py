from flask import Flask, render_template, request, redirect, url_for
import pyperclip
import os
import signal
import requests

app = Flask(__name__)

# Variables to track timer status and text entry
text_entry = ""
initial_timer_value = 0  # Tracks whether the timer was started with 5 or 10 seconds

@app.route("/", methods=["GET", "POST"])
def index():
    global initial_timer_value, text_entry

    if request.method == "POST":
        # Update text entry on user input
        if 'text' in request.form:
            text_entry = request.form['text']

        # Handle Start and Quit actions
        if 'start_5' in request.form:
            initial_timer_value = 5
            text_entry = ""  # Clear text when starting a new timer
        elif 'start_10' in request.form:
            initial_timer_value = 10
            text_entry = ""  # Clear text when starting a new timer
        elif 'clip_it' in request.form:
            pyperclip.copy(text_entry)  # Save the text to the clipboard
            text_entry = ""
            print("Clipboard content:", pyperclip.paste())  # Print clipboard content to console
        elif 'quit' in request.form:
            initial_timer_value = 0
            text_entry = ""
            return redirect(url_for("shutdown"))

    # Render the page with the initial timer value and text entry
    return render_template("index.html", initial_timer=initial_timer_value, text=text_entry)

@app.route('/shutdown', methods=['GET'])
def shutdown():
    os.kill(os.getpid(), signal.SIGINT)
    return 'Server shutting down...'

if __name__ == "__main__":
    app.run(debug=True)

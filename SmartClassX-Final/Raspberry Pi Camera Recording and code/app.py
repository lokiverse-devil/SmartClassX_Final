from flask import Flask, render_template, request, send_from_directory, jsonify
import requests
import os
from datetime import datetime

app = Flask(__name__)
UPLOAD_FOLDER = "videos"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# 🔧 Change this to your Pi's IP and port
PI_IP = "http://10.16.182.81:5001"

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/start_record", methods=["POST"])
def start_record():
    name = request.form["name"]
    duration = int(request.form["duration"])

    # Send request to Raspberry Pi
    try:
        res = requests.post(f"{PI_IP}/record_video", json={
            "name": name,
            "duration": duration
        })
        return jsonify(res.json())
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route("/upload_video", methods=["POST"])
def upload_video():
    file = request.files["file"]
    filename = file.filename
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    file.save(filepath)
    return jsonify({"status": "success", "file": filename})

@app.route("/videos/<filename>")
def serve_video(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)
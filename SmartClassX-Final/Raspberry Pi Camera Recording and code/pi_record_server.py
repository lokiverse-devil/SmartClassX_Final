from flask import Flask, request, jsonify
import subprocess
import time
import os
import requests
from datetime import datetime

app = Flask(__name__)
SAVE_FOLDER = "recordings"
os.makedirs(SAVE_FOLDER, exist_ok=True)

# 🔧 Change this to your laptop IP
LAPTOP_SERVER = "http://192.168.133.197:5001"

@app.route("/record_video", methods=["POST"])
def record_video():
    data = request.get_json()
    name = data.get("name", "user")
    duration = int(data.get("duration", 5))
    
    filename = f"{name}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.mp4"
    filepath = os.path.join(SAVE_FOLDER, filename)

    # 🎥 Record both video and audio using ffmpeg
    # -f v4l2 = video input
    # -f alsa = audio input (for USB webcam mic)
    # Adjust /dev/video0 and hw:1,0 if needed
    cmd = [
        "ffmpeg",
        "-f", "v4l2",
        "-framerate", "25",
        "-video_size", "640x480",
        "-i", "/dev/video0",
        "-f", "pulse",
        "-ac", "1",
        "-i", "alsa_input.usb-046d_0825_218E67C0-02.mono-fallback",
        "-t", str(duration),
        "-vcodec", "libx264",
        "-pix_fmt", "yuv420p",
        "-preset", "ultrafast",
        "-acodec", "aac",
        "-ar", "48000",
        "-movflags", "+faststart",
        "-y", filepath
    ]


    try:
        subprocess.run(cmd, check=True)
    except subprocess.CalledProcessError as e:
        return jsonify({"status": "error", "message": str(e)})

    # 📤 Upload the file to laptop
    with open(filepath, 'rb') as f:
        files = {'file': (filename, f, 'video/mp4')}
        try:
            res = requests.post(f"{LAPTOP_SERVER}/upload_video", files=files, timeout=30)
            res.raise_for_status()

            # ✅ Delete file after successful upload
            os.remove(filepath)
            print(f"[CLEANUP] Deleted {filepath} after successful upload.")

            return jsonify({"status": "success", "message": "Video uploaded and deleted from Pi."}), 200

        except requests.exceptions.RequestException as e:
            print(f"[UPLOAD ERROR] Could not send video to laptop: {e}")
            return jsonify({"status": "upload_failed", "error": str(e)}), 500


    return jsonify({"status": "done", "filename": filename})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)

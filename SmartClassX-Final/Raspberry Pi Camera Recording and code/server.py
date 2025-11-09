from flask import Flask, request, jsonify, Response, send_from_directory
from flask_cors import CORS
import os
from datetime import datetime
import socket
import re
from mimetypes import guess_type

# ---------------------------------------------
# 🚀 Initialize Flask app
# ---------------------------------------------
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Folder where recorded videos are stored
VIDEO_FOLDER = "videos"
os.makedirs(VIDEO_FOLDER, exist_ok=True)

# ---------------------------------------------
# 📤 Upload video
# ---------------------------------------------
@app.route("/upload", methods=["POST"])
def upload_video():
    """Upload a new lecture video"""
    file = request.files.get("file")
    if not file:
        return jsonify({"error": "No file uploaded"}), 400

    filename = file.filename
    path = os.path.join(VIDEO_FOLDER, filename)
    file.save(path)
    print(f"✅ Uploaded: {filename}")
    return jsonify({"message": "Uploaded successfully", "filename": filename})


# ---------------------------------------------
# 📚 List all available videos
# ---------------------------------------------
@app.route("/api/lectures", methods=["GET"])
def list_lectures():
    """Return metadata for all available videos"""
    ip = get_ip()
    videos = [
        {
            "id": i + 1,
            "title": os.path.splitext(fname)[0],
            "subject": "SmartClassX Lecture",
            "date": datetime.now().strftime("%Y-%m-%d"),
            "videoUrl": f"http://{ip}:5002/videos/{fname}",
        }
        for i, fname in enumerate(os.listdir(VIDEO_FOLDER))
        if fname.lower().endswith((".mp4", ".mkv", ".avi"))
    ]
    print(f"✅ Found {len(videos)} videos")
    return jsonify(videos)


# ---------------------------------------------
# 🎞️ Stream video with HTTP Range support
# ---------------------------------------------
@app.route("/videos/<path:filename>")
def stream_video(filename):
    """Stream video with byte-range support (for seeking & buffering)"""
    file_path = os.path.join(VIDEO_FOLDER, filename)
    if not os.path.exists(file_path):
        return jsonify({"error": "File not found"}), 404

    range_header = request.headers.get("Range", None)
    file_size = os.path.getsize(file_path)
    mime_type, _ = guess_type(filename)
    mime_type = mime_type or "video/mp4"

    # Default start and end
    start = 0
    end = file_size - 1

    if range_header:
        # Example Range: bytes=1000-2000
        match = re.search(r"bytes=(\d+)-(\d*)", range_header)
        if match:
            start = int(match.group(1))
            if match.group(2):
                end = int(match.group(2))
            else:
                end = min(start + 5 * 1024 * 1024, file_size - 1)  # 5MB chunks

    chunk_size = 1024 * 512  # 512 KB
    length = end - start + 1

    def generate():
        with open(file_path, "rb") as f:
            f.seek(start)
            remaining = length
            while remaining > 0:
                data = f.read(min(chunk_size, remaining))
                if not data:
                    break
                remaining -= len(data)
                yield data

    rv = Response(generate(), 206, mimetype=mime_type, direct_passthrough=True)
    rv.headers.add("Content-Range", f"bytes {start}-{end}/{file_size}")
    rv.headers.add("Accept-Ranges", "bytes")
    rv.headers.add("Content-Length", str(length))
    return rv


# ---------------------------------------------
# 🌐 Helper: Get local IP
# ---------------------------------------------
def get_ip():   
    """Detect the current device's LAN IP address"""
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(("10.254.254.254", 1))
        IP = s.getsockname()[0]
    except Exception:
        IP = "127.0.0.1"
    finally:
        s.close()
    return IP


# ---------------------------------------------
# ▶️ Run Flask server
# ---------------------------------------------
if __name__ == "__main__":
    ip = get_ip()
    print("\n===============================================")
    print(f"🚀 Flask video streaming server running at: http://{ip}:5002")
    print(f"📚 List lectures:     http://{ip}:5002/api/lectures")
    print(f"🎞️ Stream video:      http://{ip}:5002/videos/<filename>")
    print("===============================================\n")

    app.run(host="0.0.0.0", port=5002, debug=True)

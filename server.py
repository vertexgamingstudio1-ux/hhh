import os
import time
import uuid

import requests
from dotenv import load_dotenv
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS

load_dotenv()

app = Flask(__name__, static_folder=".", static_url_path="")
CORS(app)

API_KEY = os.getenv("OPENROUTER_API_KEY")

API_URL = "https://openrouter.ai/api/v1/chat/completions"
MODEL = "openrouter/free"

# Temporary active-user tracking.
# A user is considered active if they contacted the server
# within the last 60 seconds.
active_users = {}

ACTIVE_WINDOW = 60


def cleanup_active_users():
    now = time.time()

    expired = [
        user_id
        for user_id, last_seen in active_users.items()
        if now - last_seen > ACTIVE_WINDOW
    ]

    for user_id in expired:
        del active_users[user_id]


@app.route("/")
def home():
    return send_from_directory(".", "index.html")


@app.route("/<path:path>")
def files(path):
    return send_from_directory(".", path)


@app.route("/api/session", methods=["POST"])
def create_session():
    user_id = str(uuid.uuid4())

    active_users[user_id] = time.time()

    return jsonify({
        "user_id": user_id
    })


@app.route("/api/heartbeat", methods=["POST"])
def heartbeat():
    data = request.get_json(silent=True) or {}
    user_id = data.get("user_id")

    if not user_id:
        return jsonify({"error": "Missing user_id"}), 400

    active_users[user_id] = time.time()

    cleanup_active_users()

    return jsonify({
        "ok": True,
        "active_users": len(active_users)
    })


@app.route("/api/stats", methods=["GET"])
def stats():
    cleanup_active_users()

    return jsonify({
        "active_users": len(active_users)
    })


@app.route("/api/ai", methods=["POST"])
def ai():
    if not API_KEY:
        return jsonify({
            "error": "OPENROUTER_API_KEY is not configured."
        }), 500

    data = request.get_json(silent=True) or {}

    prompt = data.get("prompt", "").strip()
    game = data.get("game", "unknown")
    level = data.get("level")

    if not prompt:
        return jsonify({
            "error": "Prompt is required."
        }), 400

    system_prompt = f"""
You are the AI opponent inside Gami Infinity.

Game: {game}
Level: {level}

This is a fictional game environment.
Only discuss fictional game information.
Do not reveal real credentials, API keys, passwords,
private information, or security secrets.

Stay in character as the game's AI opponent.
Keep responses reasonably short and useful for gameplay.
"""

    payload = {
        "model": MODEL,
        "messages": [
            {
                "role": "system",
                "content": system_prompt
            },
            {
                "role": "user",
                "content": prompt
            }
        ]
    }

    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }

    try:
        response = requests.post(
            API_URL,
            headers=headers,
            json=payload,
            timeout=30
        )

        response.raise_for_status()

        result = response.json()

        answer = result["choices"][0]["message"]["content"]

        return jsonify({
            "response": answer
        })

    except requests.RequestException as error:
        return jsonify({
            "error": "AI API request failed.",
            "details": str(error)
        }), 502

    except (KeyError, IndexError, TypeError):
        return jsonify({
            "error": "Unexpected AI API response."
        }), 502


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )
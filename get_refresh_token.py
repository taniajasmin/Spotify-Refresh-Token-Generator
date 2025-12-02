from flask import Flask, request, redirect
import requests
import base64
import os
from dotenv import load_dotenv

load_dotenv()

CLIENT_ID = os.getenv("SPOTIFY_CLIENT_ID")
CLIENT_SECRET = os.getenv("SPOTIFY_CLIENT_SECRET")
REDIRECT_URI = os.getenv("REDIRECT_URI")

app = Flask(__name__)

@app.route("/login")
def login():
    scope = "playlist-modify-public playlist-modify-private"
    auth_url = (
        "https://accounts.spotify.com/authorize"
        "?response_type=code"
        f"&client_id={CLIENT_ID}"
        f"&redirect_uri={REDIRECT_URI}"
        f"&scope={scope}"
    )
    return redirect(auth_url)

@app.route("/callback")
def callback():
    code = request.args.get("code")

    token_url = "https://accounts.spotify.com/api/token"
    auth_header = base64.b64encode(f"{CLIENT_ID}:{CLIENT_SECRET}".encode()).decode()

    payload = {
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": REDIRECT_URI
    }

    headers = {
        "Authorization": f"Basic {auth_header}",
        "Content-Type": "application/x-www-form-urlencoded"
    }

    response = requests.post(token_url, data=payload, headers=headers)
    data = response.json()

    refresh_token = data.get("refresh_token")

    print("\n----------------------------")
    print("YOUR SPOTIFY REFRESH TOKEN")
    print("----------------------------")
    print(refresh_token)
    print("----------------------------\n")

    return f"""
    <h2>Your Spotify Refresh Token:</h2>
    <pre>{refresh_token}</pre>
    <p>Copy this into your .env file:</p>
    <pre>SPOTIFY_REFRESH_TOKEN={refresh_token}</pre>
    """

if __name__ == "__main__":
    print("➡ Go to: http://localhost:8888/login")
    app.run(port=8888)

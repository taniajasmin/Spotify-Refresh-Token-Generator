# Spotify Refresh Token Denerator

A simple Node.js program for generating Spotify Access Tokens and Refresh Tokens using Spotify’s Authorization Code Flow.  
Perfect for apps that need to authenticate users and interact with the Spotify Web API (e.g., creating/modifying playlists).
P.S.  Try the Node.js rather than python. 

---

## Features

- OAuth login via Spotify
- Returns both `access_token` and `refresh_token`
- Implements the Authorization Code Flow (with PKCE optional)
- Minimal, lightweight Express server
- CORS enabled

---

## Tech Stack

- Node.js
- Express.js
- dotenv
- request (or native fetch/axios alternatives)
- Spotify Web API

---

## Project Structure
├── app.js
├── package.json
├── .env
└── README.md
text---

## Installation

### 1. Install dependencies
```Bash
npm install
```

3. Create .env file
envSPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
REDIRECT_URI=http://localhost:8888/callback

Required Setup on Spotify Developer Dashboard
These steps are mandatory – the auth flow will fail otherwise.

Go to https://developer.spotify.com/dashboard
Create a new app (any name/description)
Add the exact Redirect URI:
http://localhost:8888/callback
Copy Save the changes
Copy Client ID and Client Secret into your .env file

The required scopes (playlist-modify-private playlist-modify-public) are requested automatically during login.

Running the Server
Bashnode app.js
Server will be available at: http://localhost:8888

## Usage

Start the login flow:
Open http://localhost:8888/login
After granting permission, Spotify redirects to:
http://localhost:8888/callback
Response (JSON):

JSON{
  "access_token": "BQD...",
  "refresh_token": "AQB..."
}

Key Code Snippets
Login URL Generator
JavaScriptapp.get("/login", (req, res) => {
  const scopes = "playlist-modify-private playlist-modify-public";
  const url =
    "https://accounts.spotify.com/authorize?" +
    new URLSearchParams({
      response_type: "code",
      client_id: client_id,
      scope: scopes,
      redirect_uri: redirect_uri,
    }).toString();

  res.redirect(url);
});
Token Exchange (Callback)
JavaScriptapp.get("/callback", (req, res) => {
  const code = req.query.code || null;

  const authOptions = {
    url: "https://accounts.spotify.com/api/token",
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(client_id + ":" + client_secret).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    form: {
      grant_type: "authorization_code",
      code: code,
      redirect_uri: redirect_uri,
    },
    json: true,
  };

  request.post(authOptions, (error, response, body) => {
    {
    if (!error && response.statusCode === 200) {
      res.json({
        access_token: body.access_token,
        refresh_token: body.refresh_token,
      });
    } else {
      res.json({ error: "invalid_token" });
    }
  });
});

Scripts
JSON{
  "scripts": {
    "start": "node app.js",
    "dev": "nodemon app.js"
  }
}

## Important Notes

- Never commit your .env file
- The Redirect URI in Spotify Dashboard must match exactly (including trailing slash)
- This server is intended for development/local use
- In production, serve over HTTPS and consider adding proper session/state handling

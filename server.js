require('dotenv').config();
const express = require("express");
const request = require("request");
const cors = require("cors");

const app = express();
app.use(cors());

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;

// ⚠️ Replace this later with your ngrok URL
let redirect_uri = process.env.REDIRECT_URI;

app.get("/login", (req, res) => {
  const scopes = "user-read-private user-read-email playlist-read-private";

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

app.get("/callback", (req, res) => {
  const code = req.query.code || null;

  const authOptions = {
    url: "https://accounts.spotify.com/api/token",
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(client_id + ":" + client_secret).toString("base64"),
    },
    form: {
      grant_type: "authorization_code",
      code: code,
      redirect_uri: redirect_uri,
    },
    json: true,
  };

  request.post(authOptions, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      res.send({
        access_token: body.access_token,
        refresh_token: body.refresh_token,
      });
    } else {
      res.send({ error: "Token exchange failed", details: body });
    }
  });
});

app.get("/refresh_token", (req, res) => {
  const refreshToken = req.query.refresh_token;

  const options = {
    url: "https://accounts.spotify.com/api/token",
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(client_id + ":" + client_secret).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    form: {
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    },
    json: true,
  };

  request.post(options, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      res.send({
        access_token: body.access_token,
        refresh_token: body.refresh_token || refreshToken,
      });
    } else {
      res.send({ error: "Refresh failed", details: body });
    }
  });
});

app.listen(8888, () => {
  console.log("Listening on port 8888");
});

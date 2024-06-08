import express from 'express';
import axios from 'axios';
import querystring from 'querystring';

const app = express();
const port = 5000;

const CLIENT_ID = '8d86f11320b7453a9df057225bfbec56'; // Ganti dengan Client ID Anda
const CLIENT_SECRET = '6bed9a420b1f4860a3e675dbf7bc896d'; // Ganti dengan Client Secret Anda
const REDIRECT_URI = 'http://localhost:5173'; // Ganti dengan Redirect URI Anda

app.get('/login', (req, res) => {
  const scope = 'streaming user-read-email user-read-private';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: CLIENT_ID,
      scope: scope,
      redirect_uri: REDIRECT_URI,
    }));
});

app.get('/callback', async (req, res) => {
  const code = req.query.code || null;
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri: REDIRECT_URI,
      grant_type: 'authorization_code',
    },
    headers: {
      'Authorization': 'Basic ' + (Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'))
    },
    json: true
  };

  try {
    const response = await axios.post('https://accounts.spotify.com/api/token', querystring.stringify({
      code: code,
      redirect_uri: REDIRECT_URI,
      grant_type: 'authorization_code'
    }), {
      headers: {
        'Authorization': 'Basic ' + (Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64')),
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    const { access_token, refresh_token } = response.data;
    res.redirect(`http://localhost:3000/#access_token=${access_token}&refresh_token=${refresh_token}`);
  } catch (error) {
    res.send(error);
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

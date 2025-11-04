// src/util/Spotify.js
import { SpotifyApi } from '@spotify/web-api-ts-sdk';

const isLocal =
  window.location.hostname === '127.0.0.1' ||
  window.location.hostname === 'localhost';

const redirectUri = isLocal
  ? 'http://127.0.0.1:3000/'
  : 'https://princeps911.github.io/jammming/'; // CHANGE THIS

const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
if (!clientId) throw new Error('Missing CLIENT_ID');

// ---------- SINGLETON SDK ----------
let sdk = null;
export const getSdk = () => {
  if (!sdk) {
    sdk = SpotifyApi.withUserAuthorization(
      clientId,
      redirectUri,
      [
        'playlist-modify-public',
        'playlist-modify-private',
        'user-read-private',
        'user-read-email',
      ]
    );
  }
  return sdk;
};

// ---------- LOGIN (only when button clicked) ----------
export const login = () => {
  const api = getSdk();
  api.authenticate(); // Opens popup, redirects back with ?code=
};

// ---------- GET TOKEN (checks URL for code) ----------
export const getAccessToken = async () => {
  const api = getSdk();

  // If there's a code in URL, exchange it
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');

  if (code) {
    try {
      // This exchanges code for token
      const session = await api.authenticate();
      const token = session?.access_token;
      if (token) {
        // Clean URL
        window.history.replaceState({}, '', redirectUri);
        return token;
      }
    } catch (err) {
      console.error('Token exchange failed:', err);
    }
  }

  // Otherwise, check if SDK already has a valid session
  try {
    const session = await api.getAccessToken();
    return session?.access_token || null;
  } catch {
    return null;
  }
};

// ---------- SEARCH ----------
export const search = async (term) => {
  const api = getSdk();
  const result = await api.search(term, ['track'], { limit: 10 });
  return result.tracks.items.map(t => ({
    id: t.id,
    name: t.name,
    artist: t.artists[0].name,
    album: t.album.name,
    uri: t.uri,
  }));
};
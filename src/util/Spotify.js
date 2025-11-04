// src/util/Spotify.js
import { SpotifyApi } from '@spotify/web-api-ts-sdk';

const isLocal =
  window.location.hostname === '127.0.0.1' ||
  window.location.hostname === 'localhost';

const redirectUri = isLocal
  ? 'http://127.0.0.1:3000/'
  : 'https://princeps911.github.io/jammming/'; // CHANGE THIS

const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
if (!clientId) throw new Error('Missing REACT_APP_SPOTIFY_CLIENT_ID');

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

// ---------- LOGIN ----------
export const login = () => {
  const api = getSdk();
  api.authenticate();
};

// ---------- GET TOKEN ----------
export const getAccessToken = async () => {
  const api = getSdk();

  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');

  if (code) {
    try {
      const session = await api.authenticate();
      const token = session?.access_token;
      if (token) {
        window.history.replaceState({}, '', redirectUri);
        return token;
      }
    } catch (err) {
      console.error('Token exchange failed:', err);
    }
  }

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

// ---------- SAVE PLAYLIST ----------
export const savePlaylist = async (name, trackUris) => {
  const api = getSdk();
  const user = await api.currentUser.profile();
  const playlist = await api.playlists.createPlaylist(user.id, {
    name,
    public: true,
  });
  await api.playlists.addItemsToPlaylist(playlist.id, trackUris);
  return playlist;
};
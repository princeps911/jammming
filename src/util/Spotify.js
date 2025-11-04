// src/util/Spotify.js
import { SpotifyApi } from '@spotify/web-api-ts-sdk';

// Dynamic redirect URI
const isLocal = window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost';
const redirectUri = isLocal
  ? 'http://127.0.0.1:3000/'
  : 'https://princeps911.github.io/jammming/'; // Replace YOURUSERNAME

const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;

if (!clientId) throw new Error('Missing REACT_APP_SPOTIFY_CLIENT_ID');

// Create SDK instance with PKCE
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

// Login (opens popup)
export const login = async () => {
  const api = getSdk();
  await api.authenticate(); // This opens the popup
};

// Get access token (after redirect)
export const getAccessToken = async () => {
  const api = getSdk();
  try {
    const token = await api.getAccessToken();
    return token?.access_token || null;
  } catch {
    return null;
  }
};

// Search
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

// Save playlist
export const savePlaylist = async (name, trackUris) => {
  const api = getSdk();
  const user = await api.currentUser.profile();
  const playlist = await api.playlists.createPlaylist(user.id, { name, public: true });
  await api.playlists.addItemsToPlaylist(playlist.id, trackUris);
  return playlist;
};
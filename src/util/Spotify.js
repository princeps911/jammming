// src/util/Spotify.js
const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;

// ----------  DYNAMIC REDIRECT URI  ----------
const isLocal = window.location.hostname === '127.0.0.1' ||
                window.location.hostname === 'localhost';

const redirectUri = isLocal
  ? 'http://127.0.0.1:3000/'                     // local dev (allowed by Spotify)
  : 'https://princeps911.github.io/jammming/'; // <-- replace YOURUSERNAME

if (!clientId) {
  throw new Error('Missing REACT_APP_SPOTIFY_CLIENT_ID in .env');
}

// ----------  SCOPES ----------
const scopes = [
  'playlist-modify-public',
  'playlist-modify-private',
  'user-read-private',
  'user-read-email',
].join(' ');

// ----------  LOGIN (popup) ----------
export const login = () => {
  const authUrl = `https://accounts.spotify.com/authorize?` +
    `client_id=${clientId}` +
    `&response_type=token` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&scope=${encodeURIComponent(scopes)}`;

  const width = 450,
        height = 730;
  const left = (window.screen.width / 2) - (width / 2);
  const top = (window.screen.height / 2) - (height / 2);

  window.open(
    authUrl,
    'Spotify',
    `menubar=no,location=no,resizable=yes,scrollbars=yes,status=no,` +
    `width=${width},height=${height},top=${top},left=${left}`
  );
};

// ----------  EXTRACT TOKEN FROM HASH ----------
export const getAccessToken = () => {
  const hash = window.location.hash
    .substring(1)
    .split('&')
    .reduce((acc, part) => {
      const [k, v] = part.split('=');
      acc[k] = decodeURIComponent(v);
      return acc;
    }, {});

  const token = hash.access_token;
  const expiresIn = hash.expires_in;

  if (token) {
    window.accessToken = token;
    window.expiresAt = Date.now() + parseInt(expiresIn, 10) * 1000;
    // clean the URL
    window.history.replaceState({}, document.title, redirectUri);
  }

  if (window.accessToken && Date.now() < window.expiresAt) {
    return window.accessToken;
  }
  return undefined;
};

// ----------  FETCH HELPER ----------
const api = async (endpoint, token, options = {}) => {
  const response = await fetch(`https://api.spotify.com/v1${endpoint}`, {
    headers: { Authorization: `Bearer ${token}` },
    ...options,
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error?.message || response.statusText);
  }
  return response.json();
};

// ----------  SEARCH ----------
export const search = async (term, token) => {
  const data = await api(
    `/search?q=${encodeURIComponent(term)}&type=track&limit=10`,
    token
  );
  return data.tracks.items.map(t => ({
    id: t.id,
    name: t.name,
    artist: t.artists[0].name,
    album: t.album.name,
    uri: t.uri,
  }));
};
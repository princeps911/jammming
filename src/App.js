// src/App.js
import React, { useEffect, useState } from 'react';
import { login, getAccessToken, search } from './util/Spotify';

function App() {
  const [token, setToken] = useState('');
  const [results, setResults] = useState([]);

  // ---- 1. Grab token from URL on every load ----
  useEffect(() => {
    const t = getAccessToken();
    if (t) setToken(t);
  }, []);

  // ---- 2. If no token → show login button ----
  if (!token) {
    return (
      <div style={{ textAlign: 'center', marginTop: '100px' }}>
        <h1>Jammming</h1>
        <button
          onClick={login}
          style={{ padding: '12px 24px', fontSize: '1.2rem' }}
        >
          Log in to Spotify
        </button>
      </div>
    );
  }

  // ---- 3. Search UI ----
  const handleSearch = async (e) => {
    e.preventDefault();
    const term = e.target.term.value.trim();
    if (!term) return;
    try {
      const tracks = await search(term, token);
      setResults(tracks);
    } catch (err) {
      console.error(err);
      alert('Search failed: ' + err.message);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Jammming</h1>
      <p>Token Status: Logged in</p>

      <form onSubmit={handleSearch} style={{ marginBottom: '20px' }}>
        <input
          name="term"
          type="text"
          placeholder="Search songs, artists..."
          style={{ width: '70%', padding: '8px' }}
          required
        />
        <button type="submit" style={{ padding: '8px 16px' }}>
          Search
        </button>
      </form>

      <h2>Results</h2>
      {results.length === 0 ? (
        <p>No results yet – try searching!</p>
      ) : (
        <ul>
          {results.map(t => (
            <li key={t.id}>
              <strong>{t.name}</strong> – {t.artist} ({t.album})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
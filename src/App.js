// src/App.js
import React, { useEffect, useState } from 'react';
import { login, getAccessToken, search } from './util/Spotify';

function App() {
  const [token, setToken] = useState('');
  const [results, setResults] = useState([]);
  const [term, setTerm] = useState('');

  // Check for token on load (after redirect)
  useEffect(() => {
    const checkToken = async () => {
      const t = await getAccessToken();
      if (t) setToken(t);
    };
    checkToken();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!token || !term) return;
    try {
      const tracks = await search(term);
      setResults(tracks);
    } catch (err) {
      console.error(err);
      alert('Search failed');
    }
  };

  if (!token) {
    return (
      <div style={{ textAlign: 'center', marginTop: '100px' }}>
        <h1>Jammming</h1>
        <button onClick={login} style={{ padding: '16px 32px', fontSize: '1.2rem' }}>
          Log in to Spotify
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Jammming</h1>
      <p>Logged in</p>

      <form onSubmit={handleSearch} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Search songs..."
          style={{ width: '70%', padding: '8px' }}
        />
        <button type="submit">Search</button>
      </form>

      <h2>Results</h2>
      <ul>
        {results.map(t => (
          <li key={t.id}>
            <strong>{t.name}</strong> – {t.artist} ({t.album})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
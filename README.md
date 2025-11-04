# Jammming: Spotify Playlist Creator

## Purpose
Jammming is a React web app that lets users search the Spotify library for songs, artists, or albums, build custom playlists, and save them directly to their Spotify account. Built as a frontend project to practice React components, state management, and API integration.

## Technologies Used
- **React**: For building UI components (SearchBar, Playlist, etc.).
- **Spotify Web API**: For searching tracks and saving playlists (with OAuth PKCE auth).
- **Axios/Fetch**: For HTTP requests.
- **Git/GitHub**: Version control and hosting repo.
- **Vercel/Netlify**: Deployment platform.
- **HTML/CSS/JS**: Core web tech.

## Features
- **Search Songs**: Enter a title/artist/album; displays results with title, artist, album.
- **Build Playlist**: Add/remove tracks to a custom list; rename playlist.
- **Save to Spotify**: Authenticates user and creates playlist in their account.
- **Responsive Design**: Basic styling for desktop/mobile.

Demo: [Deployed URL here](https://jammming-yourname.vercel.app)

## Setup & Installation
1. Clone repo: `git clone https://github.com/yourusername/jammming.git`
2. Install: `cd jammming && npm install`
3. Env: Add `.env` with `REACT_APP_SPOTIFY_CLIENT_ID=your_id`
4. Run: `npm start` (localhost:3000)
5. Build: `npm run build` for production.

## Future Work
- Add drag-and-drop reordering.
- Persist playlists with localStorage.
- Genre-based searches or recommendations.
- Tests with Jest.
- Advanced styling (e.g., Tailwind CSS).

## API Credits
Powered by [Spotify Web API](https://developer.spotify.com/documentation/web-api). Client ID hidden for security.

---
Built with ❤️ by [Your Name] | [November 2025]
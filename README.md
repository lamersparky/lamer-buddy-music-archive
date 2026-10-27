# Lamer & Buddy Music Archive

A hand-coded, responsive music archive built with plain HTML, CSS, and JavaScript. Designed for GitHub Pages; no build step, framework, or package installation required. The catalog currently contains 14 songs across 3 releases.

## Preview locally

From this directory, run:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000> in your browser. Stop the server with `Ctrl+C`.

You can also open `index.html` directly, but a local server is recommended for consistent browser behavior.

## Project structure

```text
lamer-buddy-music-archive/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── app.js
│   └── music.js
├── assets/
│   └── images/
└── README.md
```

## Add or edit music

Open `js/music.js`. It contains the catalog data.

### Add a song

Add an object to the `songs` array. Give it a unique `id`; use an existing `albumId` to associate it with an album, or `null` for a standalone single.

```js
{
  id: "my-new-song",
  title: "My New Song",
  artist: "Lamer & Buddy",
  albumId: "strange-arithmetic",
  type: "album",
  year: "2026",
  duration: "3:42",
  lyrics: `Verse one...

Chorus...

Verse two...`,
  links: [
    { label: "Watch on YouTube", url: "https://youtu.be/VIDEO_ID" },
    { label: "Listen on Suno", url: "https://suno.com/song/SONG_ID" }
  ],
  embedUrl: "https://www.youtube-nocookie.com/embed/VIDEO_ID"
}
```

For a YouTube video, the embed URL format is `https://www.youtube-nocookie.com/embed/VIDEO_ID`. For Spotify, use a supported embed URL such as `https://open.spotify.com/embed/track/TRACK_ID`. Only use embed URLs from services you trust. If a provider blocks embedding, its external link can still work.

Use a JavaScript template literal (backticks) for lyrics with multiple lines. If the lyrics contain a backtick, escape it with a backslash or use a different string format.

### Add an album

Add an object to the `albums` array. Give it a unique `id`, then use that exact value as the `albumId` on its songs.

```js
{
  id: "my-album",
  title: "My Album",
  year: "2026",
  kind: "Album",
  description: "A short description of the release.",
  glyph: "✦",
  artLight: "#e7c99a",
  artMid: "#6b4c87"
}
```

The current cover art is CSS-generated placeholder artwork, so the site works without image files. To use real album art, place images in `assets/images/` and update the album-card markup in `js/app.js` to reference them.

## Publish on GitHub Pages

**Important: upload the contents of this ZIP to the repository root, not the enclosing folder.** The repository root must contain `index.html`, `.nojekyll`, `css/`, and `js/` side by side. In particular, `js/music.js` must be at that exact path because it contains the song catalog. If the `js` directory is nested inside another `lamer-buddy-music-archive/` directory, the page may load but show 0 tracks.

1. Extract this ZIP.
2. Upload the *contents* of the extracted folder to the root of the `lamer-buddy-music-archive` GitHub repository. Keep the `css/` and `js/` directories intact.
3. Commit the changes to the publishing branch, usually `main`.
4. On GitHub, open **Settings → Pages**.
5. Under **Build and deployment**, choose **Deploy from a branch**.
6. Select branch `main` and folder `/(root)`, then save.
7. Wait for the Pages deployment to finish, then hard-refresh the site (`Ctrl+Shift+R`).

The HTML uses relative asset paths and versioned URLs to help avoid stale cached assets. The `.nojekyll` file is included to make the static-site intent explicit.

A project site usually uses this URL pattern: `https://YOUR-USERNAME.github.io/lamer-buddy-music-archive/`. Replace `YOUR-USERNAME` with your GitHub username. A user/organization site repository named `YOUR-USERNAME.github.io` uses `https://YOUR-USERNAME.github.io/`.

## Before launch

- Replace placeholder lyric text with the final lyrics you want to publish.
- Check every YouTube/Suno/streaming link.
- Confirm you have the rights or permission needed to publish the lyrics and artwork.
- Keep private or unreleased lyrics out of the public repository: GitHub Pages repositories publish their site files publicly.
- The fonts load from Google Fonts; the site uses fallback fonts if the external font service is unavailable.

## Current features

- Responsive cosmic/celestial design
- Album and release cards
- Search by title, artist, album, and lyric text
- Filters for all music, album tracks, and singles
- Track detail dialog with full lyrics
- Optional YouTube/Spotify/SoundCloud-style embed URLs
- External listening links
- Mobile navigation and `/` keyboard shortcut for search

(() => {
  "use strict";
  const data = window.MUSIC_ARCHIVE;
  const albumGrid = document.getElementById("albumGrid");
  const songList = document.getElementById("songList");
  const searchInput = document.getElementById("searchInput");
  const emptyState = document.getElementById("emptyState");
  const songCount = document.getElementById("songCount");
  const dialog = document.getElementById("trackDialog");
  const trackDetail = document.getElementById("trackDetail");
  let activeFilter = "all";

  const escapeHtml = (value = "") => String(value).replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[c]);

  // Fail visibly instead of leaving the page stuck at “0 tracks” if the catalog
  // asset is missing or malformed (for example, after an incomplete upload).
  if (!data || !Array.isArray(data.albums) || !Array.isArray(data.songs)) {
    songCount.textContent = "0";
    emptyState.hidden = false;
    emptyState.textContent = "The music catalog could not load. Please upload the complete site, including js/music.js, and refresh the page.";
    console.error("Lamer & Buddy archive: window.MUSIC_ARCHIVE is missing or malformed. Check the js/music.js path and deployment contents.");
    return;
  }

  const getAlbum = id => data.albums.find(album => album.id === id);
  const albumName = song => getAlbum(song.albumId)?.title || "Standalone single";

  function renderAlbums() {
    albumGrid.innerHTML = data.albums.map(album => {
      const tracks = data.songs.filter(song => song.albumId === album.id).length;
      return `<article class="album-card">
        <div class="album-art" style="--art-light:${escapeHtml(album.artLight || "#a08bca")};--art-mid:${escapeHtml(album.artMid || "#3a315c")}">
          <span class="art-glyph">${escapeHtml(album.glyph || "✦")}</span>
          <span class="art-label">${escapeHtml(album.title)}</span>
        </div>
        <h3>${escapeHtml(album.title)}</h3>
        <div class="album-meta">${escapeHtml(album.year || "Release year TBA")} · ${escapeHtml(album.kind || "Release")} · ${tracks} track${tracks === 1 ? "" : "s"}</div>
        <p>${escapeHtml(album.description || "")}</p>
        <button class="card-link" data-album="${escapeHtml(album.id)}">Explore release ↗</button>
      </article>`;
    }).join("");
  }

  function filteredSongs() {
    const q = searchInput.value.trim().toLowerCase();
    return data.songs.filter(song => {
      const matchesFilter = activeFilter === "all" || song.type === activeFilter;
      const haystack = [song.title, song.artist, albumName(song), song.year, song.lyrics].join(" ").toLowerCase();
      return matchesFilter && (!q || haystack.includes(q));
    });
  }

  function renderSongs() {
    const songs = filteredSongs();
    songCount.textContent = data.songs.length;
    songList.innerHTML = songs.map((song, index) => `
      <article class="song-row">
        <span class="song-number">${String(index + 1).padStart(2, "0")}</span>
        <div>
          <div class="song-title">${escapeHtml(song.title)}</div>
          <div class="song-subtitle">${escapeHtml(song.artist || "Lamer & Buddy")} · ${escapeHtml(albumName(song))}${song.year ? " · " + escapeHtml(song.year) : ""}</div>
        </div>
        <span class="song-tag">${song.type === "single" ? "Single" : "Album track"}</span>
        <button class="song-open" data-song="${escapeHtml(song.id)}" aria-label="Open ${escapeHtml(song.title)}">↗</button>
      </article>`).join("");
    emptyState.hidden = songs.length !== 0;
  }

  function renderDetail(song) {
    const album = getAlbum(song.albumId);
    const links = (song.links || []).filter(link => link.url);
    const safeEmbed = song.embedUrl && /^https:\/\/(www\.)?(youtube-nocookie\.com|youtube\.com|open\.spotify\.com|w\.soundcloud\.com)\//.test(song.embedUrl);
    trackDetail.innerHTML = `
      <p class="detail-kicker">${escapeHtml(albumName(song))} · ${escapeHtml(song.year || "Year TBA")}</p>
      <h2 class="detail-title">${escapeHtml(song.title)}</h2>
      <p class="detail-meta">${escapeHtml(song.artist || "Lamer & Buddy")}${song.duration ? " · " + escapeHtml(song.duration) : ""}${album ? " · " + escapeHtml(album.title) : " · Single"}</p>
      ${safeEmbed ? `<div class="embed-wrap"><iframe src="${escapeHtml(song.embedUrl)}" title="Player for ${escapeHtml(song.title)}" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>` : ""}
      <h3 class="eyebrow">LYRICS</h3>
      <div class="lyrics">${escapeHtml(song.lyrics || "Lyrics have not been added yet.")}</div>
      <div class="detail-actions">
        ${links.map(link => `<a href="${escapeHtml(link.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(link.label || "Listen") } ↗</a>`).join("")}
        ${!links.length ? `<span class="embed-placeholder">Listening links will appear here when added to js/music.js.</span>` : ""}
      </div>`;
    if (!dialog.open) dialog.showModal();
  }

  albumGrid.addEventListener("click", event => {
    const button = event.target.closest("[data-album]");
    if (!button) return;
    const albumId = button.dataset.album;
    activeFilter = "all";
    document.querySelectorAll(".filter-button").forEach(b => b.classList.toggle("active", b.dataset.filter === "all"));
    searchInput.value = "";
    renderSongs();
    document.getElementById("library").scrollIntoView({ behavior: "smooth" });
    // Briefly show tracks for the selected release by setting a useful search term.
    searchInput.value = getAlbum(albumId)?.title || "";
    renderSongs();
  });

  songList.addEventListener("click", event => {
    const button = event.target.closest("[data-song]");
    if (!button) return;
    const song = data.songs.find(item => item.id === button.dataset.song);
    if (song) renderDetail(song);
  });

  searchInput.addEventListener("input", renderSongs);
  document.querySelectorAll(".filter-button").forEach(button => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.filter;
      document.querySelectorAll(".filter-button").forEach(b => b.classList.toggle("active", b === button));
      renderSongs();
    });
  });

  const menuToggle = document.getElementById("menuToggle");
  const nav = document.getElementById("mainNav");
  menuToggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(open));
  });
  nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
    nav.classList.remove("open"); menuToggle.setAttribute("aria-expanded", "false");
  }));
  document.getElementById("year").textContent = new Date().getFullYear();

  renderAlbums();
  renderSongs();
})();

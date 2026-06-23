// =========================================================
// script.js
// This file makes the navbar buttons scroll the page,
// instead of using <a href="#section"> links.
// =========================================================

// Wait until the whole page has loaded before running our code.
document.addEventListener('DOMContentLoaded', function () {

  // Grab the mobile menu elements up front so every function below can use them.
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  // ---------------------------------------------------------
  // 1. SMOOTH SCROLL NAVIGATION
  // ---------------------------------------------------------
  // Find every button in the navbar that has a data-target attribute.
  // Example: <button class="nav-btn" data-target="about">About</button>
  const navButtons = document.querySelectorAll('.nav-btn');

  navButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      // Read the section id we want to scroll to (e.g. "about")
      const targetId = button.getAttribute('data-target');
      const targetSection = document.getElementById(targetId);

      if (targetSection) {
        // scrollIntoView is a built-in browser function.
        // "smooth" makes it glide instead of jumping instantly.
        targetSection.scrollIntoView({ behavior: 'smooth' });
      }

      // If the mobile menu is open, close it after clicking a link.
      navLinks.classList.remove('open');
    });
  });

  // ---------------------------------------------------------
  // 2. HERO "LISTEN NOW" BUTTON
  // ---------------------------------------------------------
  // Reuses the exact same scroll logic, just for one extra button.
  const heroCta = document.getElementById('heroCta');
  if (heroCta) {
    heroCta.addEventListener('click', function () {
      document.getElementById('discography').scrollIntoView({ behavior: 'smooth' });
    });
  }

  // ---------------------------------------------------------
  // 3. MOBILE MENU TOGGLE
  // ---------------------------------------------------------
  // On small screens, the nav links are hidden until this button is tapped.
  navToggle.addEventListener('click', function () {
    navLinks.classList.toggle('open');
  });

  // ---------------------------------------------------------
  // 4. LEAFLET MAP
  // ---------------------------------------------------------
  // This builds the dark tour map in the Tours section.
  // EDIT THIS LIST to match your real tour cities + dates.
  const tourStops = [
    { city: 'New York, NY',    date: 'Sep 12, 2026', lat: 40.7128, lng: -74.0060 },
    { city: 'Atlanta, GA',     date: 'Sep 20, 2026', lat: 33.7490, lng: -84.3880 },
    { city: 'Los Angeles, CA', date: 'Oct 03, 2026', lat: 34.0522, lng: -118.2437 },
    { city: 'Chicago, IL',     date: 'Oct 14, 2026', lat: 41.8781, lng: -87.6298 }
  ];

  const mapElement = document.getElementById('tourMap');

  if (mapElement && typeof L !== 'undefined') {
    // Center the map roughly in the middle of the US, zoomed out a bit.
    const map = L.map('tourMap', {
      scrollWheelZoom: false
    }).setView([39, -96], 3);

    // CARTO's free dark tile set — this is what gives the map a
    // black/dark look straight out of the box (style.css fine-tunes it).
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CARTO',
      maxZoom: 18
    }).addTo(map);

    // Drop a marker + popup for every tour stop in the list above.
    tourStops.forEach(function (stop) {
      L.marker([stop.lat, stop.lng])
        .addTo(map)
        .bindPopup('<strong>' + stop.city + '</strong><br>' + stop.date);
    });
  }

  // ---------------------------------------------------------
  // 5. PLACEHOLDER AUDIO PLAYBACK (tracklist play buttons)
  // ---------------------------------------------------------
  // Each .track row has a play button, a progress bar, and an
  // <audio> element with an empty "src" for now. This code:
  //   - plays/pauses the clicked track
  //   - pauses any other track that was already playing
  //   - animates the progress bar while audio plays
  // Once you add a real file (e.g. <audio src="introd.mp3">),
  // this same code will work with no further changes.
  const allTracks = document.querySelectorAll('.track');
  let currentlyPlaying = null; // remembers which <audio> is active

  allTracks.forEach(function (track) {
    const playBtn = track.querySelector('.play-btn');
    const audio = track.querySelector('audio');
    const progressFill = track.querySelector('.track-progress-fill');

    // Find this track's lyrics panel. It's the very next sibling element
    // in the HTML (see index.html — each .track is followed directly by
    // a .lyrics-panel with a matching id, e.g. data-track="3" -> #lyrics-3).
    const trackNumber = track.getAttribute('data-track');
    const lyricsPanel = document.getElementById('lyrics-' + trackNumber);

    playBtn.addEventListener('click', function () {
      // Close every other track's lyrics panel first, so only one
      // is open at a time (feel free to remove this if you want
      // multiple panels open at once).
      document.querySelectorAll('.lyrics-panel.open').forEach(function (panel) {
        if (panel !== lyricsPanel) {
          panel.classList.remove('open');
        }
      });

      // If there's no audio file yet, just toggle the button's look
      // so you can see the interaction working before files are added.
      if (!audio.getAttribute('src')) {
        const isPlaying = playBtn.classList.contains('playing');
        // stop any other "fake playing" button first
        document.querySelectorAll('.play-btn.playing').forEach(function (btn) {
          if (btn !== playBtn) {
            btn.classList.remove('playing');
            btn.textContent = '▶';
          }
        });
        if (!isPlaying) {
          playBtn.classList.add('playing');
          playBtn.textContent = '❙❙';
          if (lyricsPanel) lyricsPanel.classList.add('open');
        } else {
          playBtn.textContent = '▶';
          if (lyricsPanel) lyricsPanel.classList.remove('open');
        }
        return;
      }

      // --- Real audio logic (runs once a file is attached) ---
      if (currentlyPlaying && currentlyPlaying !== audio) {
        currentlyPlaying.pause();
      }

      if (audio.paused) {
        audio.play();
        playBtn.textContent = '❙❙';
        playBtn.classList.add('playing');
        if (lyricsPanel) lyricsPanel.classList.add('open');
        currentlyPlaying = audio;
      } else {
        audio.pause();
        playBtn.textContent = '▶';
        playBtn.classList.remove('playing');
        if (lyricsPanel) lyricsPanel.classList.remove('open');
      }
    });

    // Keep the gold progress bar in sync with real playback time.
    if (audio) {
      audio.addEventListener('timeupdate', function () {
        if (audio.duration) {
          const percent = (audio.currentTime / audio.duration) * 100;
          progressFill.style.width = percent + '%';
        }
      });

      audio.addEventListener('ended', function () {
        playBtn.textContent = '▶';
        playBtn.classList.remove('playing');
        progressFill.style.width = '0%';
        if (lyricsPanel) lyricsPanel.classList.remove('open');
      });
    }
  });

});
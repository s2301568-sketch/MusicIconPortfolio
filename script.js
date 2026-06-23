document.addEventListener('DOMContentLoaded', function () {

  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const navButtons = document.querySelectorAll('.nav-btn');
  const heroCta = document.getElementById('heroCta');
  const mapElement = document.getElementById('tourMap');
  const allTracks = document.querySelectorAll('.track');
  
  let currentlyPlaying = null; 

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      navLinks.classList.toggle('open');
    });
  }

  navButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      const targetId = button.getAttribute('data-target');
      const targetSection = document.getElementById(targetId);
      
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth' });
      }

      if (navLinks && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
      }
    });
  });

  if (heroCta) {
    heroCta.addEventListener('click', function () {
      const discoSection = document.getElementById('discography');
      if (discoSection) {
        discoSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  const tourStops = [
    { city: 'New York, NY',    date: 'Sep 12, 2026', lat: 40.7128, lng: -74.0060 },
    { city: 'Atlanta, GA',     date: 'Sep 20, 2026', lat: 33.7490, lng: -84.3880 },
    { city: 'Los Angeles, CA', date: 'Oct 03, 2026', lat: 34.0522, lng: -118.2437 },
    { city: 'Chicago, IL',     date: 'Oct 14, 2026', lat: 41.8781, lng: -87.6298 }
  ];

  if (mapElement && typeof L !== 'undefined') {
    const map = L.map('tourMap', { scrollWheelZoom: false }).setView([39, -96], 3);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CARTO',
      maxZoom: 18
    }).addTo(map);

    tourStops.forEach(function (stop) {
      L.marker([stop.lat, stop.lng])
        .addTo(map)
        .bindPopup('<strong>' + stop.city + '</strong><br>' + stop.date);
    });
  }

  allTracks.forEach(function (track) {
    const playBtn = track.querySelector('.play-btn');
    const audio = track.querySelector('audio');
    const progressFill = track.querySelector('.track-progress-fill');
    const trackNumber = track.getAttribute('data-track');
    const lyricsPanel = document.getElementById('lyrics-' + trackNumber);

    if (!playBtn || !audio) return; 

    playBtn.addEventListener('click', function () {
      document.querySelectorAll('.lyrics-panel.open').forEach(function (panel) {
        if (panel !== lyricsPanel) {
          panel.classList.remove('open');
        }
      });

      document.querySelectorAll('.play-btn.playing').forEach(function (btn) {
        if (btn !== playBtn) {
          btn.classList.remove('playing');
          btn.textContent = '▶';
        }
      });

      if (!audio.getAttribute('src')) {
        const isPlaying = playBtn.classList.contains('playing');
        if (!isPlaying) {
          playBtn.classList.add('playing');
          playBtn.textContent = '❙❙';
          if (lyricsPanel) lyricsPanel.classList.add('open');
        } else {
          playBtn.classList.remove('playing');
          playBtn.textContent = '▶';
          if (lyricsPanel) lyricsPanel.classList.remove('open');
        }
        return;
      }

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

    audio.addEventListener('timeupdate', function () {
      if (audio.duration && progressFill) {
        const percent = (audio.currentTime / audio.duration) * 100;
        progressFill.style.width = percent + '%';
      }
    });

    audio.addEventListener('ended', function () {
      playBtn.textContent = '▶';
      playBtn.classList.remove('playing');
      if (progressFill) progressFill.style.width = '0%';
      if (lyricsPanel) lyricsPanel.classList.remove('open');
    });
  });

});
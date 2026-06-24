document.addEventListener('DOMContentLoaded', function () {

  const allTracks = document.querySelectorAll('.track');

  let currentlyPlaying = null;

  // ── Track player ───────────────────────────────────────────────────────────
  allTracks.forEach(function (track) {
    const playBtn      = track.querySelector('.play-btn');
    const audio        = track.querySelector('audio');
    const progressFill = track.querySelector('.track-progress-fill');
    const trackNumber  = track.getAttribute('data-track');
    const lyricsPanel  = document.getElementById('lyrics-' + trackNumber);

    if (!playBtn || !audio) return;

    playBtn.addEventListener('click', function () {
      document.querySelectorAll('.lyrics-panel.open').forEach(function (panel) {
        if (panel !== lyricsPanel) panel.classList.remove('open');
      });

      
      document.querySelectorAll('.play-btn.playing').forEach(function (btn) {
        if (btn !== playBtn) {
          btn.classList.remove('playing');
          btn.textContent = '▶';
        }
      });

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
        progressFill.style.width = (audio.currentTime / audio.duration) * 100 + '%';
      }
    });

    audio.addEventListener('ended', function () {
      playBtn.textContent = '▶';
      playBtn.classList.remove('playing');
      if (progressFill) progressFill.style.width = '0%';
      if (lyricsPanel)  lyricsPanel.classList.remove('open');
    });
  });

});
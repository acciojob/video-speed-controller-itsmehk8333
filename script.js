// Elements
const video = document.getElementById('video');
const toggleBtn = document.getElementById('toggle');
const progress = document.getElementById('progress');
const progressFilled = document.getElementById('progressFilled');
const volumeSlider = document.getElementById('volume');
const playbackRateSlider = document.getElementById('playbackRate');
const skipBackBtn = document.getElementById('skipBack');
const skipFwdBtn = document.getElementById('skipFwd');
const timeDisplay = document.getElementById('timeDisplay');

// Helpers
function togglePlay() {
  if (video.paused || video.ended) {
    video.play();
  } else {
    video.pause();
  }
}

function updateToggleIcon() {
  toggleBtn.textContent = video.paused ? '►' : '❚❚';
}

function handleProgress() {
  const percent = (video.currentTime / video.duration) * 100 || 0;
  progressFilled.style.width = `${percent}%`;
  updateTimeDisplay();
}

function scrub(e) {
  const rect = progress.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const ratio = Math.max(0, Math.min(1, clickX / rect.width));
  video.currentTime = ratio * video.duration;
}

function formatTime(seconds) {
  if (isNaN(seconds) || !isFinite(seconds)) return '00:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
}

function updateTimeDisplay() {
  const current = formatTime(video.currentTime);
  const total = formatTime(video.duration);
  timeDisplay.textContent = `${current} / ${total}`;
}

// Events
video.addEventListener('click', togglePlay);
toggleBtn.addEventListener('click', togglePlay);

video.addEventListener('play', updateToggleIcon);
video.addEventListener('pause', updateToggleIcon);
video.addEventListener('timeupdate', handleProgress);
video.addEventListener('loadedmetadata', () => {
  handleProgress();
  updateTimeDisplay();
});

// Volume and playbackRate
volumeSlider.addEventListener('input', (e) => {
  video.volume = parseFloat(e.target.value);
});

playbackRateSlider.addEventListener('input', (e) => {
  video.playbackRate = parseFloat(e.target.value);
});

// Skip buttons
skipBackBtn.addEventListener('click', () => {
  video.currentTime = Math.max(0, video.currentTime - 10);
});

skipFwdBtn.addEventListener('click', () => {
  video.currentTime = Math.min(video.duration || Infinity, video.currentTime + 25);
});

// Scrub: click and drag support
let mousedown = false;
progress.addEventListener('click', scrub);
progress.addEventListener('mousedown', () => mousedown = true);
progress.addEventListener('mouseup', () => mousedown = false);
progress.addEventListener('mouseleave', () => mousedown = false);
progress.addEventListener('mousemove', (e) => {
  if (mousedown) scrub(e);
});

// Initialize
updateToggleIcon();
updateTimeDisplay();
video.volume = parseFloat(volumeSlider.value);
video.playbackRate = parseFloat(playbackRateSlider.value);

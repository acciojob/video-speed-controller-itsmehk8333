// scripts.js

const player = document.querySelector('.player');
const video = player.querySelector('.player__video');
const toggle = player.querySelector('.toggle');
const rewindBtn = player.querySelector('.rewind');
const forwardBtn = player.querySelector('.forward');
const progress = player.querySelector('.progress');
const progressFilled = player.querySelector('.progress__filled');
const volumeSlider = player.querySelector('input[name="volume"]');
const playbackRateSlider = player.querySelector('input[name="playbackRate"]');
const timeDisplay = player.querySelector('.time-display');

function togglePlay() {
  video.paused ? video.play() : video.pause();
}
function updateToggleIcon() {
  toggle.textContent = video.paused ? '►' : '❚❚';
}
function handleProgress() {
  const percent = (video.currentTime / video.duration) * 100;
  progressFilled.style.width = `${percent}%`;
  updateTimeDisplay();
}
function scrub(e) {
  const rect = progress.getBoundingClientRect();
  const scrubTime = ((e.offsetX || (e.clientX - rect.left)) / rect.width) * video.duration;
  video.currentTime = scrubTime;
}
function formatTime(sec) {
  if (!sec) return '00:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
}
function updateTimeDisplay() {
  timeDisplay.textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
}

// Event listeners
video.addEventListener('click', togglePlay);
video.addEventListener('play', updateToggleIcon);
video.addEventListener('pause', updateToggleIcon);
video.addEventListener('timeupdate', handleProgress);
video.addEventListener('loadedmetadata', updateTimeDisplay);

toggle.addEventListener('click', togglePlay);

rewindBtn.addEventListener('click', () => {
  video.currentTime = Math.max(0, video.currentTime - 10);
});
forwardBtn.addEventListener('click', () => {
  video.currentTime = Math.min(video.duration, video.currentTime + 25);
});

volumeSlider.addEventListener('input', () => {
  video.volume = parseFloat(volumeSlider.value);
});
playbackRateSlider.addEventListener('input', () => {
  video.playbackRate = parseFloat(playbackRateSlider.value);
});

let mousedown = false;
progress.addEventListener('click', scrub);
progress.addEventListener('mousedown', () => mousedown = true);
progress.addEventListener('mouseup', () => mousedown = false);
progress.addEventListener('mouseleave', () => mousedown = false);
progress.addEventListener('mousemove', (e) => mousedown && scrub(e));

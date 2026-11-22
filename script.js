const screens = [...document.querySelectorAll(".screen")];
const balloonLayer = document.getElementById("balloon-layer");
const confettiLayer = document.getElementById("confetti-layer");
const sparkleLayer = document.getElementById("sparkle-layer");
const soundToggle = document.getElementById("sound-toggle");
const soundIcon = document.getElementById("sound-icon");
const soundLabel = document.getElementById("sound-label");
let soundOn = false;
let audioContext = null;

function showScreen(id) {
  screens.forEach(screen => screen.classList.toggle("active", screen.id === id));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function makeBalloons(count = 42) {
  balloonLayer.innerHTML = "";
  const colors = ["#ff9fbd", "#a99aff", "#ffd27f", "#8fe0d2", "#ffb08f", "#d6a5ff"];
  for (let i = 0; i < count; i++) {
    const balloon = document.createElement("div");
    balloon.className = "balloon";
    const color = colors[Math.floor(Math.random() * colors.length)];
    balloon.style.left = `${Math.random() * 100}%`;
    balloon.style.background = `radial-gradient(circle at 30% 25%, rgba(255,255,255,.8), ${color} 35%, ${color} 100%)`;
    balloon.style.color = color;
    balloon.style.setProperty("--drift", `${Math.random() * 150 - 75}px`);
    balloon.style.animationDuration = `${9 + Math.random() * 9}s`;
    balloon.style.animationDelay = `${Math.random() * 2}s`;
    balloon.style.transform = `scale(${0.7 + Math.random() * 0.65})`;
    balloonLayer.appendChild(balloon);
  }
}

function makeConfetti(count = 180) {
  confettiLayer.innerHTML = "";
  const colors = ["#ffb4ca", "#f7d89a", "#c6b6ff", "#8fe0d2", "#fff1e6", "#f48eaa"];
  for (let i = 0; i < count; i++) {
    const piece = document.createElement("i");
    piece.className = "confetti";
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.borderRadius = Math.random() > .5 ? "50%" : "2px";
    piece.style.setProperty("--drift", `${Math.random() * 240 - 120}px`);
    piece.style.animationDuration = `${3 + Math.random() * 4}s`;
    piece.style.animationDelay = `${Math.random() * 1.2}s`;
    confettiLayer.appendChild(piece);
  }
  window.setTimeout(() => { confettiLayer.innerHTML = ""; }, 9000);
}

function playChime() {
  if (!soundOn) return;
  try {
    audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((frequency, index) => {
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      oscillator.type = "sine";
      oscillator.frequency.value = frequency;
      const start = audioContext.currentTime + index * .13;
      gain.gain.setValueAtTime(.0001, start);
      gain.gain.exponentialRampToValueAtTime(.12, start + .03);
      gain.gain.exponentialRampToValueAtTime(.0001, start + .45);
      oscillator.connect(gain); gain.connect(audioContext.destination);
      oscillator.start(start); oscillator.stop(start + .5);
    });
  } catch (error) { console.info("Audio is unavailable in this browser.", error); }
}

function sparkleBurst() {
  for (let i = 0; i < 34; i++) {
    const sparkle = document.createElement("span");
    sparkle.className = "wish-sparkle";
    sparkle.textContent = ["✦", "✧", "✨"][Math.floor(Math.random() * 3)];
    sparkle.style.left = `${Math.random() * 100}%`;
    sparkle.style.top = `${25 + Math.random() * 60}%`;
    sparkle.style.fontSize = `${12 + Math.random() * 18}px`;
    sparkle.style.animationDelay = `${Math.random() * .45}s`;
    sparkleLayer.appendChild(sparkle);
    window.setTimeout(() => sparkle.remove(), 1900);
  }
}

document.getElementById("open-gift").addEventListener("click", () => {
  showScreen("birthday");
  makeBalloons();
  makeConfetti();
  playChime();
});
document.getElementById("to-wishes").addEventListener("click", () => showScreen("wishes"));
document.getElementById("to-letter").addEventListener("click", () => showScreen("letter"));
document.querySelectorAll("[data-back]").forEach(button => {
  button.addEventListener("click", () => showScreen(button.dataset.back));
});
document.getElementById("replay").addEventListener("click", () => {
  balloonLayer.innerHTML = "";
  confettiLayer.innerHTML = "";
  sparkleLayer.innerHTML = "";
  showScreen("intro");
});
document.getElementById("make-wish").addEventListener("click", () => {
  const result = document.getElementById("wish-result");
  result.classList.add("show");
  sparkleBurst();
  makeConfetti(85);
  playChime();
});
soundToggle.addEventListener("click", () => {
  soundOn = !soundOn;
  soundIcon.textContent = soundOn ? "♫" : "♪";
  soundLabel.textContent = soundOn ? "Sound on" : "Sound off";
  if (soundOn) playChime();
});

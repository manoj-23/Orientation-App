// ---------------- Orientation Detection ----------------
let currentMode = "portrait-up";

// Show feature based on mode
function showFeature(mode) {
  currentMode = mode;
  document.querySelectorAll(".feature").forEach(el => el.classList.remove("active"));

  if (mode === "portrait-up") {
    document.getElementById("alarm").classList.add("active");
  } else if (mode === "portrait-down") {
    document.getElementById("timer").classList.add("active");
  } else if (mode === "landscape-right") {
    document.getElementById("stopwatch").classList.add("active");
  } else if (mode === "landscape-left") {
    document.getElementById("weather").classList.add("active");
    getWeather();
  }
}

// Toggle button (for devices with only 2 orientations)
function toggleFeature() {
  if (currentMode === "portrait-up") {
    document.getElementById("alarm").classList.toggle("active");
    document.getElementById("timer").classList.toggle("active");
  } else if (currentMode.startsWith("landscape")) {
    document.getElementById("stopwatch").classList.toggle("active");
    document.getElementById("weather").classList.toggle("active");
    if (document.getElementById("weather").classList.contains("active")) getWeather();
  }
}

// DeviceOrientation API
window.addEventListener("deviceorientation", (event) => {
  const beta = event.beta;   // front-back tilt
  const gamma = event.gamma; // left-right tilt

  let mode = "unknown";

  if (beta > 120 || beta < -120) {
    mode = "portrait-down"; // upside down
  } else if (beta > -45 && beta < 45) {
    mode = "portrait-up"; // upright
  } else if (gamma > 45) {
    mode = "landscape-right";
  } else if (gamma < -45) {
    mode = "landscape-left";
  }

  if (mode !== "unknown") {
    showFeature(mode);
  }
});

// ---------------- Alarm Clock ----------------
function updateClock() {
  const now = new Date();
  document.getElementById("clock").innerText = now.toLocaleTimeString();
  if (alarmTime && now.toLocaleTimeString() === alarmTime) {
    alert("⏰ Alarm!");
    alarmTime = null;
    document.getElementById("alarmStatus").innerText = "";
  }
}
setInterval(updateClock, 1000);

let alarmTime = null;
function setAlarm() {
  const timeInput = document.getElementById("alarmTime").value;
  if (timeInput) {
    alarmTime = new Date();
    const [hours, minutes] = timeInput.split(":");
    alarmTime.setHours(hours, minutes, 0, 0);
    alarmTime = alarmTime.toLocaleTimeString();
    document.getElementById("alarmStatus").innerText = "Alarm set for " + alarmTime;
  }
}

// ---------------- Stopwatch ----------------
let stopwatchInterval;
let stopwatchTime = 0;

function startStopwatch() {
  if (stopwatchInterval) return;
  stopwatchInterval = setInterval(() => {
    stopwatchTime++;
    document.getElementById("stopwatchDisplay").innerText = formatTime(stopwatchTime);
  }, 1000);
}

function stopStopwatch() {
  clearInterval(stopwatchInterval);
  stopwatchInterval = null;
}

function resetStopwatch() {
  stopStopwatch();
  stopwatchTime = 0;
  document.getElementById("stopwatchDisplay").innerText = "00:00:00";
}

function formatTime(sec) {
  const h = String(Math.floor(sec / 3600)).padStart(2, "0");
  const m = String(Math.floor((sec % 3600) / 60)).padStart(2, "0");
  const s = String(sec % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

// ---------------- Timer ----------------
let timerInterval;
function startTimer() {
  let time = parseInt(document.getElementById("timerInput").value);
  if (isNaN(time) || time <= 0) return alert("Enter valid seconds");

  document.getElementById("timerDisplay").innerText = time;
  timerInterval = setInterval(() => {
    time--;
    document.getElementById("timerDisplay").innerText = time;
    if (time <= 0) {
      clearInterval(timerInterval);
      alert("⏲ Time's up!");
    }
  }, 1000);
}

// ---------------- Weather ----------------
async function getWeather() {
  const apiKey = "YOUR_OPENWEATHERMAP_KEY"; // replace with your API key
  const city = "Hyderabad";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    document.getElementById("weatherInfo").innerText =
      `${data.name}: ${data.main.temp}°C, ${data.weather[0].description}`;
    document.getElementById("weatherIcon").src =
      `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
  } catch (err) {
    document.getElementById("weatherInfo").innerText = "Error loading weather";
  }
}

// ---------------- Initialize ----------------
showFeature("portrait-up"); // default

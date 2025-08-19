// Orientation detection
function getOrientation() {
  const angle = window.orientation || window.screen.orientation.angle;
  const type = window.screen.orientation.type;

  if (type.includes("portrait") && angle === 0) return "portrait-up";  
  if (type.includes("portrait") && angle === 180) return "portrait-down";  
  if (type.includes("landscape") && (angle === 90 || angle === -90)) return "landscape-right";  
  if (type.includes("landscape") && (angle === 270 || angle === -270)) return "landscape-left";  
  return "unknown";
}

function showFeature(mode) {
  document.querySelectorAll(".feature").forEach(el => el.classList.remove("active"));

  if (mode === "portrait-up") document.getElementById("alarm").classList.add("active");
  else if (mode === "landscape-right") document.getElementById("stopwatch").classList.add("active");
  else if (mode === "portrait-down") document.getElementById("timer").classList.add("active");
  else if (mode === "landscape-left") {
    document.getElementById("weather").classList.add("active");
    getWeather();
  }
}

window.addEventListener("orientationchange", () => {
  showFeature(getOrientation());
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

// Show initial feature
showFeature(getOrientation());

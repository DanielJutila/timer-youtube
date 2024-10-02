let userLocale = "en-US";

const socket = new WebSocket("ws://localhost:8080");
let timer;
let interval;
let animation = false;
const connectWebSocket = () => {
  socket.onopen = () => {
    console.log("Connected to WebSocket");
  };
  socket.onclose = () => {
    console.log("Disconnected from WebSocket, attempting to reconnect...");
    setTimeout(() => {
      connectWebSocket();
    }, 5000);
  };
  socket.onmessage = (event) => {
    let message = JSON.parse(event.data);
    if (message.type === "time") {
      timer = message.data;
      if(!animation){
        updateCountdown(timer);
      }
    }
  };
  socket.onerror = (error) => {
    console.error("WebSocket error:", error);
  };
};

// This will reload on refresh, will have to change so it does not reset
window.addEventListener("onWidgetLoad", function (obj) {
  connectWebSocket();
});

window.addEventListener("onEventReceived", function (obj) {
  if (!obj.detail.event) return;

  if (obj.detail.listener === "sponsor-latest") {
    if (obj.detail.event.tier) {
      let timeToAdd = 0;
      if (obj.detail.event.tier.includes("dweller")) {
        timeToAdd = 180
      } else if (obj.detail.event.tier.includes("support")) {
        timeToAdd = 300;
      } else if (obj.detail.event.tier.includes("adventurer")) {
        timeToAdd = 600;
      } else if (obj.detail.event.tier.includes("hero")) {
        timeToAdd = 1800;
      }
      if(timeToAdd > 0){
        animateIncrease(timer, timeToAdd);
        socket.send(JSON.stringify({ type: "tier", data: timeToAdd }));
      }
    } else {
      //I think this should add time if no tier
      //So for gifted subs?
      socket.send(JSON.stringify({ type: "tier", data: 300 }));
    }
  }
});

function animateIncrease(currentTime, timeToAdd) {
  clearInterval(interval);
  if (timeToAdd === 0) return;

  const targetTime = currentTime + timeToAdd;
  const animationDuration = 500;
  const steps = 200;
  const stepInterval = animationDuration / steps; 
  const timePerStep = timeToAdd / steps; 
  
  let currentStep = 0;

  if (currentTime < targetTime) {
    animation = true;
    interval = setInterval(() => {
      if (currentStep >= steps || currentTime >= targetTime) {
        clearInterval(interval);
        animation = false;
        updateCountdown(targetTime); 
      } else {
        currentTime += timePerStep;
        currentStep++;
        updateCountdown(Math.floor(currentTime));
      }
    }, stepInterval);
  }
}
function updateCountdown(time) {
  let hours = Math.floor(time / 3600);
  let minutes = Math.floor((time % 3600) / 60);
  let seconds = time % 60;

  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;

  const countdownDiv = document.getElementById("countdown");
  while (countdownDiv.firstChild) {
    countdownDiv.removeChild(countdownDiv.firstChild);
  }
  const p = document.createElement("p");
  p.textContent = `${hours}:${minutes}:${seconds}`;
  p.classList.add("countdownText");
  countdownDiv.appendChild(p);
  if (--time < 0) {
    clearInterval(interval);
  }
}
connectWebSocket();
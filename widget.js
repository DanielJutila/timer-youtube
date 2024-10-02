let userLocale = "en-US";

const socket = new WebSocket("ws://localhost:8080");
let timer;
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
      updateCountdown();
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
        socket.send(JSON.stringify({ type: "tier", data: timeToAdd }));
      }
    } else {
      //I think this should add time if no tier
      //So for gifted subs?
      socket.send(JSON.stringify({ type: "tier", data: 300 }));
    }
  }
});

function updateCountdown() {
  let hours = Math.floor(timer / 3600);
  let minutes = Math.floor((timer % 3600) / 60);
  let seconds = timer % 60;

  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;

  const countdownDiv = document.getElementById("countdown");
  while (countdownDiv.firstChild) {
    countdownDiv.removeChild(countdownDiv.firstChild);
  }
  const p = document.createElement("p");
  p.textContent = `${hours}:${minutes}:${seconds}`;
  countdownDiv.appendChild(p);
  if (--timer < 0) {
    clearInterval(interval);
  }
}
connectWebSocket();
let userLocale = "en-US";

const socket = new WebSocket("ws://localhost:8080");
let timerStart;
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
      timerStart = message.data;
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
      //TED change the "data" numbers if you need to adjust anything.I could do the settings file, but
      //I don't want to mess anything up lol
      if (obj.detail.event.tier.includes("dweller")) {
        socket.send(JSON.stringify({ type: "tier", data: 180 }));
      } else if (obj.detail.event.tier.includes("support")) {
        socket.send(JSON.stringify({ type: "tier", data: 300 }));
      } else if (obj.detail.event.tier.includes("adventurer")) {
        socket.send(JSON.stringify({ type: "tier", data: 600 }));
      } else if (obj.detail.event.tier.includes("hero")) {
        socket.send(JSON.stringify({ type: "tier", data: 1800 }));
      }
    } else {
      //I honestly don't know what this is for, but I'm leaving it here just in case
      // I don't know if all members have a 'tier' attribute or not. Soooo yeah. Default is 5 min
      //The type should remain tier just so it adds the time to the timer
      //but it will activate if there is no tier in JSON
      socket.send(JSON.stringify({ type: "tier", data: 300 }));
    }
  }
});

function updateCountdown() {
  let hours = Math.floor(timerStart / 3600);
  let minutes = Math.floor((timerStart % 3600) / 60);
  let seconds = timerStart % 60;

  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;

  const countdownDiv = document.getElementById("countdown");
  while (countdownDiv.firstChild) {
    countdownDiv.removeChild(countdownDiv.firstChild);
  }
  const p = document.createElement("p");
  p.textContent = `${hours}:${minutes}:${seconds}`;
  countdownDiv.appendChild(p);
  if (--timerStart < 0) {
    clearInterval(interval);
  }
}
connectWebSocket();

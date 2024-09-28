const WebSocket = require("ws");
const fs = require("fs");
const dataFile = "data.json";
const readline = require("readline");

if (!fs.existsSync(dataFile)) {
  fs.writeFileSync(dataFile, JSON.stringify([]), "utf8");
}
let dataStore = JSON.parse(fs.readFileSync(dataFile, "utf8"));

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
const wss = new WebSocket.Server({ port: 8080 });

wss.on("connection", (ws, req) => {
  const clientIP = req.socket.remoteAddress;
  const clientID = `${clientIP}:${req.socket.remotePort}`;
  console.log(`Client connected: ${clientID}`);
  console.log('clients connected to websocket: ' + wss.clients.size);
  ws.on("message", (message) => {
    console.log(`Received message from ${clientID}: ${message}`);
    const data = JSON.parse(message);

    if (data.type === "tier") {
      addTime(data.data);
    }
    if (data.type === "newMember") {
      addTime(data.data);
    }
    if (data.type === "time") {
      saveData({ type: "time", data: time });
      sendMessage();
    }
  });
  ws.on("close", () => {
    console.log(`Client disconnected: ${clientID}`);
  });
});
console.log("WebSocket server is running on ws://localhost:8080");
console.log("ctrl + c to exit");
console.log("type --help for commands");
// Function to save data to a JSON file
function saveData(data) {
  const type = data.type;
  const index = dataStore.findIndex((item) => item.type === type);
  if (index !== -1) {
    dataStore[index] = data;
  } else {
    dataStore.push(data);
  }
  fs.writeFileSync(
    dataFile,
    JSON.stringify(dataStore, null, 2),
    "utf8",
    (err) => {
      if (err) {
        console.error("Error writing data:", err);
      }
    }
  );
}
function getDataByKey(type) {
  const item = dataStore.find((item) => item.type === type);
  return item ? item.data : null;
}
function setStartTime(amount) {
  saveData(amount);
}
//If two or more clients are connected, it sends double the message. So this will 
//check the number of clients and divide time added by this number
function checkConnections() {
  return wss.clients.size;
}

let timer;
let paused = false;
let time;

countDown = () => {
  setTime(
    getDataByKey("time") === null
      ? getDataByKey("startTime")
      : getDataByKey("time")
  );
  if (timer) {
    clearInterval(timer);
  }
  timer = setInterval(() => {
    if (time <= 0) {
      clearInterval(timer);
      console.log("Time is up!");
      return;
    }
    if (!paused) {
      time--;
      sendMessage();
      if (time % 10 === 0) {
        saveData({ type: "time", data: time });
      }
    }
  }, 1000);
};
function setTime(x) {
  time = x;
}
function sendMessage() {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type: "time", data: time }));
    }
  });
}
function addTime(amount) {
  if (checkConnections() === 0) {
    console.log("No clients connected");
    return;
  } else {
    total = Math.round(amount / checkConnections());
    time += total;
    saveData({ type: "time", data: time });
  }
}

rl.on("line", (input) => {
  if (input === "pause" || input === "p") {
    paused = true;
    saveData({ type: "time", data: time });
  }
  if (input === "resume" || input === "r") {
    paused = false;
    countDown();
  }
  if (input === "clients" || input === "c" || input === "client") {
    console.log("Number of clients connected:", wss.clients.size);
  }
  const [command, value] = input.split(" ");
  if (command === "set" || command === "settime") {
    const startTime = parseInt(value, 10);
    setStartTime({ type: "startTime", data: startTime });
  }
  if (input === "timeLeft") {
    console.log("SEE COMMAND TIME:", time);
  }
  if (input === "help" || input === "--help") {
    console.log("");
    console.log("pause - pause the timer");
    console.log("resume - resume the timer / starts the timer");
    console.log("clients - get the number of clients connected to websocket");
    console.log("set - set the initial starting timer (its in minutes)");
  }
});

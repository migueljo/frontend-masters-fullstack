const express = require("express");
const http = require("http");
const path = require("path");
const PORT = 3000;

const app = express();
const server = http.createServer(app);

app.get("/", (req, res) => {
  const indexFilePath = path.resolve("index.html");
  res.sendFile(indexFilePath);
});

server.listen(PORT, function handleListen() {
  console.log(`🎉 Listening on port ${PORT}`);
});

process.on("SIGINT", function sigintHandler() {
  wss.clients.forEach(function each(client) {
    client.close();
  });
  server.close(() => {
    shutdownDB();
  });
  server.closeAllConnections();
});

// Begin websocket
const WebSocket = require("ws");
const WebsocketServer = require("ws").Server;
const wss = new WebsocketServer({ server });

const broadcast = (data) => {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
};

const getNumberOfClientsConnected = () => {
  return wss.clients.size;
};

wss.on("connection", function connectionHandler(websocket, request) {
  const numClientsConnected = getNumberOfClientsConnected();
  console.log("New client connected, total clients now ", numClientsConnected);
  broadcast(`Current visitors: ${numClientsConnected}`);

  if (websocket.readyState === WebSocket.OPEN) {
    websocket.send("Welcome to my server 😎");
  }

  db.run(`
    INSERT INTO visitors (count, time)
      VALUES(${numClientsConnected}, datetime("now"))
  `);

  getCounts();

  websocket.on("close", function closeHandler() {
    const currentNumClients = getNumberOfClientsConnected();
    const message = `A client has disconnected, current visitors: ${currentNumClients}`;
    console.log(message);
    broadcast(message);
  });
});

// End websocket

// Begin Database
const sqlite = require("sqlite3");
const db = new sqlite.Database(":memory:");
db.serialize(() => {
  db.run(`
    CREATE TABLE visitors (
      count INTEGER,
      time TEXT
    )
  `);
});

function getCounts() {
  db.each("SELECT * FROM visitors", (error, row) => {
    console.log(row);
  });
}

function shutdownDB() {
  getCounts();
  console.log("Shutting down DB");
  db.close();
}
// End Database

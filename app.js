const express = require("express");
const http = require("http");
const path = require("path");
const PORT = 3000;

const app = express();
const server = http.createServer();

app.get("/", (req, res) => {
  const indexFilePath = path.resolve("index.html");
  res.sendFile(indexFilePath);
});

server.on("request", app);
server.listen(PORT, () => {
  console.log(`🎉 Listening on port ${PORT}`);
});

const http = require("http")
const PORT = 3000

const server = http.createServer((req, res) => {
  res.write("On the way to being a full snack engineer!! 2")
  res.end()
})

server.listen(PORT)

console.log(`Listening on port ${PORT}`)


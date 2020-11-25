import http from "http"
import WebSocket from "ws"

export const init = async ({ server }: { server: http.Server }) => {
  const wss = new WebSocket.Server({ server })
  wss.on("connection", (ws) => {
    ws.on("message", function incoming(message) {
      console.log("received: %s", message)
    })

    ws.send("something")
  })
}

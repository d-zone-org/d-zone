import http from "http"
import WebSocket from "ws"

import { ClientMessage } from "../../interfaces/websocket"

export default async ({ server: httpServer }: { server: http.Server }) => {
  const server = new WebSocket.Server({ server: httpServer })

  server.on("connection", (websocket) => {
    websocket.on("message", (data) => {
      const message: ClientMessage = JSON.parse(String(data))
      console.log(message)
    })
  })
}

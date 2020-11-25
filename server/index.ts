import { createServer as createHTTPServer } from "http"

import config from "./utils/config"
import createWebSocketServer from "./components/websocket"
import createNextWrapper from "./components/next-wrapper"
import createDiscordClient from "./components/discord-client"

const main = async () => {
  createDiscordClient()
  const nextWrapper = await createNextWrapper()
  const server = createHTTPServer(nextWrapper.requestHandler)
  createWebSocketServer({ server })
  server.listen(config.port)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})

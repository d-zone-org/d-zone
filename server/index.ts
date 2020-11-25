import http from "http"

import * as websocket from "./websocket"
import * as next from "./next-wrapper"

const port = parseInt(process.env.PORT || "3000", 10)
const dev = process.env.NODE_ENV !== "production"

const main = async () => {
  const nextWrapper = await next.init({ dev })
  const server = http.createServer(nextWrapper.requestHandler)
  websocket.init({ server })
  server.listen(port)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})

import next from "next"

import http from "http"
import url from "url"
import config from "../utils/config"

export default async () => {
  const nextApp = next({ dev: config.dev })
  const nextRequestHandler = nextApp.getRequestHandler()

  await nextApp.prepare()

  return {
    requestHandler: (req: http.IncomingMessage, res: http.ServerResponse) => {
      const parsedUrl = url.parse(req.url!, true)
      return nextRequestHandler(req, res, parsedUrl)
    },
  }
}

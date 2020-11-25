import next from "next"

import http from "http"
import url from "url"

export const init = async ({ dev }: { dev: boolean }) => {
  const nextApp = next({ dev })
  const nextRequestHandler = nextApp.getRequestHandler()

  await nextApp.prepare()

  return {
    requestHandler: (req: http.IncomingMessage, res: http.ServerResponse) => {
      const parsedUrl = url.parse(req.url!, true)
      return nextRequestHandler(req, res, parsedUrl)
    },
  }
}

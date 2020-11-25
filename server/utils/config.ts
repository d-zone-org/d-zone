import "dotenv/config"
import * as z from "zod"

const schema = z.object({
  discordClientToken: z.string(),
  port: z.number(),
  dev: z.boolean(),
})

const rawConfig = {
  discordClientToken: process.env.DISCORD_CLIENT_TOKEN,
  port: parseInt(process.env.PORT || "3000", 10),
  dev: process.env.NODE_ENV !== "production",
}

const config = schema.parse(rawConfig)

export default config

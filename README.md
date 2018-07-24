# D-Zone
An _ambient life simulation_ driven by the user activity within a [Discord](https://discordapp.com) server

[![D-Zone](http://i.imgur.com/PLh059j.gif "Hippity hop!")](http://pixelatomy.com/dzone/)

## Concept
**D-Zone** is a graphical simulation meant to abstractly represent the activity in your Discord server.

This is not meant for any actual monitoring or diagnostics, only an experiment in the abstraction of chatroom data represented via autonomous characters in a scene.

Hopefully the simulation is interesting to watch. You can see the current (uninteresting) client version simulating the [discord.io server](https://discord.gg/0MvHMfHcTKVVmIGP) here: [pixelatomy.com/dzone](http://pixelatomy.com/dzone/)

## Installation

If you're an absolute beginner and have never used Node, I have written a more [beginner-friendly guide](https://github.com/vegeta897/d-zone/wiki/Beginner's-Setup-Guide)

This project is still **very early in development**, so there isn't much point in running it yet. But in case you're curious, here's what you need to do:

```
git clone https://github.com/vegeta897/d-zone.git
cd d-zone
npm install --no-optional
```

Set your `token` environment variable to your bot's token. Alternatively, create a file called `.env` in the project root and put `token="your_token"` in it.

Rename `discord-config-example.json` to `discord-config.json` and insert the info for your Discord server(s). **You must specify _one_ `default` Discord server.** You can include multiple servers here, and as long as your bot can connect to them, they will be available for clients to view.

You can password-protect a server from being viewed by a client by using the `password` property. Check the [Configuration](https://github.com/vegeta897/d-zone/wiki/Configuration) reference for more info.

You can automatically populate your `discord-config.json` with all your bot's servers by running `Update Configuration.bat`.

Rename `socket-config-example.json` to `socket-config.json` and insert the IP and port you want to run the websocket on.

Start the server with `npm start` or just `node index.js`

The client files are all contained within the `web` folder, and need to be built into `/static/bundle.js`  with `npm run-script build` or `npm run-script watch`. Upload everything in the `web` folder except the `script` folder. _Do not_ remove the web folder from the package; the server component requires it.

**Important:** D-Zone currently does not support `https`, so your host/subdomain *must not have SSL enabled*. If you are savvy with websockets over SSL, please consider submitting a pull request to add support! Regardless, this will be supported in the rewrite in progress, but I have no ETA.

If everything works, the client should connect to the default server, generate a world, and receive live updates via websocket from the server.

You can tweak the message box parameters by editing `misc-config.json`. Check the [Misc Config](https://github.com/vegeta897/d-zone/wiki/Configuration#misc) reference for details.

Remember, this project is still being developed, so check back here for updates!

Don't forget to rebuild `bundle.js` and re-upload the web files after updating!

## Design
The game engine architecture is currently loosely based on [crtrdg](http://crtrdg.com/).

It consists of both a server and client component:

### Server Component
The server runs a [Discord bot](https://www.npmjs.com/package/discord.io) which monitors the activity and user statuses in the server(s) of your choice. This data is sent to clients in real time via websockets.

### Client Component
The client (also designed with node via browserify) runs a graphical simulation in a canvas depicting an isometric scene populated by objects and autonomous characters. The activity in the scene is dictated and influenced by the data received from the server component. Clients are able to change which Discord server they are viewing with in-game UI.

Core client modules such as the renderer and input controller are loosely based on implementations found in [playground.js](http://playgroundjs.com/).

_Disclaimer: I cannot be held responsible for anything that happens to your computer, your server, your bot, or anything else as a result of using this package._

_Please consider the privacy of the users on your server. D-Zone will allow anyone with the URL (and password, if used) to monitor the chat of anyone in any channel that your bot has permission to see._

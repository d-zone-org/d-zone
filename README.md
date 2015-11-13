# D-Zone
An _ambient life simulation_ driven by the user activity within a [Discord](https://discordapp.com) server

## Concept
**D-Zone** is a graphical simulation meant to abstractly represent what's happening in your Discord server.

This is not meant for any actual monitoring or diagnostics, only an experiment in the abstraction of chatroom data represented via autonomous characters in a scene.

Hopefully the simulation is interesting to watch. You can see the current (uninteresting) client version simulating the [discord.io server](https://discord.gg/0MvHMfHcTKVVmIGP) here: [pixelatomy.com/dzone](http://pixelatomy.com/dzone/)

## Installation
This project is still **very early in development**, so there isn't much point in running it yet. But in case you're curious, here's what you need to do:

`npm install d-zone`

Contained in the package are the server files and client files.

Rename `config-example.json` to `config.json` and insert the login and server info for your Discord server and websocket server.

Start the server with `npm run-script start` or just `node index.js`

The client files are all contained within the `web` folder, and need to be built with `npm run-script build` or `npm run-script watch`

If everything works, the client should load the world, and receive websocket data from the server.

## Design

The game's modular architecture is currently loosely based on [crtrdg](http://crtrdg.com/).

It consists of both a server and client component:

### Server Component
The server runs a [Discord bot](https://www.npmjs.com/package/discord.io) which monitors the activity and user statuses in the server of your choice. This data is sent to clients in real time via websockets.

### Client Component
The client (also designed with node via browserify) runs a graphical simulation in a canvas depicting an isometric scene populated by objects and autonomous characters. The activity in the scene is dictated and influenced by the data received from the server component.

Core client modules such as the renderer and input controller are loosely based on implementations found in [playground.js](http://playgroundjs.com/).
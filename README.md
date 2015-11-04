# D-Zone
An _ambient life simulation_ driven by the user activity within a [Discord](https://discordapp.com) server

## Concept
**D-Zone** is a simulation game meant to abstractly represent what's happening in your Discord server.

This is not meant for any actual monitoring or diagnostics, only an experiment in the abstraction of chatroom data represented via characters in a scene.

Hopefully the simulation is interesting to watch.

## Design

The game's modular architecture is currently loosely based on [crtrdg](http://crtrdg.com/).

It consists of both a server and client component:

### Server Component
The server runs a [Discord bot](https://www.npmjs.com/package/discord.io) which monitors the activity and user statuses in the server of your choice. This data is sent to clients in real time via websockets.

### Client Component
The client (also powered by node with browserify) runs a graphical simulation in a canvas depicting an isometric scene populated by objects and characters. The activity in the scene is dictated and influenced by the data received from the server component.
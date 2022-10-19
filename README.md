# D-Zone
An _ambient life simulation_ driven by the user activity within a [Discord](https://discordapp.com) server

[![D-Zone](http://i.imgur.com/PLh059j.gif "Hippity hop!")](https://pixelatomy.com/dzone/)

## Concept
**D-Zone** is a graphical simulation meant to abstractly represent the activity in your Discord server.

This is not meant for any actual monitoring or diagnostics, only an experiment in the abstraction of chatroom data represented via autonomous characters in a scene.

Hopefully the simulation is interesting to watch. You can see the current (uninteresting) client version simulating the [discord.io server](https://discord.gg/0MvHMfHcTKVVmIGP) here: [pixelatomy.com/dzone](https://pixelatomy.com/dzone/)

## Installation

The Docker installation is very straightforward. You might need to change PUID and PGID to your user value, default is root. Don't forget to edit/check the config files after the installation.

```
docker run \
  --name=d-zone \
  -e TZ=Europe/Amsterdam \
  -e token=YOUR_DISCORD_BOT_TOKEN \
  -e PUID=0 \
  -e PGID=0 \
  -v /host/path/to/config:/config \
  -p 80:80 \
  --restart unless-stopped \
  peppershade/d-zone:latest
```

## Build and run it yourself
1-command build
```
git clone --branch v1/docker https://github.com/d-zone-org/d-zone.git
cd d-zone
docker build -t d-zone-org/d-zone:latest .

docker run \
  --name=d-zone \
  -e TZ=Europe/Amsterdam \
  -e token=YOUR_DISCORD_BOT_TOKEN \
  -e PUID=0 \
  -e PGID=0 \
  -v /host/path/to/config:/config \
  -p 80:80 \
  --restart unless-stopped \
  d-zone-org/d-zone:latest
```

## Design
The game engine architecture is currently loosely based on [crtrdg](http://crtrdg.com/).

It consists of both a server and client component:

### Server Component
The server runs a [Discord bot](https://abal.moe/Eris/) which monitors the activity and user statuses in the server(s) of your choice. This data is sent to clients in real time via websockets.

### Client Component
The client (also designed with node via browserify) runs a graphical simulation in a canvas depicting an isometric scene populated by objects and autonomous characters. The activity in the scene is dictated and influenced by the data received from the server component. Clients are able to change which Discord server they are viewing with in-game UI.

Core client modules such as the renderer and input controller are loosely based on implementations found in [playground.js](http://playgroundjs.com/).

_Disclaimer: I cannot be held responsible for anything that happens to your computer, your server, your bot, or anything else as a result of using this package._

_Please consider the privacy of the users on your server. D-Zone will allow anyone with the URL (and password, if used) to monitor the chat of anyone in any channel that your bot has permission to see._

### Credits
Docker install made possible with @Peppershade and @LittlestFluffy
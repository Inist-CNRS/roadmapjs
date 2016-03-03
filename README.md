# RoadmapJS

A NodeJS and ReactJS application parsing Trello roadmap boards and displaying a nice project roadmap as a visual vertical timeline.

## Install and run

Without docker:

```shell
git clone https://github.com/Inist-CNRS/roadmapjs.git
cd roadmapjs
npm install
npm start
```

Then navigate to [http://127.0.0.1:3000](http://127.0.0.1:3000)

With docker:
```shell
git clone https://github.com/Inist-CNRS/roadmapjs.git
cd roadmapjs
npm start-docker
# or just this:
# docker-compose up
```

It will download and run the [inistcnrs/roadmapjs](https://hub.docker.com/r/inistcnrs/roadmapjs/) docker image sharing ``./data/`` and ``./config.local.js`` with the docker container.

## Install and run for developements

To start roadmapjs from a local git clone, you can follow these steps (needs nodejs and mongodb installed localy):
```shell
git clone https://github.com/Inist-CNRS/roadmapjs.git
cd roadmapjs
npm install
npm run debug
# the app is listening at http://127.0.0.1:3000/
# then open another terminal and your can freely edit the code
```

The same but with docker (advantage: do not need to have mongodb and nodejs isntalled localy):
```shell
git clone https://github.com/Inist-CNRS/roadmapjs.git
cd roadmapjs
npm install
npm debug-docker
# or just: docker-compose -f docker-compose.dev.yml up
# the app is listening at http://127.0.0.1:3000/
# then open another terminal and your can freely edit the code
```

## Configuration

Create a ``config.local.js`` containing:

```javascript
module.exports = {
  "trello" : {
    "key":   "YOUR TRELLO KEY",
    "token": "YOUR TRELLO TOKEN",
    "boards": {
      "ezPAARSE": {
        "projectName": "ezPAARSE",
        "idBoard": "vJQsvUSO",
        "boardLink": "https://trello.com/b/vJQsvUSO/ezpaarse-roadmap-dpi"
      }
    }
  }
}
```

To obtain your key, naviguate to:
https://trello.com/app-key

To obtain your token, navigate to:
https://trello.com/1/connect?key=xxxx&name=dpi-roadmap&response_type=token&expiration=never
(replace the xxxx value with your key value)

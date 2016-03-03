## Configuration

Create a config.local.js containing:

```javascript
module.exports = {
  trello : {
    key:   'yourtrellokey',
    token: 'yourtrellotoken',
    boards: {
      'ezPAARSE': {
        projectName: 'ezPAARSE',
        idBoard: 'vJQsvUSO',
        boardLink: 'https://trello.com/b/vJQsvUSO/ezpaarse-roadmap'
      }
    }
  }
};
```

To obtain your key, naviguate to:
https://trello.com/app-key

To obtain your token, navigate to:
https://trello.com/1/connect?key=xxxx&name=dpi-roadmap&response_type=token&expiration=never
(replace the xxxx value with your key value)

## Build

Without docker:
```shell
make install
```

With docker:
```shell
make build-docker
```

## Run

Without docker:
```shell
make start
```

With docker (need a make ``build-docker`` before):
```shell
make start-docker
```

## Developements

To start roadmapjs (nodejs app + mongodb) on a local git clone, you can follow these steps:
```shell
git clone https://github.com/Inist-CNRS/roadmapjs.git
cd roadmapjs
make start-dev
# the app is listening at http://127.0.0.1:3000/
# then open another terminal and your can freely edit the code
```

## Configuration

Create a config.local.js containing:

```javascript
module.exports = {
  key:   'yourtrellokey',
  token: 'yourtrellotoken',
  boards: {
    'ezPAARSE': {
      projectName: 'ezPAARSE',
      idBoard: 'vJQsvUSO',
      boardLink: 'https://trello.com/b/vJQsvUSO/ezpaarse-roadmap'
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
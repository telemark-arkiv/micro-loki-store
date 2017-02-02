[![Build Status](https://travis-ci.org/telemark/micro-loki-store.svg?branch=master)](https://travis-ci.org/telemark/micro-loki-store)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

# micro-loki-store

Microservice for storing content with loki

## API

### **/store**

Read from or write to store

#### GET

Returns values from a key

```bash
?key=<key>
```

#### POST

Saves data to a store

Required input: key, type and data

```JavaScript
{
  key: '<key>'
  type: 'type',
  data: [
    'role1',
    'role2',
    'role3'
  ]
}
```

```bash
$ curl -d '{"key":"info", "type":"content", "data":{"user": "gasg", "type": "news", "list": ["aws"]}}' -v http://localhost:3000/store
```

## Code

[GitHub](https://github.com/telemark/micro-loki-store)

## License

[MIT](LICENSE)

![alt text](https://robots.kebabstudios.party/micro-loki-store.png "Robohash image of micro-loki-store")
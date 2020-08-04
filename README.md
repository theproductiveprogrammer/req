# Req

Make Ajax calls correctly with a thin wrapper around XMLHttpRequest.

Ideal for small requests and responses - especially JSON. Perfect for microservices.

## Why?

We make [ajax calls](https://en.wikipedia.org/wiki/Ajax_(programming)) often but the mechanism ([XMLHttpRequest](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest)) is not very intuitive to use. It is surprisingly hard to get it right across all browsers with proper error handling.

`Req` wraps [XMLHttpRequest](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest) so that it’s simpler to use.

## Usage

Install:

```sh
$ npm install @tpp/req
```

Use:

```javascript
const req = require("@tpp/req")

req.get(url, cb)
req.get(url, data, cb)

req.post(url, cb)
req.post(url, data, cb)

req.send({
  method: 'GET' | 'POST' | 'PUT' | ...
  url: ...,
  data: ...,
  timeout: ...,
  headers: ...,
}, cb)
```

## Content-Type

If you don’t set a `Content-Type` header, `Req` will set:

* `application/json` if the ‘data’ is a JSON object
* `text/plain` for everything else (strings etc)

## Callback

`Req` checks the response codes and error cases for you so the callback doesn’t have to. So the callback can be treated like a ‘normal’ async callback.

```javascript
cb(err, resp)
```

The callback also has access to the [http status code](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes) which is useful in many cases:

```javascript
cb(err, resp, status)
```

For the `resp`-onse itself (or `err` in case of errors), `Req` will try it’s best to parse as JSON and return it. If it is unable to do so it will return an object with a single `response` field.

```javascript
{
  response: <response string>
}
```

Note that `resp` can also be `null` if no response data was sent back.

## FAQ

### Why not use the [`fetch` api](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)?

You can! It’s a great replacement for XMLHttpRequest. `Req` is only if you want a simple callback that works well with JSON request/responses.

---


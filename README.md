# Req

Make Ajax calls correctly with a thin wrapper around [XMLHttpRequest](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest) and [Node’s HTTP](https://nodejs.org/api/http.html) module.

Ideal for small requests and responses - especially JSON. Perfect for microservices.

## Why?

We make [ajax calls](https://en.wikipedia.org/wiki/Ajax_(programming)) often but the mechanism ([XMLHttpRequest](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest)) is not very intuitive to use. It is surprisingly hard to get it right across all browsers with proper error handling.

Even if we work out [XMLHttpRequest](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest), the event management for the backend [Node’s HTTP](https://nodejs.org/api/http.html) module means we have to solve all the tricky bits there too.

`Req` wraps [XMLHttpRequest](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest) and [Node’s HTTP](https://nodejs.org/api/http.html) so that both use the same simple API in the most efficient manner possible.

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
* `application/x-www-form-urlencoded` or `multipart/form-data` for [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData)
* `text/plain` for everything else (strings etc)

## Callback

`Req` checks the response codes and error cases for you so the callback doesn’t have to. So the callback can be treated like a ‘normal’ async callback.

```javascript
cb(err, resp)
```

The response contains the the [http status code](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes), the body of the response with data, and the HTTP response headers.

```js
{
  status: 200,
  headers: headerMapFn(),
  body: {data: 1234}
}
```

For the response `body` itself, `Req` will try it's best to parse it as JSON. If it is unable to do so it will return an object with a single `response` field.

```javascript
{
  response: <response string>
}
```

Note that `resp` can also be `null` if no response data was sent back.

Use the `headers()` method to parse and retrieve the header map:

```javascript
function onResp(err, resp) {
  ...
  let headers = resp.headers()
  if(headers['content-type'] == "text/plain") {
    ...
  }
}
```

## FAQ

### Why not use the [`fetch` api](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)?

You can! It’s a great replacement for XMLHttpRequest on the browser. `Req` is if you want a tight, clean and simple callback that works well with JSON request/responses.

Plus it works both on the browser and in the backend which makes code sharing easier.

---


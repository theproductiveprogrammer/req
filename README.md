# Req

A thin wrapper around XMLHttpRequest.

Good for small requests and responses - especially JSON - and so ideal for microservices.

## Why?

We make [ajax calls](https://en.wikipedia.org/wiki/Ajax_(programming)) often but the mechanism ([XMLHttpRequest](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest)) is not very intuitive to use.

`Req` wraps [XMLHttpRequest](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest) so that it’s simpler to use.

```javascript
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

If you don’t set a `Content-Type` header, `Req` will set:

* `application/json` if the ‘data’ is a JSON object
* `text/plain` for everything else (strings etc)

The callback gets the [http status code](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes) and the response object.

---


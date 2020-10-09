'use strict'

function send(opts, cb) {
  let xhr = new XMLHttpRequest()

  let timeout
  let hdrval

  xhr.onreadystatechange = () => {
    if(xhr.readyState === XMLHttpRequest.HEADERS_RECEIVED) {
      hdrval = xhr.getAllResponseHeaders()
    }

    if(xhr.readyState !== XMLHttpRequest.DONE) return

    if(timeout) clearTimeout(timeout)

    try {
      callback_(xhr.status, JSON.parse(xhr.responseText))
    } catch(e) {
      if(!xhr.responseText) callback_(xhr.status, null)
      else callback_(xhr.status, xhr.responseText)
    }
  }

  if(opts.timeout) {
    timeout = setTimeout(() => {
      return callback_(504, { response: "TIMEOUT" })
    }, opts.timeout)
  }

  xhr.open(opts.method.toUpperCase(), opts.url, true)

  let headers = opts.headers
  let data = opts.data

  if(data && !(data instanceof FormData)) {
    let contentType = 'text/plain'
    if(typeof data == 'object') {
      contentType = 'application/json'
      data = JSON.stringify(data)
    }
    headers = Object.assign({
      "Content-Type": contentType
    }, headers)
  }

  if(headers) {
    for(let k in headers) xhr.setRequestHeader(k, headers[k])
  }

  if(data) xhr.send(data)
  else xhr.send()


  let done = false
  function callback_(status, response) {
    if(done) return
    done = true
    if(status >= 200 && status <= 300) {
      cb(null, {
        status,
        headers: () => { return headers(hdrval) },
        body: response,
      })
    } else {
      if(!response) response = { response: `ERROR:${status}` }
      cb(response, {
        status,
        headers: () => { return headers(hdrval) },
      })
    }
  }
}

function headers(hdrval) {
  if(!hdrval) return hdrmap

  let hdrmap = {}
  let a = hdrval.trim().split(/[\r\n]+/)
  for(let i = 0;i < a.length;i++) {
    let s = a[i].split(': ')
    let hdr = s.shift()
    let val = s.join(': ')
    hdrmap[hdr.toLowerCase()] = val
  }
  return hdrmap
}

function send_(method, url, data, cb) {
  if(typeof data == 'function') {
    cb = data
    data = null
  }
  send({ method, url, data }, cb)
}

function get(url, data, cb) {
  send_('GET', url, data, cb)
}

function post(url, data, cb) {
  send_('POST', url, data, cb)
}

module.exports = {
  get,
  post,
  send,
}

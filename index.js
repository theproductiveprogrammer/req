'use strict'

function send(opts, cb) {
  let xhr = new XMLHttpRequest()

  let completed = false
  let timeout

  xhr.onreadystatechange = () => {
    if(xhr.readyState !== XMLHttpRequest.DONE) return
    if(timeout) clearTimeout(timeout)
    if(completed) return
    completed = true
    let resp = xhr.responseText
    if(!resp) resp = "{}"
    try {
      resp = JSON.parse(resp)
    } catch(e) {
      resp = { reply: resp }
    }
    cb(xhr.status, resp)
  }

  if(opts.timeout) {
    timeout = setTimeout(() => {
      if(completed) return
      completed = true
      xhr.abort()
      return cb(504, { err: "TIMEOUT" })
    }, opts.timeout)
  }

  xhr.open(opts.method.toUpperCase(), opts.url, true)

  let headers = opts.headers
  let data = opts.data

  if(data) {
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
    for(let k in opts.headers) {
      xhr.setRequestHeader(k, opts.headers[k])
    }
  }

  if(data) xhr.send(data)
  else xhr.send()

}

function send_(method, url, data, cb) {
  if(typeof data == 'function') {
    cb = data
    data = null
  }
  send({
    method,
    url,
    data,
  }, cb)
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

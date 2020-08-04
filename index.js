'use strict'

function send(opts, cb) {
  let xhr = new XMLHttpRequest()

  let timeout

  xhr.onreadystatechange = () => {
    if(xhr.readyState !== XMLHttpRequest.DONE) return

    if(timeout) clearTimeout(timeout)

    let response = xhr.responseText

    try {
      return callback_(xhr.status, JSON.parse(response))
    } catch(e) {}

    if(response) response = { response }
    else response = null

    return callback_(xhr.status, response)
  }

  if(opts.timeout) {
    timeout = setTimeout(() => {
      return callback_(504, { response: "TIMEOUT" })
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


  let done = false
  function callback_(status, response) {
    if(done) return
    done = true
    if(xhr.status >= 200 && xhr.status <= 300) {
      cb(null, response, status)
    } else {
      if(!response) response = { response: `ERROR:${status}` }
      cb(response, null, status)
    }
  }
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

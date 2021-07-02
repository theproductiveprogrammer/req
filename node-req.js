'use strict'
const http = require('http')
const https = require('https')

const util = require('./util.js')

/*    way/
 * send the request to the server, handling all the events correctly so
 * that the callback is only invoked once.
 */
function send(opts, cb) {
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
  let options = {
    method: opts.method,
    timeout: opts.timeout,
    headers: headers,
  }
  let h_ = http
  if(opts.url && opts.url.startsWith("https")) h_ = https
  if(options.protocol === "https") h_ = https
  let req = h_.request(opts.url, options, res => {
    let body = []
    res.on("data", chunk => body.push(chunk))

    res.on("end", () => {
      if(!body.length) return callback_(res.statusCode, null, res.headers)
      let rdata = Buffer.concat(body)
      try {
        callback_(res.statusCode, JSON.parse(rdata), res.headers)
      } catch(e) {
        callback_(res.statusCode, rdata.toString(), res.headers)
      }
    })

    if(options.timeout) {
      req.setTimeout(options.timeout, () => {
        callback_(504, "TIMEDOUT")
        req.abort()
      })
    }

    res.on("error", err => callback_(-1, err))
    res.on("close", () => callback_(-2, "CONNECTIONCLOSED"))
  })

  req.on("error", err => callback_(-1, err))

  if(data) req.write(data)
  req.end()

  let done = false
  function callback_(status, response, hdrs) {
    if(done) return
    done = true
    if(status >= 200 && status <= 300) {
      try {
        cb(null, {
          status,
          headers: () => hdrs,
          body: response
        })
      } catch(e) {
        console.error(e)
      }
    } else {
      if(!response) response = `STATUSCODE:${status}`
      else response = util.unhtml(response)
      try {
        cb(response, {
          status,
          headers: () => hdrs,
        })
      } catch(e) {
        console.error(e)
      }
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

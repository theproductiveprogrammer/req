'use strict'
const striptags = require('striptags')

/*    understand/
 * sometimes the response is a HTML document so we try to remove all the
 * HTML to be just left with the message text
 */
function unhtml(txt) {
  if(typeof txt !== "string") return txt
  txt = striptags(txt)
  txt = txt.replace(/[\r\n]+/gm, '\n')
  return txt.trim()
}

module.exports = {
  unhtml
}

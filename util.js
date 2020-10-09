'use strict'

/*    understand/
 * sometimes the response is a HTML document so we try to remove all the
 * HTML to be just left with the message text
 */
function unhtml(txt) {
  if(typeof txt !== "string") return txt
  let e = document.createElement("div")
  txt = txt.replace(/<head>[\s\S]*<\/head>/, "")
  e.innerHTML = txt
  txt = e.innerText
  return txt.trim()
}

module.exports = {
  unhtml
}

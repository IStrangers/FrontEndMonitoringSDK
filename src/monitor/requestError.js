import { DefaultTracker } from "../utils/tracker"

const exclude = [
  "/logger"
]

function injectRequestError() {
  if(window.XMLHttpRequest) {
    const xhr = window.XMLHttpRequest
    const open = xhr.prototype.open
    xhr.prototype.open = function(method,url,async) {
      if(exclude.includes(url)) return
      this.logData = {method,url,async}
      return open.apply(this,arguments)
    }
    const send = xhr.prototype.send
    xhr.prototype.send = function(body) {
      if(this.logData) {
        const startTime = Date.now()
        const handler = type => {
          return (event) => {
            const duration = Date.now() - startTime
            const status = this.status
            const statusText = this.statusText
            DefaultTracker.send({
              kind: "stability",
              type: "xhr",
              eventType: type,
              pathName: this.logData.url,
              status: status + "-" +statusText,
              duration,
              response: this.response ? JSON.stringify(this.response) : "",
              params: body || ""
            })
          }
        }
        this.addEventListener("load",handler("load"),false)
        this.addEventListener("error",handler("error"),false)
        this.addEventListener("abort",handler("abort"),false)
      }
      return send.apply(this,arguments)
    }
  }
  if(window.fetch) {

  }
}

export {
  injectRequestError
}
import { getLastEvent, getSelector } from "../utils"
import { DefaultTracker } from "../utils/tracker"

function injectJsError() {

  function error(event) {
    if(event.target && (event.target.src || event.target.href)) {
      resourceError(event)
    } else {
      jsError(event)
    }
  }
  
  function resourceError(event) {
    DefaultTracker.send({
      kind: "stabliity",
      type: "error",
      errorType: "resourceError",
      filename: event.target.src || event.target.href,
      tagName: event.target.tagName,
      selector: getSelector(event.target,true),
    })
  }

  function jsError(event) {
    const {
      message,filename,lineno,
      colno,error,
    } = event
    const lastEvent = getLastEvent()
    DefaultTracker.send({
      kind: "stabliity",
      type: "error",
      errorType: "jsError",
      message: message,
      filename: filename,
      position: `${lineno} : ${colno}`,
      stack: error.stack,
      selector: lastEvent ? getSelector(lastEvent.path) : "",
    })
  }

  function unhandledrejection(event) {
    const { 
      reason
    } = event
    let message
    let filename
    let lineno = 0
    let colno = 0
    let stack = ''

    const typeofReason = typeof reason
    if(typeofReason === "string") {
      message = reason
    } else if(typeofReason === "object") {
      if(reason.stack) {
        const matchResult = reason.stack.match(/at\s+(.+):(\d+):(\d+)/)
        filename = matchResult[1]
        lineno = matchResult[2]
        colno = matchResult[3]
      }
      stack = reason.stack
    }
    jsError({
      message,
      filename,
      lineno,
      colno,
      error: {
        stack
      }
    })
  }

  window.addEventListener("error",error)
  window.addEventListener("unhandledrejection",unhandledrejection)
}

export {
  injectJsError
}
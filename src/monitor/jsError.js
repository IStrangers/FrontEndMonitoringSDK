import { getLastEvent, getSelector } from "../utils"
import { DefaultTracker } from "../utils/tracker"

function injectJsError() {
  window.addEventListener("error",function(event) {
    const { 
      message,
      filename,
      lineno,
      colno,
      error,
    } = event
    const lastEvent = getLastEvent()
    const errorData = {
      kind: "stabliity",
      type: "error",
      errorType: "jsError",
      url: "",
      message: message,
      filename: filename,
      position: `${lineno} : ${colno}`,
      stack: error.stack,
      selector: lastEvent ? getSelector(lastEvent.path) : "",
    }
    DefaultTracker.send(errorData)
  })
}

export {
  injectJsError
}
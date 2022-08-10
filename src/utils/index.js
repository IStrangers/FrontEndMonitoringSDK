let lastEvent;

[
  "click","touchstart","mousedown","keydown","mouseover"
]
.forEach(eventType => {
  document.addEventListener(eventType, (event) => {
    lastEvent = event
  },{
    capture: true,
    passive: true
  })
})

function getLastEvent() {
  return lastEvent
}

function getSelector(path,toPathArray = false) {
  if(toPathArray) {
    const newPath = []
    while(path) {
      newPath.push(path)
      path = path.parentNode
    }
    path = newPath
  }
  if(Array.isArray(path)) {
    return getSelectors(path)
  }
  const element = path
  let selector = `${element.nodeName.toLowerCase()}`
  if(element.id) {
    selector += `#${element.id}`
  } else if(element.className) {
    const className = element.className.split(" ")
    selector += `.${className.join(".")}`
  }
  return selector;
}

function getSelectors(path) {
  return path.reverse().filter(element => {
    return element !== document && element !== window
  }).map(element => {
    return getSelector(element)
  }).join(" > ")
}

function onload(callback) {
  if(document.readyState === "complete") {
    callback()
  } else {
    window.addEventListener("load",callback)
  }
}

export {
  getLastEvent,
  getSelector,
  getSelectors,
  onload,
}
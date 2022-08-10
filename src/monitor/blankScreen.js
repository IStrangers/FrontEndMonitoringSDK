import { getSelector, onload } from "../utils"
import { DefaultTracker } from "../utils/tracker"

const wrapperElements = ["html","body","#container"]
function isWrapper(element) {
  return wrapperElements.includes(element.nodeName.toLowerCase()) || wrapperElements.includes(element.id)
}

function injectBlankScreen() {
  onload(function() {
    let emptyPoints = 0;
    for(let i = 1; i <= 9; i++) {
      const xElements = document.elementsFromPoint(
        window.innerWidth * i / 10,
        window.innerHeight / 2
      )
      const yElements = document.elementsFromPoint(
        window.innerWidth / 2,
        window.innerHeight * i / 10
      )
      if(isWrapper(xElements[0])) emptyPoints++
      if(isWrapper(yElements[0])) emptyPoints++
    }
    const centerElements = document.elementsFromPoint(
      window.innerWidth / 2,
      window.innerHeight / 2
    )
    if(emptyPoints > 16) {
      DefaultTracker.send({
        kind: "stabilit",
        type: "blank",
        emptyPoints,
        screen: `${window.screen.width}x${window.screen.height}`,
        viewPoint: `${window.innerWidth}x${window.innerHeight}`,
        selector: getSelector(centerElements[0])
      })
    }
  })
}

export {
  injectBlankScreen
}
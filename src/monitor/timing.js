import { getLastEvent, getSelector, onload } from "../utils"
import { DefaultTracker } from "../utils/tracker"

function injectTiming() {
  let FMP,LCP,FP,FCP
  new PerformanceObserver((entry,observe) => {
    FMP = entry.getEntries()[0]
    observe.disconnect()
  }).observe({ entryTypes: ["element"] })
  new PerformanceObserver((entry,observe) => {
    LCP = entry.getEntries()[0]
    observe.disconnect()
  }).observe({ entryTypes: ["largest-contentful-paint"] })
  FP = performance.getEntriesByName("first-paint")[0]
  FCP = performance.getEntriesByName("first-contentful-paint")[0]
  DefaultTracker.send({
    kind: "experience",
    type: "paint",
    firstPaint: FP.startTime,
    firstContentfulPaint: FCP.startTime,
    firstMeaningfulPaint: FMP.startTime,
    largestContentfulPaint: LCP.startTime
  })

  new PerformanceObserver((entry,observe) => {
    const lastEvent = getLastEvent()
    const firstInput = entry.getEntries()[0]
    if(firstInput) {
      const inputDelay = firstInput.processingStart - firstInput.startTime
      const duration = firstInput.duration
      if(inputDelay > 0 || duration > 0) {
        DefaultTracker.send({
          kind: "expreience",
          type: "firstInputDelay",
          inputDelay,
          duration,
          startTime: firstInput.startTime,
          selector: lastEvent ? getSelector(lastEvent.path || lastEvent.target) : ""
        })
      }
    }
    observe.disconnect()
  }).observe({ entryTypes: ["first-input"], buffered: true })

  onload(function() {
    setTimeout(() => {
      const { 
        connectEnd,
        connectStart,
        domComplete,
        domContentLoadedEventEnd,
        domContentLoadedEventStart,
        domInteractive,
        domLoading,
        domainLookupEnd,
        domainLookupStart,
        fetchStart,
        loadEventStart,
        navigationStart,
        redirectEnd,
        redirectStart,
        requestStart,
        responseEnd,
        responseStart,
        secureConnectionStart,
        unloadEventEnd,
        unloadEventStart
      } = performance.timing
      DefaultTracker.send({
        kind: "experience",
        type: "timing",
        connectTime: connectEnd - connectStart,
        ttfbTime: responseStart - requestStart,
        responseTime: responseEnd - responseStart,
        parseDOMTime: loadEventStart - domLoading,
        domContentLoadedTime: domContentLoadedEventEnd - domContentLoadedEventStart,
        timeToInteractive: domInteractive - fetchStart,
        loadTime: loadEventStart - fetchStart
      })
    }, 3000);
  })
}

export {
  injectTiming
}
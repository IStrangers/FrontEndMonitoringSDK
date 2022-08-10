const userAgent = require("user-agent")

function getExtraData() {
  return {
    title: document.title,
    url: location.href,
    timestamp: Date.now(),
    userAgent: userAgent.parse(navigator.userAgent)
  }
}

class SendTracker {

  constructor(url) {
    this.url = url
  }

  send(data) {
    if(!data) return
    data = {...data,...getExtraData()}
    const options = {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(data)
    }
    fetch(this.url,options).then(response => {
      
    }).catch((error) => {
      console.error('SendTrackerError:', error);
    });
  }
}

const DefaultTracker = new SendTracker("")

export {
  DefaultTracker,
}
const injector = require('../injector')
const Browser = require('../Browser/Browser')
const Wavebox = require('../Wavebox/Wavebox')
const {ipcRenderer} = require('electron')
const req = require('../req')
const { WB_BROWSER_GOOGLE_COMMUNICATION_UNREAD_COUNT_CHANGED } = req.shared('ipcEvents')
const NOTIFICATION_CHANGE_CHECK_INTERVAL = 1500

class GoogleCommunication {
  /* **************************************************************************/
  // Lifecycle
  /* **************************************************************************/

  constructor () {
    this.browser = new Browser()
    this.wavebox = new Wavebox()

    this.state = {
      count: undefined
    }
    this.notificationInterval = setInterval(this.checkNewNotifications.bind(this), NOTIFICATION_CHANGE_CHECK_INTERVAL)

    injector.injectStyle(`
      a[href*="/SignOutOptions"] {
        visibility: hidden !important;
      }
    `)
  }

  /* **************************************************************************/
  // Change listeners
  /* **************************************************************************/

  /**
  * Checks for new notifications
  */
  checkNewNotifications () {
    const { count } = this.getUnreadInfo()
    if (this.state.count === undefined) {
      this.state.count = count
    } else {
      if (count !== this.state.count) {
        ipcRenderer.sendToHost({
          type: WB_BROWSER_GOOGLE_COMMUNICATION_UNREAD_COUNT_CHANGED,
          data: {
            prev: this.state.count,
            next: count
          }
        })
      }
      this.state.count = count
    }
  }

  /* **************************************************************************/
  // DOM Api
  /* **************************************************************************/

  /**
  * @return the unread info. { count }
  */
  getUnreadInfo () {
    const info = { count: undefined }

    try {
      const chatFrame = document.querySelector('#hangout-landing-chat iframe').contentWindow.document.body

      try {
        info.count = chatFrame.querySelectorAll('.ee').length
      } catch (ex) { }
    } catch (ex) {}

    return info
  }
}

module.exports = GoogleCommunication

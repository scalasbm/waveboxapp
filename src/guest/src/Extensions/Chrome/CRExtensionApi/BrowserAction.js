const { ipcRenderer } = require('electron')
const req = require('../../../req')
const {
  CRX_BROWSER_ACTION_SET_TITLE_,
  CRX_BROWSER_ACTION_FETCH_TITLE_,
  CRX_BROWSER_ACTION_SET_ICON_,
  CRX_BROWSER_ACTION_SET_POPUP_,
  CRX_BROWSER_ACTION_FETCH_POPUP_,
  CRX_BROWSER_ACTION_SET_BADGE_TEXT_,
  CRX_BROWSER_ACTION_FETCH_BADGE_TEXT_,
  CRX_BROWSER_ACTION_SET_BADGE_BACKGROUND_COLOR_,
  CRX_BROWSER_ACTION_FETCH_BADGE_BACKGROUND_COLOR_,
  CRX_BROWSER_ACTION_ENABLE_,
  CRX_BROWSER_ACTION_DISABLE_,
  CRX_BROWSER_ACTION_CLICKED_
} = req.shared('crExtensionIpcEvents')
const DispatchManager = require('./Core/DispatchManager')
const Event = require('./Core/Event')
const privExtensionId = Symbol('privExtensionId')
const Tab = require('./Tabs/Tab')

class BrowserAction {
  /* **************************************************************************/
  // Lifecycle
  /* **************************************************************************/

  /**
  * https://developer.chrome.com/extensions/browserAction
  * @param extensionId: the id of the extension
  */
  constructor (extensionId) {
    this[privExtensionId] = extensionId
    this.onClicked = new Event()

    ipcRenderer.on(`${CRX_BROWSER_ACTION_CLICKED_}${extensionId}`, (evt, tabId) => {
      this.onClicked.emit(new Tab(tabId))
    })
    Object.freeze(this)
  }

  /* **************************************************************************/
  // Title & Icon
  /* **************************************************************************/

  setTitle (details) {
    ipcRenderer.send(`${CRX_BROWSER_ACTION_SET_TITLE_}${this[privExtensionId]}`, details)
  }

  getTitle (details, callback) {
    DispatchManager.request(`${CRX_BROWSER_ACTION_FETCH_TITLE_}${this[privExtensionId]}`, [details], (evt, err, response) => {
      callback(response ? response[0] : undefined)
    })
  }

  setIcon (details, callback = undefined) {
    DispatchManager.request(`${CRX_BROWSER_ACTION_SET_ICON_}${this[privExtensionId]}`, [details], (evt, err, response) => {
      if (callback) {
        callback(response ? response[0] : undefined)
      }
    })
  }

  /* **************************************************************************/
  // Popup
  /* **************************************************************************/

  setPopup (details) {
    ipcRenderer.send(`${CRX_BROWSER_ACTION_SET_POPUP_}${this[privExtensionId]}`, details)
  }

  getPopup (details, callback) {
    DispatchManager.request(`${CRX_BROWSER_ACTION_FETCH_POPUP_}${this[privExtensionId]}`, [details], (evt, err, response) => {
      callback(response ? response[0] : undefined)
    })
  }

  /* **************************************************************************/
  // Badge
  /* **************************************************************************/

  setBadgeText (details) {
    ipcRenderer.send(`${CRX_BROWSER_ACTION_SET_BADGE_TEXT_}${this[privExtensionId]}`, details)
  }

  getBadgeText (details, callback) {
    DispatchManager.request(`${CRX_BROWSER_ACTION_FETCH_BADGE_TEXT_}${this[privExtensionId]}`, [details], (evt, err, response) => {
      callback(response ? response[0] : undefined)
    })
  }

  setBadgeBackgroundColor (details) {
    ipcRenderer.send(`${CRX_BROWSER_ACTION_SET_BADGE_BACKGROUND_COLOR_}${this[privExtensionId]}`, details)
  }

  getBadgeBackgroundColor (details, callback) {
    DispatchManager.request(`${CRX_BROWSER_ACTION_FETCH_BADGE_BACKGROUND_COLOR_}${this[privExtensionId]}`, [details], (evt, err, response) => {
      callback(response ? response[0] : undefined)
    })
  }

  /* **************************************************************************/
  // Enable / Disable
  /* **************************************************************************/

  enable (tabId = undefined) {
    ipcRenderer.send(`${CRX_BROWSER_ACTION_ENABLE_}${this[privExtensionId]}`, tabId)
  }

  disable (tabId = undefined) {
    ipcRenderer.send(`${CRX_BROWSER_ACTION_DISABLE_}${this[privExtensionId]}`, tabId)
  }
}

module.exports = BrowserAction

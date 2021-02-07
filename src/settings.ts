import * as Store from "electron-store";
import { app, BrowserWindow, net, session } from "electron";
import log from "electron-log";

log.transports.file.level = 'info';
// log.info('userData:' + app.getPath('userData'))

const store = new Store();

class vlpr {
  addr: string
  port: number
  username: string
  password: string
  lchannel: number
}

class Settings {
  ProductKey = store.get('ProductKey')
  DeviceName = store.get('DeviceName')
  DeviceSecret = store.get('DeviceSecret')
  url: string
  comPath: string
  combaudRate: number
  dvr: vlpr[]
  printCount: number

  constructor() {
  }

  getConfig() {
    const request = net.request({
      method: "GET",
      url: `http://yzb.yuqiinfo.com/api/tenant/tenantpoundhouse/${this.ProductKey}`,
    });
    request.setHeader("token", "80a09e1f-cde3-11e9-80ff-0a58ac1400ee")
    request.on('response', (response) => {
      console.log(`STATUS: ${response.statusCode}`)
      if (response.statusCode === 200) {
        response.on('data', (chunk) => {
          const d = JSON.parse(chunk.toString())
          this.url = d.url
          this.comPath = d.comPath
          this.combaudRate = d.combaudRate
          this.dvr = d.dvr
          this.printCount = d.printCount
        });
      }
    });
    request.on('error', (error) => {
      log.error(`ERROR: ${JSON.stringify(error)}`)
      // setWindow.webContents.send('settings-date', JSON.stringify(error))
    });
    request.end()
  }

  createWindow() {
    // Menu.setApplicationMenu(null)
    // Create the browser window.
    const setWindow = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true,
        webSecurity: false
      }
    })
    setWindow.loadFile('productkey.html')
  }
}
var settings = new Settings()
export default settings
import { autoUpdater } from "electron-updater"
import { BrowserWindow } from "electron"
import log from "electron-log";

log.transports.file.level = 'info';

class Updater {
  updateWindow: BrowserWindow

  sendStatusToWindow(text: string) {
    log.info(text);
    this.updateWindow.webContents.send('updatemessage', text);
  }
  createWindow() {
    this.updateWindow = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true,
        webSecurity: false
      }
    })

    this.updateWindow.loadFile('version.html')

    this.updateWindow.on('closed', function () {
      this.updateWindow = null
    })
    this.updateWindow.on("show", () => {
      autoUpdater.checkForUpdates();
    })
  }
  checkUpdate() {
    log.info('Update starting...');
    autoUpdater.on('checking-for-update', () => {
      this.sendStatusToWindow('Checking for update...');
    })
    autoUpdater.on('update-available', (ev, info) => {
      this.sendStatusToWindow('Update available.');
    })
    autoUpdater.on('update-not-available', (ev, info) => {
      this.sendStatusToWindow('Update not available.');
      this.updateWindow.close()
    })
    autoUpdater.on('error', (ev, err) => {
      this.sendStatusToWindow('Error in auto-updater.');
    })
    autoUpdater.on('download-progress', (ev, progressObj) => {
      this.sendStatusToWindow('Download progress...');
    })
    autoUpdater.on('update-downloaded', (ev, info) => {
      this.sendStatusToWindow('Update downloaded; will install in 5 seconds');
    });

    autoUpdater.on('update-downloaded', (ev, info) => {
      setTimeout(function () {
        autoUpdater.quitAndInstall();
      }, 5000)
    })
  }
  constructor() {
    this.checkUpdate()
  }
}
const updater = new Updater()
export default updater
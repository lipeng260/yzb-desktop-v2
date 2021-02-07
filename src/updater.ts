import { autoUpdater } from "electron-updater"
import { BrowserWindow } from "electron"
import log from "electron-log";

log.transports.file.level = 'info';

class Updater {
  resolve: any
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
  }
  checkUpdate() {
    return new Promise((resolve) => {
      log.info('Update starting...');
      autoUpdater.on('checking-for-update', () => {
        // this.sendStatusToWindow('Checking for update...');
      })
      autoUpdater.on('update-available', (ev, info) => {
        // this.sendStatusToWindow('Update available.');
        this.createWindow()
      })
      autoUpdater.on('update-not-available', (ev, info) => {
        // this.sendStatusToWindow('Update not available.');
        // this.updateWindow.close()
        this.resolve();
      })
      autoUpdater.on('error', (ev, err) => {
        // this.sendStatusToWindow('Error in auto-updater.');
      })
      autoUpdater.on('download-progress', (ev, progressObj) => {
        this.sendStatusToWindow('Download progress...');
      })
      autoUpdater.on('update-downloaded', (ev, info) => {
        this.sendStatusToWindow('Update downloaded; will install in 5 seconds');
        setTimeout(function () {
          autoUpdater.quitAndInstall();
        }, 5000)
      });
      autoUpdater.checkForUpdates()
      resolve("ok");
    });
  }
  constructor() {
  }
}
const updater = new Updater()
export default updater
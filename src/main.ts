import { app, BrowserWindow } from "electron";
import log from "electron-log";
import * as path from "path";
import settings from "./settings";
import updater from "./updater";

let mainWindow: BrowserWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false
    },
    width: 800,
  });

  mainWindow.loadFile(path.join(__dirname, "../index.html"));
  mainWindow.loadURL(settings.url)
}

app.on("ready", async () => {
  //判断更新
  await updater.checkUpdate();
  //读取配置文件
  await settings.load();
  //启动程序
  createWindow();
  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

export default mainWindow
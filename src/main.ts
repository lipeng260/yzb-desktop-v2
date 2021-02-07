import { app, BrowserWindow } from "electron";
import * as path from "path";

let mainWindow: BrowserWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
    width: 800,
  });

  mainWindow.loadFile(path.join(__dirname, "../index.html"));
}

app.on("ready", () => {
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
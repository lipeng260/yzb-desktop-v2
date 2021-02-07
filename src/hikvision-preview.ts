import { hc_player_start } from "yzb-node-libs-cc"
import settings from "./settings"
import mainWindow from "./main"

hc_player_start(settings.dvr, (index, w, h, FrameBuf) => {
  mainWindow.webContents.send('ping' + index, FrameBuf, w, h)
})
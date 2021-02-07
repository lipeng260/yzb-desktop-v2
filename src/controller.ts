import mainWindow from "./main";
import { createServer, Socket } from "net";
import { BrowserWindow, ipcMain, app } from "electron";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

class Controller {
  gClient: Socket
  init() {
    var server = createServer(function (client: Socket) {
      this.gClient = client
      console.log('Client remote= %s:%s', client.remoteAddress, client.remotePort);
      // client.setTimeout(500);
      client.on('data', function (data) {
        if (mainWindow.webContents) {
          mainWindow.webContents.send("active", data)
        }
      });
      client.on('end', function () {
        console.log('Client disconnected');
        server.getConnections(function (err, count) {
          console.log('Remaining Connection:' + count);
        });
      });
      client.on('error', function (err) {
        console.log('Socket Error:', JSON.stringify(err));
      });
      client.on('timeout', function () {
        console.log('Socket Timed Out');
      });
    });

    ipcMain.on('active-write-port', async function (event, data) {
      if (this.gClient) {
        this.gClient.pause()
        // console.log('write:', hex(data))
        let res
        let count = 1
        while (count < 6) {
          count++
          this.gClient.write(data);
          await sleep(500)
          res = this.gClient.read()
          if (res) { break }
        }
        // console.log('count:',count,res)
        event.returnValue = res
        this.gClient.resume()
      }
    })

    server.listen(5000, function () {
      console.log('Server listening: ' + JSON.stringify(server.address()));
      server.on('close', function () {
        console.log('Server Terminated');
      });
      server.on('error', function (err) {
        console.log('Server Error:', JSON.stringify(err));
      });
    });
  }
  constructor() {
    this.init()
  }
}

const controller = new Controller()
export default controller
import * as SerialPort from 'serialport'

class Weight {
  serial: SerialPort

  init(path: string, baudRate: number, callback: (data?: any) => void) {
    this.serial = new SerialPort(path, {
      baudRate: baudRate,
      autoOpen: false
    })

    this.serial.open(function (err) {
      console.log('IsOpen:', this.serial.isOpen)
      console.log('err:', err)
    })

    this.serial.on('data', callback)

    this.serial.on('error', function (error) {
      console.log('error: ' + error)
    })
  }
  constructor() {
  }
}

const weight = new Weight()
export default weight
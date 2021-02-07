import * as bodyParser from "body-parser";
import * as express from "express";

const app = express()

class CallbackResult {
  license: string
  colorType: string
  type: string
  confidence: string
  inout: string
}

function start_server(inout: "in" | "out", callback: (PlateResult: CallbackResult) => void) {
  app.use(bodyParser.json({ limit: '10mb' })); // for parsing application/json

  app.post('/vnl', (req, res) => {
    // console.log(req.body.AlarmInfoPlate.result.PlateResult)
    let ipAddrStr = req.body.AlarmInfoPlate.ipaddr
    let PlateResult = req.body.AlarmInfoPlate.result.PlateResult
    console.log('车号:', PlateResult.license)
    // 1蓝色 2黄色 3白色 4黑色 5绿色 6黄绿色
    console.log('车辆类型:', PlateResult.colorType)
    // 0未知车牌 1蓝色小汽车 2黑色小汽车 3单排黄牌 4双排黄牌。。。
    console.log('车牌类型:', PlateResult.type)
    // confidence
    console.log('辨识度:', PlateResult.confidence)
    callback({
      license: PlateResult.license,
      colorType: PlateResult.colorType,
      type: PlateResult.type,
      confidence: PlateResult.confidence,
      inout: ipAddrStr === inout ? 'in' : 'out'
    })
    res.send('Hello World!')
  })
  app.listen(80, () => console.log('Example app listening on port 80!'))
}

export default start_server
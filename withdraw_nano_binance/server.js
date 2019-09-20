//This is the third part of the USD-NANO gateway in which NANO becomes
//deposited into the user's wallet. This part has been added separate from the
//second part which deals with the purchase of NANO since the other node.js
//binance api librairy does not seem to support withdrawals.

//This implementation uses a promise-based node-binance api librairy
//The code here has not been tested by me due to issues dealing with await/async

//More info: https://github.com/binance-exchange/binance-api-node#accountinfo


var express = require("express")
var app = express()
const Binance = require('binance-api-node').default

// Authenticated client, can make signed calls
const client = Binance({
  apiKey: '<API Key>',
  apiSecret: '<Secret Key>',
})

client.time().then(time => console.log(time))

//The homepage of the server
app.get("/", (req,res) => {
  res.send("Hello, call the express server's url paths to perform actions" +
           "on the Binance account.")
})

app.get("/send_nano", (req, res) => {

  //Still need to figure out how to check the maximum amount of Nano in the
  //binance account. In order to send the max amount.
  console.log(await client.withdraw({
      asset: 'NANO',
      address: '<Nano Address>',
      amount: <Amount>,
  }))
  res.send("Done")
})

app.listen(3500, () =>
  console.log("Running on port 3500")
)

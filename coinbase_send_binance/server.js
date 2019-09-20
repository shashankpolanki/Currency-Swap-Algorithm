//This example illustrates the first step of the USD-to-NANO gateway.
//Given that the user has connected his coinbase account to your platform
//through open authorization, convert his USD to LTC, and then send the LTC
//over to Binance since it is the fastest currency on coinbase.

//In your API key settings on Coinbase make sure you set up a webhook
//which triggers the API gateway of the AWS lambda function in charge of
//doing the processing work on Binance.

//More Info:
// https://developers.coinbase.com/api/v2
// https://github.com/coinbase/coinbase-node

var express = require("express")
var app = express()

var Client = require('coinbase').Client
var client = new Client({'apiKey': '<api key>' ,
            'apiSecret': '<api secret>'})

//The homepage of the server
app.get("/", (req,res) => {
  res.send("Hello, call the express server's url paths to perform actions" +
           "on the coinbase account.")
})

//Converting USD to LTC on Coinbase
//Get USD Wallet id through Coinbase API's GET getAccounts method
app.get("/convert_usd_ltc", (req, res) => {

  client.getAccount('<USD Wallet ID>', function(err, account) {
    account.buy({"amount": "<amount of LTC to buy (based on the amount of USD user wants to convert to Nano)",
                 "currency": "LTC",}, function(err, tx) {
      console.log(tx);
      res.send(tx),
    });
  });

})

//Sends LTC to binance account
//Get LTC wallet id through Coinbase's API's GET getAccounts method
app.get("/send_ltc_binance", (req, res) => {

    var args = {
      "to": "<LTC Address on Binance>",
      "amount": "<amount>",
      "currency": "LTC",
      "description": "Transaction to Binance"
    }

    ltc_id = '<LTC Wallet ID>'

    client.getAccount(ltc_id, function(err, account) {

        account.sendMoney(args, function(err, txn){

          console.log('my txn info: ' +
                      '\nCurrency: '         + txn.amount.currency +
                      '\nAmount: '             + txn.amount.amount +
                      '\nFee: ' + txn.network.transaction_fee.amount)

          res.send('my txn info: ' +
                      '\nCurrency: '         + txn.amount.currency + ', ' +
                      '\nAmount: '             + txn.amount.amount + ', ' +
                      '\nFee: ' + txn.network.transaction_fee.amount)
        })
    })
})


app.listen(3300, () => {
  console.log("Running on port 3300")
})

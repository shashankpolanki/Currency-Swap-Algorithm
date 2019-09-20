// This is the second part of the USD to NANO gateway. Once we recieve a
// webhook from coinbase confirming that the LTC has been withdrawn successfully.
// We will initiate these events: sell LTC for BTC, buy NANO with BTC, and withdraw
// the NANO to the user's Nano account. This part will not cover the withdrawal
// due to the node.js api librairy used here does not seem to support withdrawals
// successfully.

// Look here for more api details: https://github.com/jaggedsoft/node-binance-api

const binance = require('node-binance-api')().options({
  APIKEY:    '<API KEY>',
  APISECRET: '<API SECRET>',
  useServerTime: true
})

var express = require('express')
var app = express()

//The homepage of the server
app.get("/", (req,res) => {
  res.send("Hello, call the express server's url paths to perform actions" +
           "on the Binance account.")
})

//Selling LTC For BTC
app.get("/sell_ltc", (req, res) => {
  binance.balance((error1, balances) => {
    binance.prices('LTCBTC', (error2, ticker) => {
        var balance = parseFloat(balances.LTC.available)
        console.log("LTC Balance: " + balance)
        console.log("LTC Price: " + ticker.LTCBTC)

        //Binance requires you to sell/buy currencies like LTC with only 2
        //decimal places. ex. SELL XX.XX LTC, but XX.XXX LTC not allowed.
        //Rounding down on the hundredths place
        var quantity = (parseInt(balance * 100))/100

        //Initiating the trade
        binance.marketSell("LTCBTC", quantity, (error3, response) => {
          if (error3) console.log(error3)
          console.log("Market Sell response", response);
          console.log("order id: " + response.orderId);
        })

        //Checking BTC balance after the trade
        binance.balance((error, balance_btc) => {
          if (error) console.error(error)
          console.log( "BTC available: " + balance_btc.BTC.available)
          res.send("Trade Executed Successfully. BTC available: " + balance_btc.BTC.available)
        })

    })

  })
})

//Buying Nano using BTC
app.get("/buy_nano", (req, res) => {
  binance.balance((error1, balances) => {
    binance.prices('NANOBTC', (error2, ticker) => {

        var balance = parseFloat(balances.BTC.available)
        console.log("BTC Balance: " + balance)
        var nano_price = parseFloat(ticker.NANOBTC)
        console.log("Nano Price: " + ticker.NANOBTC)

        //Binance requires you to sell/buy currencies like Nano with only 2
        //decimal places. ex. BUY XX.XX NANO, but XX.XXX NANO not allowed.
        //Rounding down on the hundredths place
        var quantity = parseInt(balance/(ticker.NANOBTC) * 100)/100

        //Initiating the trade
        binance.marketBuy("NANOBTC", quantity, (error3, response) => {
          if (error3) console.log(error3)
          console.log("Market Sell response", response);
          console.log("order id: " + response.orderId);
        })


        binance.balance((error4, balance_Nano) => {
          if (error4) console.error(error4)
          console.log("Nano Available:" + balance_Nano.Nano.available)
          res.send("Trade Executed Successfully. Nano Available:" + balance_Nano.Nano.available)
        })
    })

  })
})

//Not-working: Withdrawing Nano into the user's address
app.get("/withdraw_nano", (req, res) => {

  binance.balance((error1, ticker) => {

    let quantity = 2
    console.log(quantity)
    let fund_address = "<nano address>"

    binance.withdraw("NANO", fund_address, quantity, false, (error2, response) => {
      if (error2) console.error(error2)
      console.log(response)
      res.send(response)
    })
  })

})

app.listen(3400, () =>
  console.log("Listening on port 3400")
)

const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const app = express()
const {
  getUid,
  crawlRuten,
} = require('./api.js')

app.use(cors({
  origin: [
    'http://www.example.com',
    'http://localhost:5000',
  ],
  credentials: true,
}))
app.use(cookieParser())
// app.use('/ruruton', express.static(__dirname + '/dist'))
app.use(express.json()) // parse json



app.get('/test', (req, res) => {
  res.status(200).send('im a test')
})

// crawlRuten()
//     .then(res => {
//       console.log(res)
//     })

app.get('/api/ruten', (req, res) => {
  if(!req.query.gno) res.status(400).json({ msg: 'gno error.' })

  const gno = req.query.gno
  crawlRuten(gno)
    .then(data => {
      res.status(200).send(data)
    })
    .catch(err => res.status(400).json({ msg: err }))
})

app.get('/api/user/:name', (req, res) => {
  console.log(req.params.name)

  getUid(req.params.name)
    .then(data => {
      console.log(data)
      res.status(200).send(data)
    })
    .catch(err => res.status(400).json({ msg: err }))
})

/**
 *  每天0, 9, 15時爬蟲
 */
// schedule.scheduleJob('* 0,9,15 * * *', function(){
// })

app.get('/crawl/:id', (req, res) => {
  console.log(req.params.id)
  crawlEbayProduct(req.params.id)
    .then(data => {
      addProduct(data)
      res.json(data)
    })
    .catch(err => {
      res.status(400).json({ msg: err })
    })
})

app.get('/product/:id', (req, res) => {
  getEbayProduct(req.params.id)
    .then(data => {
      console.log('=============')
      console.log(data)
      res.json(data)
    })
    .catch(err => {
      console.log('-----------')
      console.log(err)
      res.status(400).json({ msg: err })
    })
})

app.post('/member/:uid/watchlist/:id', (req, res) => {
  const {uid} = req.cookies
  const productId = req.params.id
  // console.log(req.cookies)
  addWatchlist(uid, productId)
    .then(() => res.json())
    .catch(err => res.status(400).json({ msg: err }))
})

app.get('/member/:uid/watchlist', (req, res) => {
  const uid = req.params.uid

  console.log(uid)

  getWatchlist(uid)
    .then(data => res.json(data))
    .catch(err => res.status(400).json({ msg: err }))
})

app.get('/recent/watchlist', (req, res) => {
  getRecentWatchlist()
    .then(data => res.json(data))
    .catch(err => res.status(400).json({ msg: err }))
})

app.post('/hot-good/ebay', (req, res) => {
  getEbayGoods(req.body.startTime, req.body.endTime)
    .then(data => {
      res.json(data)
    })
    .catch(err => {
      res.status(400).json({ msg: err })
    })
})

app.post('/hot-good/amazon', (req, res) => {
  getAmazonGoods(req.body.startTime, req.body.endTime)
    .then(data => {
      res.json(data)
    })
    .catch(err => {
      res.status(400).json({ msg: err })
    })
})

module.exports = app;

// const port = process.env.PORT || 8888;

// app.listen(process.env.PORT, function() {
//   console.log(`Example app listening on port ${port}!`);
// })

// $ export PORT=8000  //Mac
// $ set PORT=8000  //Windows
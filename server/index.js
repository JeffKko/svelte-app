const functions = require('firebase-functions');
// const admin = require('firebase-admin');

const app = require('./server/express.js');
const {
  storeEbayHotGood,
  storeAmazonHotGood,
  updateProductInWatchlist,
} = require('./server/api.js')

/**
 *  !!!!!
 */
// admin.initializeApp(functions.config().firebase);
// admin.initializeApp();

// let db = admin.firestore();

/**
 *  每天0, 9, 15時爬蟲
 */
exports.scheduledFunction = functions.pubsub
  .schedule('0 0,9,15 * * *')
  .timeZone('Asia/Taipei')
  .onRun(context => {
    console.log('*** start scheduledFunction ***')

    console.log(storeEbayHotGood)

    storeEbayHotGood()
      .catch(console.log)
    storeAmazonHotGood()
      .catch(console.log)

    return null
  })

/**
 *  每小時更新追蹤清單
 */
exports.scheduledWatchlist = functions.pubsub
  .schedule('0 * * * *')
  .timeZone('Asia/Taipei')
  .onRun(context => {
    console.log('*** start scheduledWatchlist ***')

    updateProductInWatchlist()
      .then(res => {
        console.log('update success.')
        console.log(res)
      })
      .catch(err => {
        console.log('update fail.')
        console.log(err)
      })

  })

exports.addMessage = functions.https.onRequest(async (req, res) => {
  console.log('addMessage!!!!!!')
  res.status(200).send(req.query.text)
});

exports.api = functions.https.onRequest(app);
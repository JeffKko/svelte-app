const requestPromise = require("../utils/request-promise.js");
const fs = require("fs");
const cheerio = require('cheerio');

function crawlRuten(gno) {
  const targetUrl = 'https://rapi.ruten.com.tw/api/items/v2/list'

  return requestPromise(
    {
      url: targetUrl,
      method: 'GET',
      qs: {
        level: 'simple',
        gno,
      },
    }
  )
    .then(({response, body}) => {
      if (!body) Promise.reject('some error...')

      console.log(body)
      return body
    })
    .catch(err => Promise.reject(err))
}

function cawlEbay() {
  const targetUrl = 'https://www.ebay.com/globaldeals'
  return requestPromise(
    {
      url: targetUrl,
      method: 'GET',
    }
  )
    .then(({response, body}) => {
      const $ = cheerio.load(body)
      const $spotlighItem = $('.dne-itemtile-xlarge')
      let itemList = []

      const spotlightItem = {
        id: $spotlighItem.attr('data-listing-id'),
        name: $spotlighItem.find('.dne-itemtile-title').attr('title'),
        image: $spotlighItem.find('.slashui-image-cntr img').attr('src'),
        price: $spotlighItem.find('.dne-itemtile-price .first').text(),
        originalPrice: $spotlighItem.find('.dne-itemtile-original-price .itemtile-price-strikethrough').text(),
        isSpotlight: true,
      }

      itemList.push(spotlightItem)

      const $featureItemList = $('.ebayui-dne-item-featured-card')

      $featureItemList.find('.dne-itemtile').each(function(i, $el) {
        const $this = $(this)
        itemList.push({
          id: $this.attr('data-listing-id'),
          name: $this.find('.dne-itemtile-title').attr('title'),
          image: $this.find('.slashui-image-cntr img').attr('src'),
          price: $this.find('.dne-itemtile-price .first').text(),
          originalPrice: $this.find('.dne-itemtile-original-price .itemtile-price-strikethrough').text(),
          url: $this.find('.dne-itemtile-title a').attr('href'),
          isSpotlight: false,
        })
      })

      const payload = {
        itemList,
        timestamp: Date.now(),
      }

      return payload
    })
    .catch(error => {
      return Promise.reject(error)
    })
}

function crawlAmazon() {
  const targetUrl = 'https://www.amazon.com/gp/most-wished-for/electronics'
  return requestPromise(
    {
      url: targetUrl,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36',
        accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'accept-encoding': 'deflate, br',
        'accept-language': 'zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7',
        // cookie: 'ubid-main=133-6510838-1909130; session-id=138-1428333-7519423; x-wl-uid=1XPTts4jd9wHsnijRSsAS8hcwydGlyDfYgDerv8dM/rqNbSnFVViuAaYTGX1hWfz/9QNhRe3n4lM=; i18n-prefs=USD; lc-main=en_US; aws-priv=eyJ2IjoxLCJldSI6MCwic3QiOjB9; aws-target-static-id=1576662459863-545132; aws-target-data=%7B%22support%22%3A%221%22%7D; s_fid=71BF0CCDB9F2B602-113D06B1E18C6567; regStatus=registering; aws-ubid-main=367-8066624-6387631; aws-target-visitor-id=1576662459866-624371.22_44; s_dslv=1578540142165; s_vn=1608198460142%26vn%3D14; aws-business-metrics-last-visit=1579599123383; skin=noskin; session-id-time=2082787201l; appstore-devportal-locale=en_US; mbox=session#37d0af640f304876a0b8681a66903f2c#1585122554; check=true; AMCVS_4A8581745834114C0A495E2B%40AdobeOrg=1; _mkto_trk=id:365-EFI-026&token:_mch-amazon.com-1585120693776-19309; AMCV_4A8581745834114C0A495E2B%40AdobeOrg=-432600572%7CMCIDTS%7C18347%7CMCMID%7C49613296804893202932402764432909282701%7CMCAAMLH-1585725493%7C11%7CMCAAMB-1585725493%7CRKhpRz8krg2tLO6pguXWp5olkAcUniQYPHaMWWgdJ3xzPWQmdj0y%7CMCOPTOUT-1585127894s%7CNONE%7CMCAID%7CNONE%7CvVersion%7C4.5.2; s_lv_s=First%20Visit; s_cc=true; session-token=9JtByiSWIZUUKXPfkPRMnG7MM127RqHYuYeCiFYveZWqkIPTLerTRxDUoi3NVX02QY6VkHd7HpUhfPIBICIV9KQHfG4xDus5k+Y4Yi9ZdNk/diqvXvGSFFgo3p2/Hgx6pRl93WsIOdDjT9/wMdBHS7AGEt5Ns7EfNXImIhP3684HoAzuX4ev8seSoI2aAxI5; s_sq=amzna2z%3D%2526c.%2526a.%2526activitymap.%2526page%253Ddocs%25252Fapp-submission-api%25252Fappsubapi-endpoints.html%2526link%253DExplore%2526region%253Dswagger-ui%2526pageIDType%253D1%2526.activitymap%2526.a%2526.c%2526pid%253Ddocs%25252Fapp-submission-api%25252Fappsubapi-endpoints.html%2526pidt%253D1%2526oid%253DExplore%2526oidt%253D3%2526ot%253DSUBMIT; s_nr=1585121138843-Repeat; s_lv=1585121138844; csm-hit=tb:s-Y5RFG23TED5F4VH8453X|1585121175627&t:1585121176934&adb:adblk_yes',
        // 'sec-fetch-dest': 'document',
        // 'sec-fetch-mode': 'navigate',
        // 'sec-fetch-site': 'none',
        // 'upgrade-insecure-requests': '1',
      },
      // encoding: null,
    }
  )
    .then(({response, body}) => {
      const $ = cheerio.load(body)
      let itemList = []

      // fs.appendFile('test.html', body, function (err) {
      //   if (err)
      //       console.log(err);
      //   else
      //       console.log('Append operation complete.');
      // })

      const $featureItemList = $('#zg-ordered-list')

      $featureItemList.find('.zg-item-immersion').each(function(i, $el) {
        const $this = $(this)

        itemList.push({
          id: $this.find('.zg-item:nth-child(2)').find('.a-link-normal').attr('href').split('/')[3],
          name: $this.find('img').attr('alt'),
          image: $this.find('img').attr('src'),
          price: $this.find('.p13n-sc-price').text(),
          // originalPrice: $this.find('.dne-itemtile-original-price .itemtile-price-strikethrough').text(),
          url: `https://www.amazon.com${$this.find('.a-link-normal').attr('href')}`,
        })
      })

      const payload = {
        itemList,
        timestamp: Date.now(),
      }

      return payload
    })
    .catch(error => {
      return Promise.reject(error)
    })
}

function crawAmazonSingle() {
  // 97230-3440
  /**
   * ubid-main:
   *  TW: 130-9213683-6655637
   *  Portland: 130-2507336-4155506
   *
   */
}

function storeEbayHotGood() {
  return cawlEbay()
    .then(({itemList, timestamp}) => {
      console.log(`cawl eBay success at: ${new Date().toLocaleString('zh-tw', { timeZone: 'Asia/Taipei' })}`)

      const payload = {
        timestamp: admin.firestore.Timestamp.fromDate(new Date(timestamp)),
        itemList,
      }

      console.log('payload:')
      console.log(payload)

      let setDoc = db.collection('hotGood').doc(String(timestamp)).set(payload)
    })
    .catch(err => Promise.reject(err))
}

function storeAmazonHotGood() {
  //Amazon
  return crawlAmazon()
    .then(({itemList, timestamp}) => {
      console.log(`cawl Amazon success at: ${new Date().toLocaleString('zh-tw', { timeZone: 'Asia/Taipei' })}`)

      const payload = {
        timestamp: admin.firestore.Timestamp.fromDate(new Date(timestamp)),
        itemList,
      }

      console.log('payload:')
      console.log(payload)

      let setDoc = db.collection('amazon').doc(String(timestamp)).set(payload)
    })
    .catch(err => Promise.reject(err))
}

function getEbayGoods(startTime, endTime) {
  const startDate = new Date(startTime) //new Date('2020/3/18')
  let endDate = new Date(endTime)
  endDate.setDate(endDate.getDate() + 1)
  let hotGoodRef = db.collection('hotGood')

  return hotGoodRef.where("timestamp", ">=", startDate).where("timestamp", "<", endDate).get()
    .then(snapshot => {
      if (snapshot.empty) {
        return Promise.reject('所選區間沒有資料')
      }

      let payload = {}

      snapshot.forEach(doc => {
        // console.log(doc.id)
        payload[doc.id] = doc.data().itemList
        // console.log(doc.id, '=>', doc.data());
      });

      return Promise.resolve(payload)
    })
    .catch(err => Promise.reject(err))
}

function getAmazonGoods(startTime, endTime) {
  const startDate = new Date(startTime) //new Date('2020/3/18')
  let endDate = new Date(endTime)
  endDate.setDate(endDate.getDate() + 1)

  let hotGoodRef = db.collection('amazon')

  return hotGoodRef.where("timestamp", ">=", startDate).where("timestamp", "<", endDate).get()
    .then(snapshot => {
      if (snapshot.empty) {
        return Promise.reject('所選區間沒有資料')
      }

      let payload = {}

      snapshot.forEach(doc => {
        // console.log(doc.id)
        payload[doc.id] = doc.data().itemList
        // console.log(doc.id, '=>', doc.data());
      });

      return Promise.resolve(payload)
    })
    .catch(err => Promise.reject(err))
}

function crawlEbayProduct(id) {
  const targetUrl = `https://www.ebay.com/itm/ebay/${id}`
  return requestPromise(
    {
      url: targetUrl,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36',
        accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'accept-encoding': 'deflate, br',
        'accept-language': 'zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7',
        // cookie: 'ubid-main=133-6510838-1909130; session-id=138-1428333-7519423; x-wl-uid=1XPTts4jd9wHsnijRSsAS8hcwydGlyDfYgDerv8dM/rqNbSnFVViuAaYTGX1hWfz/9QNhRe3n4lM=; i18n-prefs=USD; lc-main=en_US; aws-priv=eyJ2IjoxLCJldSI6MCwic3QiOjB9; aws-target-static-id=1576662459863-545132; aws-target-data=%7B%22support%22%3A%221%22%7D; s_fid=71BF0CCDB9F2B602-113D06B1E18C6567; regStatus=registering; aws-ubid-main=367-8066624-6387631; aws-target-visitor-id=1576662459866-624371.22_44; s_dslv=1578540142165; s_vn=1608198460142%26vn%3D14; aws-business-metrics-last-visit=1579599123383; skin=noskin; session-id-time=2082787201l; appstore-devportal-locale=en_US; mbox=session#37d0af640f304876a0b8681a66903f2c#1585122554; check=true; AMCVS_4A8581745834114C0A495E2B%40AdobeOrg=1; _mkto_trk=id:365-EFI-026&token:_mch-amazon.com-1585120693776-19309; AMCV_4A8581745834114C0A495E2B%40AdobeOrg=-432600572%7CMCIDTS%7C18347%7CMCMID%7C49613296804893202932402764432909282701%7CMCAAMLH-1585725493%7C11%7CMCAAMB-1585725493%7CRKhpRz8krg2tLO6pguXWp5olkAcUniQYPHaMWWgdJ3xzPWQmdj0y%7CMCOPTOUT-1585127894s%7CNONE%7CMCAID%7CNONE%7CvVersion%7C4.5.2; s_lv_s=First%20Visit; s_cc=true; session-token=9JtByiSWIZUUKXPfkPRMnG7MM127RqHYuYeCiFYveZWqkIPTLerTRxDUoi3NVX02QY6VkHd7HpUhfPIBICIV9KQHfG4xDus5k+Y4Yi9ZdNk/diqvXvGSFFgo3p2/Hgx6pRl93WsIOdDjT9/wMdBHS7AGEt5Ns7EfNXImIhP3684HoAzuX4ev8seSoI2aAxI5; s_sq=amzna2z%3D%2526c.%2526a.%2526activitymap.%2526page%253Ddocs%25252Fapp-submission-api%25252Fappsubapi-endpoints.html%2526link%253DExplore%2526region%253Dswagger-ui%2526pageIDType%253D1%2526.activitymap%2526.a%2526.c%2526pid%253Ddocs%25252Fapp-submission-api%25252Fappsubapi-endpoints.html%2526pidt%253D1%2526oid%253DExplore%2526oidt%253D3%2526ot%253DSUBMIT; s_nr=1585121138843-Repeat; s_lv=1585121138844; csm-hit=tb:s-Y5RFG23TED5F4VH8453X|1585121175627&t:1585121176934&adb:adblk_yes',
        // 'sec-fetch-dest': 'document',
        // 'sec-fetch-mode': 'navigate',
        // 'sec-fetch-site': 'none',
        // 'upgrade-insecure-requests': '1',
      },
      // encoding: null,
    }
  )
    .then(({response, body}) => {
      const $ = cheerio.load(body)

      const timestamp = Date.now()
      const price = $('#prcIsum').attr('content')

      const payload = {
        id,
        name: $('#itemTitle').contents()[1].data,
        image: $('#icImg').attr('src'),
        price,
        priceHistory: {
          [timestamp]: price,
        },
        url: $('meta[property="og:url"]').attr('content'),
        condition: +($('#vi-itm-cond').text() === 'New'),
        sold: $('#why2buy .w2b-head').eq(0).text(),
        quantity: $('#qtySubTxt:nth-child(1)').text().replace(/[^\d]/g, '').trim(),
        lastUpdate: timestamp,
      }

      return payload
    })
    .catch(error => {
      return Promise.reject(error)
    })
}

// getEbayProduct('15224168')

function getEbayProduct(id) {
  const productRef = db.collection('product').doc(id)

  return productRef.get()
    .then(doc => {
      if (doc.exists) {
        return doc.data()
      } else {
        return null
      }
    })
    .catch(err => {
      return Promise.reject(err)
    })
}

// crawlEbayProduct('352933958469')
//   .then(data => {
//     db.collection('product').doc(data.id).set(data)
//   })
//   .catch(console.log)

function addProduct(data) {
  return db.collection('product').doc(data.id).set(data)
}

function updateProductHistory(id, timestamp, price) {
  console.log(id)
  console.log(new Date(timestamp).toLocaleDateString())
  console.log(price)
  return db.collection('product').doc(id).update({
      price,
      [`priceHistory.${timestamp}`]: price,
    })
    .then((res) => {
      console.log(`update ${id} success.`)
      return res
    })
    .catch((err) => {
      console.log(err)
      return Promise.reject(err)
    })
}

function addWatchlist(uid, productId) {
  userRef = db.collection('user').doc(uid)

  return userRef.get()
    .then(doc => {
      if(doc.exists) {
        const {watchlist} = doc.data()
        return watchlist.indexOf(productId) >= 0 ? 2 : 1
      } else {
        return 0
      }
    })
    .then(code => {
      addRecentWatchlist(productId)
      if(code === 0) return userRef.set({ watchlist: [productId] })
      if(code === 1) return userRef.update({
        watchlist: admin.firestore.FieldValue.arrayUnion(productId)
      })
      if(code === 2) return Promise.reject('該商品已經加入過')
    })
}

function getWatchlist(uid) {
  userRef = db.collection('user').doc(uid)

  return userRef.get()
    .then(doc => {
      if(doc.exists) {
        console.log(doc.data())
        const {watchlist} = doc.data()
        return watchlist
      } else {
        return []
      }
    })
}

function consumer(queue, job, retry = 1, delay = 1000 * 60) {
  let waitQueue = []

  return queue.reduce((reducer, id, array) => {
    return reducer.then(() => {
      return job(id)
        .then(id => {
          console.log(`success: ${id}`)
        })
        .catch(err => {
          console.log(err)
          waitQueue.push(id)
        })
    })
  }, Promise.resolve())
    .then(res => {
      console.log('retry:' + retry)
      console.log('delay:' + delay)
      console.log(waitQueue)
      if(!waitQueue.length) return false
      if(retry <= 0) return false
      retry -= 1
      setTimeout(() => {
        consumer(waitQueue, retry, delay)
      }, delay)
    })
}

function updateProductInWatchlist() {
  return collectWatchlist()
    .then(queue => {
      consumer(
        queue,
        id => crawlEbayProduct(id)
          .then(data => updateProductHistory(data.id, data.lastUpdate, data.price))
      )
    })
}

function collectWatchlist() {
  userRef = db.collection('user')

  return userRef.get()
    .then(snapshot => {
      if (snapshot.empty) {
        console.log('No matching documents.')
        return
      }

      const all = snapshot.docs.reduce((reducer, doc) => {
        const { watchlist } = doc.data()

        if(!watchlist) return reducer

        watchlist.forEach(id => {
          reducer.add(id)
        })

        return reducer
      }, new Set([]))

      return [...all]
    })
    .catch(err => Promise.reject(err))
}


function getRecentWatchlist() {
  return db.collection('recentWatchlist').orderBy('date').limit(10).get()
    .then(snapshot => {
      return snapshot.docs.map(doc => doc.id)
    })
}

function addRecentWatchlist(id) {
  return db.collection('recentWatchlist').doc(id).set({ id, date: Date.now() })
}

function getRecentSearch() {

}

function addRecentSearch(id) {

}

function login(username, password) {
  const targetUrl = 'https://member.ruten.com.tw/user/login.php'
  return requestPromise(
    {
      url: targetUrl,
      method: 'POST',
      form: {
        userid: username,
        userpass: password
      }
    }
  )
    .then(({response, body}) => {
      if(response.statusCode === 302 || response.statusCode === 200) {
        try {
          const cookie = response.headers['set-cookie'].map(item => item.slice(0, item.indexOf(';') + 1)).join('')
          return Promise.resolve(cookie)
        } catch (error) {
          return Promise.reject('parse cookie error')
        }
      } else {
        return Promise.reject('code error')
      }
    })
    .catch(error => {
      return Promise.reject(error)
    })
}

function sendMessage({me, uid, msg, cookie}) {
  const targetUrl = 'https://im.ruten.com.tw/api/im/v2/index.php/outer/user'
  const payload = JSON.stringify({
    userid: me,
    to: [uid],
    type: "text",
    msg: msg,
    time: "",
    oid: "",
    pid: ""
  })

  return requestPromise(
    {
      // proxy: 'http://172.30.0.210:8889',
      url: `${targetUrl}/${me}/msg?to=${uid}`,
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
        Cookie: cookie
      },
      form: payload
    }
  )
}

function getUid(username) {
  return requestPromise(
    {
      url: `http://class.ruten.com.tw/user/index00.php?s=${username}`,
      method: "GET",
    }
  )
    .then(({response, body}) => {
      let uid = body.match(/(.*?)"userID":"(.*?)"(.*?)/g)[0].replace(/(.*?)"userID":"(.*?)"(.*?)/g, function(match, ...p){
        return p[1]
      })
      return Promise.resolve(uid)
    })
    .catch(err => Promise.reject(err))
}

function setFavor({me, uid, cookie}) {
  return requestPromise(
    {
      // proxy: 'http://172.30.0.210:8889',
      url: `https://rtapi.ruten.com.tw/api/im/v2/index.php/outer/user/${me}/favorlist?id=${uid}`,
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
        Cookie: cookie
      },
      form: JSON.stringify([uid])
    }
  )
}

module.exports = {
  login,
  getUid,
  setFavor,
  sendMessage,
  cawlEbay,
  crawlAmazon,
  storeEbayHotGood,
  storeAmazonHotGood,
  getEbayGoods,
  getAmazonGoods,
  crawlEbayProduct,
  getEbayProduct,
  addProduct,
  addWatchlist,
  getWatchlist,
  updateProductInWatchlist,
  getRecentWatchlist,
  crawlRuten,
}
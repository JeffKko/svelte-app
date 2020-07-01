const request = require("request");

module.exports = function(options) {
  let basicOptions = {
    // proxy: 'http://172.30.0.210:8889',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
  }

  return new Promise((resolve, reject) => {
    request(
      {
        ...basicOptions,
        ...options,
      }, (error, response, body) => {
        if (error) {
          reject(error)
        }
       // console.log(response.statusCode)
        resolve({
          response,
          body,
        })
      }
    )
  })
}
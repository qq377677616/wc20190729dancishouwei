const ajax = (url, data = {}, method = 'GET', callback) => {
  wx.request({
    url: url,
    data: data,
    method: method,
    header: {
      'content-type': 'application/json'
    },
    success: function (res) {
      callback(res)
    },
    fail: function (err) {
      callback(res)
    }
  })
}
const gets = (url, data = {}, callback) => {
  wx.request({
    url: url,
    data: data,
    method: 'GET',
    header: {
      'content-type': 'application/json'
    },
    success: function (res) {
      callback(res)
    },
    fail: function (err) {
      callback(res)
    }
  })
}
const post = (url, data = {}, callback) => {
  wx.request({
    url: url,
    data: data,
    method: 'POST',
    header: {
      'content-type': 'application/json'
    },
    success: function (res) {
      callback(res)
    },
    fail: function (err) {
      callback(res)
    }
  })
}
const getP = (url, data = {}, header = { 'content-type': 'application/json' }) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: url,
      data: data,
      method: 'GET',
      header: header,
      success: function (res) {
        resolve(res)
      },
      fail: function (err) {
        reject(err)
      }
    })
  })
}
const postP = (url, data = {}, header = { 'content-type': 'application/json'}) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: url,
      data: data,
      method: 'POST',
      header: header,
      success: function (res) {
        resolve(res)
      },
      fail: function (err) {
        reject(err)
      }
    })
  })
}
module.exports = {
  ajax: ajax,
  gets: gets,
  post: post,
  getP: getP,
  postP: postP
}
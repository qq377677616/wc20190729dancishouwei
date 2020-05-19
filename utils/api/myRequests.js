const app = getApp()
const $ = require('./request.js')
const auth = require('../publics/authorization.js')
const SERVICE = "https://gameh5.flyh5.cn/game/wx7c3ed56f7f792d84/yyt_dfqcfslb/public"

//获取openid【get请求】
const getOpenid = data => {
  let _url = `${SERVICE}/api/Oauth/getCode`
  return new Promise((resolve, reject) => {
    $.postP(_url, data).then(res => {
      resolve(res)
    })
  })
}

//获取用户unionid
const getUnionid = data => {
  let _url = `${SERVICE}/api/Oauth/decryptedUnionId`
  return new Promise((resolve, reject) => {
    $.postP(_url, data).then(res => {
      resolve(res)
    })
  })
}

//手机号解密
const getPhoneNumber = (data) => {
  let _url = `${SERVICE}/api/Oauth/decryptedPhone`
  return new Promise((resolve, reject) => {
    $.postP(_url, data).then(res => {
      resolve(res)
    })
  })
}

module.exports = {
  getOpenid,
  getUnionid,
  getPhoneNumber
}
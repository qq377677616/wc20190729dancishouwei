// const app = getApp()
const canIUse = wx.canIUse('button.open-type.getUserInfo')
const $ = require('../api/request.js')
const SERVICE = "https://game.flyh5.cn/game/wxf8c4f91c26f2fa95/walmart/public/"
const gets = require('../api/myRequests.js')
const tool = require('./tool.js')

//腾讯统计代码
const statistics = (mta, opation) => {
  mta.App.init(opation)
}
//登录
const login = () => {
  return new Promise((resolve, reject) => {
    wx.login({
      success: res => {
        resolve(res)
      }
    })
  })
}
/*获取用户个人信息(普通微信)*/
const getUser = callback => {
  wx.getUserInfo({
    success: res => {
      getApp().globalData.userInfo = res.userInfo
      callback(res.userInfo)
    }
  })
}
/*检查登录态会话密钥session_key是否过期*/
const isCheckSession = callback => {
  wx.checkSession({
    success() {
      callback(true)
    },
    fail() {
      callback(false)
    }
  })
}
/*登录后获取openid和session_key（普通微信）*/
const getOpenidSk = callback => {
  wx.login({
    success: res => { 
      gets.getOpenid({ code: res.code }).then(res => {
        wx.setStorageSync("open_session", res.data.open_session)
        callback()
      })
    }
  })
}
/*授权*/
const getUserInfo = (e, SM_title = '授权提示', SM_content = '为了您更好的体验,请先同意授权', URL_index, callBack) => {
  if (e.detail.userInfo) {
    getApp().globalData.userInfo = e.detail.userInfo
    if (URL_index) {
      wx.switchTab({
        url: URL_index
      })
    } else {
      callBack()
    }
  } else {
    wx.showModal({
      title: SM_title,
      content: SM_content,
      showCancel: false
    })
  }
}
/*查询用户是否否授权了 scope*/
const isSettingScope = (scope, callback) => {
  wx.getSetting({
    success(res) {
      if (!res.authSetting[scope]) {
        wx.authorize({
          scope: scope,
          success() {//这里是用户同意授权后的回调
            callback({ status: 1, message: "用户已授权" })
          },
          fail() {//这里是用户拒绝授权后的回调
            callback({ status: 0, message: "用户未授权" })
          }
        })
      } else {//用户已经授权过了
        callback({ status: 2, message: "用户已经授权过了"})
      }
    }
  })
}
/*获取用户信息*/
const getSetting = loginUrl => {
  wx.getSetting({
    success: res => {
      if (res.authSetting['scope.userInfo']) {
        // 已经授权，可以直接调用 getUserInfo 获取头像昵称
        wx.getUserInfo({
          success: res => {
            // 可以将 res 发送给后台解码出 unionId
            getApp().globalData.userInfo = res.userInfo
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            if (getApp().userInfoReadyCallback) {
              getApp().userInfoReadyCallback(res)
            }
          }
        })
      } else {
        wx.redirectTo({
          url: loginUrl
        })
      }
    }
  })
}

/*判断是否授权*/
const isSetting = callBack => {
  wx.getSetting({
    success: res => {
      //授过权
      if (res.authSetting['scope.userInfo']) {
        callBack(true)
        //未授权  
      } else {
        callBack(false)
      }
    }
  })
}
//打开授权设置
const openSetting = (callback) => {
  wx.openSetting({
    success(res) {
      if (callback) callback(res)
      console.log(res)
      console.log("【授权情况】")
      console.log(res.authSetting)
    }
  })
}
module.exports = {
  statistics: statistics,
  getOpenidSk: getOpenidSk,
  getUserInfo: getUserInfo,
  isCheckSession: isCheckSession,
  isSettingScope: isSettingScope,
  getSetting: getSetting,
  login: login,
  isSetting: isSetting,
  getUser: getUser,
  openSetting: openSetting
}
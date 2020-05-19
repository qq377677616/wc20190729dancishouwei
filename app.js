//app.js
import mta from '/utils/mta_analysis'
import auth from '/utils/publics/authorization'
import axios from '/utils/axios/axios'

import tool from '/utils/publics/tool'
App({
  onShow(){
    //  每次第一次加载动态修改
    wx.setStorageSync('isBg', true)
    this.addTools()
    if (!wx.getStorageSync("resourcesUrl")) wx.setStorageSync("resourcesUrl", "https://game.flyh5.cn/resources/game/wechat/szq/danci")

    // const updateManager = wx.getUpdateManager()
    // updateManager.onCheckForUpdate(function (res) {
    //   // 请求完新版本信息的回调
    //   // console.log(res.hasUpdate)
    // })
    // updateManager.onUpdateReady(function () {
    //   wx.showModal({
    //     title: '更新提示',
    //     content: '新版本已经准备好，是否重启应用？',
    //     success: function (res) {
    //       if (res.confirm) {
    //         // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
    //         updateManager.applyUpdate()
    //       }
    //     }
    //   })
    // })
    // updateManager.onUpdateFailed(function () {
    //   // 新版本下载失败
    //   console.log('新版本下载失败')
    // })
  },
  addTools(){
    let toast = (title,icon = 'none')=>{
      wx.showToast({
        icon:icon,
        title:title
      })
    }
    Object.assign(this, toast)
  },
  onLaunch: function () {
    //腾讯统计
    auth.statistics(mta, {
      "appID": "500690518",
      "eventID": "500690519",
      "autoReport": true,
      "statParam": true,
      "ignoreParams": [],
      "statPullDownFresh": true,
      "statShareApp": true,
      "statReachBottom": true
    })
  },
  login(callback) {
    const userInfo = wx.getStorageSync('openid');
    // console.log('userInfoooooooo', userInfo)
    if (userInfo) {
      wx.hideLoading();
      callback();
    } else {
      wx.showLoading({
        title: '登录中',
        mask: true,
      });
      new Promise((resolve, reject) => {
        wx.login({
          success(res) {
            resolve(res)
          },
          fail(reason) {//失败
            reject(reason)
          }
        })
      }).then((value) => {
        return this.getOpenid(value.code);
      }).then((value) => {
        // const data = value.data.data.openid;
        // wx.setStorageSync('openid', data);
        // this.globalData.openid = data;
        wx.hideLoading();
        callback();
      })
    }

  },
  getOpenid(code) {
    let that = this;
    return new Promise((resolve, reject) => {
      let shareId = wx.getStorageSync('shareId');
      let obj = { code: code, nickName: '', avatarUrl: ''}
      if(shareId){
        obj.share_id = shareId;
      }
      axios.post('Base/getOpen', obj).then(res => {
        wx.setStorageSync('rdSession', res.data.rdSession)
        resolve(res);
      })
      // that._request_get('ask.php/getCode', {
      //   code: code
      // }, function (success) {
      //   resolve(success);
      // })
    })
  },
  globalData: {
    userInfo: null,
    audioObj:wx.createInnerAudioContext(),
  }
})
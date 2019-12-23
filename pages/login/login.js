// pages/login/login.js
const app = getApp()
const api = require('../../utils/api/myRequests.js')
const auth = require('../../utils/publics/authorization.js')
const tool = require('../../utils/publics/tool.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isGetUnionid: false,//是否获取用户的unionid
    isGetPhoneNumber: true,//是否获取用户的手机号
    jumpUrl: "/pages/index/index",//授权成功后跳转的页面
    showModal: {//自定义弹窗配置信息
      isShow: false,
      title: "手机号授权",
      test: "为了更好的体验，智趣启辰将自动获取您的手机号。",
      cancelText: "取消",
      confirmText: "授权",
      color_confirm: '#0BB20C'
    }
  },
  //点击授权后
  getUserInfo(e) {
    console.log("拿到授权返回数据-->", e)
    if (e.detail.userInfo) {
      tool.loading('授权中')
      let { userInfo } = e.detail
      //微信小程序登录
      auth.login().then(res => {
        console.log("微信登录后获取拿到code-->", res)
        return res
      }).then(res => {
        //获取code后请求后端登录接口
        return api.getOpenid({ code: res.code })
      }).then(res => {
        console.log("请求后端登录接口返回-->", res)
        if (res.data.status === 1) {
          let { data } = res.data
          if (this.data.isGetUnionid) {//判断是否需要获取用户unionid
            this.getUnionid(data, e)
          } else {
            this.getgetUnionidOk(userInfo, data)
          }
        } else {
          tool.alert("登录失败，请稍后再试")
        }
      })
    } else {
      tool.showModal("授权提示", "为了更好的体验,请先进行授权", "好的,#A3271F", false)
    }
  },
  //请求后端接口获取unionid
  getUnionid(data, e) {
    let _data = {
      user_id: data.id,
      session_key: data.session_key,
      encrypted_data: e.detail.encryptedData,
      iv: e.detail.iv
    }
    //请求后端接口获取unionid
    api.getUnionid(_data).then(res => {
      if (res.data.status === 1) {
        console.log("获取unionid后返回数据-->", res)
        data.unionid = res.data.data.unionid
        this.getgetUnionidOk(userInfo, data)
      } else {
        tool.alert("获取unionid失败，请稍后再试")
      }
    })
  },
  //登录成功后处理
  getgetUnionidOk(userInfo, userId) {
    wx.setStorageSync("userInfo", userInfo)
    wx.setStorageSync("userId", userId)
    tool.loading_h()
    if (this.data.isGetPhoneNumber) {
      this.showHideModal() 
    } else {
      tool.jump_swi(this.data.jumpUrl)
    }
  },
  //点击自定义Modal弹框上的按钮
  operation(e) {
    tool.loading("")
    if (e.detail.confirm) {
      this.showHideModal()
      let _data = {
        user_id: 15,
        session_key: wx.getStorageSync("userId").session_key,
        encrypted_data: e.detail.encryptedData,
        iv: e.detail.iv
      }
      //请求后端接口解密获取手机号
      api.getPhoneNumber(_data).then(res => {
        if (res.data.status == 1) {
          let _userInfo = wx.getStorageSync("userInfo")
          _userInfo.phone = res.data.data.mobile
          wx.setStorageSync("userInfo", _userInfo)
          tool.jump_swi(this.data.jumpUrl)
        }
      })
    } else {
      tool.loading("")
      this.showHideModal()
      setTimeout(() => {
        tool.loading_h()
        this.showHideModal()
      }, 600)
    }
  },
  //打开、关闭自定义Modal弹框
  showHideModal() {
    let _showModal = this.data.showModal
    _showModal.isShow = !_showModal.isShow
    this.setData({ showModal: _showModal })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})
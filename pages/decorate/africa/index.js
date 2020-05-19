// pages/decorate/africa/index.js
import axios from '../../../utils/axios/axios'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    resourcesUrl: `${wx.getStorageSync("resourcesUrl")}/images/decorate/africa/`,
    resourcesUrls: `${wx.getStorageSync("resourcesUrl")}/images/Mycity/`,
    list:[],
    isShow: true,
    speed: 0,
    openid: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    let rdSession = wx.getStorageSync('rdSession');
    if (options.openid) {
      this.setData({ openid: options.openid })
    }
    axios.post('Index/check_city', { rdSession: this.data.openid ? this.data.openid : rdSession, state: 'africa' }).then(res => {
      console.log('ressssss', res)
      _this.setData({
        list: res.data.data.list,
        speed: res.data.data.percent
      })
      for (let i = 0; i < _this.data.list.length; i++) {
        if (_this.data.list[i].did == 87) {
          _this.setData({
            isShow: false
          })
        }
      }
    })
  },
  back: function () {
    wx.navigateBack({
      delta: 1
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.audioCtx1 = wx.createAudioContext('myAudios1');
    this.audioCtx1.play();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '单词总动员Word Defender',
      // desc: '分享页面的内容',
      imageUrl: 'https://flynew.oss-cn-hangzhou.aliyuncs.com/game/wechat/szq/danci/images/Mycity/sharecommon.jpg',
      path: 'pages/index/index' // 路径，传递参数到指定页面。
    }
  }
})
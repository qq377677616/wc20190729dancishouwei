// pages/decorate/north/index.js
import axios from '../../../utils/axios/axios'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    resourcesUrl: `${wx.getStorageSync("resourcesUrl")}/images/decorate/north/`,
    resourcesUrls: `${wx.getStorageSync("resourcesUrl")}/images/Mycity/`,
    list:[],
    isShow: true,
    speed: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    let rdSession = wx.getStorageSync('rdSession');
    axios.post('Index/check_city', { rdSession: rdSession, state: 'north america' }).then(res => {
      console.log('ressssss', res)
      _this.setData({
        list: res.data.data.list,
        speed: res.data.data.percent
      })
      for (let i = 0; i < _this.data.list.length; i++) {
        if (_this.data.list[i].did == 57 || _this.data.list[i].did == 65) {
          _this.setData({
            isShow: false
          })
        }
      }
    })
  },
  back: function () {
    wx.redirectTo({
      url: '/pages/city/index',
    })
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

  }
})
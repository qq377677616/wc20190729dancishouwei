// pages/clearance/index.js
import axios from '../../utils/axios/axios'
import tool from '../../utils/publics/tool.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    resourcesUrl: `${wx.getStorageSync("resourcesUrl")}/images/Mycity/`, //图片公共地址
    memberList:[
      {icon:'page19_22',timer:'page19_18'},
      {icon:'page19_23',timer:'page19_18'},
      {icon:'page19_24',timer:'page19_18'},
    ],
    lists: [],
    star: 0,
    isShow: true,
    success: true,
    isShows: false,
    monster: '', //小怪兽图片
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    let rdSession = wx.getStorageSync('rdSession');
    let star = wx.getStorageSync('score');
    this.setData({ monster: wx.getStorageSync('monster')})
    axios.post('Index/get_pay_set', { rdSession: rdSession }).then(res => {
      console.log('ressssss', res)
      _this.setData({
        lists: res.data.data,
        star: star
      })
    })
  },
  // 关闭进入页面的小怪兽弹层
  close(){
    this.setData({ isShows: true})
  },
  //  弹出充值界面
  recharge:function(){
    this.setData({
      isShow: false
    })
  },
  // play:function(e){
  //   console.log('eeeeeeeeee',e)
  //   let rdSession = wx.getStorageSync('rdSession');
  //   let money = e.currentTarget.dataset.money;
  //   let day = e.currentTarget.dataset.day;
  //   axios.post('Index/pay', { rdSession: rdSession, price: money, day: day }).then(res => {
  //     if (res.data.code == 1) {
  //       console.log('ressssssssssssss',res.data.data)
  //     }
  //   })
  // },
  del:function(){
    this.setData({
      isShow: true
    })
  },
  nextCity:function(){
    console.log('下一个城市')
    // 如果不是最后一关 就加1
    let poindex = wx.getStorageSync('poindex');
    poindex++;
    wx.setStorageSync('poindex', poindex);
    // 在本地存入答题分数
    wx.setStorageSync('score', 0);
    let state = wx.getStorageSync('state');
    if (state == 'ASIA'){
      this.getCity(poindex)
      // wx.redirectTo({ url: '/pages/mapdetailed/asia/index?ids='+poindex})
    } else if (state == 'EUROPE'){
      this.getCity(poindex)
      // wx.redirectTo({ url: '/pages/mapdetailed/europe/index?ids=' + poindex })
    } else if (state == 'NORTH AMERICA'){
      this.getCity(poindex)
      // wx.redirectTo({ url: '/pages/mapdetailed/northamerica/index?ids=' + poindex })
    } else if (state == 'AFRICA'){
      this.getCity(poindex)
      // wx.redirectTo({ url: '/pages/mapdetailed/africa/index?ids=' + poindex })
    }
    
  },
  //  获取当前大洲所有城市
  getCity(poindex){
    let rdSession = wx.getStorageSync('rdSession');
    let state = wx.getStorageSync('state');
    let _this = this;
    axios.post('Index/get_city', { rdSession: rdSession, state: state }).then(res => {
      console.log("ressssss", res)
      _this.setData({
        key: res.data.data.num - 1,
        activeIndex: res.data.data.num,
        cityList: res.data.data.list
      })
      
      console.log('poindexxxxx', poindex, res.data.data.list.length)
      if (poindex > 0) {
        //  如果大于数组长度  就是最后一关
        if (poindex < res.data.data.list.length) {
          let cityId = res.data.data.list[poindex].id;
          let cityName = res.data.data.list[poindex].k + ' ' + res.data.data.list[poindex].city
          _this.linkAnswer(cityId, cityName);
        }else{
          tool.alert("当前大洲所有城市已通关！")
          wx.navigateTo({
            url: '/pages/map/index'
          })
        }
      }
    }) 
  },
  // 自动跳转到下一个城市答题
  linkAnswer(cityId, cityName){
    console.log('cityIddddddddd',cityId,cityName)
    let _this = this;
    // 拿到登录状态
    let rdSession = wx.getStorageSync('rdSession');
    // 在本地存入城市ID
    wx.setStorageSync('cityId', cityId);
    // 在本地存入答题分数
    wx.setStorageSync('score', 0);
    // 在本地存入城市名
    wx.setStorageSync('cityName', cityName);
    //  在本地存入答题数
    wx.setStorageSync('anumber', 0);
    //  在本地存入小怪兽的血条数量 默认为3
    wx.setStorageSync('lifebar', 9)
    //  获取下一题的题型  
    axios.post('Index/get_question', { rdSession: rdSession, cityid: cityId }).then(res => {
      console.log("ressssss", res)
      let ids = res.data.data.id;
      _this.setData({ datas: res.data.data })
      if (!res.data.data.user.is_ball) {
        if (res.data.data.typeid == 1) {
          wx.redirectTo({ url: '/pages/subject/four/index?id=' + ids })
        } else if (res.data.data.typeid == 2) {
          wx.redirectTo({ url: '/pages/subject/one/index?id=' + ids })
        } else if (res.data.data.typeid == 3) {
          wx.redirectTo({ url: '/pages/subject/two/index?id=' + ids })
        } else if (res.data.data.typeid == 4) {
          wx.redirectTo({ url: '/pages/subject/eight/index?id=' + ids })
        } else if (res.data.data.typeid == 5) {
          wx.redirectTo({ url: '/pages/subject/eleven/index?id=' + ids })
        } else if (res.data.data.typeid == 6) {
          wx.redirectTo({ url: '/pages/subject/fives/index?id=' + ids })
        } else if (res.data.data.typeid == 7) {
          wx.redirectTo({ url: '/pages/subject/twelve/index?id=' + ids })
        } else if (res.data.data.typeid == 8) {
          wx.redirectTo({ url: '/pages/subject/six/index?id=' + ids })
        } else if (res.data.data.typeid == 9) {
          wx.redirectTo({ url: '/pages/subject/seven/index?id=' + ids })
        } else if (res.data.data.typeid == 10) {
          wx.redirectTo({ url: '/pages/subject/nine/index?id=' + ids })
        } else if (res.data.data.typeid == 11) {
          wx.redirectTo({ url: '/pages/subject/three/index?id=' + ids })
        } else if (res.data.data.typeid == 12) {
          wx.redirectTo({ url: '/pages/subject/ten/index?id=' + ids })
        }
      }
    })
  },
  //  排行榜
  rank:function(){
    wx.navigateTo({
      url: '/pages/ranking/index',
    })
  },
  //  我的城市
  myCity:function(){
    wx.navigateTo({
      url: '/pages/city/index'
    })
  },
  //  在玩一次
  more:function(){
    // 拿到登录状态
    let rdSession = wx.getStorageSync('rdSession');
    // 在本地存入答题分数
    wx.setStorageSync('score', 0);
    // 拿到当前点击的城市ID
    let cityId = wx.getStorageSync('cityId')
    axios.post('Index/get_question', { rdSession: rdSession, cityid: cityId }).then(res => {
      wx.setStorageSync('anumber', 0)
      let ids = res.data.data.id;
      if (res.data.data.typeid == 1) {
        wx.redirectTo({ url: '/pages/subject/four/index?id=' + ids })
      } else if (res.data.data.typeid == 2) {
        wx.redirectTo({ url: '/pages/subject/one/index?id=' + ids })
      } else if (res.data.data.typeid == 3) {
        wx.redirectTo({ url: '/pages/subject/two/index?id=' + ids })
      } else if (res.data.data.typeid == 4) {
        wx.redirectTo({ url: '/pages/subject/eight/index?id=' + ids })
      } else if (res.data.data.typeid == 5) {
        wx.redirectTo({ url: '/pages/subject/eleven/index?id=' + ids })
      } else if (res.data.data.typeid == 6) {
        wx.redirectTo({ url: '/pages/subject/fives/index?id=' + ids })
      } else if (res.data.data.typeid == 7) {
        wx.redirectTo({ url: '/pages/subject/twelve/index?id=' + ids })
      } else if (res.data.data.typeid == 8) {
        wx.redirectTo({ url: '/pages/subject/six/index?id=' + ids })
      } else if (res.data.data.typeid == 9) {
        wx.redirectTo({ url: '/pages/subject/seven/index?id=' + ids })
      } else if (res.data.data.typeid == 10) {
        wx.redirectTo({ url: '/pages/subject/nine/index?id=' + ids })
      } else if (res.data.data.typeid == 11) {
        wx.redirectTo({ url: '/pages/subject/three/index?id=' + ids })
      } else if (res.data.data.typeid == 12) {
        wx.redirectTo({ url: '/pages/subject/ten/index?id=' + ids })
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    if (wx.getStorageSync('isPlay')) {
      this.audioCtx1 = wx.createAudioContext('myAudios1');
      this.audioCtx1.play();
    }
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
      title: '分享',
      path: '/pages/index/index?shareId=' + wx.getStorageSync('rdSession'),
      // imageUrl: 'https://......./img/groupshare.png',  //用户分享出去的自定义图片大小为5:4,
      success: function (res) {
        // 转发成功
        wx.showToast({
          title: "分享成功",
          icon: 'success',
          duration: 2000
        })
      },
      fail: function (res) {
        // 分享失败
      },
    }
  }
})
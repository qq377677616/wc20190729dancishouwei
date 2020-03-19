// pages/subject/four/index.js
import axios from '../../../utils/axios/axios'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    resourcesUrl: `${wx.getStorageSync("resourcesUrl")}/images/subject/one/`,
    datas: {},
    cityName: '',
    isShow: true, //控制提示框显示
    isX: false, // 答题完显示星星
    //  提示下标
    _index: 100
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    // 拿到登录状态
    let rdSession = wx.getStorageSync('rdSession');
    // 拿到城市ID
    let cityId = wx.getStorageSync('cityId');
    axios.post('Index/get_question', { rdSession: rdSession, cityid: cityId, id: options.id }).then(res => {
      //console.log("ressssss111", res)
      // 在本地保存小怪兽图片 在闯关成功页面显示
      wx.setStorageSync('monster', res.data.data.user.monster.yes_pic);
      //  获取怪兽血条数
      let lifebar = wx.getStorageSync('lifebar');
      let str = 'datas.user.monster.lifebar';
      _this.setData({
        datas: res.data.data,
        ['datas.cityName']: wx.getStorageSync('cityName'),
        [str]: lifebar
      })
      // this.data.datas.cityName = wx.getStorageSync('cityName');
    })
    
  },
  //  播放音频
  playAudio:function(){
    this.audioCtx1.play()
  },
  //  选择答案
  select: function ({ currentTarget }){
    let index = currentTarget.dataset.index;
    // 答案下标
    let rand = this.data.datas.rand;
    //  获取怪兽血条数
    let lifebar = wx.getStorageSync('lifebar');
    if(rand == index){
      //console.log("Yes")
      this.answer(1)
      //  答对 播放音频
      this.audioCtx2.play();
      // 增加怪兽血条数
      if (lifebar > 1) {
        lifebar--;
        wx.setStorageSync('lifebar', lifebar);
        let str = 'datas.user.monster.lifebar';
        this.setData({ [str]: lifebar })
      }
    }else{
      //console.log("No")
      this.answer(2)
      //  答错 播放音频
      this.audioCtx3.play();
      //  减少怪兽血条数
      if (lifebar < 9) {
        lifebar++;
        wx.setStorageSync('lifebar', lifebar);
        let str = 'datas.user.monster.lifebar';
        this.setData({ [str]: lifebar })
      }
    }
  },
  //  调用答题接口
  answer:function(is_yes){
    if (is_yes == 1){
      let _this = this;
      // 拿到登录状态
      let rdSession = wx.getStorageSync('rdSession');
      let data = this.data.datas;
      axios.post('Index/set_answer', { rdSession: rdSession, q_id: data.id, is_yes: is_yes, star: data.star, monsterid: data.user.monster.id }).then(res => {
        //console.log("ressssss", res)
        if (res.data.code == 1) {
          //  拿到答题数
          let anumber = wx.getStorageSync('anumber');
          anumber++;
          // 拿到答题分数
          let score = wx.getStorageSync('score') + this.data.datas.star;;
          wx.setStorageSync('score', score)
          if (anumber >= this.data.datas.count) {
            console.log('该城市所有题目已答完');
            //  如果是最后一题 小怪兽就变成笑脸
            let str = 'datas.user.monster.is_last';
            this.setData({ [str]: true, isX: true });
            wx.redirectTo({
              url: '/pages/clearance/index',
            })
          } else {
            // 当前答题数量成功 设置本地存储答题数量+1
            wx.setStorageSync('anumber', anumber)
            // 拿到登录状态
            let rdSession = wx.getStorageSync('rdSession');
            // 拿到当前点击的城市ID
            let cityId = wx.getStorageSync('cityId')
            this.setData({ isX: true })
            setTimeout(() => {
              axios.post('Index/get_question', { rdSession: rdSession, cityid: cityId }).then(res => {
                let ids = res.data.data.id;
                if (res.data.data.typeid == 1) {
                  wx.reLaunch({ url: '/pages/subject/four/index?id=' + ids })
                } else if (res.data.data.typeid == 2) {
                  wx.reLaunch({ url: '/pages/subject/one/index?id=' + ids })
                } else if (res.data.data.typeid == 3) {
                  wx.reLaunch({ url: '/pages/subject/two/index?id=' + ids })
                } else if (res.data.data.typeid == 4) {
                  wx.reLaunch({ url: '/pages/subject/eight/index?id=' + ids })
                } else if (res.data.data.typeid == 5) {
                  wx.reLaunch({ url: '/pages/subject/eleven/index?id=' + ids })
                } else if (res.data.data.typeid == 6) {
                  wx.reLaunch({ url: '/pages/subject/fives/index?id=' + ids })
                } else if (res.data.data.typeid == 7) {
                  wx.reLaunch({ url: '/pages/subject/twelve/index?id=' + ids })
                } else if (res.data.data.typeid == 8) {
                  wx.reLaunch({ url: '/pages/subject/six/index?id=' + ids })
                } else if (res.data.data.typeid == 9) {
                  wx.reLaunch({ url: '/pages/subject/seven/index?id=' + ids })
                } else if (res.data.data.typeid == 10) {
                  wx.reLaunch({ url: '/pages/subject/nine/index?id=' + ids })
                } else if (res.data.data.typeid == 11) {
                  wx.reLaunch({ url: '/pages/subject/three/index?id=' + ids })
                } else if (res.data.data.typeid == 12) {
                  wx.reLaunch({ url: '/pages/subject/ten/index?id=' + ids })
                }
              })
            },1600)
            
          }
        }
      })
    }
  },
  //  提示
  tips:function(){
    this.setData({
      isShow: false
    })
  },
  cane:function(){
    //console.log("取消");
    this.setData({
      isShow: true
    })
  },
  isTips:function(){
    this.setData({
      isShow: true
    })
    let this_ = this;
    // 拿到登录状态
    let rdSession = wx.getStorageSync('rdSession');
    axios.post('Index/deduct_star', { rdSession: rdSession, star: 2 }).then(res => {
      //console.log("ressssss", res)
      if (res.data.code == 1) {
        //  修改当前用户拥有的星星数量 
        let arr = 'datas.user.star';
        this.setData({
          _index: this.data.datas.rand,
          [arr]: this_.data.datas.user.star - 2
        })

      } else if (res.data.code == 301) {
        //console.log('星星数量不够')
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.audioCtx1 = wx.createAudioContext('myAudio')
    this.audioCtx2 = wx.createAudioContext('myAudios1')
    this.audioCtx3 = wx.createAudioContext('myAudios2')
    this.audioCtx1.play()
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
// pages/subject/ten/index.js
import axios from '../../../utils/axios/axios'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    resourcesUrl: `${wx.getStorageSync("resourcesUrl")}/images/subject/one/`,
    isShow: true, //控制提示框显示
    isX: false, //答题完显示星星
    datas:{},
    cityName: '',
    contents:['','',''],
    audios: '',
    isShows: false,
    sum: 0,
    imgUrl: false, // 显示大图片
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
      //console.log("ressssss", res)
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
  // 点击查看图片
  click(e) {
    let url = e.currentTarget.dataset.url;
    this.setData({ imgUrl: url })
  },
  //  点击关闭图片
  closes() {
    this.setData({ imgUrl: false })
  },
  select:function(e){
    let index = e.currentTarget.dataset.index;
    let _this = this.data;
    //  获取怪兽血条数
    let lifebar = wx.getStorageSync('lifebar');
    if(_this.sum < 3){
      if (_this.datas.question[index].type == _this.datas.answer[_this.sum].type){
        //console.log('答对了')
        let arr = 'contents['+_this.sum+']';
        let arrs = 'datas.answer['+index+'].isY';
        this.setData({
          [arr]: index+1,
          [arrs]: 1
        })
        for(let i=0;i<_this.datas.answer.length;i++){
          if (_this.datas.answer[i].isY == 2){
            let arrs = 'datas.answer[' + i + '].isY';
            this.setData({
              [arrs]: 0
            })
          }
        }
        _this.sum++;
        if (_this.sum == 3) {
          this.answer(1)
          this.audioCtx4.play()
        }else{
          //  答对 播放音频
          this.audioCtx1.play();
        }
        // 增加怪兽血条数
        if (lifebar > 1) {
          lifebar--;
          wx.setStorageSync('lifebar', lifebar);
          let str = 'datas.user.monster.lifebar';
          this.setData({ [str]: lifebar })
        }
      }else{
        //console.log('答错了')
        // 答错了 把之前答错的标识去掉
        for (let i = 0; i < _this.datas.answer.length; i++) {
          if (_this.datas.answer[i].isY == 2) {
            let arrs = 'datas.answer[' + i + '].isY';
            this.setData({
              [arrs]: 0
            })
          }
        }
        let arrs = 'datas.answer[' + index + '].isY';
        this.setData({
          [arrs]: 2
        })
        //  答错 播放音频
        this.audioCtx2.play();
        //  减少怪兽血条数
        if (lifebar < 9) {
          lifebar++;
          wx.setStorageSync('lifebar', lifebar);
          let str = 'datas.user.monster.lifebar';
          this.setData({ [str]: lifebar })
        }
        // this.answer(2)
      }
    }
  },
  //  调用答题接口
  answer: function (is_yes) {
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
        //console.log('this.data.datas===>', this.data.datas)
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
          },800)
          
        }
      }
    })
  },
  //  提示
  tips:function(){
    this.setData({
      isShow: false
    })
  },
  cane: function () {
    //console.log("取消");
    this.setData({
      isShow: true
    })
  },
  isTips: function () {
    this.setData({
      isShow: true
    })
    let this_ = this;
    // 拿到登录状态
    let rdSession = wx.getStorageSync('rdSession');
    axios.post('Index/deduct_star', { rdSession: rdSession, star: 2 }).then(res => {
      //console.log("ressssss", res)
      if (res.data.code == 1) {
        let _this = this.data;
        for (let i = 0; i < _this.datas.answer.length; i++) {
          if (_this.datas.answer[i].type == _this.datas.question[_this.sum].type) {
            let arr = 'datas.answer[' + i + '].isTip';
            this.setData({
              [arr]: true,
              isShows: true,
              audios: _this.datas.answer[i].muc
            })
          }
        }
        //  修改当前用户拥有的星星数量 
        let arr1 = 'datas.user.star';
        this.setData({
          _index: this.data.datas.rand,
          [arr1]: _this.datas.user.star - 2
        })
      } else if (res.data.code == 301) {
        //console.log('星星数量不够')
      }
    })
  },
  plays:function(){
    this.audioCtx3.play();
  },
  close:function(){
    this.setData({isShows:false})
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.audioCtx1 = wx.createAudioContext('myAudios1')
    this.audioCtx2 = wx.createAudioContext('myAudios2')
    this.audioCtx3 = wx.createAudioContext('myAudios3')
    this.audioCtx4 = wx.createAudioContext('myAudios4')
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
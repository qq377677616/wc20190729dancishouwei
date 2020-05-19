// pages/city/index.js
import axios from '../../utils/axios/axios'
import tool from '../../utils/publics/tool.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uid:null,//uid
    resourcesUrl: `${wx.getStorageSync("resourcesUrl")}/images/Mycity/`,
    dataList:[
        {name:'page21_7.png',png:'asia.png'},
        {name:'page21_8.png',png:'euro.png'},
        {name: 'page21_10.png', png:'nort.png'},
        {name:'page21_9.png',png:'afra.png'},
    ],
    data: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  goTo(e){
    this.audios.play();
    wx.navigateTo({url:e.currentTarget.dataset.url})
  },
  back(){
    this.audios.play();
    wx.navigateBack({})
  },
  btns:function(e){
    let index = e.currentTarget.dataset.index;
    if(index==0){
      wx.navigateTo({ url: '../decorate/asia/index?openid=' + this.data.openid})
    }else if(index==1){
      wx.navigateTo({ url: '../decorate/europe/index?openid=' + this.data.openid })
    } else if (index == 2) {
      wx.navigateTo({ url: '../decorate/africa/index?openid=' + this.data.openid })
    } else if (index == 3) {
      wx.navigateTo({ url: '../decorate/north/index?openid=' + this.data.openid })
    }
  },
  onLoad: function (options) {
    let rdSession = wx.getStorageSync('rdSession');
    let type = 1;
    let uid = '';
    if (options.uid){
      type = 2;
      this.setData({ uid: options.uid, openid: options.openid});
      uid = options.uid;
    }
    axios.post('Index/get_user_city', { rdSession: rdSession, type: type,uid:uid }).then(res => {
      if(res.data.code == 1){
        console.log("ressssss", res)
        this.setData({data:res.data.data})
      }
    })
    let isUser = wx.getStorageSync('userInfo')
    if (!isUser) {
      this.setData({ isAuthorization: true })
      return false
    } else {
      return true
    }
  },
  //登录授权
  async onGotUserInfo({ detail }) {
    console.log("aaaaaaaaaaaaaaaaaa")
    const { userInfo } = detail
    const { handCancel } = this
    let showTitle
    if (userInfo) {
      tool.loading('登录中')
      handCancel()
      await axios.login(userInfo).then(res => {
        if (res.data.code == 1) {
          console.log(res.data)
          wx.setStorageSync('rdSession', res.data.rdSession)
          wx.setStorageSync('userInfo', JSON.stringify(userInfo))
          wx.hideLoading()
          showTitle = '授权成功'
          tool.alert(showTitle)
        }
      })
    } else {
      handCancel()
      showTitle = '授权失败'
      //弹窗提示
      tool.alert(showTitle)
    }
  },
  //关闭弹窗
  handCancel() {
    this.setData({ isAuthorization: false })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.audios = wx.createInnerAudioContext();
    this.audios.src = wx.getStorageSync('resourcesUrl') + '/images/index/click.mp3'; 
    if (wx.getStorageSync('isPlay')) {
      this.audioCtx1 = wx.createAudioContext('myAudios1');
      this.audioCtx1.play();
    }
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
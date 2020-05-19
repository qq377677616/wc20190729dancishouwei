// pages/station/index.js
import axios from '../../utils/axios/axios'
import tool from '../../utils/publics/tool.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    resourcesUrl: `${wx.getStorageSync("resourcesUrl")}/images/Mycity/`, //图片公共地址
    pages: 2, // 默认显示两页
    pagesCount: 0,
    dataList:[  //六个选项图片
        'page22_21.png',
        'page22_22.png',
        'page22_23.png',
        'page22_24.png',
        'page22_25.png',
        'page22_26.png',
    ],
    star: 20, //购买饰品消耗星星数
    datas:[],
    zIndex: 0,
    deId:0,
    isShowMsgBox:{ //msgBox状态 url地址
      std:false,
      img:''
    },
  },

  pleaseConfirm(e){ //触发弹窗 传入图片地址
    let {isShowMsgBox} = this.data
    this.audios.play();
    isShowMsgBox.std = true
    isShowMsgBox.img = e.currentTarget.dataset.url;
    this.setData({ 
      isShowMsgBox: isShowMsgBox, 
      deId: e.currentTarget.dataset.id, 
      zIndex: e.currentTarget.dataset.index,
      star: this.data.datas.list[e.currentTarget.dataset.index].star
    })
    // console.log("zIndexxxxxx",this.data.zIndex)
  },

  shutDown(){ //关闭弹窗
    this.audios.play();
    let { isShowMsgBox } = this.data
    isShowMsgBox.std = false
    this.setData({ isShowMsgBox:isShowMsgBox })
  },
  play(){ // 购买装饰
    this.audios.play()
    let rdSession = wx.getStorageSync('rdSession');
    let { isShowMsgBox } = this.data
    isShowMsgBox.std = false
    this.setData({ isShowMsgBox: isShowMsgBox })
    axios.post('Index/buy_adorn', { rdSession: rdSession, id: this.data.deId }).then(res => {
      if (res.data.code == 1) {
        tool.alert("援救成功")
        let arr = "datas.list[" + this.data.zIndex+"].type";
        this.setData({ [arr]: 2,'datas.user.star':res.data.data});
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let rdSession = wx.getStorageSync('rdSession');
    let _this = this;
    axios.get('Index/get_adorn', { rdSession: rdSession, page: 1 }).then(res => {
      console.log('ressssaa', res)
      if(res.data.code == 1){
        _this.setData({
          datas: res.data.data,
          pagesCount: res.data.data.count 
        })
        let arrList = res.data.data.list;
        axios.get('Index/get_adorn', { rdSession: rdSession, page: 2 }).then(res => {
          if (res.data.code == 1) {
            arrList = arrList.concat(res.data.data.list)
            let arr = 'datas.list'
            _this.setData({
              [arr]: arrList
            })
            console.log("datsssssssss",this.data.datas)
          }
        })
      }
      
    })
  },
  scroll: function (e) {
    if (this.data.pages < this.data.pagesCount){
      this.data.pages++;
      let rdSession = wx.getStorageSync('rdSession');
      let _this = this;
      let arrList = this.data.datas.list;
      axios.get('Index/get_adorn', { rdSession: rdSession, page: this.data.pages }).then(res => {
        if (res.data.code == 1) {
          arrList = arrList.concat(res.data.data.list)
          let arr = 'datas.list'
          _this.setData({
            [arr]: arrList
          })
          console.log("datsssssssss", this.data.datas)
        }
      })
    }else{
      console.log("已经没有更多的数据了") 
    }
  },
  back:function(){
    this.audios.play();
    wx.navigateBack({})
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
// pages/Achievements/index.js
import axios from '../../utils/axios/axios'
import auth from '../../utils/publics/authorization.js'
import tool from '../../utils/publics/tool.js'
import util from '../../utils/util.js'
//获取应用实例
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
      resourcesUrl: `${wx.getStorageSync("resourcesUrl")}/images/Mycity/`,
      isShowCheckBox: false,
      userInfo: {},
      isAuthorization: false, //是否显示授权框
      progressNum: 0,
      checkList: [
        {off: 'page24_27', on: 'page24_20', std: false},
        {off: 'page24_24', on: 'page24_17', std: false},
        {off: 'page24_23', on: 'page24_16', std: false},
        {off: 'page24_29', on: 'page24_22', std: false},
        {off: 'page24_25', on: 'page24_18', std: false},
        {off: 'page24_26', on: 'page24_19', std: false},
        {off: 'page24_28', on: 'page24_21', std: false},
      ],
      posterImgUrl:'',
      userid: '',  //好友ID
      num: '', //分享过来的星星数量
      userImgList: [
        { imgUrl:' https://game.flyh5.cn/resources/game/wechat/szq/danci/images/Mycity/k1.png'},
        { imgUrl: 'https://game.flyh5.cn/resources/game/wechat/szq/danci/images/Mycity/k2.png' },
        { imgUrl: 'https://game.flyh5.cn/resources/game/wechat/szq/danci/images/Mycity/k3.png' },
        { imgUrl: 'https://game.flyh5.cn/resources/game/wechat/szq/danci/images/Mycity/k4.png' },
        { imgUrl: 'https://game.flyh5.cn/resources/game/wechat/szq/danci/images/Mycity/k5.png' },
        { imgUrl: 'https://game.flyh5.cn/resources/game/wechat/szq/danci/images/Mycity/k6.png' },
        { imgUrl: 'https://game.flyh5.cn/resources/game/wechat/szq/danci/images/Mycity/k7.png' },
        { imgUrl: 'https://game.flyh5.cn/resources/game/wechat/szq/danci/images/Mycity/k8.png' },
        { imgUrl: 'https://game.flyh5.cn/resources/game/wechat/szq/danci/images/Mycity/k9.png' },
        { imgUrl: 'https://game.flyh5.cn/resources/game/wechat/szq/danci/images/Mycity/k10.png' },
        { imgUrl: 'https://game.flyh5.cn/resources/game/wechat/szq/danci/images/Mycity/k11.png' },
        { imgUrl: 'https://game.flyh5.cn/resources/game/wechat/szq/danci/images/Mycity/k12.png' }
      ],
      isShow: false, //是否显示头像框
    },
    //弹窗开关
    showMsgBox() {
      let {isShowCheckBox} = this.data
      this.setData({isShowCheckBox: true})
      let _this = this;
      let rdSession = wx.getStorageSync('rdSession')
      axios.get('Index/sign_in', { rdSession: rdSession, type: 1 }).then(res => {
        console.log('ressssss',res)
        for(let i=0;i<res.data.data.day;i++){
          _this.setData({ ['checkList['+i+'].std']:true})
        }
      })
      console.log('isShowCheckBox', this.data.isShowCheckBox)
    },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    console.log('options.userid', options.userid)
    if (options.userid) {
      this.setData({
        userid: options.userid,
      })
    }
    if (options.num) {
      this.setData({
        num: options.num
      })
    }
    let isBg = wx.getStorageSync('isBg');
    console.log('isBgggggg', isBg)
    // app.login(() => {
    //   //需要openid的函数
    //   this.handCheckData()
    //   if (options.userid) {
    //     const rdSession = wx.getStorageSync('rdSession')
    //     axios.get('Index/set_expire', { rdSession: rdSession }).then(res => {
    //       try{
    //         if (res.data.code == 1) {
    //           _this.setData({ 'userInfo.star': res.data.data })
    //           _this.getUserInfos()
    //         }
    //       }
    //       catch(err){
    //         console.log('errrrrrrrr',err)
    //       }

    //     })
    //   } else {
    //     _this.getUserInfos()
    //   }
    // })
    if(isBg){
      app.login(() => {
        //需要openid的函数
        this.handCheckData()
        if (options.userid) {
          const rdSession = wx.getStorageSync('rdSession')
          axios.get('Index/set_expire', { rdSession: rdSession }).then(res => {
            if(res.data.code == 1){
              console.log('ressssss.code', res)
              _this.setData({ 'userInfo.star': res.data.data })
              _this.getUserInfo()
            }

          })
        }else{
          _this.getUserInfo()
        }
      })
    }else{
      this.handCheckData()
      this.getUserInfo()
    }

    let isUser = wx.getStorageSync('userInfo')
    if (!isUser) {
      this.setData({ isAuthorization: true })
      return false
    } else {
      return true
    }
  },
  //获取个人信息
  getUserInfo() {
    const rdSession = wx.getStorageSync('rdSession')
    let _this = this;
    let { userInfo } = this.data
    let data = {}
    if (this.data.userid != '') {
      data = {
        rdSession: rdSession,
        type: 1,
        num: Number(this.data.num),
        share_id: this.data.userid,
      }
    } else {
      data = {
        rdSession: rdSession,
        type: 1,
        num: '',
        share_id: '',
      }
    }
    axios.get('Index/get_user_info', data).then(res => {
      userInfo = res.data.data
      this.setData({ userInfo: userInfo })
      console.log('userInfo',_this.data.userInfo)
    })
  },
    cat(){
      this.setData({ isShow: true})
    },
    close(){
      this.setData({ isShow: false})
    },
    //  关闭签到弹窗
    closes(){
      this.setData({ isShowCheckBox: false})
    },
    // 签到
    handCheck(e) {
      this.audios.play();
      // let index = e.currentTarget.dataset.index
      let {checkList} = this.data
      let index = 0;
      for(let i=0;i<checkList.length;i++){
        if(!checkList[i].std){
          index = i;
          break;
        }
      }
      console.log('indexxxxxxx', index, checkList[index].std)
      // let { isShowCheckBox } = this.data
      // this.setData({ isShowCheckBox: !isShowCheckBox })
      //如果已签到则返回
      if (checkList[index].std) return
      //调用签到接口
      this.handCheckData(2)
    },
    //获取签到数据
    async handCheckData(std = 1) {
        const rdSession = wx.getStorageSync('rdSession')
        let {checkList, progressNum} = this.data
        let ret

        await axios.get('Index/sign_in', {rdSession: rdSession, type: std}).then(res => {
            ret = res.data
        })
        // code === 1 === true 设置已签到天数 否则 弹出提示并 return
        if (ret.code === 1) {
          progressNum = ret.data;
          if (std==2){
            tool.alert("签到成功")
            this.setData({'userInfo.star':ret.data.star})
          }
        } else {
          axios.toast(ret.msg)
          return
        }
        // 设置已签到的日子
        for (let i = 0; i < progressNum; i++) {
            checkList[i].std = true
        }

        this.setData({
            checkList: checkList,
            progressNum: progressNum,
        })
    },
    goto(e) {
      this.audios.play();
      const url = e.currentTarget.dataset.url
      wx.navigateTo({ url: url });
      this.audioCtx1.pause();
    },
    savePic:function(){
      // this.isSettingScope();
      this.audios.play();
      wx.navigateTo({
        url: '/pages/ranking/index',
      })
    },
    // //判断是否授权访问手机相册
    // isSettingScope() {
    //   let _self = this
    //   auth.isSettingScope("scope.writePhotosAlbum", res => {
    //     console.log("res", res)
    //     if (res.status == 0) {
    //       tool.loading_h()
    //       _self.showHideModal()
    //     } else if (res.status == 1 || res.status == 2) {
    //       // _self.saveImageToPhotosAlbum(this.data.posterImgUrl)
    //       this.getSharePoster()
    //       console.log("保存成功!")
    //     }
    //   })
    // },
    // //获取分享海报
    // getSharePoster() {
    //   var _this = this
    //   tool.loading("海报生成中", "loading")
    //   this.data.canvasLoading = setTimeout(() => {
    //     console.log("this.data.posterImgUrl====>", this.data.posterImgUrl)
    //     if (!this.data.posterImgUrl) {
    //       tool.loading_h()
    //       tool.alert("海报生成失败，请稍后再试")
    //     }
    //   }, 15000)
    //   console.log("_this.data.userInfo.avatarUrl", this.data.userInfo.avatarurl)
    //   Promise.all([
    //     util.getImgLocalPath("https://game.flyh5.cn/resources/game/wechat/szq/danci/images/Mycity/page24_jpg.jpg"),
    //     util.getImgLocalPath(_this.data.userInfo.avatarUrl),
    //     util.getImgLocalPath("https://game.flyh5.cn/resources/game/wechat/szq/danci/images/Mycity/page24_jpg.jpg"),
    //     util.getImgLocalPath("https://game.flyh5.cn/resources/game/wechat/szq/danci/images/Mycity/boxs.png"),
    //     util.getImgLocalPath(this.data.resourcesUrl +'page24_7.png'),
    //     util.getImgLocalPath(this.data.userInfo.avatarurl), 
    //     util.getImgLocalPath('https://game.flyh5.cn/resources/game/wechat/szq/danci/images/Mycity/bgbor.png'),
    //     //  宠物
    //     util.getImgLocalPath(this.data.resourcesUrl +'page24_88.png'),
    //     util.getImgLocalPath('https://game.flyh5.cn/resources/game/wechat/szq/danci/images/Mycity/page24_66.png'),
    //     ]).then(res => {
    //       console.log("res", res)
    //       tool.canvasImg({
    //         canvasId: 'myCanvas',
    //         imgList: [
    //           { url: res[0], imgW: 574, imgH: 1026, imgX: 0, imgY: 0 },
    //           { url: res[1], imgW: 500, imgH: 610, imgX: 35, imgY: 130 },
    //           { url: res[2], imgW: 90, imgH: 130, imgX: 70, imgY: 250 },
    //           { url: res[3], imgW: 50, imgH: 50, imgX: 90, imgY: 285, isRadius: true },
    //           { url: res[4], imgW: 80, imgH: 80, imgX: 385, imgY: 280, isRadius: true },
    //           { url: res[5], imgW: 40, imgH: 50, imgX: 405, imgY: 295 },
    //           { url: res[6], imgW: 50, imgH: 50, imgX: 220, imgY: 630 },
    //         ],
    //         textList: [
    //           { string: this.data.userInfo.nickname, color: '#3478df', fontSize: '20', fontFamily: 'Arial', bold: false, textX: 165, textY: 300 },
    //           { string: 'Valid until:' + this.data.userInfo.expire_time, color: '#ffd149', fontSize: '20', fontFamily: 'Arial', bold: false, textX: 165, textY: 330 },
    //           { string: 'Words learned', color: '#3478df', fontSize: '20', fontFamily: 'Arial', bold: false, textX: 140, textY: 415 },
    //           { string: this.data.userInfo.learned_words, color: '#ff9a82', fontSize: '20', fontFamily: 'Arial', bold: false, textX: 410, textY: 415 },
    //           { string: 'City rescued', color: '#3478df', fontSize: '20', fontFamily: 'Arial', bold: false, textX: 140, textY: 485 },
    //           { string: this.data.userInfo.city_num, color: '#ff9a82', fontSize: '20', fontFamily: 'Arial', bold: false, textX: 410, textY: 485 },
    //           { string: 'You surpassed         of the defenders!', color: '#3478df', fontSize: '20', fontFamily: 'Arial', bold: false, textX: 100, textY: 555 },
    //           { string: this.data.userInfo.guard_num + '%', color: '#ff9a82', fontSize: '20', fontFamily: 'Arial', bold: false, textX: 240, textY: 555 },
    //           { string: this.data.userInfo.star, color: '#ffd149', fontSize: '26', fontFamily: 'Arial', bold: false, textX: 270, textY: 646 },
    //         ]
    //       }, res => {
    //         tool.loading_h();
    //         _this.setData({
    //           isState: true,
    //           posterImgUrl: res,
    //           canvasHidden: true
    //         })
    //         console.log("_this............", this.data.posterImgUrl)
    //         _this.saveImageToPhotosAlbum(this.data.posterImgUrl)
    //       })
    //     })
    // },
    // //将canvas生成的临时海报图片保存到手机相册
    // saveImageToPhotosAlbum(imgUrl) {
    //   let _this = this;
    //   wx.saveImageToPhotosAlbum({
    //     filePath: imgUrl,
    //     success(res) {
    //       setTimeout(() => {
    //         tool.alert("已保存到手机相册", "success")
    //         _this.setData({
    //           canvasHidden: false,
    //           isShare: true
    //         })
    //       }, 600)
    //     },
    //     fail() {
    //       tool.alert("保存失败")
    //     },
    //     complete() {
    //       tool.loading_h()
    //     }
    //   })
    // },
    
    //登录授权
    async onGotUserInfo({ detail }) {
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
      if(wx.getStorageSync('isPlay')){
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

    }
})
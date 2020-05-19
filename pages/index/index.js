//index.js
//获取应用实例
const app = getApp()
//mta腾讯统计相关
const mta = require('../../utils/mta_analysis.js')
//请求
import axios from '../../utils/axios/axios'
//tool 封装的一些方法
import tool from '../../utils/publics/tool.js'

Page({
  data: {
    /**
     * @Description :
     *   titles 头部三个图片名字
     *   buttons 底部三个按钮 icon图片名字 url按钮对应跳转的地址
     * @date 2019-07-30
     */
    isAuthorization: false,
    resourcesUrl: `${wx.getStorageSync("resourcesUrl")}/images/index/`,
    titles: ['page1_2', 'page1_4',],
    buttons: [
      { icon: 'page1_5', url: '/pages/map/index' },
      { icon: 'page1_6', url: '/pages/ranking/index' },
      { icon: 'page1_7', url: '/pages/city/index' },
    ],
    isShow: false,
    isBg: false, // 进入首页的背景故事
    isPlay: true, // 是否播放背景音乐
    times: 0, // 记录背景故事播放的时间 
    imgList: [
      { imgUrl: 'https://game.flyh5.cn/resources/game/wechat/szq/danci/images/index/img1.png' },
      { imgUrl: 'https://game.flyh5.cn/resources/game/wechat/szq/danci/images/index/img2.png' },
      { imgUrl: 'https://game.flyh5.cn/resources/game/wechat/szq/danci/images/index/img3.png' },
      { imgUrl: 'https://game.flyh5.cn/resources/game/wechat/szq/danci/images/index/img4.png' },
      { imgUrl: 'https://game.flyh5.cn/resources/game/wechat/szq/danci/images/index/img5.png' },
      { imgUrl: 'Ready ?    Go   !' }
    ],
    iswel: 0, // 视频轮播初始值
    loaded: false,
    isgid: false,
    isjoin: false,
    teamname: null
  },
  hiddenshow() {
    this.setData({ isgid: false });
  },
  //  第一次进入小程序 弹框
  rece: function () {
    this.setData({ isShow: false });
    wx.setStorageSync('isNo1', true);
    this.audios.play();
    tool.alert("领取成功");
    //  加载字体
    wx.loadFontFace({
      family: 'times',
      source: 'url("https://game.flyh5.cn/resources/game/wechat/szq/danci/fonts/times.ttf")',
      success(res) {
        console.log(res.status)
      },
      fail: function (res) {
        console.log(res.status)
      }
    });
  },
  //跳转页面
  handJumps({ currentTarget }) {
    this.audios.play();
    //没有登录则需要授权,反之直接跳转
    if (currentTarget.dataset.id == 1) {
      // this.isRdSession()
      let isUser = wx.getStorageSync('userInfo')
      if (!isUser) {
        this.setData({ isAuthorization: true })
        return false
      } else {
        wx.navigateTo({
          url: '/pages/map/index'
        })
        this.audioCtx2.pause();
      }
    } else {
      this.audioCtx2.pause();
      wx.navigateTo({
        url: currentTarget.dataset.url
      })
    }
    // if (!this.isRdSession()) return
    // wx.navigateTo({
    //     url: currentTarget.dataset.url
    // })
  },
  //是否授权
  // isRdSession() {
  //   let isUser = wx.getStorageSync('userInfo')
  //   if (!isUser) {
  //     this.setData({ isAuthorization: true })
  //     return false
  //   } else {
  //     wx.navigateTo({
  //       url: '/pages/map/index'
  //     })
  //     this.audioCtx2.pause();
  //   }
  // },
  //登录授权
  async onGotUserInfo({ detail }) {
    const { userInfo } = detail
    const { handCancel } = this
    let _this = this;
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
          _this.audioCtx2.pause();
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
    wx.navigateTo({ url: '/pages/map/index' })
    this.setData({ isAuthorization: false })
  },
  onLoad(options) {
    console.log(options)
    if (options.name != undefined) {
      var rdSession = wx.getStorageSync('rdSession');
      var _this = this;
      axios.post('Index/check_group', { rdSession: rdSession }).then(res => {
        console.log(res)
        if (res.data.code == 1) {
          axios.post('Index/get_group', { rdSession: rdSession, search_name: options.name }).then(res => {
            if (res.data.code == 1) {
              this.setData({ teamname: res.data.data.list[0].name, isgid: true });
              axios.post('Index/set_group', { rdSession: rdSession, g_id: options.newgid }).then(res => {
                if (res.data.code == 1) {
                  this.setData({ isgid: true });
                }
              });
            }
          })

          return;
        }
        if (res.data.code == 201) {
          this.setData({ isgid: true, isjoin: true });
          return;
        }
      })
    }
    // console.log('optionssss',options)
    //  判断是不是第一次进入小程序
    if (!wx.getStorageSync('isNo1')) {
      this.setData({ isShow: true })
    }
    //  判断是不是第一次加载  如果是第一次加载就显示背景故事和背景音乐
    // 刷新页面的时候 在app.js里面第一次加载会默认为true
    this.setData({ isBg: wx.getStorageSync('isBg') })
    if (wx.getStorageSync('isBg')) {
      // this.audioCtx1 = wx.createAudioContext('myAudios1');
      // this.audioCtx1.play();
      //  用来判断是否播放所有页面的背景音乐 默认播放
      wx.setStorageSync('isPlay', true);
    }
    // this.data.timer = setInterval(this.times, 1500);
    this.statistics()
    if (options.shareId) {
      wx.setStorageSync('shareId', options.shareId);
      const rdSession = wx.getStorageSync('rdSession')
      axios.get('Index/set_expire1', { rdSession: rdSession }).then(res => {
        app.login(() => {
          //需要openid的函数
        })
      })

    } else {
      app.login(() => {
        //需要openid的函数
      })
    }

  },
  times: function () {
    if (this.data.times < 5) {
      this.data.times++;
      this.setData({ iswel: this.data.times });
    } else {
      // console.log('播放完毕')
      clearInterval(this.data.timer)
      this.setData({ isBg: false })
      wx.setStorageSync('isBg', false)
      this.audioCtx1.pause();
    }
    // console.log('iiii',this.data.times)
  },
  // 跳过背景故事
  skip: function () {
    clearInterval(this.data.timer)
    this.setData({ isBg: false })
    wx.setStorageSync('isBg', false)
    this.audioCtx1.pause();
  },
  //  暂停背景音乐
  pause: function () {
    this.audioCtx2.pause();
    this.setData({ isPlay: false })
    wx.setStorageSync('isPlay', false);
  },
  //  播放背景音乐
  play: function () {
    this.audioCtx2.play();
    this.setData({ isPlay: true })
    wx.setStorageSync('isPlay', true);
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },
  onShow: function () {
    this.audios = wx.createInnerAudioContext();
    this.audios.src = wx.getStorageSync('resourcesUrl') + '/images/index/click.mp3';
    this.audioCtx2 = wx.createAudioContext('myAudios2');
    if (wx.getStorageSync('isPlay')) {
      this.audioCtx2.play();
      this.setData({ isPlay: true })
    } else {
      this.setData({ isPlay: false })
    }
    this.setData({ isgid: false })
  },
  //腾讯统计
  statistics() {
    mta.Page.init()
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

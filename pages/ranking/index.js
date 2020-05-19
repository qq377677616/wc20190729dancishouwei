// pages/ranking/index.js
import axios from '../../utils/axios/axios'
import tool from '../../utils/publics/tool.js'


Page({

  /**
   * 页面的初始数据
   */
  data: {
    /**
     * @Description :
     * list1 大洲排行前三rink信息
     * list2 好友排行前三rink信息
     * myRink 我的rink信息
     * otherRink 除去前三的rink信息
     * totalRank 个人排行信息
     * friendRank 好友排行信息
     * activeStd 两种rink排行榜切换状态 false:totalRank true:friendRank
     * isStar 控制弹窗显示 ==1 显示获取星星  ==2 显示分组弹窗
     * @date 2019-08-01
     */
    resourcesUrl: `${wx.getStorageSync("resourcesUrl")}/images/Mycity/`, //图片公共地址
    //  大洲排行榜前三
    list1: [
      { avatarBg: 'page20_15', name: '', avatar: '', star: '' },
      { avatarBg: 'page20_18', name: '', avatar: '', star: '' },
      { avatarBg: 'page20_19', name: '', avatar: '', star: '' },
    ],
    //   好友排行榜前三
    list2: [
      { avatarBg: 'page20_15', name: '', avatar: '', star: '' },
      { avatarBg: 'page20_18', name: '', avatar: '', star: '' },
      { avatarBg: 'page20_19', name: '', avatar: '', star: '' },
    ],
    isLoad1: false,
    isLoad2: false,
    user1: {}, // 大洲排行榜 当前用户信息
    user2: {},// 好友排行榜 当前用户信息
    //  当前用户排行信息
    myRink: {},
    //  去除前三的大洲排行榜信息
    otherRink: [],
    //  去除前三的好友排行榜信息
    tList: [],
    fList: [],
    goodRink: [],
    friendRank: [],
    totalRank: [],
    activeStd: false,
    // 控制分组弹框
    isStar: 0,
    lists1: [],
    lists2: [],
    inputVal: '',
    gid: 0,
    isshow: true,
    isshows: true,
    rname: null,
    isExit: false, // 退出分组弹框
    warning: false,
    newgid: null
  },
  // pages/city/index
  opencity(){

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let isUser = wx.getStorageSync('userInfo')
    if (!isUser) {
      this.setData({ isAuthorization: true })
      return false
    } else {
      return true
    }
  },

  //输入用户
  nameinput(e) {
    this.setData({ rname: e.detail.value, warning: false });
  },
  // 提交分组信息
  creater: function () {
    this.audios.play();
    let _this = this;
    if (this.data.rname.replace(/\s+/g, "") == '') {
      tool.alert("请输入战队名称")
      return;
    }
    tool.loading();
    let rdSession = wx.getStorageSync('rdSession');
    axios.post('Index/create_team', { rdSession: rdSession, name: this.data.rname }).then(res => {
      console.log(res)
      tool.loading_h();
      if (res.data.status == 1) {
        setTimeout(() => {
          _this.onReady();
          _this.setData({ isStar: 4, newgid: res.data.data.g_id, rname: null });
        }, 1000);
        return;
      }
      if (res.data.status == 202) {
        this.setData({ warning: true });
        return;
      }
    })
  },
  alertsopen() {
    console.log('弹窗')
    this.setData({ isStar: 3 });
  },
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
    this.audios.play();
    this.setData({ isAuthorization: false })
  },
  //  打开下拉列表
  open: function () {
    this.setData({
      isshow: false
    })
  },
  //  选择列表数据
  select: function (e) {
    this.setData({
      inputVal: e.currentTarget.dataset.name,
      isshow: true,
      isshows: true,
      gid: e.currentTarget.dataset.id
    })
  },
  // 通过文本输入的信息获取相应内容
  getInput: function (e) {
    let val = e.detail.value;
    this.setData({
      inputVal: val,
      isshow: true,
      isshows: false
    })
    if (val != '') {
      let _this = this;
      let rdSession = wx.getStorageSync('rdSession');
      axios.post('Index/get_group', { rdSession: rdSession, search_name: val }).then(res => {
        if (res.data.code == 1) {
          _this.setData({
            lists2: res.data.data.list
          })
        }
      })
    } else {
      this.setData({
        lists2: [],
        isshows: true
      })
    }
  },
  // 提交分组信息
  submit: function () {
    this.audios.play();
    let _this = this;
    let rdSession = wx.getStorageSync('rdSession');
    tool.loading();
    if (!this.data.gid){
      tool.alert("请选择战队名称");
      return;
    }
    axios.post('Index/set_group', { rdSession: rdSession, g_id: this.data.gid }).then(res => {
      tool.loading_h();
      if (res.data.code == 1) {
        this.setData({ gid: null, inputVal:''});
        setTimeout(() => {
          _this.onReady();
          //  获取分组信息
          axios.post('Index/get_group', { rdSession: rdSession, search_name: this.data.rname }).then(res => {
            if (res.data.data != undefined) {
              _this.setData({
                lists1: res.data.data.list,
              })
            }
          })
          this.setData({
            isStar: 0
          })
        }, 1000)
      }
    })
  },
  // 退出分组弹窗
  exit_group: function () {
    this.audios.play();
    this.setData({ isExit: true })
  },
  canel: function () {
    this.audios.play();
    this.setData({ isExit: false })
  },
  //  退出分组
  exit: function () {
    let _this = this;
    this.audios.play();
    // this.switching();
    let rdSession = wx.getStorageSync('rdSession');
    axios.post('Index/exit_group', { rdSession: rdSession }).then(res => {
      if (res.data.code == 1) {
        tool.alert("已退出分组")
        console.log('退出分组')
        this.initDataList();
        this.setData({ isExit: false, activeStd:false });
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let _this = this;
    let rdSession = wx.getStorageSync('rdSession');
    axios.post('Index/check_group', { rdSession: rdSession }).then(res => {
      if (res.data.code == 201) {
        _this.switching();
      }
    })
    this.initDataList()
  },
  //切换排行
  switching: function (check) {
    let tRank = {}, fRank = {}, mRink = {}
    this.audios.play();
    let _this = this;
    let rdSession = wx.getStorageSync('rdSession');
    //  判断是否已设置分组
    axios.post('Index/check_group', { rdSession: rdSession }).then(res => {
      console.log(res);
      if (res.data.code == 1) {
        _this.setData({
          isStar: 2
        });
      } else if (res.data.code == 201) {
        console.log(this.data);
        // _this.onReady();

        //  好友排行榜信息 
        axios.get('Index/get_rank_list', { rdSession: rdSession, type: 2, page: 1 }).then(res => {

          fRank = res.data.data || false
          _this.setData({
            tList: tRank,
            user2: res.data.user
          })
          // 如果拿到了数据
          if (fRank) {
            //  如果数据长度大于2  
            if (fRank.length > 2) {
              // 把除了前三的数据拿出来
              _this.setData({ fList: fRank.slice(3, fRank.length) })
            }
          }
          const { activeStd, totalRank, friendRank } = this.data
          let data = !activeStd ? friendRank : totalRank
          console.log(totalRank, friendRank)
          //判断是否有数据 没有数据则不让切换
          console.log(!data)
          if (!data) {
            // tool.alert('暂无数据')
            return
          }
          if (!activeStd) {
            this.setTop(_this.data.tList)
            this.setData({ myRink: this.data.user2 })

          } else {
            this.setTops(_this.data.fList)
            this.setData({ myRink: this.data.user1 })
          }
          this.setTop(data)
          this.setData({ activeStd: !activeStd })
        });

      }
    })

    // let rdSession = wx.getStorageSync('rdSession');
    // axios.post('Index/get_user_info', { rdSession: rdSession, type: 1 }).then(res => {
    //   console.log("ressssss333", res)
    // })
  },
  //初始化数据
  async initDataList() {
    const rdSession = wx.getStorageSync('rdSession')
    let tRank = {}, fRank = {}, mRink = {}
    let _this = this;
    //   大洲排行榜信息
    await axios.get('Index/get_rank_list', { rdSession: rdSession, type: 1, page: 1 }).then(res => {
      tRank = res.data.data || false
      _this.setData({
        tList: tRank,
        user1: res.data.user
      });
      mRink = res.data.user
      // 如果拿到了数据
      if (tRank) {
        //  如果数据长度大于2  
        if (tRank.length > 2) {
          // 把除了前三的数据拿出来
          _this.setData({ otherRink: tRank.slice(3, tRank.length) })
        }
      }
    });
    //  好友排行榜信息 
    await axios.get('Index/get_rank_list', { rdSession: rdSession, type: 2, page: 1 }).then(res => {
      console.log('获取好友排行', res)
      fRank = res.data.data || false
      _this.setData({
        tList: tRank,
        user2: res.data.user
      })
      // 如果拿到了数据
      if (fRank) {
        //  如果数据长度大于2  
        if (fRank.length > 2) {
          // 把除了前三的数据拿出来
          _this.setData({ fList: fRank.slice(3, fRank.length) })
        }
      }
    })
    this.setTop(tRank)
    this.setTops(fRank)
    // this.setOtherRink(tRank)
    // this.setTopThree(tRank)

    this.setData({
      myRink: mRink,
      totalRank: tRank,
      friendRank: fRank
    })
  },
  //  大洲
  setTop(tRank) {
    if (!this.data.isLoad1) {
      let { list1 } = this.data;
      this.setData({ isLoad1: true });
      // let topThree = item;
      // 因为第一名是在中间 所以需要调换位置 模板循环 把第一名放在数组第二个的位置 利用map + 解构赋值
      if (tRank.length > 1) {
        let sum = tRank.length > 2 ? 3 : tRank.length;
        for (let i = 0; i < sum; i++) {
          list1[i].avatar = tRank[i].avatarurl;
          list1[i].name = tRank[i].nickname;
          list1[i].star = tRank[i].star;
        }
        //  第一个和第二个位置互换
        let temp = list1[0];
        list1[0] = list1[1];
        list1[1] = temp;
      } else {
        //  判断数据是否为空
        if (tRank.length) {
          let temp = list1[1].avatarBg;
          list1[1].avatarBg = list1[0].avatarBg;
          list1[0].avatarBg = temp;
          list1[1].avatar = tRank[0].avatarurl;
          list1[1].name = tRank[0].nickname;
          list1[1].star = tRank[0].star;
        }
      }
      // list1[0] = list1.splice(1, 1, list1[0])[0];
      console.log('itemmmmmmmm11111', tRank, list1)
      this.setData({ list1: list1 })
    }
  },
  // 好友
  setTops(fRank) {
    let { list2 } = this.data;
    // this.setData({ isLoad2: true });
    // let topThree = item;
    // 因为第一名是在中间 所以需要调换位置 模板循环 把第一名放在数组第二个的位置 利用map + 解构赋值
    if (fRank.length > 1) {
      let sum = fRank.length > 2 ? 3 : fRank.length;
      for (let i = 0; i < sum; i++) {
        list2[i].avatar = fRank[i].avatarurl;
        list2[i].name = fRank[i].nickname;
        list2[i].star = fRank[i].star;
      }
      //  第一个和第二个位置互换
      let temp = list2[0];
      list2[0] = list2[1];
      list2[1] = temp;
    } else {
      //  判断数据是否为空
      if (fRank.length) {
        let temp = list2[1].avatarBg;
        list2[1].avatarBg = list2[0].avatarBg;
        list2[0].avatarBg = temp;
        list2[1].avatar = fRank[0].avatarurl;
        list2[1].name = fRank[0].nickname;
        list2[1].star = fRank[0].star;
      }
    }
    // list2[0] = list2.splice(1, 1, list2[0])[0];
    console.log('itemmmmmmmm22222', fRank, list2)
    this.setData({ list2: list2 })
  },
 
  starEnergy: function () {
    this.audios.play();
    this.setData({
      isStar: 1
    })
  },
  close: function () {
    this.audios.play();
    this.setData({
      isStar: 0
    })
  },
  share: function () {  // 分享赠送星星
    // 拿到登录状态
    let rdSession = wx.getStorageSync('rdSession');
    axios.post('Index/set_expire', { rdSession: rdSession }).then(res => { })
  },
  //  返回主页
  goUrl: function () {
    this.audios.play();
    wx.redirectTo({ url: '/pages/index/index?isBg=true' })
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
      title: this.data.isStar == 4 ? '单词总动员Word Defender' : '你收到好友赠送的5颗星能量哦。',
      // desc: '分享页面的内容',
      imageUrl: this.data.isStar == 4 ? this.data.resourcesUrl + 'shareimg01.jpg' : this.data.resourcesUrl + 'shareImg.png',
      path: this.data.isStar == 4 ? 'pages/index/index?name=' + this.data.rname + '&newgid=' + this.data.newgid : '/pages/Achievements/index?num=5&userid=' + wx.getStorageSync('rdSession') // 路径，传递参数到指定页面。
    }
  }
})
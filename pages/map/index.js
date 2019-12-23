// pages/map/index.js
import tool from '../../utils/publics/tool.js'
import axios from '../../utils/axios/axios'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    curShut: 1,//当前关卡数
    point: 1, // 已开通的大洲
    resourcesUrl: `${wx.getStorageSync("resourcesUrl")}/images/map/`, 
    imgList:[
      { offIcon:'page2_5.png',onIcon:'page2_4.png', url:'/pages/mapdetailed/asia/index',zm:'ASIA'},
      { offIcon: 'page2_11.png', onIcon: 'page2_10.png', url: '/pages/mapdetailed/europe/index', zm: 'EUROPE'},
      { offIcon: 'page2_7.png', onIcon: 'page2_6.png', url: '/pages/mapdetailed/northamerica/index', zm: 'NORTH AMERICA'},
      { offIcon: 'page2_9.png', onIcon: 'page2_8.png', url: '/pages/mapdetailed/africa/index', zm: 'AFRICA'},
    ],
    leftWidth: 240, // 当前页面默认滚动位置
    repeat: true, // 防止重复选择关卡
    pot: 0, // 当前飞机坐标点
    isShow: false,
  },
  //  第一次进入小程序 弹框
  rece: function () {
    this.setData({ isShow: false });
    wx.setStorageSync('isNo1', true);
    this.audios.play();
    tool.alert("领取成功");
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //  判断是不是第一次进入小程序
    if (!wx.getStorageSync('isNo1')) {
      this.setData({ isShow: true })
    }
    this.audios = wx.createInnerAudioContext();
    this.audios.src = wx.getStorageSync('resourcesUrl') + '/images/index/click.mp3';
    let _this = this;
    let rdSession = wx.getStorageSync('rdSession');
    //  获取当前过关的大洲
    axios.post('Index/get_route', { rdSession: rdSession }).then(res => {
      if(res.data.data.type == 2){
        let width = res.data.data.sum == 1 ? 240 : res.data.data.sum == 2 ? 0 : res.data.data.sum == 3 ? 650 : 0;
        _this.setData({
          curShut: res.data.data.sum,
          point: res.data.data.sum,
          leftWidth: width
        })
        //  赋值当前飞机距离屏幕左边的坐标点
        //创建节点选择器
        var query = wx.createSelectorQuery();
        //选择id
        let ids = '#icon' + res.data.data.sum;
        query.select(ids).boundingClientRect()
        query.exec(function (res) {
          //res就是 所有标签为mjltest的元素的信息 的数组
          _this.setData({ pot: res[0].left })
        })
      }else{
        _this.setData({
          curShut: 4,
          point: 4
        })
      }
      
      let { curShut } = _this.data;
      // tool.alert(`第${curShut}关`)
    })
  },
  goToDetailed(e){
    this.audios.play();
    this.audioCtx2.pause();
    let _this = this;
    // 防止重复点击
    if (this.data.repeat) {
      this.data.repeat = false;
      if (this.data.point < e.currentTarget.dataset.index){
        this.data.repeat = true;
        return ;
      }
      //创建节点选择器
      var query = wx.createSelectorQuery();
      //选择id
      let ids = '#' + e.currentTarget.id;
      let points = 0;
      query.select(ids).boundingClientRect()
      query.exec(function (res) {
        //res就是 所有标签为mjltest的元素的信息 的数组
        points = res[0].left;
        // 判断当前飞机的坐标距离屏幕左边的距离 是否大于点击的坐标距离
        if (_this.data.pot >= points) {
          _this.setData({
            leftOrRightClass: 'position-right',
            pot: points
          })
        } else {
          _this.setData({
            leftOrRightClass: 'position-left',
            pot: points
          })
        }
        let times = _this.data.curShut == e.currentTarget.dataset.index ? 50 : 1500;
        _this.setData({ curShut: e.currentTarget.dataset.index })
        let timer = setTimeout(() => {
          let name = e.currentTarget.dataset.name;
          wx.setStorageSync('state', name)
          wx.navigateTo({ url: e.currentTarget.dataset.url })
          _this.data.repeat = true;
          clearTimeout(timer)
        }, times)
      })
    }
    
    // if (this.data.curShut != e.currentTarget.dataset.index) {
    //   console.log(this.data.curShut, '!=',e.currentTarget.dataset.index)
    //   this.setData({ curShut: e.currentTarget.dataset.index })
    //   let timer = setTimeout(() => {
    //     let name = e.currentTarget.dataset.name;
    //     wx.setStorageSync('state', name)
    //     wx.navigateTo({ url: e.currentTarget.dataset.url })
    //     clearTimeout(timer)
    //   }, 2000)
    // }else{
    //   console.log(this.data.curShut, '==', e.currentTarget.dataset.index)
    //   let name = e.currentTarget.dataset.name;
    //   wx.setStorageSync('state', name)
    //   wx.navigateTo({ url: e.currentTarget.dataset.url })
    // }
    
  },
  //过关
  passThrough() {
    // let { curShut } = this.data
    // if (curShut >= 4) return
    // this.setData({ curShut: ++curShut})
    // tool.alert(`第${curShut}关`)
    this.audios.play();
    wx.navigateBack({})
  },
  onShow(){
    this.audioCtx2 = wx.createAudioContext('myAudios2');
    if (wx.getStorageSync('isPlay')) {
      this.audioCtx2.play();
    }
    
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
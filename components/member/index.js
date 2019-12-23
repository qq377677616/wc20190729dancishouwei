// components/topicHerd/index.js
import axios from '../../utils/axios/axios'
import tool from '../../utils/publics/tool.js'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    
  },

  /**
   * 组件的初始数据
   */
  data: {
    resourcesUrl: `${wx.getStorageSync("resourcesUrl")}/images/Mycity/`, //图片公共地址
    memberList: [
      { icon: 'page19_22', timer: 'page19_18' },
      { icon: 'page19_22', timer: 'page19_18' },
      { icon: 'page19_23', timer: 'page19_18' },
      { icon: 'page19_24', timer: 'page19_18' },
    ],
    lists: [{ time: 12, money: 0.01 }, { time: 6, money: 0.01 }, { time: 3, money: 0.01 }],
    isPlay: false,
    isShows: false,
    isShow: true,

  },
  properties: {
    datas: Object,
    // cityName: String
  },
  onLoad: function () {
    console.group('mounted 挂载结束状态===============》');
  },
  /**
   * 组件的方法列表
   */
  methods: {
    join_now:function(){
      this.setData({ isShow: false })
      if(!this.data.isPlay){
        let _this = this;
        let rdSession = wx.getStorageSync('rdSession');
        axios.post('Index/get_pay_set', { rdSession: rdSession }).then(res => {
          console.log('ressssss', res)
          _this.setData({
            lists: res.data.data,
            isPlay: true
          })
        })
      }
    },
    play: function (e) {
      console.log('eeeeeeeeee', e)
      let _this = this;
      let rdSession = wx.getStorageSync('rdSession');
      let money = e.currentTarget.dataset.money;
      let day = e.currentTarget.dataset.day;
      axios.post('Index/pay', { rdSession: rdSession, price: money, day: day }).then(res => {
        if (res.data.code == 1) {
          console.log('ressssssssssssss', res.data.data)
          wx.requestPayment({
            timeStamp: res.data.data.timeStamp,
            nonceStr: res.data.data.nonceStr,
            package: res.data.data.package,
            signType: res.data.data.signType,
            paySign: res.data.data.paySign,
            success(res) {
              tool.alert("充值成功");
              _this.setData({ isShow: true, isShows: true })
            },fail(res) { }
          })
        }
      })
    },
    del: function () {
      this.setData({
        isShow: true
      })
    },
    canel:function(){
      this.setData({isShows:true})
    }
  }
})

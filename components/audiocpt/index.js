// components/audiocpt/index.js
const app = getApp();
Component({
  pageLifetimes: {
    show: function() {
      // 页面被展示
    },
    hide: function() {
      // 页面被隐藏
    },
    resize: function(size) {
      // 页面尺寸变化
    }
  },
  /**
   * 组件的属性列表
   */
  properties: {
    audioUrl:{
      type:String,
      value:''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    resourcesUrl: `${wx.getStorageSync("resourcesUrl")}/images/subject/one/`,
    innerAudioContext:app.globalData.audioObj
  },

  /**
   * 组件的方法列表
   */
  methods: {

  },
  observers:{
    'audioUrl'(){
      console.log(this.properties.audioUrl)
    }
  }
})

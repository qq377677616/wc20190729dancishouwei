// components/prompt/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isShow:Boolean,
    star: Number
  },

  /**
   * 组件的初始数据
   */
  data: {
    resourcesUrl: `${wx.getStorageSync("resourcesUrl")}/images/subject/one/`
  },

  /**
   * 组件的方法列表
   */
  methods: {
    yes:function(){
      this.triggerEvent('click')
    },
    no:function(){
      this.triggerEvent('clicks')
    }
  }
})

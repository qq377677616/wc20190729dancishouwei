// components/showModal/showModal.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    container: {
      type: Object,
      value: {
        isShow: false,
        title: "确认",
        test: "删除当前图片将不可恢复，确认是否删除？",
        cancelText: "取消",
        confirmText: "确定",
        color_confirm: 'red'
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    operation(e) {
      let options = { confirm : true}
      if (e.currentTarget.dataset.type == 0) {
        options.confirm = false
      }
      this.triggerEvent("operation", options)  
    }
  }
})

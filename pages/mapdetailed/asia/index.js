// pages/mapdetailed/asia/index.js
import '../subjectmap'
import {subjectMap} from "../subjectmap"
import axios from '../../../utils/axios/axios'
Page({

    /**
     * 页面的初始数据
     */

    data: {
        /**
         * @Description :
         *  inverted 正常需要转头的关卡
         *  leftOrRightClass 当前飞机转向类
         *  resourcesUrl 图片地址
         *  key 当前关卡
         *  activeIndex 当前选中的关卡(index)
         *  dataList 单词 图片名字 ( 顺序不能改变 )
         * @date 2019-07-29
        */
        inverted: [3, 7, 9, 12, 13, 18],
        leftOrRightClass: 'position-right',
        resourcesUrl: `${wx.getStorageSync("resourcesUrl")}/images/mapdetailed/asia/`,
        repeat: true, // 防止重复选择关卡
        key: 0,
        activeIndex: 0, 
        dataList: [
            'page3_63', 'page3_60', 'page3_62', 'page3_64', 'page3_66',
            'page3_61', 'page3_56', 'page3_65', 'page3_67', 'page3_50',
            'page3_49', 'page3_47', 'page3_57', 'page3_58', 'page3_59',
            'page3_51', 'page3_55', 'page3_52', 'page3_53', 'page3_54',
            'page3_46', 'page3_48'
        ],
        indexs: 1000, // 选中气球变色
        //  保存当前已通关的城市
        cityList:[],
        leftWidth: 560, // 当前页面默认滚动位置
    },
    back(){
      wx.navigateBack({})
    },
    //移动事件
    passThrough({currentTarget}) {
      let _this = this;
      if(this.data.repeat){
        this.data.repeat = false;
        const { inverted, key } = this.data;
        let dataIndex = currentTarget.dataset.index;
        wx.setStorageSync('poindex', dataIndex)
        if (dataIndex > this.data.activeIndex) {
          this.data.repeat = true;
          return;
        }
        // console.log('是否要正常砖头===》', inverted.includes(dataIndex), dataIndex - key)
        if (inverted.includes(dataIndex) && dataIndex - key === 1) { //判断是否需要转头,正常移动情况下
          this.setData({
            leftOrRightClass: 'position-left'
          })
        } else {
          // console.log('左右掉头=====》', dataIndex, '<', key)
          if (dataIndex < key) { //判断不连续移动下的 左右移动 掉头操作
            this.setData({
              leftOrRightClass: 'position-left'
            })
          } else {
            this.setData({
              leftOrRightClass: 'position-right'
            })
          }
        }
        this.setData({ key: currentTarget.dataset.index, indexs: dataIndex })
        //  如果选择的是第一关就把定时器的时间缩短
        let times = dataIndex == key ? 50 : 1500;
        let timer = setTimeout(() => { // 气球点亮延迟
          // this.setData({activeIndex: this.data.key})
          // 拿到登录状态
          let rdSession = wx.getStorageSync('rdSession');
          // 拿到当前点击的城市ID
          let cityId = currentTarget.dataset.id;
          // 在本地存入城市ID
          wx.setStorageSync('cityId', cityId);
          // 在本地存入答题分数
          wx.setStorageSync('score', 0);
          // 在本地存入城市名
          wx.setStorageSync('cityName', this.data.cityList[dataIndex].k + ' ' + this.data.cityList[dataIndex].city);
          //  在本地存入答题数
          wx.setStorageSync('anumber', 0);
          //  在本地存入小怪兽的血条数量 默认为3
          wx.setStorageSync('lifebar', 9)
          //  获取下一题的题型  
          axios.post('Index/get_question', { rdSession: rdSession, cityid: cityId }).then(res => {
            let ids = res.data.data.id;
            _this.setData({datas:res.data.data})
            if (!res.data.data.user.is_ball){ 
              if (res.data.data.typeid == 1) {
                wx.redirectTo({ url: '/pages/subject/four/index?id=' + ids })
              } else if (res.data.data.typeid == 2) {
                wx.redirectTo({ url: '/pages/subject/one/index?id=' + ids })
              } else if (res.data.data.typeid == 3) {
                wx.redirectTo({ url: '/pages/subject/two/index?id=' + ids })
              } else if (res.data.data.typeid == 4) {
                wx.redirectTo({ url: '/pages/subject/eight/index?id=' + ids })
              } else if (res.data.data.typeid == 5) {
                wx.redirectTo({ url: '/pages/subject/eleven/index?id=' + ids })
              } else if (res.data.data.typeid == 6) {
                wx.redirectTo({ url: '/pages/subject/fives/index?id=' + ids })
              } else if (res.data.data.typeid == 7) {
                wx.redirectTo({ url: '/pages/subject/twelve/index?id=' + ids })
              } else if (res.data.data.typeid == 8) {
                wx.redirectTo({ url: '/pages/subject/six/index?id=' + ids })
              } else if (res.data.data.typeid == 9) {
                wx.redirectTo({ url: '/pages/subject/seven/index?id=' + ids })
              } else if (res.data.data.typeid == 10) {
                wx.redirectTo({ url: '/pages/subject/nine/index?id=' + ids })
              } else if (res.data.data.typeid == 11) {
                wx.redirectTo({ url: '/pages/subject/three/index?id=' + ids })
              } else if (res.data.data.typeid == 12) {
                wx.redirectTo({ url: '/pages/subject/ten/index?id=' + ids })
              }
            }
          })
          // wx.redirectTo({ url: '/pages/subject/twelve/index?id=' + 4147 })
          this.data.repeat = true;
          clearTimeout(timer)
        }, times)
      }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      let rdSession = wx.getStorageSync('rdSession');
      let state = wx.getStorageSync('state');
      let _this = this;
      axios.post('Index/get_city', { rdSession: rdSession, state: state }).then(res => {
        //console.log("ressssss",res)
        let width = res.data.data.num < 10 ? 560 : res.data.data.num < 19 ? 260 : 0;
        _this.setData({
          key: res.data.data.num - 1,
          activeIndex:res.data.data.num,
          cityList: res.data.data.list,
          leftWidth: width
        })
        if (options.ids > 0) {
          //  如果大于数组长度  就是最后一关
          if (options.ids <= res.data.data.list.length){
            //console.log('optionsssssssss',options.ids)
            // 在本地存入答题分数
            wx.setStorageSync('score', 0);
            this.automatic(options.ids, res.data.data.list[options.ids].id)
          }
        }
      })
      
    },
    //移动事件
    automatic:function(index,cityId) {
      console.log('indexxxxxxxxx', index, cityId)
      const { inverted, key } = this.data
      let dataIndex = index
      //console.log("this.data.activeIndex", this.data.activeIndex, "dataIndex", dataIndex)
      wx.setStorageSync('poindex', Number(dataIndex))
      if (dataIndex > this.data.activeIndex) {
        return;
      }
      if (dataIndex > 0) {
        if (key === dataIndex) return //是否多次点击
      }

      //console.log('是否要正常砖头===》', inverted.includes(dataIndex), dataIndex - key)
      if (inverted.includes(dataIndex) && dataIndex - key === 1) { //判断是否需要转头,正常移动情况下
        this.setData({
          leftOrRightClass: 'position-left'
        })
      } else {
        ////console.log('左右掉头=====》', dataIndex, '<', key)
        if (dataIndex < key) { //判断不连续移动下的 左右移动 掉头操作
          this.setData({
            leftOrRightClass: 'position-left'
          })
        } else {
          this.setData({
            leftOrRightClass: 'position-right'
          })
        }
      }
      this.setData({ key: index })
      //  如果选择的是第一关就把定时器的时间缩短
      let times = dataIndex == key ? 50 : 1500;
      let timer = setTimeout(() => { // 气球点亮延迟
        // this.setData({activeIndex: this.data.key})
        // 拿到登录状态
        let rdSession = wx.getStorageSync('rdSession');
        // 在本地存入城市ID
        wx.setStorageSync('cityId', cityId);
        // 在本地存入答题分数
        wx.setStorageSync('score', 0);
        // 在本地存入城市名
        wx.setStorageSync('cityName', this.data.cityList[dataIndex].k + ' ' + this.data.cityList[dataIndex].city);
        //  在本地存入答题数
        wx.setStorageSync('anumber', 0);
        //  在本地存入小怪兽的血条数量 默认为3
        wx.setStorageSync('lifebar', 9)
        this.audioCtx2.pause();
        //  获取下一题的题型  
        axios.post('Index/get_question', { rdSession: rdSession, cityid: cityId }).then(res => {
          //console.log("ressssss", res)
          let ids = res.data.data.id;
          if (res.data.data.typeid == 1) {
            wx.redirectTo({ url: '/pages/subject/four/index?id=' + ids })
          } else if (res.data.data.typeid == 2) {
            wx.redirectTo({ url: '/pages/subject/one/index?id=' + ids })
          } else if (res.data.data.typeid == 3) {
            wx.redirectTo({ url: '/pages/subject/two/index?id=' + ids })
          } else if (res.data.data.typeid == 4) {
            wx.redirectTo({ url: '/pages/subject/eight/index?id=' + ids })
          } else if (res.data.data.typeid == 5) {
            wx.redirectTo({ url: '/pages/subject/eleven/index?id=' + ids })
          } else if (res.data.data.typeid == 6) {
            wx.redirectTo({ url: '/pages/subject/fives/index?id=' + ids })
          } else if (res.data.data.typeid == 7) {
            wx.redirectTo({ url: '/pages/subject/twelve/index?id=' + ids })
          } else if (res.data.data.typeid == 8) {
            wx.redirectTo({ url: '/pages/subject/six/index?id=' + ids })
          } else if (res.data.data.typeid == 9) {
            wx.redirectTo({ url: '/pages/subject/seven/index?id=' + ids })
          } else if (res.data.data.typeid == 10) {
            wx.redirectTo({ url: '/pages/subject/nine/index?id=' + ids })
          } else if (res.data.data.typeid == 11) {
            wx.redirectTo({ url: '/pages/subject/three/index?id=' + ids })
          } else if (res.data.data.typeid == 12) {
            wx.redirectTo({ url: '/pages/subject/ten/index?id=' + ids })
          }
        })
        // wx.navigateTo({url:'/pages/subject/one/index'})
        clearTimeout(timer)
      }, times)
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        this.pageInit();
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
      this.audioCtx2 = wx.createAudioContext('myAudios2');
      if (wx.getStorageSync('isPlay')) {
        this.audioCtx2.play();
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

    },

    pageInit() {
        // this.setData({ resourcesUrl: `${wx.getStorageSync("resourcesUrl")}/images/mapdetailed/asia/` })
    }
})
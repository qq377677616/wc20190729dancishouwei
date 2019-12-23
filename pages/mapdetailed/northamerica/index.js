import axios from '../../../utils/axios/axios'
Page({

    /**
     * 页面的初始数据
     */
    data: {
      resourcesUrl: `${wx.getStorageSync("resourcesUrl")}/images/northamerica/`,
      imgList: ['page5_14.png','page5_15.png','page5_16.png','page5_17.png','page5_18.png','page5_19.png'],
      timeoutNum: 0,//延迟变亮处理 
      leftList: [863,856,614,371,39,140],
      rotate: 0,
      repeat: true, //防止重复选择关卡
      activeIndex: 0,
      inverted: [5],
      key: 0,
      cityList: [],
      leftWidth: 180, // 当前页面默认滚动位置     
      point: 0, // 当前飞机坐标点 
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      let rdSession = wx.getStorageSync('rdSession');
      let state = wx.getStorageSync('state');
      let _this = this;
      axios.post('Index/get_city', { rdSession: rdSession, state: state }).then(res => {
        console.log("ressssss", res)
        let width = res.data.data.num < 5 ? 180 : 0;
        _this.setData({
          key: res.data.data.num,
          activeIndex: res.data.data.num,
          cityList: res.data.data.list,
          leftWidth: width
        })
        if (options.ids > 0) {
          //  如果大于数组长度  就是最后一关
          if (options.ids <= res.data.data.list.length) {
            this.automatic(options.ids, res.data.data.list[options.ids].id)
          }
        }
        //  赋值当前飞机距离屏幕左边的坐标点
        //创建节点选择器
        var query = wx.createSelectorQuery();
        //选择id
        let ids = '#icon' + res.data.data.num;
        query.select(ids).boundingClientRect()
        query.exec(function (res) {
          //res就是 所有标签为mjltest的元素的信息 的数组
          _this.setData({ point: res[0].left })
        })
      })
    },
    passThrough({ currentTarget }) {
      if (this.data.repeat){
        this.data.repeat = false;
        const { inverted, key } = this.data
        let _this = this;
        let dataIndex = currentTarget.dataset.index
        if (dataIndex > this.data.activeIndex) {
          this.data.repeat = true;
          return;
        }
        //创建节点选择器
        var query = wx.createSelectorQuery();
        //选择id
        let ids = '#icon' + dataIndex;
        let points = 0;
        query.select(ids).boundingClientRect()
        query.exec(function (res) {
          //res就是 所有标签为mjltest的元素的信息 的数组
          points = res[0].left;
          // 判断当前飞机的坐标距离屏幕左边的距离 是否大于点击的坐标距离
          if (_this.data.point > points) {
            _this.setData({
              leftOrRightClass: 'position-right',
              point: points
            })
          } else {
            _this.setData({
              leftOrRightClass: 'position-left',
              point: points
            })
          }
          _this.setData({ key: currentTarget.dataset.index })
          //  如果选择的是第一关就把定时器的时间缩短
          let times = dataIndex == key ? 50 : 2000;
          let timer = setTimeout(() => { // 气球点亮延迟
            // _this.setData({activeIndex: _this.data.key})
            // 拿到登录状态
            let rdSession = wx.getStorageSync('rdSession');
            // 拿到当前点击的城市ID
            let cityId = currentTarget.dataset.id;
            // 在本地存入城市ID
            wx.setStorageSync('cityId', cityId);
            // 在本地存入答题分数
            wx.setStorageSync('score', 0);
            // 在本地存入城市名
            wx.setStorageSync('cityName', _this.data.cityList[dataIndex].k + ' ' + _this.data.cityList[dataIndex].city);
            //  在本地存入答题数
            wx.setStorageSync('anumber', 0);
            //  在本地存入小怪兽的血条数量 默认为3
            wx.setStorageSync('lifebar', 9)
            _this.audioCtx2.pause();
            //  获取下一题的题型  
            axios.post('Index/get_question', { rdSession: rdSession, cityid: cityId }).then(res => {
              console.log("ressssss", res)
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
            _this.data.repeat = true;
            clearTimeout(timer);
          }, times)
        })
      }
    },
    automatic(index, cityId) {
      const { inverted, key } = this.data
      let dataIndex = index
      if (dataIndex > this.data.activeIndex) {
        return;
      }
      if (dataIndex > 0) {
        if (key === dataIndex) return //是否多次点击
      }
      console.log('inverted.includes(dataIndex)', inverted.includes(dataIndex))
      console.log('dataIndex  key', dataIndex, key)
      if (inverted.includes(dataIndex) && dataIndex - key === 1) { //判断是否需要转头,正常移动情况下
        this.setData({
          leftOrRightClass: 'position-left'
        })
      } else {
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
      let times = dataIndex == key ? 50 : 2000;
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
        //  获取下一题的题型  
        axios.post('Index/get_question', { rdSession: rdSession, cityid: cityId }).then(res => {
          console.log("ressssss", res)
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
        clearTimeout(timer)
      }, times)

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

})
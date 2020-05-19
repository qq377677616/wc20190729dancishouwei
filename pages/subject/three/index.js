// pages/subject/three/index.js
import axios from '../../../utils/axios/axios'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    resourcesUrl: `${wx.getStorageSync("resourcesUrl")}/images/subject/one/`,
    isShow: true, //控制提示框显示
    isX: false, //答题完显示星星
    datas: {},
    cityName: '',
    // 存放点击的两个单词下标
    alist: [],
    sum: 0,
    // 花瓣数量  默认4片
    hum: 4
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    // 拿到登录状态
    let rdSession = wx.getStorageSync('rdSession');
    // 拿到城市ID
    let cityId = wx.getStorageSync('cityId');
    axios.post('Index/get_question', { rdSession: rdSession, cityid: cityId, id: options.id }).then(res => {
      //console.log("ressssss", res)
      if (res.data.code == 1) {
        // 在本地保存小怪兽图片 在闯关成功页面显示
        wx.setStorageSync('monster', res.data.data.user.monster.yes_pic);
        //  获取怪兽血条数
        let lifebar = wx.getStorageSync('lifebar');
        let str = 'datas.user.monster.lifebar';
        _this.setData({
          datas: res.data.data,
          ['datas.cityName']: wx.getStorageSync('cityName'),
          [str]: lifebar
        })
        // this.data.datas.cityName = wx.getStorageSync('cityName');
        for (let i = 0; i < res.data.data.answer.length; i++) {
          let arr = 'datas.answer[' + i + '].istip';
          let arrs = 'datas.answer[' + i + '].ischeck';
          this.setData({
            [arr]: false,
            [arrs]: false
          })
        }
        return;
      }
      wx.showToast({
        title: res.data.msg,
        icon: 'none',
        duration: 1500,
        success: function(){
        }
      })
    })
  },
  select: function (e) {
    let index = e.currentTarget.dataset.index;
    let _this = this.data;
    //  获取怪兽血条数
    let lifebar = wx.getStorageSync('lifebar');
    let check = 'datas.answer[' + index + '].ischeck';
    this.setData({
      [check]: true
    })
    //   判断是否四组单词都选对了
    if (_this.sum < 4) {
      //  判断选中的是不是已经选择正确的答案
      if (_this.datas.answer[index].isY != 1) {
        _this.alist.push(index);
        // 判断是否已经选中两个  
        if (_this.alist.length == 2) {
          // 判断两次点击是否是重复的
          if (_this.datas.answer[_this.alist[0]].id != _this.datas.answer[_this.alist[1]].id) {
            // 
            if (_this.datas.answer[_this.alist[0]].type == _this.datas.answer[_this.alist[1]].type) {
              //console.log("答对了")
              //  答对了把之前选错的标识去掉
              for (let i = 0; i < _this.datas.answer.length; i++) {
                if (_this.datas.answer[i].isY == 2) {
                  let arr1 = 'datas.answer[' + i + '].isY';
                  this.setData({
                    [arr1]: 0,
                  })
                }
              }
              // 改变选中的两个单词的背景
              let arr1 = 'datas.answer[' + _this.alist[0] + '].isY';
              let arr2 = 'datas.answer[' + _this.alist[1] + '].isY';
              let check1 = 'datas.answer[' + _this.alist[0] + '].ischeck';
              let check2 = 'datas.answer[' + _this.alist[1] + '].ischeck';
              this.setData({
                [arr1]: 1,
                [arr2]: 1,
                [check1]: false,
                [check2]: false,
                hum: this.data.hum + 1
              })
              this.data.sum++;

              _this.alist = [];
              if (_this.sum == 4) {
                this.answer(1)
                this.audioCtx3.play();
              } else {
                //  答对 播放音频
                this.audioCtx1.play();
              }
              // 增加怪兽血条数
              if (lifebar > 1) {
                lifebar--;
                wx.setStorageSync('lifebar', lifebar);
                let str = 'datas.user.monster.lifebar';
                this.setData({ [str]: lifebar })
              }
            } else {
              //console.log("答错了")
              //  答错了 把之前答错的标识去掉
              for (let i = 0; i < _this.datas.answer.length; i++) {
                if (_this.datas.answer[i].isY == 2) {
                  let arr1 = 'datas.answer[' + i + '].isY';
                  this.setData({
                    [arr1]: 0,
                  })
                }
              }
              // 改变选中的两个单词的背景
              let arr1 = 'datas.answer[' + _this.alist[0] + '].isY';
              let arr2 = 'datas.answer[' + _this.alist[1] + '].isY';
              let check1 = 'datas.answer[' + _this.alist[0] + '].ischeck';
              let check2 = 'datas.answer[' + _this.alist[1] + '].ischeck';
              this.setData({
                [arr1]: 2,
                [arr2]: 2,
                [check1]: false,
                [check2]: false,
              })
              // this.data.hum > 0 ? this.setData({ hum: this.data.hum - 1 }) : ''
              _this.alist = [];
              //  答错 播放音频
              this.audioCtx2.play();
              //  减少怪兽血条数
              if (lifebar < 9) {
                lifebar++;
                wx.setStorageSync('lifebar', lifebar);
                let str = 'datas.user.monster.lifebar';
                this.setData({ [str]: lifebar })
              }
              // this.answer(2)
            }

          } else {
            //console.log("重复了")
            // 如果重复点击了 就把第二个下标删掉
            _this.alist.pop();
          }
        }
      }
    }

  },
  //  调用答题接口
  answer: function (is_yes) {
    let _this = this;
    // 拿到登录状态
    let rdSession = wx.getStorageSync('rdSession');
    let data = this.data.datas;
    axios.post('Index/set_answer', { rdSession: rdSession, q_id: data.id, is_yes: is_yes, star: data.star, monsterid: data.user.monster.id }).then(res => {
      //console.log("ressssss", res)
      if (res.data.code == 1) {
        //  拿到答题数
        let anumber = wx.getStorageSync('anumber');
        anumber++;
        // 拿到答题分数
        let score = wx.getStorageSync('score') + this.data.datas.star;;
        wx.setStorageSync('score', score)
        //console.log('this.data.datas===>', this.data.datas)
        // if (anumber >= this.data.datas.count) {

        if (res.data.data >= this.data.datas.count) {
          console.log('该城市所有题目已答完');
          //  如果是最后一题 小怪兽就变成笑脸
          let str = 'datas.user.monster.is_last';
          this.setData({ [str]: true, isX: true });
          wx.redirectTo({
            url: '/pages/clearance/index',
          })
        } else {
          // 当前答题数量成功 设置本地存储答题数量+1
          // wx.setStorageSync('anumber', anumber)

          wx.setStorageSync('anumber', res.data)
          // 拿到登录状态
          let rdSession = wx.getStorageSync('rdSession');
          // 拿到当前点击的城市ID
          let cityId = wx.getStorageSync('cityId')
          this.setData({ isX: true })
          setTimeout(() => {
            axios.post('Index/get_question', { rdSession: rdSession, cityid: cityId }).then(res => {
              let ids = res.data.data.id;
              if (res.data.data.typeid == 1) {
                wx.reLaunch({ url: '/pages/subject/four/index?id=' + ids })
              } else if (res.data.data.typeid == 2) {
                wx.reLaunch({ url: '/pages/subject/one/index?id=' + ids })
              } else if (res.data.data.typeid == 3) {
                wx.reLaunch({ url: '/pages/subject/two/index?id=' + ids })
              } else if (res.data.data.typeid == 4) {
                wx.reLaunch({ url: '/pages/subject/eight/index?id=' + ids })
              } else if (res.data.data.typeid == 5) {
                wx.reLaunch({ url: '/pages/subject/eleven/index?id=' + ids })
              } else if (res.data.data.typeid == 6) {
                wx.reLaunch({ url: '/pages/subject/fives/index?id=' + ids })
              } else if (res.data.data.typeid == 7) {
                wx.reLaunch({ url: '/pages/subject/twelve/index?id=' + ids })
              } else if (res.data.data.typeid == 8) {
                wx.reLaunch({ url: '/pages/subject/six/index?id=' + ids })
              } else if (res.data.data.typeid == 9) {
                wx.reLaunch({ url: '/pages/subject/seven/index?id=' + ids })
              } else if (res.data.data.typeid == 10) {
                wx.reLaunch({ url: '/pages/subject/nine/index?id=' + ids })
              } else if (res.data.data.typeid == 11) {
                wx.reLaunch({ url: '/pages/subject/three/index?id=' + ids })
              } else if (res.data.data.typeid == 12) {
                wx.reLaunch({ url: '/pages/subject/ten/index?id=' + ids })
              }
            })
          }, 1600)

        }
      }
    })
  },
  //  提示
  tips: function () {
    this.setData({
      isShow: false
    })
  },
  cane: function () {
    //console.log("取消");
    this.setData({
      isShow: true
    })
  },
  isTips: function () {
    this.setData({
      isShow: true
    })
    let this_ = this;
    // 拿到登录状态
    let rdSession = wx.getStorageSync('rdSession');
    axios.post('Index/deduct_star', { rdSession: rdSession, star: 1 }).then(res => {
      //console.log("ressssss", res)
      if (res.data.code == 1) {
        let _this = this.data;
        let obj = {};
        let _index = 0;
        //  修改当前用户拥有的星星数量 
        let arr = 'datas.user.star';
        this.setData({
          [arr]: _this.datas.user.star - 1
        })
        for (let i = 0; i < _this.datas.answer.length; i++) {
          if (_this.datas.answer[i].isY != 1) {
            obj = _this.datas.answer[i];
            _index = i;
            for (let j = i + 1; j < _this.datas.answer.length; j++) {
              if (obj.type == _this.datas.answer[j].type) {
                let arr1 = 'datas.answer[' + _index + '].istip';
                let arr2 = 'datas.answer[' + j + '].istip';
                this.setData({
                  [arr1]: true,
                  [arr2]: true
                })
                //console.log('sssssssssssss', _this.datas.answer)
                return;
              }
            }
          }
        }
      } else if (res.data.code == 301) {
        //console.log('星星数量不够')
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.audioCtx1 = wx.createAudioContext('myAudios1')
    this.audioCtx2 = wx.createAudioContext('myAudios2')
    this.audioCtx3 = wx.createAudioContext('myAudios3')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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
      title: '单词总动员Word Defender',
      // desc: '分享页面的内容',
      imageUrl: 'https://flynew.oss-cn-hangzhou.aliyuncs.com/game/wechat/szq/danci/images/Mycity/sharecommon.jpg',
      path: 'pages/index/index' // 路径，传递参数到指定页面。
    }
  }
})
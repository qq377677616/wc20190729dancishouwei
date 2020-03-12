// pages/subject/eleven/index.js
import axios from '../../../utils/axios/axios'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    resourcesUrl: `${wx.getStorageSync("resourcesUrl")}/images/subject/one/`,
    isShow: true, //控制提示框显示
    isX: false, //答题完显示星星
    anubmer: 0,
    users: {},
    cityName: '',
    stars: 0,
    //  答对数量
    snum: 0,
    //  存放选中的选项
    slist:[],
    indexs:[],
    arrs2:[],
    datas: [],
    monsterid:'',
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
      // 在本地保存小怪兽图片 在闯关成功页面显示
      wx.setStorageSync('monster', res.data.data.user.monster.yes_pic);
      //  获取怪兽血条数
      let lifebar = wx.getStorageSync('lifebar');
      let str = 'users.user.monster.lifebar';
      _this.setData({
        users: res.data.data,
        anubmer: res.data.data.count,
        datas: res.data.data.question,
        stars: res.data.data.star,
        monsterid: res.data.data.user.monster.id,
        ['users.cityName']: wx.getStorageSync('cityName'),
        [str]: lifebar
      })
      // _this.data.users = wx.getStorageSync('cityName');
      for(let i=0;i<this.data.datas.length;i++){
        _this.data.datas[i].ischeck = false;
        let arr1 = 'datas[' + i + '].isTip';
        let arrs = 'datas[' + i + '].ischeck';
        _this.setData({
          [arr1]: false,
          [arrs]: false
        })
        
      }
      //console.log('thisssssssss',this.data.datas)
    })
  },
  select:function(e){
    //console.log("eeeeeeee",e);
    //console.log(this.data.datas)
    let index = e.currentTarget.dataset.index;
    //  获取怪兽血条数
    let lifebar = wx.getStorageSync('lifebar');
    // let check = 'datas[' + index + '].ischeck';
    // this.setData({
    //   [check]: true
    // })
    if (this.data.snum < 3) {
      //console.log("data.slist", this.data.slist.length)
      //  如果保存的选项不超过6个 就可以一直选
      if (this.data.slist.length <= 6) {
        //  判断点击的是否是已经选中并且正确的  
        if (this.data.datas[index].isY != 1){
          // 修改ischeck的值 用来判断是否点击 防止重复点击
          if (this.data.datas[index].ischeck){
            return ;
          }else{
            this.data.indexs.push(index);
            this.data.slist.push(this.data.datas[index].type)
            let check = 'datas[' + index + '].ischeck';
            this.setData({
              [check]: true
            })
            // this.data.datas[index].ischeck = true;
            //console.log("data.slist", this.data.slist)
          }
        }else{
          return ;
        }
        if (this.data.slist.length == 2) {
          if (this.data.slist[0] == this.data.slist[1]) {
            // 如果答对了  就snum+1
            this.data.snum++;
            //console.log("答对了111")
            //  答对 播放音频
            this.audioCtx1.play();
            //  如果答对了 把其他答错的样式还原
            for (let i = 0; i < this.data.datas.length; i++) {
              if (this.data.datas[i].isY == 2) {
                let arr1 = 'datas[' + i + '].isY';
                this.setData({
                  [arr1]: 0
                })
              }
            }
            let arr1 = 'datas[' + this.data.indexs[0]+'].isY';
            let arr2 = 'datas[' + this.data.indexs[1] +'].isY';
            let check1 = 'datas[' + this.data.indexs[0] + '].ischeck';
            let check2 = 'datas[' + this.data.indexs[1] + '].ischeck';
            this.setData({
              [arr1]:1,
              [arr2]:1,
              [check1]:false,
              [check2]:false
            })
            this.data.slist = [];
            this.data.indexs = [];
            if(this.data.snum == 3){
              this.answer(1)
            }
            // 增加怪兽血条数
            if (lifebar > 1) {
              lifebar--;
              wx.setStorageSync('lifebar', lifebar);
              let str = 'users.user.monster.lifebar';
              this.setData({ [str]: lifebar })
            }
          }else{
            //  把之前答错的还原
            for(let i=0;i<this.data.datas.length;i++){
              if (this.data.datas[i].isY == 2){
                let arr1 = 'datas[' + i + '].isY';
                this.setData({
                  [arr1]: 0
                })
              }
            }
            let arr1 = 'datas[' + this.data.indexs[0] + '].isY';
            let arr2 = 'datas[' + this.data.indexs[1] + '].isY';
            let check1 = 'datas[' + this.data.indexs[0] + '].ischeck';
            let check2 = 'datas[' + this.data.indexs[1] + '].ischeck';
            this.setData({
              [arr1]: 2,
              [arr2]: 2,
              [check1]: false,
              [check2]: false
            })
            this.data.datas[this.data.indexs[0]].ischeck = false;
            this.data.datas[this.data.indexs[1]].ischeck = false;
            this.data.slist = [];
            this.data.indexs = [];
            // 答错播放音频
            this.audioCtx2.play();
            //  减少怪兽血条数
            if (lifebar < 9) {
              lifebar++;
              wx.setStorageSync('lifebar', lifebar);
              let str = 'users.user.monster.lifebar';
              this.setData({ [str]: lifebar })
            }
            // this.answer(2)
          }
        }
      }
    }
  },
  //  调用答题接口
  answer: function (is_yes) {
    // 拿到登录状态
    let rdSession = wx.getStorageSync('rdSession');
    let data = this.data.datas;
    let _this = this;
    axios.post('Index/set_answer', { rdSession: rdSession, q_id: data[0].id, is_yes: is_yes, star: _this.data.stars, monsterid: _this.data.monsterid }).then(res => {
      //console.log("ressssss", res)
      if (res.data.code == 1) {
        //  拿到答题数
        let anumber = wx.getStorageSync('anumber');
        anumber++;
        // 拿到答题分数
        let score = wx.getStorageSync('score') + this.data.stars;
        wx.setStorageSync('score', score)
        //console.log('this.data.datas===>', this.data.datas)
        if (anumber >= this.data.datas.count) {
          console.log('该城市所有题目已答完');
          //  如果是最后一题 小怪兽就变成笑脸
          let str = 'datas.user.monster.is_last';
          this.setData({ [str]: true, isX: true });
          wx.redirectTo({
            url: '/pages/clearance/index',
          })
        } else {
          // 当前答题数量成功 设置本地存储答题数量+1
          wx.setStorageSync('anumber', anumber)
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
          },800)
          
        }
      }
    })
  },
  tips:function(){
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
        let index = 0;
        if (_this.snum == 0) {
          for (let i = 1; i < _this.datas.length; i += 2) {
            if (_this.datas[index].type == _this.datas[i].type) {
              let arr1 = 'datas[' + index + '].isTip';
              let arr2 = 'datas[' + i + '].isTip';
              this.setData({
                [arr1]: true,
                [arr2]: true
              })
            }
          }
          //  修改当前用户拥有的星星数量 
          let arr = 'users.user.star';
          this.setData({
            [arr]: this_.data.users.user.star - 1
          })
        } else if (_this.snum == 1) {
          //  修改当前用户拥有的星星数量 
          let arr = 'users.user.star';
          this.setData({
            [arr]: this_.data.users.user.star - 1
          })
          for (let j = 0; j < _this.datas.length; j += 2) {
            if (_this.datas[j].isY != 1) {
              index = j;
              for (let i = 1; i < _this.datas.length; i += 2) {
                if (_this.datas[index].type == _this.datas[i].type) {
                  let arr1 = 'datas[' + index + '].isTip';
                  let arr2 = 'datas[' + i + '].isTip';
                  this.setData({
                    [arr1]: true,
                    [arr2]: true
                  })
                }
              }
              break;
            }
          }
        } else if (_this.snum == 2) {
          //  修改当前用户拥有的星星数量 
          let arr = 'users.user.star';
          this.setData({
            [arr]: this_.data.users.user.star - 1
          })
          for (let j = 0; j < _this.datas.length; j += 2) {
            if (_this.datas[j].isY != 1) {
              index = j;
              for (let i = 1; i < _this.datas.length; i += 2) {
                if (_this.datas[index].type == _this.datas[i].type) {
                  let arr1 = 'datas[' + index + '].isTip';
                  let arr2 = 'datas[' + i + '].isTip';
                  this.setData({
                    [arr1]: true,
                    [arr2]: true
                  })
                }
              }
              break;
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

  }
})
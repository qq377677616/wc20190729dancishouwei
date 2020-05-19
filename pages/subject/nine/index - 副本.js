// pages/subject/nine/index.js
import axios from '../../../utils/axios/axios'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    resourcesUrl: `${wx.getStorageSync("resourcesUrl")}/images/subject/one/`,
    isShow: true, //控制提示框显示
    datas:{},
    cityName: '',
    contents: [''],
    // 单词字母数量
    num:0,
    // 答案个数
    sum: 0,
    // 对应单词数组下标
    cindex: 0
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
      console.log("ressssss", res)
      //  获取怪兽血条数
      let lifebar = wx.getStorageSync('lifebar');
      let str = 'datas.user.monster.lifebar';
      _this.setData({
        datas: res.data.data,
        ['datas.cityName']: wx.getStorageSync('cityName'),
        [str]: lifebar
      })
      // this.data.datas.cityName = wx.getStorageSync('cityName');
    })
  },
  select:function(e){
    let _this = this.data;
    let _index = e.currentTarget.dataset.index
    //  获取怪兽血条数
    let lifebar = wx.getStorageSync('lifebar');
    //  判断总共有几个答案选项
    if(_this.sum < _this.datas.question.answer.length){
      //  判断输入的是不是第一个字母
      if (_this.num == 0){
        if (!isStart(_index)) {
          console.log("答错了", "您当前选择的不是某个单词开头字母", "好的,red", false)
          this.audioCtx2.play();
          //  减少怪兽血条数
          if (lifebar < 9) {
            lifebar++;
            wx.setStorageSync('lifebar', lifebar);
            let str = 'datas.user.monster.lifebar';
            this.setData({ [str]: lifebar })
          }
          for (let i = 0; i < _this.datas.answer.length; i++) {
            if (_this.datas.answer[i].isY == 2) {
              let arr = 'datas.answer[' + i + '].isY';
              this.setData({
                [arr]: 0
              })
            }
          }
          let arrs = 'datas.answer[' + _index + '].isY';
          this.setData({
            [arrs]: 2
          })
          return
        }else{
          for (let j = 0; j < _this.datas.question.answer.length;j++) {
            let arr = _this.datas.question.answer[j].split('');
            if (arr[0] == _this.datas.answer[_index].word) {
              console.log('arrrr[0]',arr[0],'answerrrr',_this.datas.answer[_index].word)
              //   将选中的单词拆分放进数组中
              for(let i=0;i<arr.length;i++){
                let arrs = 'contents[' + i + ']';
                let arrs1 = 'datas.answer[' + _index +'].isY';
                if(i == 0){
                  this.setData({
                    [arrs]: arr[i],
                    [arrs1]: 1,
                    cindex: j
                  })
                  console.log('arr[i]', arr[i])
                  console.log('content11111111',this.data.contents)
                }else{
                  this.setData({
                    [arrs]: ''
                  })
                }
              }
              console.log('content3333333', this.data.contents)
              break;
            }
          }
        }
        _this.num ++;
        // _this.num == 当前正在选择的单词长度 单词选完了  选择下一个
        if (_this.num == _this.datas.question.answer[_this.cindex].length) {
          _this.num = 0;
          _this.datas.question.answer.splice(_this.cindex, 1);
          // 循环  把选中的字母都删掉
          for (let i = 0; i < _this.datas.answer.length; i++) {
            if (_this.datas.answer[i].isY == 1) {
              let arr = 'datas.answer[' + i + '].isY';
              this.setData({
                [arr]: 3
              })
            }
            if (_this.datas.answer[i].isTip) {
              let arr = 'datas.answer[' + i + '].isTip';
              this.setData({
                [arr]: false
              })
            }
          }
          this.setData({
            contents: ['']
          })
        }
      }else{
        //  当前选中的单词字母数量小于单词的长度
        if (_this.num < _this.datas.question.answer[_this.cindex].length){
          if (_this.datas.answer[_index].isY != 1){
            let str = _this.datas.question.answer[_this.cindex].split('');
            //  如果当前选中的字母 == 对应单词中的字母
            if (str[_this.num] == _this.datas.answer[_index].word) {
              console.log('答对了')
              let arr = 'contents[' + _this.num + ']';
              let arrs = 'datas.answer[' + _index + '].isY';
              this.setData({
                [arr]: _this.datas.answer[_index].word,
                [arrs]: 1
              })
              for (let i = 0; i < _this.datas.answer.length; i++) {
                if (_this.datas.answer[i].isY == 2) {
                  let arr = 'datas.answer[' + i + '].isY';
                  this.setData({
                    [arr]: 0
                  })
                }
              }
              _this.num++;
              // num == 当前正在选择的单词长度 单词选完了  选择下一个
              if (_this.num == _this.datas.question.answer[_this.cindex].length) {
                _this.num = 0;
                _this.datas.question.answer.splice(_this.cindex, 1);
                // 循环  把选中的字母都删掉
                for (let i = 0; i < _this.datas.answer.length;i++){
                  if (_this.datas.answer[i].isY == 1){
                    let arr = 'datas.answer[' + i +'].isY';
                    this.setData({
                      [arr]: 3
                    })
                  }
                  if (_this.datas.answer[i].isTip){
                    let arr = 'datas.answer[' + i + '].isTip';
                    this.setData({
                      [arr]: false
                    })
                  }
                }
                this.setData({
                  contents:['']
                })
              }
              //  答对 播放音频
              this.audioCtx1.play();
              if (_this.datas.question.answer.length == 0){
                console.log('全部答完了')
                this.answer(1)
              }
              // 增加怪兽血条数
              if (lifebar > 1) {
                lifebar--;
                wx.setStorageSync('lifebar', lifebar);
                let str = 'datas.user.monster.lifebar';
                this.setData({ [str]: lifebar })
              }
            } else {
              console.log('答错了')
              for (let i = 0; i < _this.datas.answer.length; i++) {
                if (_this.datas.answer[i].isY == 2) {
                  let arr = 'datas.answer[' + i + '].isY';
                  this.setData({
                    [arr]: 0
                  })
                }
              }
              let arrs = 'datas.answer[' + _index + '].isY';
              this.setData({
                [arrs]: 2
              })
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
          }
        }
      }
    }
    //判断第一次点击是否是某个单词的开头字母
    function isStart(curIndex) {
      let _isStart = false
      _this.datas.question.answer.forEach((item, index) => {
        let arr = item.split('');
        if (arr[0] == _this.datas.answer[_index].word){
          _isStart = true;
        }
      })
      return _isStart
    }
  },
  //  调用答题接口
  answer: function (is_yes) {
    let _this = this;
    // 拿到登录状态
    let rdSession = wx.getStorageSync('rdSession');
    let data = this.data.datas;
    axios.post('Index/set_answer', { rdSession: rdSession, q_id: data.id, is_yes: is_yes, star: data.star, monsterid: data.user.monster.id }).then(res => {
      console.log("ressssss", res)
      if (res.data.code == 1) {
        //  拿到答题数
        let anumber = wx.getStorageSync('anumber');
        anumber++;
        // 拿到答题分数
        let score = wx.getStorageSync('score') + this.data.datas.star;;
        wx.setStorageSync('score', score)
        console.log('this.data.datas===>', this.data.datas)
        if (anumber >= this.data.datas.count) {
          console.log('该城市所有题目已答完');
          //  如果是最后一题 小怪兽就变成笑脸
          let str = 'datas.user.monster.is_last';
          this.setData({ [str]: true });
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
          axios.post('Index/get_question', { rdSession: rdSession, cityid: cityId }).then(res => {
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
        }
      }
    })
  },
  //  提示
  tips:function(){
    this.setData({
      isShow: false
    })
  },
  cane: function () {
    console.log("取消");
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
      if (res.data.code == 1) {
        let _this = this.data;
        if (_this.contents.join('') != '') {
          console.log('contentssssssssss', _this.contents.join(''))
          // 已选中的部分单词字母
          let cont = _this.contents.join('');
          let arr = [];
          for (let i = 0; i < _this.datas.question.answer.length; i++) {
            // 如果当前已选择部分单词字母 判断当前答案中是否包含选中字母
            if (_this.datas.question.answer[i].indexOf(cont) != -1) {
              arr = _this.datas.question.answer[i].replace(cont, "");
              arr = arr.split('');
              break;
            }
          }
          for (let i = 0; i < arr.length; i++) {
            for (let j = 0, k = 0; j < _this.datas.answer.length; j++) {
              if (arr[i] == _this.datas.answer[j].word) {
                if (_this.datas.answer[j].isY != 3 && !_this.datas.answer[j].isTip) {
                  let arrs = 'datas.answer[' + j + '].isTip';
                  this.setData({
                    [arrs]: true
                  })
                  arr[i] = '';
                }
              }
            }
          }
        } else {
          let arr = _this.datas.question.answer[_this.sum].split('');
          for (let i = 0; i < arr.length; i++) {
            for (let j = 0, k = 0; j < _this.datas.answer.length; j++) {
              if (arr[i] == _this.datas.answer[j].word) {
                if (_this.datas.answer[j].isY != 3 && !_this.datas.answer[j].isTip) {
                  let arrs = 'datas.answer[' + j + '].isTip';
                  this.setData({
                    [arrs]: true
                  })
                  arr[i] = '';
                }
              }
            }
          }
        }
        //  修改当前用户拥有的星星数量 
        let arr1 = 'datas.user.star';
        this.setData({
          _index: this.data.datas.rand,
          [arr1]: _this.datas.user.star - 1
        })
      } else if (res.data.code == 301) {
        console.log('星星数量不够')
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
// pages/subject/two/index.js
import axios from '../../../utils/axios/axios'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pdTop:(index)=> {return [1,3,5].includes(index)},
    resourcesUrl: `${wx.getStorageSync("resourcesUrl")}/images/subject/one/`,
    isShow: true, //控制提示框显示
    isX: false, //答题完显示星星
    isLetter:[],
    cityName:'',
    datas:{},
    // 保存选择的答案选项
    answer:[],
    // 存放下面选项的音频
    audios:[],
    // 已选择答案个数
    aindex: 0,
    //  提示内容
    tipcont:'',
    tcont:'',
    imgUrl: false, // 显示大图片
  },
  // 点击查看图片
  click(e) {
    let url = e.currentTarget.dataset.url;
    this.setData({ imgUrl: url })
  },
  //  点击关闭图片
  closes() {
    this.setData({ imgUrl: false })
  },
  selectLetter(e){
    let _this = this;
    let index = e.currentTarget.dataset.index
    //  答案
    let appley = this.data.datas.question.answer;
    //  拿到选中的选项内容
    let answer = this.data.datas.answer[index].txt;
    // 将答案分割成数组形式
    let arrlist = appley.split('');
    // 拿到上面保存的选项内容
    let answers = this.data.answer;
    //  获取怪兽血条数
    let lifebar = wx.getStorageSync('lifebar');
    if (this.data.aindex < appley.length){
      // 判断选中的内容长度 是不是两个字母
      if (answer.length < 2) {
        let arr = 'answer[' + this.data.aindex + ']'
        let arrs = 'datas.answer[' + index +'].isY'
        //  判断是否选对
        if (answer == arrlist[this.data.aindex]){
          let cont = this.data.tcont+answer;
          this.setData({
            [arr]: answer, //将选中的答案赋值到上面的横线上
            aindex: this.data.aindex + 1, // 答对 上面答案的下标加1
            [arrs]: 1, // 答对给对应的选项赋值
            tcont: cont
          })
          //  当选对的时候 循环判断其他选项的样式是否有红色的 如果有就变成正常的
          for (let i = 0; i < this.data.datas.answer.length; i++) {
            //console.log("(this.data.datas.answer", this.data.datas.answer);
            let arr1 = 'datas.answer[' + i + '].isY'
            if (this.data.datas.answer[i].isY == 2) {
              _this.setData({
                [arr1]: 0
              })
            }
          }
          if (this.data.aindex == appley.length){
            this.answer(1)
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
        }else{
          // 把其他选错的答案还原
          for (let i = 0; i < this.data.datas.answer.length; i++) {
            let arr1 = 'datas.answer[' + i + '].isY'
            _this.setData({
              [arr1]: 0
            })
            // if (this.data.datas.answer[i].isY == 2) {
            //   _this.setData({
            //     [arr1]: 0
            //   })
            // }
          }
          this.setData({
            [arrs]: 2 // 答错给对应的选项赋值
          })
          //  答错 播放音频
          this.audioCtx2.play();
          //  减少怪兽血条数
          if (lifebar < 3) {
            lifebar++;
            wx.setStorageSync('lifebar', lifebar);
            let str = 'datas.user.monster.lifebar';
            this.setData({ [str]: lifebar })
          }
        }
        
      } else {
        // 将选中的答案拆分成数组
        let arrs = answer.split('');
        let leng = arrs.length;
        // 定义一个数量 如果当前选中的答案对应就加1 arrs(选中的答案拆分成数组)  arrlist(完整答案拆分的数组)
        let num = 0;
        for(let i=0;i<arrs.length;i++){
          if (arrs[i] == arrlist[this.data.aindex+i]){
            num++;
          }
        }
        // console.log('nummmm', num, leng, arrs)
        if (num == leng) {
          for (let i = 0; i < arrs.length; i++) {
            let arr = 'answer[' + this.data.aindex + ']';
            let arr1 = 'datas.answer[' + index + '].isY';
            this.data.tcont += arrs[i];
            this.setData({
              [arr]: arrs[i], //将选中的答案赋值到上面的横线上
              aindex: this.data.aindex + 1, // 答对 上面答案的下标加1
              [arr1]: 1, // 答对给对应的选项赋值
            })
          }
          //  当选对的时候 循环判断其他选项的样式是否有红色的 如果有就变成正常的
          for (let i = 0; i < this.data.datas.answer.length;i++){
            let arr1 = 'datas.answer[' + i + '].isY'
            if (this.data.datas.answer[i].isY == 2){
              _this.setData({
                [arr1]: 0
              })
            }
          }
          if (this.data.aindex == appley.length){
            this.answer(1)
          }
          // 增加怪兽血条数
          if (lifebar < 9) {
            lifebar++;
            wx.setStorageSync('lifebar', lifebar);
            let str = 'datas.user.monster.lifebar';
            this.setData({ [str]: lifebar })
          }
        } else {
          // 把其他选错的答案还原
          for (let i = 0; i < this.data.datas.answer.length; i++) {
            let arr1 = 'datas.answer[' + i + '].isY'
            _this.setData({
              [arr1]: 0
            })
            // if (this.data.datas.answer[i].isY == 2) {
            //   _this.setData({
            //     [arr1]: 0
            //   })
            // }
          }
          let arr1 = 'datas.answer[' + index + '].isY'
          this.setData({
            [arr1]: 2 // 答错给对应的选项赋值
          })
          //  减少怪兽血条数
          if (lifebar > 1) {
            lifebar--;
            wx.setStorageSync('lifebar', lifebar);
            let str = 'datas.user.monster.lifebar';
            this.setData({ [str]: lifebar })
          }
        }
      }
    }
  },
  //  调用答题接口
  answer: function (is_yes) {
    let _this =this;
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
        if (anumber >= this.data.datas.count) {
          console.log('该城市所有题目已答完');
          //  如果是最后一题 小怪兽就变成笑脸
          let str = 'datas.user.monster.is_last';
          this.setData({ [str]: true, isX: true });
          wx.redirectTo({
            url: '/pages/clearance/index',
          })
        } else {
          // 当前答题数量成功 设置本地存储答题数量+1  楊
          wx.setStorageSync('anumber', anumber)
          // 拿到登录状态
          let rdSession = wx.getStorageSync('rdSession');
          // 拿到当前点击的城市ID
          let cityId = wx.getStorageSync('cityId')
          this.setData({ isX: true })
          axios.post('Index/get_question', { rdSession: rdSession, cityid: cityId }).then(res => {
            //console.log('ressss',res)
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
      // 在本地保存小怪兽图片 在闯关成功页面显示
      wx.setStorageSync('monster', res.data.data.user.monster.yes_pic);
      //  获取怪兽血条数
      let lifebar = wx.getStorageSync('lifebar');
      let str = 'datas.user.monster.lifebar';
      res.data.data.question.answer = res.data.data.question.answer.replace(/[ ]/g, '');
      _this.setData({
        datas: res.data.data,
        ['datas.cityName']: wx.getStorageSync('cityName'),
        [str]: lifebar
      })
      // this.data.datas.cityName = wx.getStorageSync('cityName');
      // 给上面空白选项赋值
      for (let i = 0; i < res.data.data.question.answer.length; i++) {
        let arr = 'answer[' + i + ']';
        _this.setData({
          [arr]: '',
        })
      }
      for (let i = 0; i < res.data.data.answer.length; i++) {
        _this.data.datas.answer[i].txt = _this.data.datas.answer[i].txt.replace(/[ ]/g, '');
        let arrs = 'datas.answer[' + i + '].isTip';
        _this.setData({
          [arrs]: false
        })
      }
      // let answer = this.data.datas.answer;
      // // 循环存放音频
      // for (let i = 0; i < answer.length; i++) {
      //   this.data.audios[i] = wx.createAudioContext('myAudio' + i + '')
      // }
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
    let _this = this;
    // 拿到登录状态
    let rdSession = wx.getStorageSync('rdSession');
    axios.post('Index/deduct_star', { rdSession: rdSession, star: 1 }).then(res => {
      //console.log("ressssss", res)
      if (res.data.code == 1) {
        let str = this.data.datas.question.answer.split('');
        //  拿到上面选中的内容长度 当下标
        let _index = this.data.tcont.length;
        let cont = str[_index];
        for (let j = 0; j < 4; j++) {
          if (j == 1) {
            cont += str[_index + 1];
          } 
          if (j == 2) {
            cont += str[_index + 2];
          }
          if (j == 3) {
            cont += str[_index + 3];
          }
          for (let i = 0; i < this.data.datas.answer.length; i++) {
            if (cont == this.data.datas.answer[i].txt && !this.data.datas.answer[i].isY) {
              let arrs = 'datas.answer[' + i + '].isTip'; 
              this.setData({
                [arrs]: true
              })
              break;
            }
          }
        }
        //  修改当前用户拥有的星星数量 
        let arr = 'datas.user.star';
        _this.setData({
          [arr]: _this.data.datas.user.star - 1
        })
      } else if (res.data.code == 301) {
        //console.log('星星数量不够')
      }
    })
  },
  //  播放音频
  tmAudio:function(){
    this.audioCtxs.play();
  },
  // playAudio: function ({ currentTarget }){
  //   let index = currentTarget.dataset.index;
  //   this.data.audios[index].play();
  // },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.audioCtxs = wx.createAudioContext('myAudio')
    this.audioCtxs.play();
    this.audioCtx1 = wx.createAudioContext('myAudios1')
    this.audioCtx2 = wx.createAudioContext('myAudios2')
    // this.audioCtx2 = wx.createAudioContext('myAudio0')
    // this.audioCtx3 = wx.createAudioContext('myAudio1')
    // this.audioCtx4 = wx.createAudioContext('myAudio2')
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
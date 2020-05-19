const QQMapWX = require('../qqmap-wx-jssdk.min.js')
//alert提示
const alert = (str, duration = 1500, icon = "none", callback) => {
  console.log('aaaaaaaaaaaaaaaaa',str)
  wx.showToast({
    title: str,
    icon: icon,
    duration: duration,
    success: () => {
      if (!callback) return
      setTimeout(() => { callback() }, duration)
    }
  })
}
//loading提示框
const loading = (str = '加载中', mask = false) => {
  console.log('sssssssssssss',str)
  wx.showLoading({
    title: str,
    mask: mask
  })
}
//关闭loading提示框
const loading_h = () => {
  wx.hideLoading()
}
//确认/取消弹框
const showModal = (title = "确认", content = "您确认进行此操作？", confirms = "确认,#333", cancels = "取消,#333") => {
  return new Promise((resolve, reject) => {
    wx.showModal({
      title: title,
      content: content,
      showCancel: cancels ? true : false,
      cancelText: cancels ? cancels.split(",")[0] : '取消',
      cancelColor: cancels ? cancels.split(",")[1] : '#333',
      confirmText: confirms.split(",")[0],
      confirmColor: confirms.split(",")[1],
      success: (res) => {
        if (res.confirm) {
          resolve(true)
        } else {
          resolve(false)
        }
      }
    })
  })
}
//获取dom节点
const getDom = ele => {
  const query = wx.createSelectorQuery()
  query.select(ele).boundingClientRect()
  query.selectViewport().scrollOffset()
  query.exec(function (res) {
    return res
    res[0].top       // #the-id节点的上边界坐标
    res[1].scrollTop // 显示区域的竖直滚动位置
  })
}
//播放视频
const videoPlay = (ele, isFullScreen = true) => {
  let videoContext = wx.createVideoContext(ele)
  console.log(videoContext)
  videoContext.play()
  // if (isFullScreen) {
  //   videoContext.requestFullScreen({ direction: 0 })
  // }
}
//获取手机系统信息
const getSystem = () => {
  return new Promise((resolve, reject) => {
    wx.getSystemInfo({
      success(res) {
        resolve(res)
      }
    })
  })
}
//可返回跳转
const jump_nav = (url) => {
  wx.navigateTo({
    url: url
  })
}
//不可返回跳转
const jump_red = (url) => {
  wx.redirectTo({
    url: url
  })
}
//跳转tabBar页
const jump_swi = (url) => {
  wx.switchTab({
    url: url
  })
}
//返回上一页面
const jump_back = () => {
  wx.navigateBack()
}
//预览图片
const previewImage = (urls, current) => {
  wx.previewImage({
    urls: urls,
    current: current
  })
}
//canvas绘图
const canvasImg = (options, callback) => {
  const ctx = wx.createCanvasContext(options.canvasId);
  ctx.setFillStyle('#fff')
  ctx.rect(0, 0, 574, 1022)
  ctx.fill()
  if (options.imgList.length > 0) {
    for (let i = 0; i < options.imgList.length; i++) {
      let _curimg = options.imgList[i]
      if (_curimg.isRadius) {
        ctx.save()
        ctx.beginPath()
        ctx.arc(_curimg.imgX + _curimg.imgW / 2, _curimg.imgY + _curimg.imgW / 2, _curimg.imgW / 2, 0, 2 * Math.PI)
        ctx.clip()
      }
      ctx.drawImage(_curimg.url, _curimg.imgX, _curimg.imgY, _curimg.imgW, _curimg.imgH)
      ctx.restore()
    }
  }
  if (options.textList.length > 0) {
    for (let i = 0; i < options.textList.length; i++) {
      let _curText = options.textList[i]
      ctx.setFontSize(_curText.fontSize)
      ctx.setFillStyle(_curText.color)
      ctx.setTextAlign('left')
      ctx.setTextBaseline('top')
      ctx.fillText(_curText.string, _curText.textX, _curText.textY)
      if (_curText.bold) {
        ctx.fillText(_curText.string, _curText.textX, _curText.textY - 0.5)
        ctx.fillText(_curText.string, _curText.textX - 0.5, _curText.textY)
      }
      ctx.fillText(_curText.string, _curText.textX, _curText.textY)
      if (_curText.bold) {
        ctx.fillText(_curText.string, _curText.textX, _curText.textY + 0.5)
        ctx.fillText(_curText.string, _curText.textX + 0.5, _curText.textY)
      }
    }
    //ctx.draw(true)
  }
  ctx.draw(true, () => {
    if (callback) {
      setTimeout(() => {
        wx.canvasToTempFilePath({
          canvasId: options.canvasId,
          success(res) {
            callback(res.tempFilePath)
          }
        })
      }, 100)
    }
  })
}
//获取定位
const getPosition = () => {
  return new Promise((resolve, reject) => {
    let qqmapsdk = new QQMapWX({ key: 'GW3BZ-NMN6J-JSEFT-FTC6R-F7DA3-Z3FVJ' })
    qqmapsdk.reverseGeocoder({
      success: res => {//成功后的回调
        resolve(res)
      },
      fail: function (err) {
        reject(err)
      },
      complete: function (res) {
        //console.log(res)
      }
    })
  })
}
module.exports = {
  alert,
  showModal,
  loading,
  loading_h,
  getDom,
  videoPlay,
  getSystem,
  jump_nav,
  jump_red,
  jump_swi,
  jump_back,
  previewImage,
  canvasImg,
  getPosition
}
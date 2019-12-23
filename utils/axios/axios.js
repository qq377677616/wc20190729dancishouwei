const config = {
    apiBaseUrl: 'https://game.flyh5.cn/game/wx7c3ed56f7f792d84/yz_guardian/api/',
    // headerData: {'content-type': 'application/x-www-form-urlencoded',}
}

// 网络请求函数
function get(url,data) {
    return new Promise((resolve, reject) => {
        wx.request({
            url: config.apiBaseUrl + url,
            method: 'get',
            data: data,
            header: {'content-type': 'application/json'},
            success: (res) => {
                resolve(res)
            },
            fail: (err) => {
                reject(err)
            }
        })
    })
}

function post(url,data) {
    return new Promise((resolve, reject) => {
        wx.request({
            url: config.apiBaseUrl + url,
            method: 'post',
            data: data,
            header: {'content-type': 'application/x-www-form-urlencoded'},
            success: (res) => {
                resolve(res)
            },
            fail: (err) => {
                reject(err)
            }
        })
    })
}

function login(params) {
    return new Promise((resolve, reject) => { 
        wx.login({
            success(res) {
                if (res.code) {
                    wx.request({
                        url: config.apiBaseUrl + 'Base/getOpen',
                        method: 'post',
                        data: {
                            code: res.code,
                            nickName: params.nickName,
                            avatarUrl: params.avatarUrl
                        },
                        success(res) {
                            resolve(res)
                        },
                        fail(err) {
                            reject(err)
                        }
                    })
                } else {
                    console.log('登录失败！' + res.errMsg)
                }
            }
        })
    })
}

function toast(title, icon = 'none',duration = 1500){
    wx.showToast({
        title:title,
        icon:icon,
        duration:duration
    })
}

module.exports = {
    get: get,
    post: post,
    login: login,
    toast:toast,
}
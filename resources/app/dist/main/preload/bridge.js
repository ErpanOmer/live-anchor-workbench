/**
 * preload目前只给streaming页面，因为这个页面是用微模块打开互动组件、评论页
 * 其他页面都是用iframe打开已有web页面
 */

const { ipcRenderer } = require('electron')

console.log('inject preload')
// contextBridge.exposeInMainWorld('isInTbw', {isInTbw: true})
// contextBridge.exposeInMainWorld('QCefQuery', {isInTbw: true})

const disableCallback = title => {
  ipcRenderer.send('show-confirm', {
    type: 'dialog-modal',
    confirmData: {
      closable: false,
      content: (title || '') + '在当前版本暂不可用，敬请期待',
      showFooter: true,
      showOk: true,
      showCancel: false,
      okText: '确定',
    },
  })
}

const InvokeMethodHandler = {}

InvokeMethodHandler['GotoLiveRoom'.toLowerCase()] = payload => {
  ipcRenderer.send('open-window', {
    type: 'streaming',
    mountData: payload.livedetail,
  })
}
InvokeMethodHandler['liveDetail'.toLowerCase()] = payload => {
  ipcRenderer.send('live-detail-changed', {
    newLiveDetail: payload.data,
  })
}

// 打开互动组件
InvokeMethodHandler['showDialog'.toLowerCase()] = payload => {
  let _payload = payload
  if ('version' in payload) {
    // 兼容{version: '1.0',data: any}的格式
    _payload = payload.data
  }
  console.log('open interaction', _payload)
  ipcRenderer.send('open-window', {
    type: 'iframe-modal',
    mountData: _payload,
  })
}

// 打开绿幕
InvokeMethodHandler['GreenBackGroundBoard'.toLowerCase()] = payload => {
  ipcRenderer.send('green-check-enable-for-open', {
    type: 'green-screen',
    mountData: payload,
  })
}

// 打开音频
InvokeMethodHandler['music'.toLowerCase()] = payload => {
  ipcRenderer.send('open-window', {
    type: 'audio-player',
    mountData: payload,
  })
}

// 打开音频
InvokeMethodHandler['OperationMusic'.toLowerCase()] = payload => {
  ipcRenderer.send('open-window', {
    type: 'audio-player',
    mountData: payload,
  })
}

// 粉丝连麦
InvokeMethodHandler['LinkMic'.toLowerCase()] = payload => {
  // {"version":"1.0","data":{"linkmic-type":1,"width":1000,"height":600,"pos-x":175,"pos-y":56}}
  if (payload.data['linkmic-type'] !== undefined) {
    ipcRenderer.send('EVENT_LINKMIC_CHECK_ENABLE_FOR_OPEN', {
      type: 'linkmic-list',
      source: 'interaction',
      mountData: {
        ...payload,
        type: payload.data['linkmic-type'],
      },
    })
  } else {
    ipcRenderer.send('EVENT_LINKMIC_CHECK_ENABLE_FOR_OPEN', {
      type: 'linkmic-list',
      mountData: payload,
    })
  }
}
// 主播大赛连麦
InvokeMethodHandler['zhubodasai'.toLowerCase()] = payload => {
  ipcRenderer.send('EVENT_LINKMIC_CHECK_ENABLE_FOR_OPEN', {
    type: 'linkmic-list',
    source: 'interaction',
    mountData: {
      ...payload,
      type: 4,
    },
  })
}

// 3D沉浸直播
InvokeMethodHandler['immersiveStream'.toLowerCase()] = () => {
  disableCallback('3D沉浸直播')
}

// 小游戏
InvokeMethodHandler['InteractiveMaterialBoard'.toLowerCase()] = () => {
  disableCallback('小游戏')
}

// 互动道具
InvokeMethodHandler['MaterialBoard'.toLowerCase()] = payload => {
  ipcRenderer.send('open-window', {
    type: 'interact-material',
    mountData: payload,
  })
}

// 自动录制
InvokeMethodHandler['AutoRecord'.toLowerCase()] = () => {
  disableCallback('自动录制')
}

// 快捷录屏
InvokeMethodHandler['UserRecord'.toLowerCase()] = () => {
  ipcRenderer.send('EVENT_LIVE_RECORDER_CHECK_ENABLE', {})
}

// 3D商品素材
InvokeMethodHandler['threedMaterialBoard'.toLowerCase()] = () => {
  disableCallback('3D商品素材')
}

// 信息卡
InvokeMethodHandler['ElementCard'.toLowerCase()] = payload => {
  console.log('open ElementCard', payload)
  ipcRenderer.send('open-window', {
    type: 'iframe-modal',
    mountData: {
      width: 600,
      height: 600,
      'pos-x': 0,
      'pos-y': 420,
      url: `https://market.m.taobao.com/app/mtb/app-live-pc-web/list-material/index.html?type=MARQUEE`,
      innerInfo: {
        title: '轮播条',
      },
    },
  })
}

// 连麦小游戏
InvokeMethodHandler['LinkMicMaterialBoard'.toLowerCase()] = () => {
  disableCallback('连麦小游戏')
}

// 最大化 / 取消最大化当前窗口
InvokeMethodHandler['MaxNormalWindow'.toLowerCase()] = () => {
  ipcRenderer.send('maximize-current-window', {})
}

// 最小化当前窗口
InvokeMethodHandler['MinimizeWindow'.toLowerCase()] = () => {
  ipcRenderer.send('minimize-current-window', {})
}

// 关闭当前窗口
InvokeMethodHandler['Close'.toLowerCase()] = () => {
  ipcRenderer.send('close-current-window', {})
}

// 放大评论区
InvokeMethodHandler['enlargeCommentPanelInElectron'.toLowerCase()] = payload => {
  if (window.location.href.indexOf('comments') === -1) {
    ipcRenderer.send('open-comment-page', payload)
  }
}

// 放大礼物区域
InvokeMethodHandler['enlargeRewardPanelInElectron'.toLowerCase()] = payload => {
  if (window.location.href.indexOf('reward') === -1) {
    ipcRenderer.send('open-reward-page', payload)
  }
}

// 打开url链接
InvokeMethodHandler['OpenExternalUrl'.toLowerCase()] = payload => {
  ipcRenderer.send('open-url-external', { url: (payload.data && payload.data.url) || payload.url })
}

const client = {
  invokeMethod: (method, data) => {
    console.log('[tbw bridge]invokeMethod', method, data)
    const defaultInvoker = () => {
      console.log('[tbw bridge]invoke method failed,no callback registered')
    }
    ;(InvokeMethodHandler[method.toLowerCase()] || defaultInvoker)(JSON.parse(data || ''))
  },

  addEventListener: (event, cb) => {
    console.log('[tbw bridge]addEventListener', event, cb)
  },
  removeEventListener: (event, cb) => {
    console.log('[tbw bridge]removeEventListener', event, cb)
  },
}

const globalWindow = window
globalWindow.preload = true
globalWindow.isInTbw = true
globalWindow.QCefQuery = client
globalWindow.TbwClient = client
globalWindow.QCefClient = client

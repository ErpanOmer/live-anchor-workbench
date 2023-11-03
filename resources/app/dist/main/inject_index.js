((context) => {
    
    const path = require('path')
    const url = require('url')
    const querystring = require("querystring");
    const log = require(path.resolve(`${process.env.APPDATA}`, './npm/node_modules/electron-log/main'))
    const electron = require('electron')

    log.initialize({ preload: true });
    log.transports.file.resolvePathFn = () => path.resolve(process.env.HOMEPATH, './Desktop/test.log');
    log.transports.file.maxSize = 500 * 1024 * 1024;
    Object.assign(console, log.functions)



    // http 请求拦截
    electron.app.whenReady().then(() => {

        electron.session.defaultSession.webRequest.onBeforeRequest((details, callback) => {
            log.info(details.webContentsId, details.method, details.resourceType, details.url)
    
            if (details.requestHeaders) {
    
            }
    
    
            if (details.url.includes('/arms.') && details.uploadData) {
                for (const iterator of details.uploadData) {
                    if (iterator.type && iterator.bytes) {
                        const data = JSON.parse(iterator.bytes.toString())
    
                        if (data.gokey) {
                            const gokey = querystring.parse(data.gokey)
    
                            if (gokey.msg) {
                                const msg = decodeURIComponent(gokey.msg)
                                gokey.msg = encodeURIComponent(msg.replace(/OBS-Camera2/g, 'FaceTime Camera'))
                                data.gokey = querystring.stringify(gokey)
                            }
                        }
    
                        log.info('Reqeust data:', JSON.stringify(data))
                    }
                }
            }
    
    
            callback(details)
          })

    })



    // ipc 数据拦截
    electron.app.on('web-contents-created', (e, webContents) => {
        setTimeout(() => webContents.openDevTools(), 300)

        webContents.on('ipc-message', (event, channel, args) => {
            log.info(`ipc-message: ${event.frameId} `, channel, args)
        })

        webContents.on('ipc-message-sync', (event, channel, args) => {
            log.info(`ipc-message-sync: ${event.frameId} `, channel, args)
        })
    })


    electron.app.on('browser-window-created', (e, window) => {
        window.on('show', () => {
            // setTimeout(() => window.hide(), 300)
            // setTimeout(() => window.minimize())
        })
    })

    log.info('inject test start')
})(globalThis)


((context) => {
    
    const path = require('path')
    const url = require('url')
    const querystring = require("querystring");
    const electron = require('electron');
    const log = require(path.resolve(`${process.env.APPDATA}`, './npm/node_modules/electron-log/main'))
    const { createInterceptor } = require(path.resolve(`${process.env.APPDATA}`, './npm/node_modules/@mswjs/interceptors'))
    const { interceptClientRequest }  = require(path.resolve(`${process.env.APPDATA}`, './npm/node_modules/@mswjs/interceptors/lib/interceptors/ClientRequest'))

    log.initialize({ preload: true });
    log.transports.file.resolvePathFn = () => path.resolve(process.env.HOMEPATH, './Desktop/test.log');
    log.transports.file.maxSize = 500 * 1024 * 1024;
    Object.assign(console, log.functions)



    // 渲染进程 webRequest 拦截器
    electron.app.whenReady().then(() => {

        electron.session.defaultSession.webRequest.onBeforeRequest((details, callback) => {
            log.info('webRequest:', details.webContentsId, details.method, details.resourceType, details.url)
    
            if (details.url.includes('/arms.') && details.uploadData) {
                for (const iterator of details.uploadData) {
                    if (iterator.type && iterator.bytes) {
                        const data = JSON.parse(iterator.bytes.toString())
    
                        if (data.gokey) {
                            const gokey = querystring.parse(data.gokey)
    
                            if (gokey.msg) {
                                gokey.msg = decodeURIComponent(gokey.msg)
                                //gokey.msg = encodeURIComponent(msg.replace(/OBS-Camera2/g, 'FaceTime Camera'))
                                //data.gokey = querystring.stringify(gokey)
                            }

                            data.gokey = gokey
                        }

                        log.info('webRequest:', data)
                    }
                }
            }
    
    
            callback(details)
          })
    })


    // 主进程 http.ClientRequest 拦截器
    const interceptor = new createInterceptor({
        modules: [interceptClientRequest],
        resolver(request, ref) {
            // log.info('ClientRequest', request)
        },
    })

    interceptor.apply()

    interceptor.on('request', request => {
        log.info('ClientRequest', request)

        const body = JSON.parse(request.body);

        if (body.gokey) {
            const gokey = querystring.parse(body.gokey)

            if (gokey.msg) {
                gokey.msg = decodeURIComponent(gokey.msg)
            }

            body.gokey = gokey
        }

        log.info('ClientRequest', body)

        return request
    })


    // 进程 ipc 数据拦截
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
            setTimeout(() => window.minimize())
        })
    })

    log.info('inject test start')
})(globalThis)


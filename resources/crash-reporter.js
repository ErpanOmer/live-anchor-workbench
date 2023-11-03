"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrashReporterServer = void 0;
const child_process_1 = require("child_process");
const fs_1 = __importDefault(require("fs"));
const os_1 = __importDefault(require("os"));
const path_1 = __importDefault(require("path"));
const url_1 = __importDefault(require("url"));
const http_1 = __importDefault(require("http"));
const https_1 = __importDefault(require("https"));
const zlib_1 = __importDefault(require("zlib"));
const NodeUtSdkDir = path_1.default.normalize(path_1.default.join(path_1.default.join(__dirname), './app.asar.unpacked/node_modules/@ali/nodeutsdk'));
const MinidumpStackwalkExe = path_1.default.join(NodeUtSdkDir, './minidump_stackwalk.exe');
const NodeUTSDK = require(path_1.default.join(NodeUtSdkDir, './NodeUTSdk.node'));
// 关闭服务超时时间
const TIMEOUT_CLOSE = 3000; // ms
const logger = {
    log: console.log.bind(console),
    error: console.error.bind(console),
    verbose: console.log.bind(console),
};
class CrashReporterServer {
    constructor(options) {
        /**
         * 如果在发送上报中，停止应用的自动退出
         */
        this.sending = false;
        /**
         * 初始化 UT SDK 是否成功
         */
        this.isInitUtSdkSucc = false;
        /**
         * 崩溃 mt 配置
         */
        this.crashedConfig = {
            gpuCrashedTypeList: [],
            filterCrashReporterTypeList: [],
            avoidDupCrashReporterTime: 10000,
            crashTypeReporterSetting: {
                limitNum: 3,
                limitTime: 12,
            },
        };
        /**
         * 上次崩溃时间
         */
        this.lastCrashedTime = 0;
        /**
         * 进程版本号
         */
        this.processVersion = '';
        /**
         * 独立进程类型
         */
        this.extraProcessType = '';
        /**
         * gpu进程是否崩溃过，若崩溃过则不重复上报
         */
        this.isGpuProcessCrash = false;
        /**
         * utility进程是否崩溃过，若崩溃过则不重复上报
         */
        this.isUtilityProcessCrash = false;
        this.options = options;
        this.server = http_1.default.createServer((req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.handle(req, res);
            }
            catch (error) {
                logger.error('handle request fail:', error.message);
            }
            finally {
                if (this.sending) {
                    this.sending = false;
                }
            }
        }));
    }
    initUtSdk() {
        var _a, _b, _c, _d;
        const isProd = ((_a = this.options.globalExtra) === null || _a === void 0 ? void 0 : _a.env) === 'prod';
        // 设置当前运行目录
        logger.log('NodeUtSdkDir', NodeUtSdkDir, NodeUTSDK);
        const res = NodeUTSDK.SetModulesDir(NodeUtSdkDir);
        logger.log('NodeUTSDK SetModulesDir', res);
        // 初始化 UT SDK
        const initUtSdkRes = NodeUTSDK.InitUTSdk(`${(_b = this.options.globalExtra) === null || _b === void 0 ? void 0 : _b.appKey}`, `${(_c = this.options.globalExtra) === null || _c === void 0 ? void 0 : _c.appName}`, `${(_d = this.options.globalExtra) === null || _d === void 0 ? void 0 : _d.appVersion}`, !isProd);
        if (Number(initUtSdkRes.ret) >= 0) {
            this.isInitUtSdkSucc = true;
            this.sendUtLog('[UTLog]NodeUTSDK init succ', NodeUtSdkDir);
            fetchCrashConfigs().then((config) => {
                this.sendUtLog('[UTLog]Fetch Crash Configs', config);
                this.crashedConfig = config;
            });
        }
    }
    // ut 日志上报
    sendUtLog(...message) {
        var _a;
        logger.log(message);
        if (!this.isInitUtSdkSucc) {
            return;
        }
        NodeUTSDK.UTOriginalEvent(JSON.stringify({
            eventId: '2101',
            pageName: 'Page_Trace_Anchor_Live',
            arg1: 'UTLog',
            arg2: (_a = this.options.globalExtra) === null || _a === void 0 ? void 0 : _a.userId,
            monitor_map_info: {
                msg: JSON.stringify(message),
            }
        }));
    }
    sendCrashGpuInfo(info) {
        logger.log('sendCrashGpuInfo', info);
        if (!this.isInitUtSdkSucc) {
            return;
        }
        NodeUTSDK.UTOriginalEvent(JSON.stringify({
            eventId: '2101',
            pageName: 'Page_Trace_Anchor_Live',
            arg1: 'mlGPUBlackList',
            monitor_map_info: info,
        }));
    }
    start() {
        this.server.listen(this.options.port, this.options.host, () => {
            logger.log('Start listening', this.options.host, 'on', this.options.port);
        });
        setInterval(() => __awaiter(this, void 0, void 0, function* () {
            logger.verbose('live check', process.pid, 'parent pid', process.ppid);
            // 如果已经脱离的主进程，并且没有发送中，就自动退出
            if (!this.sending && (
            // Mac 的 ppid 会在退出后变为 1
            process.ppid === 1 ||
                // Windows 需要手动判断 ppid 是否存在
                !processExist(process.ppid))) {
                yield this.stop();
                logger.log('process exit.', process.pid);
                process.exit();
            }
        }), 1000);
    }
    stop() {
        if (!this.server) {
            logger.error('没有获取到 server 实例');
            return Promise.resolve(false);
        }
        return new Promise((resolve, _reject) => {
            var _a;
            const timer = setTimeout(() => {
                logger.error(new Error('Close server timeout.'));
                resolve(false);
            }, TIMEOUT_CLOSE);
            (_a = this.server) === null || _a === void 0 ? void 0 : _a.close((err) => {
                if (err) {
                    clearTimeout(timer);
                    logger.error(err);
                    return resolve(false);
                }
                clearTimeout(timer);
                resolve(true);
            });
        });
    }
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.log(`\n${req.method} ${req.url} HTTP/${req.httpVersion}`);
            if (!req.url) {
                throw new Error('url is not set.');
            }
            const uri = new url_1.default.URL(req.url, `http://${this.options.host}:${this.options.port}`);
            if (uri.pathname === '/crash') {
                // 两次崩溃时间小于配置的阈值时，则不上报崩溃数据
                const avoidDupCrashReporterTime = this.crashedConfig.avoidDupCrashReporterTime || 10000;
                if (Date.now() - this.lastCrashedTime < avoidDupCrashReporterTime) {
                    this.sendUtLog('[UTlog]two crashed time less then', avoidDupCrashReporterTime);
                    this.lastCrashedTime = Date.now();
                    return;
                }
                this.lastCrashedTime = Date.now();
                this.sendUtLog('[UTlog]isGpuProcessCrash', this.isGpuProcessCrash);
                this.sendUtLog('[UTlog]isUtilityProcessCrash', this.isUtilityProcessCrash);
                if (this.isGpuProcessCrash || this.isUtilityProcessCrash) {
                    return;
                }
                this.sending = true;
                const buf = yield new Promise((resolve, reject) => {
                    let chunks = [];
                    req.on('data', (chunk) => {
                        chunks.push(chunk);
                    });
                    req.on('end', () => {
                        resolve(Buffer.concat(chunks));
                        chunks = [];
                    });
                    req.on('error', (error) => {
                        reject(error);
                    });
                });
                logger.log('content length:', buf.length);
                const boundary = MultiPart.getBoundary(req.headers['content-type'] || '');
                const contentEncoding = req.headers['content-encoding'];
                const tasks = [];
                // 转发崩溃上报信息
                if (this.options.relayURL) {
                    const relayTask = this.relayReport(req.headers, buf);
                    tasks.push(relayTask);
                }
                // 使用了 compress 属性
                const _buf = contentEncoding === 'gzip' ? zlib_1.default.gunzipSync(buf) : buf;
                const parts = MultiPart.parse(_buf, boundary);
                if (!parts.length) {
                    logger.log('解析 form 失败');
                    res.write('解析失败');
                    res.end();
                    return;
                }
                const obj = {
                    appCode: this.options.appCode,
                };
                let file = null;
                parts.forEach(part => {
                    var _a;
                    if (part.filename) {
                        // 记录文件路径即可
                        obj['filename'] = part.filename;
                        file = {
                            filename: part.filename,
                            type: part.type,
                            data: part.data,
                        };
                    }
                    else if (part.name) {
                        obj[part.name] = part.data.toString();
                        logger.log('part:', part.name, obj[part.name]);
                        switch (part.name) {
                            case 'version':
                                this.processVersion = obj[part.name];
                                break;
                            case 'process_type':
                                if ((_a = obj[part.name]) === null || _a === void 0 ? void 0 : _a.includes('extra')) {
                                    this.extraProcessType = obj[part.name];
                                }
                                else if (obj[part.name] === 'gpu-process') {
                                    this.isGpuProcessCrash = true;
                                }
                                else if (obj[part.name] === 'utility') {
                                    this.isUtilityProcessCrash = true;
                                }
                                break;
                        }
                    }
                });
                // 非独立进程崩溃则上报至 EMAS、千鸟平台
                if (!this.extraProcessType) {
                    try {
                        const isAliNet = yield detectIsAliNet();
                        this.sendUtLog('[UTLog]isAliNet', isAliNet);
                        if (isAliNet) {
                            return;
                        }
                    }
                    catch (err) {
                        this.sendUtLog('[UTLog]detectIsAliNet fail', err);
                    }
                    this.sendUtLog('[UTLog]relayReportToEmas ready');
                    if (file) {
                        // 崩溃上报信息至emas
                        const dumpData = file.data;
                        this.sendUtLog('[UTLog]relayReportToEmas start', this.extraProcessType);
                        this.relayReportToEmas(dumpData);
                    }
                    this.sendUtLog('[UTLog]relayReportToEmas end');
                    const resultBuf = yield this.request(req.headers, obj);
                    let result;
                    try {
                        result = JSON.parse(resultBuf.toString());
                    }
                    catch (error) {
                        logger.error('解析返回内容失败', resultBuf.toString());
                        res.end();
                        return;
                    }
                    if (!result.success) {
                        logger.log('崩溃日志发送失败');
                        res.end();
                        return;
                    }
                    const uploadUrl = result.data;
                    logger.log('upload url:', uploadUrl);
                    if (file) {
                        const uploadDmp = this.uploadDmp(uploadUrl, file);
                        tasks.push(uploadDmp);
                    }
                    else {
                        logger.log('fail to upload dmp');
                    }
                    try {
                        const results = yield Promise.all(tasks);
                        results.forEach((result, index) => {
                            logger.verbose(`result ${index}:`, result === null || result === void 0 ? void 0 : result.toString());
                        });
                    }
                    catch (error) {
                        logger.error(error);
                    }
                }
            }
            res.write('Succ!');
            res.end();
        });
    }
    request(headers, body) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.options.realSubmitURL) {
                throw new Error('realSubmitURL not set.');
            }
            const faasBody = JSON.stringify({
                args: [body],
            });
            const _headers = Object.assign(Object.assign({}, Object.keys(headers).reduce((acc, key) => {
                if (!['transfer-encoding', 'connection', 'accept-encoding', 'accept-language', 'host'].includes(key.toLowerCase())) {
                    acc[key] = headers[key];
                }
                return acc;
            }, {})), {
                'content-length': Buffer.from(faasBody).length,
            });
            _headers['content-type'] = 'application/json';
            const options = {
                method: 'POST',
                headers: _headers,
            };
            logger.log('options:', options);
            logger.verbose('write faasBody:', faasBody);
            return commonRequest(this.options.realSubmitURL || '', options, faasBody);
        });
    }
    uploadDmp(uploadUrl, dmpFile) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!dmpFile || !dmpFile.type) {
                throw new Error('dmpFile not set.');
            }
            const options = {
                method: 'PUT',
                headers: {
                    'content-type': dmpFile.type,
                },
            };
            return commonRequest(uploadUrl, options, dmpFile.data);
        });
    }
    relayReport(headers, body) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.options.relayURL) {
                return;
            }
            const parsedUrl = new url_1.default.URL(this.options.relayURL);
            const _headers = Object.assign(Object.assign({}, headers), { host: parsedUrl.host });
            delete _headers['transfer-encoding'];
            const options = {
                method: 'POST',
                headers: _headers,
            };
            return commonRequest(this.options.relayURL, options, body);
        });
    }
    // UT 上报崩溃信息至 emas 魔兔
    relayReportToEmas(buf) {
        var _a, _b, _c;
        if (!this.isInitUtSdkSucc) {
            return;
        }
        // 过滤预发崩溃数据
        const isProd = ((_a = this.options.globalExtra) === null || _a === void 0 ? void 0 : _a.env) === 'prod';
        if (!isProd) {
            return;
        }
        try {
            const userId = `${(_b = this.options.globalExtra) === null || _b === void 0 ? void 0 : _b.userId}`;
            const dmpPath = (_c = this.options.globalExtra) === null || _c === void 0 ? void 0 : _c.dmpPath;
            const dmpFileNamePath = `${dmpPath}/${userId}_${Date.now()}.dmp`;
            const dmpContentPath = `${dmpPath}/${userId}_${Date.now()}.txt`;
            fs_1.default.writeFileSync(dmpFileNamePath, buf, 'binary');
            const cmd = `"${MinidumpStackwalkExe}" "${dmpFileNamePath}" > "${dmpContentPath}"`;
            this.sendUtLog('[UTLog]exec minidump_stackwalk cmd', cmd);
            (0, child_process_1.exec)(cmd, { encoding: 'utf-8', maxBuffer: 10000 * 1024 }, (error, stdout) => {
                var _a, _b, _c, _d, _e, _f, _g;
                if (error) {
                    this.sendUtLog('[UTLog]exec minidump_stackwalk cmd fail', error);
                    // 过滤 IntentionallyCrashBrowserForUnusableGpuProcess 等非崩溃数据
                    // this.reportToEmas(buf);
                }
                else {
                    const dmpContent = fs_1.default.readFileSync(dmpContentPath, 'utf-8');
                    this.sendUtLog('[UTLog]exec minidump_stackwalk cmd succ', dmpContent.length, stdout);
                    const res = dmpContent.trim();
                    const reason = res.substring(res.indexOf('Crash reason:') + 13, res.indexOf('Crash address:')).trim();
                    let crashed = '!';
                    const crashedSubstring = res.substring(res.indexOf('crashed'), res.indexOf('given as instruction pointer in context'));
                    const crashedOtherSubstring = res.substring(res.indexOf('given as instruction pointer in context'));
                    if (crashedSubstring.includes('[') || crashedSubstring.includes('+')) {
                        crashed = crashedSubstring.substring(crashedSubstring.indexOf('crashed') + 12, (crashedSubstring.indexOf('[') > 0 ? crashedSubstring.indexOf('[') : crashedSubstring.indexOf('+'))).trim();
                    }
                    else if (crashedOtherSubstring.includes('[') || crashedOtherSubstring.includes('+')) {
                        crashed = crashedOtherSubstring.substring(crashedOtherSubstring.indexOf('given as instruction pointer in context') + 43, (crashedOtherSubstring.indexOf('[') > 0 ? crashedOtherSubstring.indexOf('[') : crashedOtherSubstring.indexOf('+'))).trim();
                        if (crashed.length > 50) {
                            crashed = '!';
                        }
                    }
                    const msg = `${reason}(${crashed})`;
                    this.sendUtLog('[UTLog]exec minidump_stackwalk message', msg, res.substring(0, 2000));
                    if (!((_a = this.crashedConfig.filterCrashReporterTypeList) === null || _a === void 0 ? void 0 : _a.includes(crashed))) {
                        // 过滤一段时间内同个崩溃类型连续崩溃超过n次的数据
                        const crashLimitNum = ((_c = (_b = this.crashedConfig) === null || _b === void 0 ? void 0 : _b.crashTypeReporterSetting) === null || _c === void 0 ? void 0 : _c.limitNum) || 3;
                        const crashLimitTime = ((_e = (_d = this.crashedConfig) === null || _d === void 0 ? void 0 : _d.crashTypeReporterSetting) === null || _e === void 0 ? void 0 : _e.limitTime) || 12;
                        const crashTime = Date.now();
                        const crashInfo = this.readLocalCacheInfo('crashinfo.json');
                        const crashList = (crashInfo === null || crashInfo === void 0 ? void 0 : crashInfo.crashList) || [];
                        const filterCrashList = crashList.filter(item => item.crashType === crashed && crashTime - item.crashTime < crashLimitTime * 3600 * 1000) || [];
                        const crashNum = filterCrashList.length;
                        this.sendUtLog('[UTLog]crash num', crashNum);
                        if (crashNum >= crashLimitNum) {
                            this.sendUtLog(`[UTLog]crash num greater than ${crashLimitNum}`, crashed);
                            return;
                        }
                        else {
                            crashList.push({
                                crashType: crashed,
                                crashTime,
                            });
                            this.sendUtLog('[UTLog]crash list', crashList, crashed);
                            this.writeLocalCacheInfo('crashinfo.json', { crashList });
                        }
                        this.reportToEmas(buf, msg, crashed, reason);
                        // 本地缓存崩溃数据
                        if (crashed === null || crashed === void 0 ? void 0 : crashed.includes('winhadnt')) {
                            // 获取音频属性被其他监控软件占用时崩溃缓存
                            this.sendUtLog('[UTLog]winhadnt crash', crashed);
                            this.writeLocalCacheInfo('crashinfo.json', { isWinhadntCrash: true });
                        }
                        else {
                            // GPU 显卡崩溃缓存
                            let isGpuCrashedType = false;
                            (_f = this.crashedConfig.gpuCrashedTypeList) === null || _f === void 0 ? void 0 : _f.forEach(gpu => {
                                if (crashed === null || crashed === void 0 ? void 0 : crashed.includes(gpu)) {
                                    isGpuCrashedType = true;
                                }
                            });
                            if (isGpuCrashedType) {
                                this.sendUtLog('[UTLog]gpu crash type', crashed);
                                // 将 GPU 崩溃信息缓存到本地
                                if (crashInfo === null || crashInfo === void 0 ? void 0 : crashInfo.isGpuCrash) {
                                    this.writeLocalCacheInfo('crashinfo.json', { isGpuCrash: true, isIntegratedGpuCrash: true });
                                }
                                else {
                                    this.writeLocalCacheInfo('crashinfo.json', { isGpuCrash: true, isDiscreteGpuCrash: true });
                                }
                                // 上报崩溃 GPU 信息
                                const hardwareInfo = this.readLocalCacheInfo('hardwareinfo.json');
                                this.sendCrashGpuInfo({
                                    gpuName: (hardwareInfo === null || hardwareInfo === void 0 ? void 0 : hardwareInfo.adapterName) || '',
                                    gpuType: (hardwareInfo === null || hardwareInfo === void 0 ? void 0 : hardwareInfo.adapterType) || '',
                                    user_id: ((_g = this.options.globalExtra) === null || _g === void 0 ? void 0 : _g.userId) || '',
                                });
                            }
                        }
                    }
                }
            });
        }
        catch (err) {
            this.sendUtLog('[UTLog]exec minidump_stackwalk fail', err);
            this.reportToEmas(buf);
        }
    }
    reportToEmas(buf, msg, crashed, reason) {
        var _a, _b, _c, _d;
        const userId = `${(_a = this.options.globalExtra) === null || _a === void 0 ? void 0 : _a.userId}`;
        const isProd = `${((_b = this.options.globalExtra) === null || _b === void 0 ? void 0 : _b.env) === 'prod'}`;
        const appName = `${(_c = this.options.globalExtra) === null || _c === void 0 ? void 0 : _c.appName}`;
        const appVersion = (_d = this.options.globalExtra) === null || _d === void 0 ? void 0 : _d.appVersion;
        const crashVersion = this.extraProcessType ? `${this.processVersion}_${this.extraProcessType}` : `${appVersion}`;
        this.sendUtLog('[UTLog]reportToEmas crash version:', crashVersion, 'extraProcessType:', this.extraProcessType);
        const arg3 = {
            'an': appName,
            'av': crashVersion,
            'li': userId,
            'sm': msg,
            'mn': crashed,
            'p': `${os_1.default.arch()}`,
            'os': `${os_1.default.platform()}`,
            'ov': `${os_1.default.version()}`,
            'do': 'upload',
            'ufv': '1.0.0',
        };
        const emasRes = NodeUTSDK.UTOriginalEvent(JSON.stringify({
            eventId: '1',
            pageName: 'taolive_page',
            arg1: 'MOTU_REPORTER_SDK_3.0.0_PRIVATE_COMPRESS',
            arg2: zlib_1.default.gzipSync(buf).toString('base64'),
            arg3: zlib_1.default.gzipSync(encodeParams(arg3)).toString('base64'),
            monitor_map_info: {
                APPVERSION: crashVersion
            }
        }));
        this.sendUtLog('[UTLog]crash upoad to emas', emasRes);
        // 排查crash上报至emas平台的数据跟千鸟平台不一致的问题
        const res = NodeUTSDK.UTOriginalEvent(JSON.stringify({
            eventId: '2101',
            pageName: 'Page_Trace_Anchor_Live',
            arg1: 'UTCrashUploaded',
            monitor_map_info: {
                userId,
                version: crashVersion,
                isProd,
                arg1: crashed,
                arg2: reason,
            }
        }));
        this.sendUtLog('[UTLog]UTCrashUploaded', res);
    }
    writeLocalCacheInfo(filename, info) {
        var _a;
        const localCacheInfoPath = (_a = this.options.globalExtra) === null || _a === void 0 ? void 0 : _a.localCacheInfoPath;
        if (!localCacheInfoPath) {
            return;
        }
        try {
            const localCacheInfo = this.readLocalCacheInfo(filename);
            const filePath = path_1.default.join(localCacheInfoPath, filename);
            fs_1.default.writeFileSync(filePath, JSON.stringify(Object.assign(Object.assign({}, localCacheInfo), info)));
            logger.log('set crash info succ');
        }
        catch (err) {
            logger.error('set crash info fail', err);
        }
    }
    readLocalCacheInfo(filename) {
        var _a;
        const localCacheInfoPath = (_a = this.options.globalExtra) === null || _a === void 0 ? void 0 : _a.localCacheInfoPath;
        if (!localCacheInfoPath) {
            return undefined;
        }
        const filePath = path_1.default.join(localCacheInfoPath, filename);
        try {
            if (fs_1.default.existsSync(filePath)) {
                const localCacheInfo = JSON.parse(fs_1.default.readFileSync(filePath, 'utf8'));
                return localCacheInfo;
            }
        }
        catch (err) {
            logger.error('get crash info fail', err);
        }
        return undefined;
    }
}
exports.CrashReporterServer = CrashReporterServer;
function encodeParams(params) {
    logger.log('encodeParams start', params);
    let s = '';
    for (let key in params) {
        const value = params[key];
        s += `${encodeURIComponent(key)}=${encodeURIComponent(value)}&`;
    }
    s = s.substring(0, s.length - 1);
    logger.log('encodeParams end', s);
    return s;
}
function commonRequest(url, options, body) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            const clientReq = https_1.default.request(url, options, (clientRes) => {
                let chunks = [];
                clientRes.on('data', (chunk) => {
                    chunks.push(chunk);
                });
                clientRes.on('end', () => {
                    logger.verbose('uploadDmg log:', Buffer.concat(chunks).toString());
                    const result = Buffer.concat(chunks);
                    resolve(result);
                    chunks = [];
                });
                clientRes.on('error', (error) => {
                    logger.error('error client req text:', error);
                    reject(error);
                });
            });
            if (body) {
                clientReq.write(body);
            }
            clientReq.end();
        });
    });
}
function fetchCrashConfigs() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            https_1.default.get('https://hudong.alicdn.com/api/data/v2/f94dfd3db43241629b018b128c321324.js', (res) => {
                let data = '';
                res.on('data', (chunk) => {
                    data += chunk;
                });
                res.on('end', () => {
                    const crashConfigs = JSON.parse(data);
                    logger.log('fetchCrashConfigs', crashConfigs);
                    resolve(crashConfigs);
                });
            }).on('error', (err) => {
                logger.log(err.message);
                reject(err);
            });
        });
    });
}
function detectIsAliNet() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            https_1.default.get('https://alilang-intranet.alibaba-inc.com/is_white_list.json', (res) => {
                let data = '';
                res.on('data', (chunk) => {
                    data += chunk;
                });
                res.on('end', () => {
                    var _a;
                    try {
                        const isAliNet = !!((_a = JSON.parse(data)) === null || _a === void 0 ? void 0 : _a.content);
                        logger.log('detectIsAliNet', isAliNet);
                        resolve(isAliNet);
                    }
                    catch (err) {
                        logger.error('detectIsAliNet fail', err);
                        reject(false);
                    }
                });
            }).on('error', (err) => {
                logger.log(err.message);
                reject(false);
            });
        });
    });
}
function processExist(pid) {
    try {
        return process.kill(pid, 0);
    }
    catch (e) {
        return false;
    }
}
var MultiPart;
(function (MultiPart) {
    /**
     * Multipart Parser (Finite State Machine)
     * usage:
     * const multipart = require('./multipart.js');
     * const body = multipart.DemoData(); 							   // raw body
     * const body = Buffer.from(event['body-json'].toString(),'base64'); // AWS case
     * const boundary = multipart.getBoundary(event.params.header['content-type']);
     * const parts = multipart.Parse(body,boundary);
     * each part is:
     * { filename: 'A.txt', type: 'text/plain', data: <Buffer 41 41 41 41 42 42 42 42> }
     *  or { name: 'key', data: <Buffer 41 41 41 41 42 42 42 42> }
     */
    function parse(multipartBodyBuffer, boundary) {
        let lastline = '';
        let header = '';
        let info = '';
        let state = 0;
        let buffer = [];
        const allParts = [];
        for (let i = 0; i < multipartBodyBuffer.length; i++) {
            const oneByte = multipartBodyBuffer[i];
            const prevByte = i > 0 ? multipartBodyBuffer[i - 1] : null;
            const newLineDetected = oneByte === 0x0a && prevByte === 0x0d ? true : false;
            const newLineChar = oneByte === 0x0a || oneByte === 0x0d ? true : false;
            if (!newLineChar)
                lastline += String.fromCharCode(oneByte);
            if (0 === state && newLineDetected) {
                if ('--' + boundary === lastline) {
                    state = 1;
                }
                lastline = '';
            }
            else if (1 === state && newLineDetected) {
                header = lastline;
                state = 2;
                if (header.indexOf('filename') === -1) {
                    state = 3;
                }
                lastline = '';
            }
            else if (2 === state && newLineDetected) {
                info = lastline;
                state = 3;
                lastline = '';
            }
            else if (3 === state && newLineDetected) {
                state = 4;
                buffer = [];
                lastline = '';
            }
            else if (4 === state) {
                if (lastline.length > boundary.length + 4)
                    lastline = ''; // mem save
                if ('--' + boundary === lastline) {
                    const j = buffer.length - lastline.length;
                    const part = buffer.slice(0, j - 1);
                    const p = { header: header, info: info, part: part };
                    allParts.push(processPart(p));
                    buffer = [];
                    lastline = '';
                    state = 5;
                    header = '';
                    info = '';
                }
                else {
                    buffer.push(oneByte);
                }
                if (newLineDetected)
                    lastline = '';
            }
            else if (5 === state) {
                if (newLineDetected)
                    state = 1;
            }
        }
        return allParts;
    }
    MultiPart.parse = parse;
    //  read the boundary from the content-type header sent by the http client
    //  this value may be similar to:
    //  'multipart/form-data; boundary=----WebKitFormBoundaryvm5A9tzU1ONaGP5B',
    function getBoundary(header) {
        const items = header.split(';');
        if (items) {
            for (let i = 0; i < items.length; i++) {
                const item = new String(items[i]).trim();
                if (item.indexOf('boundary') >= 0) {
                    const k = item.split('=');
                    return new String(k[1]).trim().replace(/^["']|["']$/g, "");
                }
            }
        }
        return '';
    }
    MultiPart.getBoundary = getBoundary;
    function processPart(part) {
        // will transform this object:
        // { header: 'Content-Disposition: form-data; name="uploads[]"; filename="A.txt"',
        // info: 'Content-Type: text/plain',
        // part: 'AAAABBBB' }
        // into this one:
        // { filename: 'A.txt', type: 'text/plain', data: <Buffer 41 41 41 41 42 42 42 42> }
        const obj = function (str) {
            const k = str.split('=');
            const a = k[0].trim();
            const b = JSON.parse(k[1].trim());
            const o = {};
            Object.defineProperty(o, a, {
                value: b,
                writable: true,
                enumerable: true,
                configurable: true
            });
            return o;
        };
        const header = part.header.split(';');
        const filenameData = header[2];
        let input = {};
        if (filenameData) {
            input = obj(filenameData);
            const contentType = part.info.split(':')[1].trim();
            Object.defineProperty(input, 'type', {
                value: contentType,
                writable: true,
                enumerable: true,
                configurable: true
            });
        }
        // always process the name field
        Object.defineProperty(input, 'name', {
            value: header[1].split('=')[1].replace(/"/g, ''),
            writable: true,
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(input, 'data', {
            value: Buffer.from(part.part),
            writable: true,
            enumerable: true,
            configurable: true
        });
        return input;
    }
})(MultiPart || (MultiPart = {}));
/**
 * main entry
 */
if (require.main === module) {
    const optionStr = process.argv[process.argv.length - 1];
    if (optionStr) {
        const options = JSON.parse(optionStr);
        logger.log('options:', options);
        const _crashReporter = new CrashReporterServer(options);
        _crashReporter.start();
        _crashReporter.initUtSdk();
        process.on('beforeExit', (err) => {
            logger.log('beforeExit:', err);
            _crashReporter.stop();
        });
        process.on('uncaughtException', (err) => {
            logger.log('uncaughtException:', err);
        });
    }
}
//# sourceMappingURL=crash-reporter.js.map
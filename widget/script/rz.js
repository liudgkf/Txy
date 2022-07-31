var imagesI = 1;

// 图片处理
function dealImg(img, callback) {
    var imageFilter = api.require('imageFilter');
    imageFilter.getAttr({
        path: img
    }, function (ret, err) {
        if (ret.status) {
            console.log(JSON.stringify(ret));
            if (ret.width > 3000 || ret.height > 3000 || ret.size / 1024 / 1024 > 3) {
                imgCompress(img, callback);
            } else {
                callback(img);
            }
        } else {
            _alert(JSON.stringify(err));
        }
    });
}

// 图片压缩
function imgCompress(img, callback) {
    var imageFilter = api.require('imageFilter');
    imageFilter.compress({
        img: img,
        isClarityimg: false,
        quality: 0.5,
        scale: 0.5,
        save: {
            imgPath: '/storage/emulated/0/csUpload',
            imgName: imagesI + '.jpg'
        },
    }, function (rets, errs) {
        if (rets.status) {
            var path = '/storage/emulated/0/csUpload/' + imagesI + '.jpg';
            dealImg(path, callback)
        } else {
            alert(JSON.stringify(errs));
        }
    });
}

// 获取biztoken
function jiaoyan(url) {
    _loading('请稍后');
    _ajaxFile('api/Faceid/get_biz_token', function (ret, err) {
        console.log(JSON.stringify(ret))
        console.log(JSON.stringify(err))
        if (ret && ret.code == 200) {
            openFace(ret.data)
        } else {
            _loadingClose();
            // _alert('相关数据错误');
            var msg = showError(ret.msg);
            _alert(msg);
        }
    }, {
        user_id: $api.getStorage('userid'),
    }, {
        image_ref1: url
    })
}

// 打开faceid
function openFace(bizToken) {
    var UIFaceID = api.require('UIFaceID');
    UIFaceID.openFaceID({
        bizToken: bizToken,
    }, function (rets, errs) {
        console.log(JSON.stringify(rets))
        console.log(JSON.stringify(errs))
        if (rets.code == 51000) {
            _ajax('api/Faceid/auth', function (retg, errg) {
                console.log(JSON.stringify(retg))
                console.log(JSON.stringify(errg))
                _loadingClose();
                if (retg.code == 200) {
                    // pushImg(url);
                    _alert('验证成功', function () {
                        api.closeWin();
                    });
                } else {
                    // _alert('验证失败');
                    var msg = showError(retg.msg);
                    _alert(msg);
                }
            }, {
                user_id: $api.getStorage('userid')
            });
        } else {
            _loadingClose();
            var msg = showError(rets.msg);
            _alert(msg);
        }
    });
}

//上传图片 到用户相册
function pushImg(img) {
    _ajaxFile('add_user_img.php', function (rets, errs) {
        console.log(JSON.stringify(ret))
        console.log(JSON.stringify(err))
        if (rets && rets.code == 200) {
            _loadingClose();
            _msg('验证成功');
            timerWin();
        }
    }, {
        user_id: $api.getStorage('userid'),
    }, {
        photo_album: img,
    })
}

// 人脸识别错误码
function showError(m) {
    if (!m) {
        return '未知错误1';
    }
    var msg = m.split(':')[0];
    var error = {
        'PASS_LIVING_NOT_THE_SAME': '待比对照片与权威数据照片比对结果不是同一个人',
        'NO_ID_CARD_NUMBER': '权威数据无此身份证号',
        'ID_NUMBER_NAME_NOT_MATCH': '身份证号，姓名不匹配',
        'NO_ID_PHOTO': '无法获取权威数据照片',
        'PHOTO_FORMAT_ERROR': '权威数据照片格式错误',
        'DATA_SOURCE_ERROR': '其他权威数据照片错误',
        'FAIL_LIVING_FACE_ATTACK': '未经过活体判断，可能的原因：是假脸攻击',
        'REPLACED_FACE_ATTACK': '发生换脸攻击，在做活体过程中出现两张不相同的人脸',
        'BIZ_TOKEN_DENIED': '传入的 biz_token 不符合要求',
        'AUTHENTICATION_FAIL': '鉴权失败，鉴权过程中非biz_token的错误',
        'MOBILE_PHONE_NOT_SUPPORT': '手机在不支持列表里',
        'SDK_TOO_OLD': 'SDK版本过旧，已经不被支持',
        'MOBILE_PHONE_NO_AUTHORITY': '没有权限（运动传感器、存储、相机）',
        'USER_CANCELLATION': '用户活体失败，可能原因：用户取消了',
        'USER_TIMEOUT': '用户活体失败，可能原因：验证过程超时',
        'VERIFICATION_FAILURE': '用户活体失败，可能原因：验证失败',
        'UNDETECTED_FACE': '用户活体失败，可能原因：未检测到人脸',
        'ACTION_ERROR': '用户活体失败，可能原因：用户动作错误',
        'API_KEY_BE_DISCONTINUED': 'api_key被停用',
        'IP_NOT_ALLOWED': '不允许访问的IP',
        'NON_ENTERPRISE_CERTIFICATION': '客户未进行企业认证',
        'BALANCE_NOT_ENOUGH': '余额不足',
        'MORE_RETRY_TIMES': '获取服务器配置时超过重试次数',
        'ACCOUNT_DISCONTINUED': '用户帐号已停用',
        'EXPIRED_SIGN': '签名过期',
        'INVALID_SIGN': '无效的签名',
        'REPLAY_ATTACK': '重放攻击，单次有效的签名被多次使用',
        'USER_CANCEL': '用户取消',
        'NO_CAMERA_PERMISSION': '没有打开相机的权限，请开启权限后重试',
        'ILLEGAL_PARAMETER': '传入参数不合法',
        'DEVICE_NOT_SUPPORT': '无法启动相机，请确认摄像头功能完好',
        'INVALID_BUNDLE_ID': '信息验证失败，请重启程序或设备后重试',
        'NETWORK_ERROR': '连不上互联网，请连接上互联网后重试',
        'FACE_INIT_FAIL': '无法启动人脸识别，请稍后重试',
        'LIVENESS_DETECT_FAILED': '活体检测不通过',
        'NO_SENSOR_PERMISSION': '无法读取运动数据的权限，请开启权限后重试',
        'NO_WRITE_EXTERNAL_STORAGE_PERMISSION': '没有读取写SD卡的权限',
        'INIT_FAILED': '初始化失败',
        'LIVING_NOT_START': '活体验证没有开始',
        'LIVING_IN_PROGRESS': '正在进行验证',
        'LIVING_OVERTIME': '操作超时，由于用户在长时间没有进行操作',
        'UNKOWN_ERROR': '未知错误',
        'IMAGE_ERROR_UNSUPPORTED_FORMAT': '参数对应的图像无法解析，有可能不是图像文件、或有数据破损',
        'MISSING_ARGUMENTS': '缺少某个必选参数',
        'BAD_ARGUMENTS': '某个参数解析出错（比如必须是数字，但是输入的是非数字字符串; 或者长度过长）',
        'NO_FACE_FOUND': '没有检测到人脸',
        'INVALID_IMAGE_SIZE': '图像太大，像素尺寸的长或宽超过4096像素',
        'AUTHORIZATION_ERROR': 'api_key被停用、调用次数超限、没有调用此API的权限，或者没有以当前方式调用此API的权限',
        'CONCURRENCY_LIMIT_EXCEEDED': '并发数超过限制',
        'API_NOT_FOUND': '所调用的API不存在',
        'Request Entity Too Large': '请求大小超过了20MB限制或单张照片大小超过了2MB',
        'INTERNAL_ERROR': '服务器内部错误，当此类错误发生时请再次请求，如果持续出现此类错误，请及时联系 FaceID 客服或商务',
    };
    var err = error[msg] || m;
    return err;
}
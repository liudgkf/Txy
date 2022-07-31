(function (window) {
    var otherLogin = function () {

    }
    //微信登录
    otherLogin.prototype.wx_register = function (callback) {
        var wx = api.require('wx');
        wx.auth({}, function (ret, err) {
            console.log(JSON.stringify(ret))
            console.log(JSON.stringify(err))
            if (ret.status) {
                _loading('', '登录中...', '请稍后...');
                wx.getToken({
                    code: ret.code,
                }, function (rets, errs) {
                    console.log(JSON.stringify(rets))
                    console.log(JSON.stringify(errs))
                    if (rets.status) {
                        //获取用户信息
                        wx.getUserInfo({
                            accessToken: rets.accessToken,
                            openId: rets.openId
                        }, function (retg, errg) {
                            console.log(JSON.stringify(retg))
                            console.log(JSON.stringify(errg))
                            if (retg.status) {
                                downLoadImage(retg.headimgurl, function (base64headimg) {
                                    //微信返回的参数,openid为该微信号唯一码,sex为性别,name为微信昵称,headimgurl为头像图本地路径
                                    var returndata = {
                                        openid: retg.openid,
                                        sex: retg.sex,
                                        name: retg.nickname,
                                        headimgurl: base64headimg
                                    }
                                    callback && callback(returndata);
                                })
                            } else {
                                _loadingClose();
                                _alert('无法获取相关信息');
                            }
                        });
                    } else {
                        _loadingClose();
                        _alert('无法获取相关信息');
                    }
                });
            } else {
                _loadingClose();
                _alert('无法获取相关信息');
            }
        });
    };
    //	将微信提供的头像图保存在手机本地
    function downLoadImage(url, callback) {
        api.download({
            url: url,
            savePath: 'fs://touxiang1/' + url + '.png',
            report: false,
            allowResume: true,
            cache: true
        }, function (ret, err) {
            if (ret.state == 1) {
                callback.call(this, ret['savePath']);
            } else {
                callback.call(this, false);
            }
        });
    }

    //QQ登录
    otherLogin.prototype.qq_register = function (callback) {
        var obj = api.require('QQPlus');
        obj.login({}, function (ret, err) {
            console.log(JSON.stringify(ret))
            console.log(JSON.stringify(err))
            if (ret.status) {
                _loading('', '登录中...', '请稍后...');
                //获取用户基本信息
                obj.getUserInfo(function (retg, errg) {
                    console.log(retg.info)
                    console.log(JSON.stringify(retg.info))
                    console.log(JSON.stringify(errg))
                    if (retg.status) {
                        if(typeof retg.info == 'string'){
                            retg.info = JSON.parse(retg.info);
                        }
                        var returndata = {
                            openid: ret.openId,
                            sex: retg.info.gender,
                            name: retg.info.nickname,
                        }
                        callback && callback(returndata, retg.info.figureurl_qq_1);
                    } else {
                        _loadingClose();
                        alert("获取失败");
                        callback('', 1);
                    }
                });
            } else {
                _loadingClose();
                alert("获取失败");
                callback('', 1);
            }
        });
    }
    window.otherLogin = otherLogin;
})(window)

// 登录 type 0 微信 1 qq
function login(type) {
    var loginWay = new otherLogin();
    if (type == 0) {
        loginWay.wx_register(function (ret, err) {
            if (ret) {
                _o_login(0, ret)
            }
        });
    } else {
        loginWay.qq_register(function (ret, err) {
            if (ret) {
                _o_login(1, ret)
            }
        });
    }
}

function _o_login(type, ret) {
    console.log(JSON.stringify(ret))
    var sex;
    if (ret.sex == 1) {
        sex = '男';
    } else if (ret.sex == 0) {
        sex = '女';
    } else {
        sex = ret.sex
    }
    _ajaxFile('wx_login.php', function (rel, erl) {
        console.log(JSON.stringify(rel))
        console.log(JSON.stringify(erl))
        _loadingClose();
        if (rel && rel.state == 1) {
            // $api.setStorage('userid', rel.result.user_id);
            // 微信
            if (type == 0) {
                $api.setStorage('wechat', ret.openid);
                // _url({ flag: 1, url: 'user/male_frame', title: '你是。。。', })
                _url({url:'user/reg', title:'注册'})
            } else {
                $api.setStorage('qq_openID', ret.openid);
                // qq
                // _url({ flag: 1, url: 'user/male_frame', title: '你是。。。', })
                _url({url:'user/reg', title:'注册'})
            }

        } else if (rel && rel.state == 0) {
            $api.setStorage('userid', rel.result.user_id);
            $api.setStorage('sex', rel.result.sex);
            _send('fresh'); //登录之后重新加载数据
             _url({ slidBackEnabled: 0 }, 'index_win');
        }
    }, {
        name: ret.name,
        wechat: ret.openid,
        sex: sex,
        type: type
    }, {
        images: ret.headimgurl,
    })
}
var Push = function (callback) {
    var ajpush = api.require('ajpush');

    var init = function () {
        judgePush(function () {
            // 安卓初始化
            if (api.systemType != 'ios') {
                ajpush.init();
            }
            // // 安卓监听 点击
            // api.addEventListener({
            //     name: 'appintent'
            // }, function(ret, err) {
            //     console.log(JSON.stringify(ret))
            //     console.log(JSON.stringify(err))
            //     if (ret && ret.appParam.ajpush) {
            //     }
            // })

            // // ios监听 点击
            // api.addEventListener({
            //     name: 'noticeclicked'
            // }, function(ret, err) {
            //     if (ret && ret.value) {
            //     }
            // })
        })
    }

    // 初始化Push
    init();

    // 注册监听
    // 安卓 前台时 消息类推送不会显示在通知栏
    // ios 前台时 消息和通知都不会显示在通知栏
    this.linstener = function (callback) {
        judgePush(function () {

            ajpush.setListener(function (ret, err) {
                console.log(JSON.stringify(ret))
                if (typeof callback == 'function') {
                    callback(ret, err)
                }
            });
        })
    }

    // 移除监听
    this.rm = function () {
        ajpush.removeListener();
    }

    // 绑定别名和标签
    this.setAlias = function (alias, tags) {
        judgePush(function () {
            var param = {
                alias: alias,
                tags: tags
            };
            ajpush.bindAliasAndTags(param, function (ret, err) {
                console.log(JSON.stringify(ret))
                console.log(JSON.stringify(err))
            });
        })
    }

    // 通知极光推送SDK当前应用恢复到前台。
    this.userHabit = function () {
        judgePush(function () {
            if (api.systemType == 'ios') return;

            // 用于极光推送做“用户使用时长”，“活跃用户”，“用户打开次数”的统计 安卓有效
            api.addEventListener({
                name: 'resume'
            }, function (ret, err) {
                ajpush.onResume();
            });
            // 通知极光推送SDK当前应用退入到后台。
            api.addEventListener({
                name: 'pause'
            }, function (ret, err) {
                ajpush.onPause();
            });
        })
    }

    // 待清除的通知id（等同于消息ID），为-1时清除所有，iOS只支持清除所有，不能为空
    this.clearNotification = function (param) {
        judgePush(function () {
            // var param = {id:-1};
            param = param ? param : {
                id: -1
            };
            ajpush.clearNotification(param, function (ret) {
                if (ret && ret.status) {
                    //success
                }
            });
        })
    }

    // 设置允许推送时间，只Android有效  推送到的通知会被扔掉。
    // days 允许推送的日期，0表示星期天，1表示星期一 不能为空
    // startHour 允许推送的开始时间（24小时制：startHour的范围为0到23），不能为空
    // endHour 允许推送的结束时间（24小时制：endHour的范围为0到23），不能为空
    this.setTime = function (days, start, end) {
        judgePush(function () {
            if (api.systemType == 'ios') return;

            var params = {};
            params.days = days || [1, 2, 3, 4, 5, 6, 0];
            params.startHour = start || 23;
            params.endHour = end || 23;
            ajpush.setPushTime(params, function (ret) {
                if (ret && ret.status) {
                    //success
                }
            });
        })

    }

    // 设置通知静默时间，只Android有效  如果在该时间段内收到消息，则：不会有铃声和震动
    // startHour 静音时段的开始小时（24小时制，范围：0~23），不能为空
    // startMinute 静音时段的开始分钟（范围：0~59），不能为空
    // endHour 静音时段的结束小时（24小时制，范围：0~23），不能为空
    // endMinute 静音时段的结束分钟（范围：0~59），不能为空
    this.setSlience = function (startH, startM, endH, endM) {
        judgePush(function () {
            if (api.systemType == 'ios') return;

            var params = {};
            params.startHour = startH || 23;
            params.startMinute = startM || 59;
            params.endHour = endH || 23;
            params.endMinute = endM || 59;
            ajpush.setPushTime(params, function (ret) {
                if (ret && ret.status) {
                    //success
                }
            });
        })

    }
    // 停止推送
    this.stop = function () {
        judgePush(function () {
            ajpush.stopPush(function (ret) {
                if (ret && ret.status) {
                    //success
                }
            });
        })

    }
    // 恢复推送
    this.resume = function () {
        judgePush(function () {
            ajpush.resumePush(function (ret) {
                if (ret && ret.status) {
                    //success
                }
            });
        })

    }
    // 查询当前推送服务是否停止
    this.check = function () {
        judgePush(function () {
            ajpush.isPushStopped(function (ret) {
                if (ret && ret.isStopped) {}
            });
        })
    }

    // 判断是否有ajpush模块
    function judgePush(callback) {
        if (!ajpush) {
            console.log('push模块不存在')
        } else {
            if (typeof callback == 'function') {
                callback()
            }
        }
    }
}
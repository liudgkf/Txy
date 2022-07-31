//分享模块
(function (window) {
    var Share = function () {};
    //分享至微信
    Share.prototype.shareWinXin = function (url, type) {
        var weiXin = api.require('wx');
        var weiTitle = '同心缘';
        var weiDescription = '看电影，玩游戏，去旅游.....颜值最高的附近交友软件';
        var weiThumb = 'widget://res/logo.png';
        weiXin.shareWebpage({
            apiKey: '',
            scene: type,
            title: weiTitle,
            description: weiDescription,
            thumb: weiThumb,
            contentUrl: url,
        }, function (ret, err) {
            api.hideProgress();
            if (ret.status) {
                $.post(phpurl + 'index.php/home/User/sharenum', {
                    user_id: $api.getStorage('userid'),
                }, function (res) {
                    if (res.code == 201 && api.pageParam.type == 'parm') {
                        api.closeFrame({});
                        api.openFrame({
                            name: 'parm',
                            url: 'parm.html',
                            bounces: false,
                            bgColor: 'none',
                            vScrollBarEnabled: false,
                            rect: {
                                x: 0,
                                y: 0,
                                w: 'auto',
                                h: 'auto',
                            },
                            animation: {
                                type: 'movein',
                                curve: 'ease_in', //动画类型（详见动画类型常量）
                                subType: 'from_top', //动画子类型（详见动画子类型常量）
                                duration: 300, //动画过渡时间，默认300毫
                            },
                            pageParam: {
                                type: 'parm'
                            }
                        });
                    }
                });
                api.toast({
                    msg: '分享成功',
                });
            } else {
                api.toast({
                    msg: '分享失败',
                });;
            }
        });
    };
    //分享至qq
    Share.prototype.shareQQ = function (url, type) {
        var qq = api.require('QQPlus');
        var qqTitle = $api.getStorage('qqTitle');
        var qqDescription = $api.getStorage('qqDescription');
        var qqimgUrl = $api.getStorage('qqimgUrl');
        qq.shareNews({
            url: url,
            title: qqTitle,
            description: qqDescription,
            type: type,
            imgUrl: qqimgUrl,
        }, function () {});
    };
    window.Share = Share;
})(window);
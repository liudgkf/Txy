//支付的js
(function (window) {
    var pay = function pay(price, ordersid, phpurl, types) {
        this.price = price;
        this.ordersid = ordersid;
        this.phpurl = phpurl;
        this.types = types;
        //alert(this.price);alert(this.ordersid);alert(this.phpurl);alert(this.types);
    };
    //支付宝支付
    pay.prototype.zhifubao = function (callback) {
        var obj = api.require('aliPay');
        var subject = ZhiFuConfig.subject;
        var body = ZhiFuConfig.body;
        var notifyURL = this.phpurl + 'pay/notify_url.php?type=' + this.types;
        var types = this.type;
        var phpurl = this.phpurl;
        //支付异步通知借口（前端勿管）
        var price = this.price;
        var ordersid = this.ordersid;
        obj.config({
            partner: ZhiFuConfig.partner, //
            seller: ZhiFuConfig.seller, //
            rsaPriKey: ZhiFuConfig.rsaPriKey, //
            rsaPubKey: ZhiFuConfig.rsaPubKey, //
            notifyURL: notifyURL, //
        }, function (ret, err) {
            console.log($api.jsonToStr(ret));
            console.log($api.jsonToStr(err));
        });
        //		alert($api.jsonToStr({
        //			subject : subject,
        //			body : body,
        //			amount : price,
        //			tradeNO : ordersid
        //		}))
        obj.pay({
            subject: subject,
            body: body,
            amount: price,
            tradeNO: ordersid,
        }, function (ret, err) {
            if (ret.code == 9000) {
                callback && callback(true);
            } else if (ret.code == 4000) {
                alert('系统异常,错误码:4000');
                callback && callback(false);
            } else if (ret.code == 4001) {
                alert('数据格式不正确,错误码:4001');
                callback && callback(false);
            } else if (ret.code == 4003) {
                alert('支付宝账户被冻结或不允许支付,错误码:4003');
                callback && callback(false);
            } else if (ret.code == 4003) {
                alert('支付宝账户被冻结或不允许支付,错误码:4003');
                callback && callback(false);
            } else if (ret.code == 4006) {
                alert('订单支付失败,错误码:4006');
                callback && callback(false);
            } else if (ret.code == 6001) {
                api.toast({
                    msg: '订单支付已被取消',
                });
                callback && callback(false);
            } else if (ret.code == '0001') {
                alert('支付模块缺少商户id等商户配置信息,错误码:0001');
                callback && callback(false);
            } else if (ret.code == '0002') {
                alert('支付模块缺少（subject、body、amount、tradeNO）等参数,错误码:0002');
                callback && callback(false);
            } else if (ret.code == '0003') {
                alert('支付模块中的公钥密钥与支付宝上配置的不一致,错误码:0003');
                callback && callback(false);
            } else {
                callback && callback(false);
            }
        });
    };
    pay.prototype.weixinzhifu = function (callback) {
        // if (this.types == 1) {
        payurl = 'weixin/example/app.php';
        // }
        // else {
        //     payurl = 'weixinvip/example/app.php';
        // }
        var phpurl = this.phpurl;
        var price = this.price;
        var ordersid = this.ordersid;
        //     alert(payurl);alert(price);alert(ordersid);alert(phpurl);
        api.ajax({
                url: phpurl + payurl, // 调取微信支付借口（前端勿管）  后台工程师配置：http://www.fondfell.com/m/api/weixin/lib/WxPay.Config.php 即可         安卓获取签名工具 ：http://www.fondfell.com/zentaopms/www/doc-view-24.html
                method: 'POST',
                timeout: '30',
                dataType: 'json',
                returnAll: false,
                cache: true,
                data: {
                    values: {
                        type: 'login',
                        zongjia: price, //支付的价格
                        danhao: ordersid, //单号
                    },
                },
            },
            function (ret, err) {
                console.log(JSON.stringify(ret))
                console.log(JSON.stringify(err))
                //          alert(JSON.stringify(ret));
                if (ret) {
                    var back_info = ret;
                    var weiXin = api.require('wxPay');
                    weiXin.payOrder({
                        orderId: back_info.prepayid,
                        mchId: back_info.partnerid,
                        nonceStr: back_info.noncestr,
                        timeStamp: back_info.timestamp,
                        package: back_info.package,
                        sign: back_info.sign,
                    }, function (ret, err) {
                        if (ret.status) {
                            //	                                alert('no')
                            api.toast({
                                msg: '支付成功',
                            });
                            api.sendEvent({
                                name: 'money_get',
                            });
                            callback && callback(true);
                        } else {
                            if (err.code == 2) {
                                api.toast({
                                    msg: '支付失败',
                                });
                                callback && callback(false);
                            }
                        }
                    });
                } else {

                    //	            alert(JSON.stringify(err));
                    callback && callback(false);
                }
            });
    };
    window.pay = pay;
    var ZhiFuConfig = {
        subject: '同心缘', //订单名称
        body: '同心缘', //收款方名称
        seller: ' payhelp@163.com', //商户账号
        partner: '2088331296331780', //合作者ID
        //商户私钥
        rsaPriKey: 'MIICdwIBADANBgkqhkiG9w0BAQEFAASCAmEwggJdAgEAAoGBALTiNF1G9UiO6Y+Yq2lhbiatbsFzemJuItPmmdA2ePjEQLtJKSaHn26OR8s809lbeoZPAm0GcyvrvTjoKGQHPCSsfA6H/C04jOoWzhTMxZwTZZG5xdAq3441AZyNvBaSo/4M6ATYAgJ1PHvDyF7yrxTqb2yPqnKus36aiAXoiCePAgMBAAECgYEAjglKYSyFEzLViGKzxw4wtsJdRB7vrTcathZQFcWQfJdu1SH/5Dd/JAspqRfcqsNAlRKZrw7vhT+Z2IPEo7diq37MgwALLWsJW0/gfovh6SqCH8GV2LRh7sjFOszdEUkdVKcBW+9dzrqx7TJCiJSpFlC9zjpIFav26bmYWqUIFYECQQDnJY70CWHlbZ+I0nNpjgpOUVOHTKmKvWueyYKuVemZ+MYHNYlM2YaOFF54Uer8otMALugn4Zk71fkAIemPqkdvAkEAyFUgWjkRPGJ8UuLlFth4huQO5pBNDDod1muozQEArVdZY8ut0A6OYsfjK9iJb22skfQIo2hsTpP9XiMIZG8R4QJAeqZ0R0ufNZVInNpGwVDMaShAMT/diq/eJkB45jbSIJBfy719oFigTE3EnwWgsfNYEPXS3C6aF6T/XjGgdEn/YwJAc/AQEScFupSkrrNxMY+F8Ur69KR+cp0Pt5AG2N3Dro3mxcKSjN5fuPtFlZJzt3EZdj5s4WUFiVRMRbawnK9LAQJBAIIHHDe1zdUBzeIAIKDLFPFpqEc4hZuICgdZtHaU6ZVLFKCKJSN/y+X0KSPEwYE8hpD0kWXXM3Vw4XHgx89m8T0=',
        //商户公钥
        rsaPubKey: 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC04jRdRvVIjumPmKtpYW4mrW7Bc3pibiLT5pnQNnj4xEC7SSkmh59ujkfLPNPZW3qGTwJtBnMr67046ChkBzwkrHwOh/wtOIzqFs4UzMWcE2WRucXQKt+ONQGcjbwWkqP+DOgE2AICdTx7w8he8q8U6m9sj6pyrrN+mogF6IgnjwIDAQAB',
    };
})(window);
/*
//支付宝支付
function zhifubao(price,ordersid){

        var obj = api.require('aliPay');
        var subject = '来嗨网络';//订单名称
        var body = '来嗨网络订单';//收款方名称
        var notifyURL = 'http://www.fondfell.com/laihai/api/pay/notify_url.php';//支付异步通知借口（前端勿管）
        obj.config({
            partner: '2088221546451343',//
            seller: 'zhengding_jiang@aliyun.com',//
            rsaPriKey: 'MIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGBANiRCg5HzSrwWgbAykPvECd+4nNzzK06k7o1WuKU3YgLjB4did7I+Vd2nW3fV/5MPKgNRr4Uhkd19TGjdR8myomjjTPkEMpcIR0M9Or7mLn78z2ltRo769qD8z0HV9mSq7qOUDpZXll0UCdTAXvWxMvjgwQmXaYoQvSB1IgPtM7dAgMBAAECgYAF30DnjDja7jNytW2GlAfbGkynlr84/zqcNPAm7qRnGPEOq/xeBxMDtRqlrQWkxopqgBmn88SEUYV5eBYn5xRcxEHEpdLVDSs7wYd5HErWRMF2aGu7rAy4cJ+3W03Q4pPX5Jybbi19/spq7RiyZRQhe1PPSrMDZe2ykqbcNR3pIQJBAPi4G06BROu9tBYAipmL1Cb6KDF9XmQGmkIn54B2ZvCIX8KN/QGW+t3ZgaopVyTa8h0fvbfs2D7vs22bJQLacSkCQQDe5/tl81/7gx1do3cI4ge+03W0cxMIY2EypSkCLHo2RiZvfIHNxw5yrSTLCqOAtlbmU+pNQx9Qv6lUjtYo7aKVAkAhoNroUWgdK6gWtXoH6rUDlB0tG9NQWOgwe668WsXuTbIM3x/PQDepGUiD1lUXAZdswqbnIFnYoJY1Ap4NdbWJAkAKXRDEKa+RuwPXga0cHZ4skhpL3HnLDwvK1gD1F+pKsbJBxrEmRxX14PTv97uoVVHu/YHMO82t7GtMAiQU3Q+NAkEAyOR7rSv2sxJxQCKE/0xvBEFg+NVQ2dWLLttnDFLChf2U9zVK/dllkVlc+yTNm5TCyBdKfTkfnfAV7iu1GyNzyA==',
            rsaPubKey: 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDYkQoOR80q8FoGwMpD7xAnfuJzc8ytOpO6NVrilN2IC4weHYneyPlXdp1t31f+TDyoDUa+FIZHdfUxo3UfJsqJo40z5BDKXCEdDPTq+5i5+/M9pbUaO+vag/M9B1fZkqu6jlA6WV5ZdFAnUwF71sTL44MEJl2mKEL0gdSID7TO3QIDAQAB',//公钥
            notifyURL: notifyURL
        }, function(ret, err) {

        });

        obj.pay({
            subject: subject,
            body: body,
            amount: price,
            tradeNO: ordersid
        }, function(ret, err) {

            if (ret.code == 9000) {
                $api.post('http://www.fondfell.com/laihai/api/weixins.php',
				 { //POST开始 ：支付结果通知（前端勿管）
                    values: {
                        danhao: ordersid
                    }
                }, function(ret) {

                    alert('支付成功');
                }, 'json'); //POST结束


            } else {
                $api.toast('支付失败啦', '可以重来嘛', 1000);

            }

        });
}

//微信支付
function weixinzhifu(price,ordersid,phpurl){

    api.ajax({
        url: phpurl+"weixin/example/app.php",// 调取微信支付借口（前端勿管）  后台工程师配置：http://www.fondfell.com/m/api/weixin/lib/WxPay.Config.php 即可         安卓获取签名工具 ：http://www.fondfell.com/zentaopms/www/doc-view-24.html
        method: 'POST',
        timeout: '30',
        dataType: 'json',
        returnAll: false,
        cache: true,
        data: {
            values: {
                type: "login",
                zongjia: price,  //支付的价格
                danhao: ordersid  //单号
            }
        }
    },
    function(ret, err) {
        if (ret) {
            var back_info = ret;
            var weiXin = api.require('wxPay');
            weiXin.registerApp(
                function(ret, err) {
                    if (ret.status) {
                        weiXin.payOrder({
                            orderId: back_info.prepayid,
                            mchId: back_info.partnerid,
                            nonceStr: back_info.noncestr,
                            timeStamp: back_info.timestamp,
                            package: back_info.package,
                            sign: back_info.sign
                        }, function(ret, err) {


                            if (ret.status) {

                                $api.post(phpurl+'weixins.php', { //POST开始   //支付结果通知借口
                                    values: {
                                        danhao: ordersid
                                    }
                                }, function(ret) {

                                    alert('支付成功');



                                }, 'json'); //POST结束

                            } else {
                                if (err.code == 2) {
                                    alert('支付失败');
                                }

                            }
                        });
                    } else {
                        alert(err.msg);
                    }
                }
            );
        } else {
            alert(JSON.stringify(err));
        }
    });

}*/
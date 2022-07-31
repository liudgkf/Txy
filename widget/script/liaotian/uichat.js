var UIChat = function () {
    var UIChatBox = api.require('UIChatBox');

    // 打开
    this.open = function (callback) {
        UIChatBox.open({
            placeholder: '',
            maxRows: 4,
            emotionPath: 'widget://res/img/emotion',
            texts: {
                recordBtn: {
                    normalTitle: '按住说话',
                    activeTitle: '松开结束'
                },
                sendBtn: {
                    title: 'send'
                }
            },
            styles: {
                inputBar: {
                    borderColor: '#d9d9d9',
                    bgColor: '#f2f2f2'
                },
                inputBox: {
                    borderColor: '#B3B3B3',
                    bgColor: '#FFFFFF'
                },
                emotionBtn: {
                    normalImg: 'widget://res/img/face.png',
                },
                extrasBtn: {
                    normalImg: 'widget://res/img/jia.png',
                },
                keyboardBtn: {
                    normalImg: 'widget://res/img/jian_pan.png',
                },
                speechBtn: {
                    normalImg: 'widget://res/img/lu_yin.png',
                },
                recordBtn: {
                    normalBg: '#c4c4c4',
                    activeBg: '#3dad12',
                    color: '#000',
                    size: 14
                },
                indicator: {
                    target: 'both',
                    color: '#c4c4c4',
                    activeColor: '#9e9e9e'
                },
                sendBtn: {
                    titleColor: '#4cc518',
                    bg: '#000000',
                    activeBg: '#000000',
                    titleSize: 14
                }
            },
            extras: {
                titleSize: 10,
                titleColor: '#a3a3a3',
                btns: [{
                    title: '图片',
                    normalImg: 'widget://res/img/tu_pian.png',
                    activeImg: 'widget://res/img/tu_pian.png',
                }, {
                    title: '拍照',
                    normalImg: 'widget://res/img/xiang_ji.png',
                    activeImg: 'widget://res/img/xiang_ji.png',
                }, ],
            }
        }, function (ret, err) {
            if (ret) {
                if(typeof callback == 'function'){
                    callback(ret);
                }
            } else {
                alert(JSON.stringify(err));
            }
        });
    }


    // 关闭
    this.close = function(){
        UIChatBox.close();
    }

    // 显示
    this.show = function(){
        UIChatBox.show();
    }
    // 隐藏
    this.hide = function(){
        UIChatBox.hide();
    }

    // 弹出键盘
    this.showKeyboard = function(){
        UIChatBox.popupKeyboard();
    }

}
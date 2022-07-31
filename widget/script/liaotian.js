// 处理数据
function dealData(data) {
    console.log(JSON.stringify(data))
    var type = data.type;
    var self = data.self;
    var userid = data.self == 1 ? $api.getStorage('userid') : touserid;
    data.pic_headimg = imgurl + data['head_portrait'];
    var info = {
        id: data.id,
        headimg: data.pic_headimg,
        content: phpurl + data.content,
        content_origin: phpurl + data.content,
        showtime: data.showtime,
        time: data.time,
        userid: userid,
        second: data.second,
        status: data.status || 0,
        state: data.state || 0,
    };
    info.sender = self == 0 ? 'zs' : 'self';
    var typeArr = ['text', 'image', 'sound', 'video', 'file', 'hongbao', 'area'];
    info.type = typeArr[type];
    if (type == 0) {
        info.content = getMesge(data.content);
        info.content_origin = data.content;
    }
    // 红包
    if (type == 5) {
        info.content = data.content.substring(0, 10);
        info.content_origin = data.content;
    }
    if (type == -1) {
        info.type = 'tip';
        if (data.data && data.data.chat_id) {
            if ($api.getStorage('userid') == data.data.userid) {
                // 我发的
                var text = data.data.touser_name + '领取了你';
            } else {
                // 对方发的
                var text = '你领取了' + data.data.user_name;
            }
            info.content = text;
            info.content_origin = text;
            info.chat_id = data.data.chat_id;
        }
    }
    console.log(JSON.stringify(info))
    return info;
}


// 打开拍照
function pai_zhao(sourceType, callback) {
    api.getPicture({
        sourceType: sourceType,
        encodingType: 'jpg',
        destinationType: 'url',
        mediaValue: 'pic',
        quality: 50,
        saveToPhotoAlbum: false,
    }, function (ret, err) {
        if (ret && ret.data) {
            callback && callback(ret.data);
        } else {
            api.toast({
                msg: '没有拍照',
            });
        }
    });
}


function loadAllImage(callback) {
    var $imgs = $('.msg-content-image');
    var len = $imgs.length - loadImage;
    if (len == 0) {
        callback && callback();
        return;
    }
    var loadnum = 0;
    $imgs.load(function () {
        loadnum++;
        loadImage++;
        if (loadnum == len) {
            callback && callback();
        }
    });
    $imgs.error(function () {
        loadnum++;
        loadImage++;
        if (loadnum == len) {
            callback && callback();
        }
    });
};



//得到替换后的消息内容
function getMesge(str) {
    if (!str) {
        return '';
    }
    str = str.replace(/\[(.+?)\]/g, function (a, b) {
        var url = '../../res/img/emotion/' + getEmotionUrl(a) + '.png';
        return '<img src=' + url + ' border="0" width="25"/>';
    });
    str = entityToString(str);
    return str;
}
// 实体字符转html代码
function entityToString(entity) {
    // 若无实体字符则不转换
    if (entity.indexOf('&lt' == -1)) return entity;
    var div = document.createElement('div');
    div.innerHTML = entity;
    var res = div.innerText || div.textContent;
    return res;
}
//根据表情名获取表情图片路径
function getEmotionUrl(text) {
    for (var i = 0; i < emotionUrl.length; i++) {
        if (text == emotionUrl[i].text) {
            return emotionUrl[i].name;
        }
    }
}

// 获取用户信息
function getUserInfo() {
    _ajax('user_info.php', function (ret, err) {
        console.log(JSON.stringify(ret))
        if (ret && ret.code == 200) {
            userInfo.headimg = imgurl + ret.result.head_300;
        }
    }, {
        user_id: $api.getStorage('userid'),
        longitude: $api.getStorage('lon'),
        latitude: $api.getStorage('lat')
    })
}

// 复制
function copyTxt(text) {
    var clipBoard = api.require('clipBoard');
    clipBoard.set({
        value: text
    }, function (ret, err) {
        console.log(JSON.stringify(ret))
        console.log(JSON.stringify(err))
        if (ret.status) {
            _msg('复制成功');
        } else {
            _msg('复制失败');
        }
    });
}

// 菜单框
function showAction(text, id, msgType) {
    console.log(text);
    console.log(id);
    if(msgType == 'sound' || msgType == 'hongbao'){
        return;
    }

    var buttons = msgType == 'text' ? ['撤回', '删除', '复制'] : ['撤回', '删除'];
    // var _id = id.replace('id', '');
    _action('', buttons, function (bIndex) {
        if (bIndex != buttons.length + 1) {

            if (bIndex == 1) {
                // 撤回
                _ajax('home/privatechat/recall', function (ret, err) {
                    console.log(JSON.stringify(ret))
                    console.log(JSON.stringify(err))
                    var msg = ret.msg;
                    _msg(msg);
                    if (ret && ret.code == 200) {
                        recallCss(id);
                    }
                }, {
                    chat_id: id,
                    user_id: $api.getStorage('userid')
                })
            } else if (bIndex == 2) {
                // 删除
                _ajax('home/privatechat/delete', function (ret, err) {
                    console.log(JSON.stringify(ret))
                    console.log(JSON.stringify(err))
                    var msg = ret.msg;
                    _msg(msg);
                    if (ret && ret.code == 200) {
                        var index = $('#id' + id).index();
                        $('#id' + id + ' .msg-item').remove();
                        record.splice(index, 1);
                    }
                }, {
                    chat_id: id,
                    user_id: $api.getStorage('userid')
                })
            } else if (bIndex == 3) {
                copyTxt(text);
            }
        }
    })
}

// 移除被撤回消息
function recallCss(id) {
    console.log(id)
    var index = $('#id' + id).index();
    var html = '<div class="recall"><span>该消息已被撤回</span></div>';
    console.log(index);
    console.log(JSON.stringify(record))
    record[index].status = 3;
    $('#id' + id + ' .msg-item').before(html);
    $('#id' + id + ' .msg-item').remove();
}

// 点击红包
function openRed(id) {
    console.log(id);
    var myuserid = $api.getStorage('userid');
    var index = $('#id' + id).index();
    var data = record[index];
    // console.log(JSON.stringify(record))
    console.log(index);
    console.log(JSON.stringify(data));
    if (data.userid == myuserid) {
        // 自己发的红包
        _url({
            id: id
        }, 'frame0/hong_bao_detail');
    } else {
        if (data.state == 0) {
            // 对方发的红包
            showDetail('frame0/hong_bao', {
                id: id
            });
        } else {
            _url({
                id: id
            }, 'frame0/hong_bao_detail');
        }
    }
}


// 打开红包详情
function openRedDetail(id) {
    _url({
        id: id
    }, 'frame0/hong_bao_detail');
}


// 更新红包状态
function updateHongbao(id, state) {
    var $this = $('#id' + id);
    var index = $this.index();
    record[index].state = state;
    if (state == 1) {
        $this.find('.red-img').addClass('red-img-no');
    }
    var txtArr = ['等待领取', '已领取', '已过期'];
    $this.find('.red-game').text(txtArr[state]);
}
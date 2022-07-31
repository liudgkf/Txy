var base_url = 'http://n2n1.cn/';
var phpurl = base_url + 'apis/'
var share_url = 'http://n2n1.cn/';
var imgurl = base_url + 'disk/';
var html_win = 'widget://html/';
var myuserid = $api.getStorage('userid');
var mysex = $api.getStorage('sex');

// 打开窗口
function _url(pageParam, url, login) {
	var nameUrl = url;
	var e = window.event || arguments.callee.caller.arguments[0];
        stopBubble(e);
	if (!url) {
		url = 'win';
		nameUrl = pageParam.url;
	}
	var animationType = 'push';
	if (pageParam.animationType == 0) {
		animationType = 'none';
	}
	var subType = pageParam.subType ? pageParam.subType : 'from_right';
	var slidBackEnabled = pageParam.slidBackEnabled === 0 ? false : true;
	console.log(nameUrl);
	api.openWin({
		name: nameUrl,
		url: html_win + url + '.html',
		pageParam: pageParam,
		reload: true,
		hideHomeIndicator: false,
		slidBackEnabled: slidBackEnabled,
		animation: {
			type: animationType, //动画类型（详见动画类型常量）
			subType: subType, //动画子类型（详见动画子类型常量）
			duration: 500
		}
	})
}

function stopBubble(e) {
	//如果提供了事件对象，则这是一个非IE浏览器 
	if (e && e.stopPropagation)
	// 	//因此它支持W3C的stopPropagation()方法 
		e.stopPropagation();
	// else
	// 	//否则，我们需要使用IE的方式来取消事件冒泡 
	// 	window.event.cancelBubble = true;
}


// 统一服装调用 Frame页面
// url 页面文件命
// header 不填写默认读取顶部高度    填写1表示不显示header
// footer 不填写默认读取底部高度    填写1表示不显示footer
function _openFrame(url, header, footer, pageParam) {
	// 解析属性	消除点击300S 延时问题 tapmode
	api.parseTapmode();
	var headerh;
	var footerh;
	if (header == 1) {
		headerh = 0;
	} else {
		var header = $api.dom('header');
		$api.fixStatusBar(header);
		var headerPos = $api.offset(header);
		headerh = headerPos.h
	}
	if (footer == 1) {
		footerh = 0;
	} else {
		$api.fixTabBar($api.dom('footer'))
		footerh = $api.offset($api.dom('footer')).h;
	}
	var allowEdit = false;
	if (pageParam && pageParam.allowEdit == 1) {
		allowEdit = true;
	}
	api.openFrame({
		name: url,
		url: html_win + url + '.html',
		bounces: false,
		reload: true,
		rect: {
			x: 0,
			y: headerh,
			w: 'auto',
			h: 'auto',
			marginBottom: footerh
		},
		allowEdit: allowEdit,
		pageParam: pageParam
	})
}


// 打开模态框
function showDetail(url, data, topH, footerH) {
	var th = topH || 0;
	var fh = footerH || 0;
	api.openFrame({
		name: url,
		url: html_win + url + '.html',
		bounces: false,
		rect: {
			x: 0,
			y: th,
			w: 'auto',
			h: 'auto',
			marginBottom: fh
		},
		useWKWebView: true,
		bgColor: 'rgba(0,0,0,0)',
		animation: {
			type: "fade", //动画类型（详见动画类型常量）
			subType: "from_bottom", //动画子类型（详见动画子类型常量）
			duration: 300 //动画过渡时间，默认300毫秒
		},
		pageParam: data,
		reload: true
	})
}

// 延时关闭窗口
function timerWin(time, winName) {
	var t = time || 1000;
	setTimeout(function () {
		if (winName) {
			api.closeToWin({
				name: winName
			})
		} else {
			api.closeWin();
		}
	}, t)
}

// 关闭窗口
function _closeToWin() {
	if (api.pageParam['winName']) {
		api.closeToWin({
			name: api.pageParam['winName']
		})
	} else {
		api.closeWin();
	}
}

// ajax
function _ajax(urls, callback, data) {
	var type = data ? 'post' : 'get';
	var url = urls.toLowerCase(); // 转为小写
	if (url.indexOf('.php') != -1) { // 原生
		var f_url = base_url + 'apis/';
	} else if (url.indexOf('home/') != -1) { // tp3 
		var f_url = base_url + 'apis/index.php/';
	} else if (url.indexOf('api/') != -1) { // tp5
		var f_url = base_url + 'index.php/';
	} else { // 后端封装
		var f_url = base_url + 'apis/index.php?'
	}
	console.log(JSON.stringify(f_url + urls))
	api.ajax({
		url: f_url + urls,
		method: type,
		data: {
			values: data
		},
		cache: true,
	}, callback);
}


// 上传文件
function _ajaxFile(urls, callback, data, files) {
	var url = urls.toLowerCase(); // 转为小写
	if (url.indexOf('.php') != -1) { // 原生
		var f_url = base_url + 'apis/';
	} else if (url.indexOf('home/') != -1) { // tp3 
		var f_url = base_url + 'apis/index.php/';
	} else if (url.indexOf('api/') != -1) { // tp5
		var f_url = base_url + 'index.php/';
	} else { // 后端封装
		var f_url = base_url + 'apis/index.php?'
	}
	console.log(JSON.stringify(f_url + urls))
	api.ajax({
		url: f_url + urls,
		method: 'post',
		timeout: data.timeout || 6000,
		data: {
			values: data,
			files: files
		},
		cache: true,
	}, callback)
}
// ajax
function _ajaxOrign(url, callback, data) {
	var type = data ? 'post' : 'get';
	console.log(JSON.stringify(url))
	api.ajax({
		url: url,
		method: type,
		data: {
			values: data
		},
		cache: true,
	}, callback);
}

//loading层
function _loading(data) {
	var msg = (data && data.msg) ? data.msg : '加载中';
	var title = (data && data.title) ? data.title : '';
	api.showProgress({
		title: title,
		text: msg,
		modal: true,
		animationType: 'zoom',
	});
}

// 关闭 提示
function _loadingClose() {
	api.hideProgress();
	api.refreshHeaderLoadDone();
}


// 弹出提示
function _alert(msg, functions, title) {
	api.alert({
		msg: msg,
		title: title,
	}, functions)
}

// msg提示
function _msg(msg, duration, location) {
	if (!location) {
		location = 'middle';
	}
	if (!duration) {
		duration = 2000;
	}
	api.toast({
		msg: msg || '错误',
		duration: duration,
		location: location
	});
}


// 底部弹窗
function _action(title, buttons, callback) {
	api.actionSheet({
		title: title,
		buttons: buttons,
		style: {
			// layerColor:'',         //遮蔽层颜色，仅支持 rgba颜色，默认值：rgba（0, 0, 0, 0.4）
			// itemNormalColor:'',    //选项按钮正常状态背景颜色，支持#000、#000000、rgb、rgba，默认值：#F1F1F1
			// itemPressColor:'',     //选项按钮按下时背景颜色，支持#000、#000000、rgb、rgba，默认值：#E6E6E6
			fontNormalColor: '#000000', //选项按钮正常状态文字颜色，支持#000、#000000、rgb、rgba，默认值：#007AFF
			fontPressColor: '#000000', //选项按钮按下时文字颜色，支持#000、#000000、rgb、rgba，默认值：#0060F0
			// titleFontColor:''      //标题文字颜色，支持#000、#000000、rgb、rgba，默认值：#8F8F8F
		}
	}, function (ret, err) {
		callback(ret.buttonIndex);
	});
}

// 统一方向 confirm  // 确定 取消 subIndex = 1,['确定','取消'] subIndex = 2, ['取消', '确定']
function _confirm(data, callback) {
	var subBtn = [1, 2];
	if (!data.btn) {
		data.btn = ['确定', '取消'];
	}
	var btn = api.systemType == 'ios' ? data.btn.reverse() : data.btn;
	var sub = api.systemType == 'ios' ? subBtn.reverse() : subBtn;
	api.confirm({
		title: data.title || '提示',
		msg: data.msg || '',
		buttons: btn,
	}, function (ret, err) {
		if (callback && typeof callback == 'function') {
			callback(sub[ret.buttonIndex - 1]);
		}
	})
}

// 广播事件
function _listener(name, callback) {
	api.addEventListener({
		name: name
	}, function (ret) {
		callback(ret);
	})
}

function _send(name, data) {
	api.sendEvent({
		name: name,
		extra: data
	})
}

// 状态栏 1 黑字 0白字
function _heibai(type) {
	var style = type ? 'dark' : 'light'
	api.setStatusBarStyle({
		style: style,
		color: 'rgba(0,0,0,0)'
	});
}


// 退出应用
function keyback() {
	var exitStatu;
	api.addEventListener({
		name: 'keyback'
	}, function () {
		_back();
	})

	function _back() {
		if (!exitStatu) {
			exitStatu = 1;
			_msg("再按一次返回键退出");
			setTimeout(function () {
				exitStatu = null;
			}, 2000)
		} else if (exitStatu == 1) {
			api.closeWidget({
				silent: true
			});
		}
	}
}

/*
 *camera               //相机/拍照/录像
 *contacts             //写入/读取通讯录
 *microphone           //麦克风/录制音频
 *photos               //相册/本地存储。Android上等同storage权限
 *location             //定位
 *locationAlways       //后台定位，只支持iOS
 *notification         //状态栏通知
 *calendar             //日历读写，只支持Android
 *phone                //直接拨打电话/获取手机号码、IMEI（设备标识），只支持Android
 *sensor               //传感器，只支持Android
 *sms                  //后台发送短信，只支持Android
 *storage              //存储空间，读取相册，多媒体，本地存储相关，只支持Android
 */
// 获取相应权限
function getPermission(perArr, callback) {
	if (api.systemType == 'ios') {
		return;
	}
	var list = perArr ? perArr : ['camera', 'microphone', 'photos', 'location', 'storage'] // 相机 麦克风 定位 存储
	var result = api.hasPermission({
		list: list
	});

	console.log(JSON.stringify(result));
	var noP = [];
	for (var i = 0, len = result.length; i < len; i++) {
		if (!result[i].granted) {
			noP.push(result[i].name);
		}
	}


	api.requestPermission({
		list: noP,
		code: 100001
	}, function (ret, err) {
		var noPer = 0;
		for (var j = 0, jlen = ret.list.length; j < jlen; j++) {
			if (!ret.list[j].granted && noPer == 0) {
				noPer = 1;
			}
		}
		// 有权限未开启 返回1
		if (typeof callback == 'function') {
			callback(noPer);
		}
		console.log(JSON.stringify(ret));
	});

	// 若所需权限都开启，返回0
	if (noP.length == 0) {
		if (typeof callback == 'function') {
			callback(0);
		}
	}
}
// 上拉滚动参数统一设置
var textDown = '下拉刷新...',
	textUp = '松开刷新...',
	bgColor = '#fff',
	textColor = '#000',
	visible = true,
	showTime = true,
	loadingImg = '',
	textLoading,
	textTime;

// 通用设置变量
var pagenum = 1;
var pagesize = 10;
//  禁止滚动
var heigutgao = 0;
var pagecount = 10;
var threshold = 0;

function _shangla(functions, refreshHeaderLoading) {
	api.parseTapmode();
	api.setRefreshHeaderInfo({
		visible: true,
		loadingImg: loadingImg,
		bgColor: bgColor,
		textColor: textColor,
		textDown: textDown,
		textUp: textUp,
		showTime: true,

	}, functions);
	// 第一次打开APP，自动执行刷新
	if (!refreshHeaderLoading) {
		api.refreshHeaderLoading();
	}
}

// 渲染数据
function _lists(url, page, loading, data) {
	if (!url) {
		api.refreshHeaderLoadDone();
		return;
	}
	// url = url.toLowerCase(); // 转为小写
	if (!data) {
		data = {};
	}
	data.pagecount = 10;
	data.pagesize = 10;
	data.page = page;
	pagenum = page;
	if ($('#no_more').length == 0) {
		$('body').append('<div id="no_more"></div>');
	}
	_ajax(url, function (ret, err) {
		console.log(JSON.stringify(ret))
		console.log(JSON.stringify(err))
		ret = ret.ret ? ret.ret : ret;
		if (ret) {
			if (loading == 1) { // 上拉刷新时  初始化参数
				$('body').scrollTop(0);
				$('#no_more').text('加载更多');
				$('#no_more').removeClass('null');
				// 重置滚动统计
				heigutgao = 1;
				pagenum = 0;
				// 停止刷新
				api.refreshHeaderLoadDone();
				view.ffList = [];
			}
			heigutgao = 1;
			ret.result = ret.result ? ret.result : ret.data ? ret.data : [];
			if (page == 0) {
				view.ffList = [];
			}
			view.ffList = view.ffList.concat(ret.result);

			$('#no_more').text('加载更多');
			if (ret.result.length < pagecount) {
				heigutgao = 0;
				$('#no_more').text('没有更多了');
			}
			console.log(view.ffList.length)
			if (view.ffList.length == 0) {
				$('#no_more').text('');
				$('#no_more').addClass('null');
			}
		} else {
			view.ffList = [];
			api.refreshHeaderLoadDone();
		}
	}, data)
	setTimeout(function () {
		_loadingClose();
	}, 300)
}

// 滚动
function _scrollToBottom(callback) {
	api.addEventListener({
		name: 'scrollToBottom',
		extra: {
			threshold: threshold
		}
	}, function () {
		if (typeof callback != 'function') return;
		callback();
	})
}

// 验证手机号码
function checkMobile(mobile) {
	if (mobile == "") {
		return false;
	} else {
		// var valid_rule = /^(13[0-9]|14[5-9]|15[012356789]|166|17[0-8]|18[0-9]|19[8-9])[0-9]{8}$/; // 手机号码校验规则
		// if (!valid_rule.test(mobile)) {
		// 	return false;
		// }
		mobile = mobile.replace(/\s*/g, '');
		if (mobile.length != 11) {
			return false;
		}
		return true;
	}
}

// 随机数 包括最小值 不包括最大值
function getRandom(min, max) {
	var num = Math.floor(Math.random() * (max - min + 1) + min);
	return num;
}

// 判断网络
function judgeNet() {
	api.addEventListener({
		name: 'offline'
	}, function (ret, err) {
		_url({}, 'error');
	});
}

// 清除所有HTML
function clearHtml(s) {
	if (!s) {
		return s;
	}
	var dd = s.replace(/<\/?.+?>/g, "");
	var dds = dd.replace(/ /g, "");
	return dds;
}

// 查看用户详情
function go_userInfo(id, name, sex) {
	var mysex = $api.getStorage('sex');
	if (sex && mysex == sex) {
		_msg('不可查看同性的详细信息')
		return;
	}
	var _u = $api.getStorage('shang') == 1 ? 'shang/user_info_frame' : 'frame0/user_info_frame';
	_url({ url: _u, title: name, user_id: id, moreType: 1 })
}


// 打开相册
function openPic(callback) {
	var buttons = ['优雅自拍', '浏览相册'];
	var typeArr = ['camera', 'album'];
	var qArr = [50, 100];
	var sys = api.systemType;
	_action('选择图片来源', buttons, function (bIndex) {
		if (bIndex != (buttons.length + 1)) {
			var perArr = ['camera', 'photos', 'storage'] // 相机 相册 存储
			if (sys != 'ios') {
				getPermission(perArr, function (code) {
					// 1权限未开启 0权限已开启
					if (code == 1) {
						_msg('请先开启相关权限');
					} else {
						api.getPicture({
							sourceType: typeArr[bIndex - 1],
							encodingType: 'jpg',
							mediaValue: 'pic',
							destinationType: 'url',
							quality: qArr[bIndex - 1],
							saveToPhotoAlbum: false,
						}, function (ret, err) {
							if (ret && ret.data) {
								if (typeof callback == 'function') {
									callback(ret)
								}
							} else {
								_msg('没有图片');
							}
						});
					}
				})
			} else {
				api.getPicture({
					sourceType: typeArr[bIndex - 1],
					encodingType: 'jpg',
					mediaValue: 'pic',
					destinationType: 'url',
					quality: qArr[bIndex - 1],
					saveToPhotoAlbum: false,
				}, function (ret, err) {
					if (ret && ret.data) {
						if (typeof callback == 'function') {
							callback(ret)
						}
					} else {
						_msg('没有图片');
					}
				});
			}
		}
	})
}


// 设置上下线 1上线 0下线
function setOnline(state) {
	var uid = $api.getStorage('userid');
	if (!uid) return;
	_ajax('set_online_state.php', function (ret) {}, {
		state: state,
		user_id: uid,
	})
}


// 打开登录页
function _login() {
	setOnline(0);
	var push = new Push();
	push.setAlias(0); // 退出登录 解除与该账号的关联
	$api.rmStorage('userid');
	$api.rmStorage('sex');
	_url({
		slidBackEnabled: 0
	}, 'user/login_win');
}

// 声音或震动
function setWarnning() {
	// var voice = 1;
	// var shake = 1;
	var voice = $api.getStorage('voice');
	var shake = $api.getStorage('shake');
	if (shake == 1) {
		//仅震动
		api.notification({
			vibrate: [100, 500]
		});
	}
	if (voice == 1) {
		var audio = api.require('netAudio');
		audio.play({ //聊天语音提醒
			path: 'http://www.youdingb.com/apk/tishi.mp3',
		}, function (ret) {});
	}
}




// 百度统计
function openMTJ() {
	// 初始化
	var mtj = api.require('modulebaidumtj');
	if (!mtj) return;
	var keyObj = {
		android: '2cc7044763',
		ios: '4044fdf7b2',
	}
	var appkey = api.systemType == 'ios' ? keyObj.ios : keyObj.android;
	// 初始化
	mtj.startWithAppkey({
		appkey: appkey,
		appVersion: api.appVersion,
		channelId: api.channel,
		enableExceptionLog: 'false',
		enableDebugOn: 'false'
	});
}



function onPageStart(name) {
	var demo = api.require('modulebaidumtj');
	if (!demo) return;
	demo.onPageStart({
		pageName: name
	});
}

function onPageEnd(name) {
	var demo = api.require('modulebaidumtj');
	if (!demo) return;
	demo.onPageEnd({
		pageName: name
	});
}


// 打开主窗口
function _index(type) {
	var a = ['index_win', 'diantai_win', 'xiaoxi_win', 'member_win'];
	var b = ['shang_win', 'shang/fabu_win', 'shang/member_win'];
	var arr = $api.getStorage('shang') == 1 ? b : a;
	api.openWin({
		name: arr[type],
		url: html_win + arr[type] + '.html',
		reload: false,
		hideHomeIndicator: false,
		slidBackEnabled: false,
		animation: {
			type: 'none', //动画类型（详见动画类型常量）
			duration: 500
		}
	})
}


// 更新底部导航消息数量
function changeMsgNum(num) {
	if (num && num > 0) {
		$('footer .num').text(num);
		$('footer .num').removeClass('new-hide');
	} else {
		$('footer .num').addClass('new-hide');
	}
}
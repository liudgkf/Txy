
//进入获取样式
function getTheme(){
   var themetype = $api.getStorage('themetype')||'0';
   var classs = [
   		'one',
   		'two',
   		'three',
   		'four',
   		'five',
   		'six',
   ];
   var className = $('html')[0].className;
   for(var i =0 ; i <classs.length ; i++ ){
   		if(className.indexOf(classs[i])!=-1){
   			className = className.replace(classs[i] , '');
   		}
   }
   
   className =className+ '  ' +classs[themetype];
 
   $('html').attr('class',className);
// alert('类名：'+className);
   
  
}


getTheme();

//全局监听颜色改变
function changeTheme(){
    api.addEventListener({
	    name:'changeTheme'
    },function(ret,err){
    	var themetype = $api.getStorage('themetype')||'0';
	    var classs = [
	   		'one',
	   		'two',
	   		'three',
	   		'four',
	   		'five',
	   		'six',
	    ];
	    var className = $('html')[0].className;
	    for(var i =0 ; i <classs.length ; i++ ){
	   		if(className.indexOf(classs[i])!=-1){
	   			className = className.replace(classs[i] , '');
	   		}
	    }
	    className =className+ '  ' +classs[themetype];
	    $('html').attr('class',className);
    });
}


/*通用win的调用函数,参数分别为: {title, frm_url, data, win}
 1,title显示在新窗口header上的名称;
 2,frm_url该win页面的frm子页面的url和name;
 3,data是要加多个参数就自己新建空的data对象把你要加的参数全部放在data对象中;
 4,win就是有时候要改win的名字，如果不用改win的名字这个参数就可以不用加；
 5.
 */


function openW(obj) {
	var win_title = $api.text(obj.title) || obj.title, jsfun = '', win_na = obj.winName, win_url = './html/Win.html', data = obj.data || {
		title : win_title,
		frm_url : obj.frm_url
	};
	if (obj.frm_url&&!win_na) {
		var a = obj.frm_url.lastIndexOf('/') + 1, b;
		if (obj.frm_url.indexOf('.') != -1) {
			b = obj.frm_url.lastIndexOf('.');
		} else {
			b = obj.frm_url.length;
		}
		win_na = obj.frm_url.slice(a, b);
	}
	data.frm_name = win_na + '-1';
	data.title = win_title;
	//这个是怕同时传win_title，frm_url和data ，win_tltle和frm_url失效的
	data.frm_url = obj.frm_url;

	if (!obj.frm_url && !data.frm_url && !obj.win) {
		alert('错误：  你没有传子窗口路径');
		return;
	};
	if (!win_title && !data.title && !obj.win) {
		alert('错误： 你没有传父窗口标题');
		return;
	};
	if (obj.win && obj.win.name) {
		win_na = obj.win.name || win_na;
		win_url = obj.win.url || win_url;
	}
	
	
	
	
	data = JSON.stringify(data);
	var animation = '';
	if (obj.animation) {
		animation = ',animation:' + JSON.stringify(obj.animation);
	}
	jsfun = "api.openWin({name: '" + win_na + " ', url: '" + win_url + "' ,  allowEdit:true,    pageParam:" + data + animation + "});"
	api.execScript({
		name : 'root1',
		script : jsfun
	});
};

var proportion = 1;
//改变图片尺寸
var changeImageSize = function(images){
    for(var i=0;i<images.length;i++){
        var width = images[i].offsetWidth;
        images[i].style.height = width*proportion+'px';
    }
}

function closeMyWin(){
    var sysType = api.systemType;
    if(sysType == "ios"){
	    setTimeout(function(){
	       api.closeWin({
	       });
	       
	    },500)
    }else{
        api.addEventListener({
	        name:'closeFWin'
        },function(ret,err){
        	api.closeWin({
	        });
        });
    }
}

function closeFWin(){
    api.sendEvent({
	    name:'closeFWin'
    });
}


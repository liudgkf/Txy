// 安卓 监听
var winHeight = window.innerHeight;

window.onresize = function () {
    var nowH = window.innerHeight;
    if($api.getStorage('shang') == 1)return;
    if(nowH < winHeight){
        $('#keyboard').addClass('new-hide');
    }else{
        $('#keyboard').removeClass('new-hide');
    }
}

(function(window){
    var selectAction={};
    var _callback;
     // 打开拍照    
	function pai_zhao(sourceType){
		api.getPicture({
			sourceType : sourceType,
			encodingType : "jpg",
			destinationType : "url",
			mediaValue : "pic",
			quality : 50,
			saveToPhotoAlbum : false
		}, function(ret, err) {
			//alert(ret.data);
			if (ret && ret.data) {
			   _callback&&_callback(ret.data);
			} else {
			    api.toast({
					msg : '没有拍照'
			    });
			}
		});
	}
    selectAction.shang_tu = function(callback){
        _callback = callback;
        api.actionSheet({
			title : '选择图片来源',
		    buttons : ['优雅自拍', '浏览相册']
		}, function(ret, err) {
			var index = ret.buttonIndex;
			if(index==1){pai_zhao('camera');}
			else if(index==2){pai_zhao('library');}
			else{return}
		});
    }
    
    window.selectAction = selectAction;
})(window)

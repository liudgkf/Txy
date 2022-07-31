//图片裁剪对象
(function(window){
    
    var clipImage = function(FNImageClip,callback){
        this.FNImageClip = FNImageClip;
        this.callback = callback;
    }
    
    //生成底部栏并绑定事件
    clipImage.prototype.addButtonContainer = function($p){
		var _this = this;
		
		var $warn = document.createElement('div');
		$warn.className = 'head';
		$warn.style.marginTop = '25px';
		//$api.fixStatusBar($api.dom('.head'));
		$warn.innerText = '请保持裁剪范围在图片区域内！！！！';
		$warn.style.background = '#f4c600 url(image/wa.png) no-repeat 10px center';
		$warn.style.fontSize = '13px';
		$warn.style.paddingLeft = '30px';
		$warn.style.backgroundSize = '15px';
		$warn.style.color = 'white';
		$warn.style.height = '30px';
		$warn.style.lineHeight = '30px';
		$warn.style.zIndex = '666666666666666';
		
		this.$warn =$warn;
		
		$p.insertBefore($warn,$p.childNodes[0]);
		var $button_container = document.createElement('div');
		$button_container.id = "button_container";
		$button_container.style.position = 'fixed';
		$button_container.style.bottom = 0+'px';
		$button_container.style.width ='100%';
		$button_container.style.left = '0px';
		$button_container.style.zIndex = '10000';
		$button_container.style.height = '50px';
		
		
		

		
		var $button2 = document.createElement('div');
		$button2.innerText = "取消";
		$button2.style.textAlign = 'center';
		$button2.style.height = "50px";
		$button2.style.lineHeight = "50px";
		$button2.style.width = '33.334%'
//		$button2.style.background = "#05BEFF";
		$button2.style.background = "rgba(0,0,0,.3)";
		$button2.style.color = 'white';
		$button2.style.fontSize = "15px";
		$button2.style.fontWeight = "blod";
		$button2.style.float = 'left'; 
		$button2.id = "cancel";
		
		var $button3 = document.createElement('div');
		$button3.innerText = "重置";
		$button3.style.textAlign = 'center';
		$button3.style.height = "50px";
		$button3.style.lineHeight = "50px";
		$button3.style.width = '33.334%'
//		$button3.style.background = "#05BEFF";
		$button3.style.background = "rgba(0,0,0,.3)";
		$button3.style.color = 'white';
		$button3.style.fontSize = "15px";
		$button3.style.fontWeight = "blod";
		$button3.style.float = 'left'; 
		$button3.id = "reset";
		//		$button3.style.borderRight = '1px solid white'
		
		
		var $button1 = document.createElement('div');
		$button1.innerText = "确认"
		$button1.style.textAlign = 'center';
		$button1.style.height = "50px";
		$button1.style.lineHeight = "50px";
//		$button1.style.background = "#05BEFF";
		$button1.style.background = "rgba(0,0,0,.3)";
		$button1.style.color = 'white';
		$button1.style.fontSize = "15px";
		$button1.style.fontWeight = "blod";
		$button1.style.width = '33.334%'
		$button1.id = "comfirm";
		$button1.style.float = 'left'; 
//		$button1.style.borderRight = '1px solid white';




		var $bd = document.createElement('div');
		$bd.style.position = 'absolute';
		$bd.style.top = '30px'; 
		$bd.style.left = '0px'; 
		$bd.style.right = '0px'; 
		$bd.style.bottom = '0px'; 
		$bd.style.background = "rgba(0,0,0,0.5)";
		$bd.id = "bd";
		
		$button_container.appendChild($button2);
		$button_container.appendChild($button3);
		$button_container.appendChild($button1);
		$p.appendChild($button_container);
		$p.appendChild($bd);
		
		this.button_cotainer = $api.dom($p,'#button_container');
		
		this.bd = $api.dom($p,'#bd');
		this.body = $p;
		$api.dom($p, '#reset').onclick = function(){
		   _this.reset();
		};
		
		$api.dom($p,'#comfirm').onclick = function(){
		   _this.save();
		};
		
		$api.byId('cancel').onclick = function(){
		   _this.close();
		};
    }
    
    
    
    //打开图片裁剪
    //srcPath 图片路径   api，  $body ， html：body标签      appearance，形状    w，宽   和，高  x，x轴起点    y，y轴起点   dech，裁剪区域高度  stah,裁剪区域起点
    clipImage.prototype.open = function(srcPath,api,$body,appearance,w,h,x,y,dech,stah){
       var _this = this;
       this.FNImageClip.open({
		    rect: {
		        x: 0,
		        y: stah,
		        w: api.winWidth,
		        h: dech
		    },
		    srcPath: srcPath,
		    mode:'image',
		    style: {
		        mask: 'rgba(0,0,0,0.5)',
		        clip: {
		            w: w,
		            h: h,
		            x: x,
		            y: y,
		            borderColor: '#fff', 
		            borderWidth: 1,    
		            appearance: appearance
		        }
		    },
		    fixedOn: api.frameName
		}, function(ret, err){        
		    if( ret ){
		        _this.addButtonContainer($body)
		    }else{
//		        alert( JSON.stringify( err ) );
		    }
		});
    }
    
    //重置
    clipImage.prototype.reset = function(){
        this.FNImageClip.reset();
    }
    
    //确认裁剪
    clipImage.prototype.save = function(){
        var callback = this.callback;
        this.FNImageClip.save({
		    destPath: 'fs://imageClip/result.png',
		    copyToAlbum: false,
		    quality: 1
		},function(ret, err){        
		    if(ret) {
		        var destPath = ret['destPath'];
		        callback & callback(destPath);
		    } else{
		        alert(JSON.stringify(err));
		    }
		});
    }
    
    //取消裁剪
    clipImage.prototype.close = function(){
//     $api.send('chongXingDiaoYong');
       this.body.removeChild(this.button_cotainer);
       this.body.removeChild(this.bd);
       this.body.removeChild(this.$warn);
       this.FNImageClip.close();
       api.closeWin({});
    }
    window.clipImage = clipImage;
})(window)
/**
 * Booking v1 h5 version.
 * Author       : kongming
 * createTime   : 16/12/28
 */
var projectName = new Vue({
	el: '#app',
	data: {
		loadingPageShow: true,
		loadingProgress: 0,
		bgmEle: document.getElementById("bgm"),
		showBgMusic: true,
		musicPlay: false,
		submitBtnDisabled: false,
		form: {
			name: '',
			tel: '',
			email: ''
		}
	},
	watch: {
        form.name: function () {this.checkForm('name');},
        form.tel: function () {
            if(this.phone.length>=11){
                this.checkFormSatu('phone');
            }
        },
        form.email: function () {this.checkForm('address');},		
	},
	mounted: function(){
		this.loader();
	},
	methods: {
		getUrlParms: function (name) {
		    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		    var r = window.location.search.substr(1).match(reg);
		    if (r != null)
		        return unescape(r[2]);
		    return null;
		},
        isWeiXin: function(){
            //window.navigator.userAgent属性包含了浏览器类型、版本、操作系统类型、浏览器引擎类型等信息，这个属性可以用来判断浏览器类型
            var ua = window.navigator.userAgent.toLowerCase();
            //通过正则表达式匹配ua中是否含有MicroMessenger字符串
            if(ua.match(/MicroMessenger/i) == 'micromessenger'){
                return true;
            }else{
                return false;
            }
        },	
        landscapeInit: function () {
            var _this = this;
            if (window.orientation == 90 || window.orientation == -90) {
                // console.log('横屏');
                _this.showLandscape = true;
            } else {
                // console.log('竖屏');
                _this.showLandscape = false;
            }
        }, 
		showNotice: function (text, type, time, callback) {
            var _this = this;
            if (this.notice.timer) {
                clearTimeout(this.notice.timer);
                this.notice.timer = null;
            }
            this.notice.show = true;
            this.notice.text = text;
            this.notice.type = type;
            this.notice.timer = setTimeout(function () {
                _this.notice.show = false;
                _this.notice.text = '';
                _this.notice.type = '';
                callback && callback();
            }, time);
        },               	
		loader: function () {
			var _this = this;
			var loader = new resLoader({
				//resources:  [assetsPath + 'imgs/music_btn.png', assetsPath + 'imgs/map_bg.png'],
				resources:  ['images/music_btn.png', 'https://mp3file1.mafengwo.net/201902281617/714ed729ca8a557b004397680ae8d31e/s13/M00/B1/56/wKgEaVx1OmWASp8PAHRO0QHiXJg103.mp3'],
				onStart: function(total){
				},
				onProgress: function(current, total){
					var percent = current/total*100;
					if(percent > 100) percent= 100;
                    this.loadingProgress = percent;					
				},
				onComplete: function(){
					this.loadingPageShow = false;
					_this.pageInit();
				}
			});
			loader.start();
		},
		bgMusicInit: function () {
			var _this = this;
			this.bgmEle.play();
			this.musicPlay = !this.bgmEle.paused;
            document.addEventListener(
                "WeixinJSBridgeReady",
                function () {
                    _this.bgmEle.play();
                    _this.musicPlay = !_this.bgmEle.paused;
                }, false);			
		},
		triggerBgMusic: function () {
			if(this.bgmEle.paused){
				this.bgmEle.play();
			} else {
				this.bgmEle.pause();
			}
			this.musicPlay = !this.bgmEle.paused;
		},
		checkForm: function (type) {
            var _this = this,
                checkedNum = 0,
                formCheckedNum = 0;
            switch (type) {
                case 'all':
                    for (var i in this.form) {
                        _this.checkForm(i);
                    }
                    break;
                case 'name':
                    this.name && this.name !== '' ? this.formChecked[type] = true : this.showNotice('姓名不能为空', 'warning', 2000);
                    break;
                case 'tel':
                    this.formChecked[type] = false;
                    if (!this.phone || this.phone == '') {
                        this.showNotice('请填写手机号码', 'warning', 2000);
                    } else {
                        if (this.phone.length >= 11) {
                            /^0?(13|14|15|17|18|19)\d{9}$/.test(this.phone) ? this.formChecked[type] = true : this.showNotice('请核实手机号码', 'warning', 2000);
                        } else {
                            this.showNotice('请核实手机号码', 'warning', 2000);
                        }
                    }
                    break;
                case 'address':
                    this.address && this.address !== '' ? this.formChecked[type] = true : this.showNotice('地址不能为空', 'warning', 2000);
                    break;
                default:
                    break;
            }
            for (var i in _this.formChecked) {
                formCheckedNum++;
                if (_this.formChecked[i]) {
                    checkedNum++;
                }
            }
            this.submitBtnDisabled = checkedNum !== formCheckedNum;
		},
		submitForm: function () {
			this.checkForm('all');
			if(this.submitBtnDisabled){
				axios.post('/add', {
				    name: this.form.name,
				    tel: this.form.tel,
				    email: this.form.email
				}).then(function (res) {
				   //请求成功
				}).catch(function (err) {
				   //请求失败
				});
			}
		},
		pageInit: function(){
			var _this = this;
			this.showBgMusic = false;
			this.bgMusicInit();
		}
	}
})

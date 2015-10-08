define(function() {
	var Drawer = function(id, model) {
		this.model = model;
		this.id = id;
		this.container = null;
		this.active = false;
        this.visible = false;
		this.templateList = [];
		this.timerContainer = null;

		//proto value
		Drawer.prototype.rootElement = $("#vod_container");
		//proto method

		Drawer.prototype.onStart = function() {
			this.initialize()
			this.onCreateLayout();
			this.onPaint();
			this.onAfterPaint();
            this.onShow();
			//TODO show 할지 말지 고민해보자
		};
		Drawer.prototype.onCreateLayout = function() {
			//@Comment 한번 만들어질 레이아웃을 만듬
		};
		Drawer.prototype.onPaint = function() {
			//@Comment list 를 비롯한 변동이 있는 요소를 템플릿을 이용해 만들고 값을 채움
		};
		Drawer.prototype.onAfterPaint = function() {
			//@Comment CSS 를 적용 
		};
		Drawer.prototype.initialize = function() {
			this.container = null;
			//this.active = false;
			//this.visible = false;
			//this.templateList = [];
			this.timerContainer = null;
		}
		Drawer.prototype.onUpdate = function() {
			this.onPaint();
			this.onAfterPaint();
		};
		Drawer.prototype.onRepaint = function() {
			this.onAfterPaint();
		};
		Drawer.prototype.onHide = function() {
			if(this.container) {
				this.container.hide();
			}
            this.setVisible(false);
		};
		Drawer.prototype.onShow = function() {
			if(this.container) {
				this.container.show();
			}
            this.setVisible(true);
		};
		/*Drawer.prototype.visibleToggle = function() {
			if(this.container) {
				this.container.visibleToggle();
			}
		};*/
		Drawer.prototype.setActive = function(_value) {
			this.active = _value;
			this.onAfterPaint();
		};
        Drawer.prototype.setVisible = function(_value) {
            this.visible = _value;
        };
        Drawer.prototype.isActive = function() {
            return this.active;
        };
        Drawer.prototype.isVisible = function() {
            return this.visible;
        };

		Drawer.prototype.onDestroy = function() {
            if(this.container) {
                this.container.html("");
            }
			this.timerContainer = null;
			this.active = false;
            this.onHide();
			this.onAfterDestroy();
		};
		Drawer.prototype.onAfterDestroy = function() {

		}
		Drawer.prototype.createContainer = function(id) {
			var beforeContainer = $("#" + id);
			if(!beforeContainer[0]) {
				this.container = $("<div>");
				this.container.attr("class", "container");
				this.container.attr("id", id);
				this.container.appendTo(this.rootElement);	
			} else {
				this.container = beforeContainer;
			}
			
		};
		Drawer.prototype.setContainer = function(container) {
			this.container = container;
		};
		Drawer.prototype.getContainer = function() {
			if(!this.container) {
				this.createContainer(this.id);
			}
			return this.container;
		};
		Drawer.prototype.setFocus = function(obejct) {
			if(obejct) {
				this.removeFocus(obejct);
				obejct.addClass("focus");
			}
		};
		Drawer.prototype.setUnFocus = function(obejct) {
			if(obejct) {
				this.removeFocus(obejct);
				obejct.addClass("unfocus");
			}
		};

		Drawer.prototype.removeFocus = function(obejct) {
			if(obejct) {
				obejct.removeClass("focus");
				obejct.removeClass("unfocus");
			}
		};
		Drawer.prototype.setDefaultTimerContainer = function() {
			if(!this.timerContainer) {
				this.timerContainer = this.container;
			}
		}
		Drawer.prototype.getTemplateList = function() {
			return this.templateList;
		};
		Drawer.prototype.showTimerContainer = function() {
			this.setDefaultTimerContainer();
			if(this.timerContainer) {
				this.timerContainer.show();
			}
		};
		Drawer.prototype.hideTimerContainer = function() {
			this.setDefaultTimerContainer();
			if(this.timerContainer) {
				this.timerContainer.hide();
			}

		};
		Drawer.prototype.sendEvent = function (type, param) {
			$(this).trigger(type, param);
		}

	};
	
	return Drawer;
});
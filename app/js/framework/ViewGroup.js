define(["framework/event/CCAEvent"], function(CCAEvent) {
	var ViewGroup = function(id) {
		this.id = id;
		this.viewList = new Array();
        this.currentView = null;
	};
	
	ViewGroup.prototype.getID = function() {
		return this.id;
	};
	/*ViewGroup.prototype.onInit = function(param) {
		//enter viewgroup
	};*/
    /**
     * onstart이벤트에 바인딩 되어있음
     * @param param
     */
	ViewGroup.prototype.onStart = function(param) {
		//enter viewgroup
		this.onBeforeStart(param);
		this.onAfterStart();
	};
	ViewGroup.prototype.onBeforeStart = function (param) {

	}
	ViewGroup.prototype.onAfterStart = function () {

	}

	ViewGroup.prototype.onStop = function() {
		this.onBeforeStop();
		this.onAfterStop();
	}
	ViewGroup.prototype.onBeforeStop = function () {

	}
	ViewGroup.prototype.onAfterStop = function () {

	}

    ViewGroup.prototype.onPause = function() {
        //
    };
	ViewGroup.prototype.onShow = function() {
		//show last moment
		this.onBeforeShow();
		this.onAfterShow();
	};
	ViewGroup.prototype.onBeforeShow = function () {

	}
	ViewGroup.prototype.onAfterShow = function () {

	}
	ViewGroup.prototype.onResume = function () {

	}

	ViewGroup.prototype.onResult = function() {
	};
	ViewGroup.prototype.onPopupResult = function() {
	};
	ViewGroup.prototype.onHide = function() {
		//hide all
	};
	ViewGroup.prototype.onUpdate = function() {
	};
    ViewGroup.prototype.onKeyDown = function(event) {
    };
    ViewGroup.prototype.getCurrentView = function() {
        return this.currentView;
    };
	ViewGroup.prototype.sendEvent = function(type, param) {
        //이벤트를 this 가 아니라 window 의 특정 개체에 전달한다면 (전역) 해당 이벤트를 바인딩 하고 있는 뷰그룹간 또는 뷰간 직접 이벤트 전달 가능할듯하다.
		var self = this;
		if(CCAEvent.COMPLETE_TO_DRAW_VIEW == type) {
			$(self).trigger(CCAEvent.COMPLETE_TO_DRAW_VIEW, param);
		} else {
			setTimeout(function() {
				$(self).trigger(type, param);
			}, 0);
		}
		//$(this).trigger(type, param);
	};

	
	return ViewGroup;
});
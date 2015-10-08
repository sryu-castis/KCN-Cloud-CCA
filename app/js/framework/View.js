define(["framework/KeyNavigator", "framework/event/CCAEvent"], function (KeyNavigator, CCAEvent) {
    var View = function (id) {
        this.id = id;
        this.model = null;
        this.drawer = null;
        this.keyNavigator = null;

        //proto method
        View.prototype.getID = function () {
            return this.id;
        };
        View.prototype.onBeforeStart = function (param) {

        }
        View.prototype.onAfterStart = function () {

        }
        View.prototype.onStart = function (param) {
            this.clearTimeout();
            this.onInitData();
            this.keyNavigator = new KeyNavigator(this.model);
            this.onBeforeStart(param);
            //this.onGetData(arguments);
            this.onGetData(param);

            if(this.drawer) {
                this.drawer.onStart();
            }
            this.onAfterStart(param);
            /*var hasData = this.onGetData(arguments);
            // 기존??onGetData�??�용?�는 곳�? undefined�??�어??
            if ((hasData == undefined || hasData == true) && this.drawer) {
                this.drawer.onStart();
            }*/
        };

        View.prototype.onInitData = function () {
            if (this.model) {
                this.model.init();
            }
        };

        View.prototype.onGetData = function () {
            //private ?��?�?interface�??�다...
        };

        View.prototype.onUpdate = function () {
            if (this.drawer) {
                this.drawer.onUpdate();
            }
        };
        View.prototype.onShow = function () {
            this.onBeforeShow();
            if (this.drawer) {
                this.drawer.onShow();
            }
            this.onAfterShow();
        };
        View.prototype.onBeforeShow = function () {

        }
        View.prototype.onAfterShow = function () {

        }
        View.prototype.onResult = function () {

        };

        View.prototype.onPopupResult = function () {

        };

        View.prototype.onHide = function () {
            if (this.drawer) {
                this.drawer.onHide();
            }
        };

        View.prototype.onStop = function () {
            //this.onDeActive();
            this.onBeforeStop();
            if (this.drawer) {
                this.drawer.onDestroy();
            }
            this.onInitData();
            this.onAfterStop();
            this.clearTimeout();
        };
        View.prototype.onBeforeStop = function () {

        }
        View.prototype.onAfterStop = function () {

        }

        View.prototype.onActive = function () {
            this.onBeforeActive();
            if (this.drawer) {
                this.drawer.setActive(true);
            }
            $(window).unbind(CCAEvent.SEND_KEYEVENT);
            $(window).bind(CCAEvent.SEND_KEYEVENT, this.onKeyDown);
            this.onAfterActive();
        };
        View.prototype.onBeforeActive = function () {

        }
        View.prototype.onAfterActive = function () {

        }

        View.prototype.onDeActive = function () {
            this.onBeforeDeActive();
            if (this.drawer) {
                this.drawer.setActive(false);
            }
            $(window).unbind(CCAEvent.SEND_KEYEVENT);
            this.onAfterDeActive();
        };
        View.prototype.onBeforeDeActive = function () {

        }
        View.prototype.onAfterDeActive = function () {

        }

        View.prototype.isActive = function () {
            if (this.drawer) {
                return this.drawer.isActive();
            } else {
                return false;
            }
        };

        View.prototype.onMouseActive = function () {

        };

        View.prototype.onMouseDeActive = function () {

        }

        View.prototype.isVisible = function () {
            if (this.drawer) {
                return this.drawer.isVisible();
            } else {
                return false;
            }
        };


        View.prototype.sendEvent = function (type, param) {
            var self = this;
            if(CCAEvent.COMPLETE_TO_DRAW_VIEW == type) {
                $(self).trigger(CCAEvent.COMPLETE_TO_DRAW_VIEW, param);
            } else {
                setTimeout(function() {
                    $(self).trigger(type, param);
                }, 0);
            }

        };

        View.prototype.onKeyDown = function (event, param) {
            /*var keyCode = param.keyCode;
            var tvKey = TVKeyValue;
            switch (keyCode) {
                case tvKey.KEY_UP:
                    this.keyNavigator.keyUp();
                    return true;
                case tvKey.KEY_DOWN:
                    this.keyNavigator.keyDown();
                    return true;
                case tvKey.KEY_LEFT:
                    this.keyNavigator.keyLeft();
                    return true;
                case tvKey.KEY_RIGHT:
                    this.keyNavigator.keyRight();
                    return true;
                case tvKey.KEY_EXIT:
                    return true;
                case tvKey.KEY_ENTER:
                case tvKey.KEY_PANEL_ENTER:
                    return true;
                default:
                    return false;
            }*/
        };


        //CSS 최적?��? ?�한 ??��?�웃 기능
        this.timeoutID = null;

        View.prototype.clearTimeout = function() {
            if(this.timeoutID != null) {
                clearTimeout(this.timeoutID);
                this.timeoutID = null;
            }
        }
        View.prototype.showTimerContainer = function() {
            this.drawer.showTimerContainer();
        };
        View.prototype.hideTimerContainer = function() {
            this.drawer.hideTimerContainer();
        };

        View.prototype.setVisibleTimer = function(time) {
            this.clearTimeout();
            var self = this;
            this.timeoutID = setTimeout(function() {
                self.showTimerContainer();
                self.clearTimeout();
                self.sendEvent(CCAEvent.COMPLETE_TO_DRAW_VIEW);
            }, time);
        }
    };

    return View;
});
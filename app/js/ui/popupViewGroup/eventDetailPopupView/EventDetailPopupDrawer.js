define(["framework/Drawer", "ui/popupViewGroup/eventDetailPopupView/EventDetailPopupModel"], function (Drawer, EventDetailPopupModel) {
    var EventDetailPopupDrawer = function (_id, _model) {
        Drawer.call(this, _id, _model);
        this.templateList = {'layout': new EJS({url: 'js/ui/popupViewGroup/eventDetailPopupView/LayoutTemplate.ejs'})};
        var _this = this;

        EventDetailPopupDrawer.prototype.onCreateLayout = function () {
        	
        };

        EventDetailPopupDrawer.prototype.onPaint = function () {
            if(_this.model.getData()) {
                var result = _this.templateList['layout'].render({model: this.model});
    			this.getContainer().html(result);
    			setButton();
            };
            //_this.timerContainer = $('#popup_xlarge');
        };

		EventDetailPopupDrawer.prototype.onAfterPaint = function () {        
			drawFocus();
		};

        function getButtons() {
        	return $('#popup_xlarge .area_btn .bt_147');
        };
        function setButton() {
        	var buttons = getButtons().hide();
            var type = _this.model.getType();
        	if(type == EventDetailPopupDrawer.TYPE_ON_EVENT) {
        		var button = buttons.eq(0).text(CCABase.StringSources.ButtonLabel.CONFIRM);
                button.removeClass('focus');
                button.addClass('unfocus');
                button.show();
        	} else if(type == EventDetailPopupDrawer.TYPE_OFF_EVENT){
        		var buttonLeft = buttons.eq(0).text(CCABase.StringSources.ButtonLabel.SHOW_WINNER);
                buttonLeft.removeClass('focus');
                buttonLeft.addClass('unfocus').show();
        		var buttonRight = buttons.eq(1).text(CCABase.StringSources.ButtonLabel.CANCEL);
                buttonRight.removeClass('focus');
                buttonRight.addClass('unfocus');
                buttonRight.show();
        	} else {
        		var buttonLeft = buttons.eq(0).text(CCABase.StringSources.ButtonLabel.ENROLL);
                buttonLeft.removeClass('focus');
                buttonLeft.addClass('unfocus')
                buttonLeft.show();
        		var buttonRight = buttons.eq(1).text(CCABase.StringSources.ButtonLabel.CANCEL);
                buttonRight.removeClass('focus');
                buttonRight.addClass('unfocus')
                buttonRight.show();
        	};
        };
        function drawFocus() {
        	var hIndex = _this.model.getHIndex();
        	var buttons = getButtons();
        	if(hIndex == 0) {
        		var buttonLeft = buttons.eq(0);
                buttonLeft.removeClass('unfocus');
                buttonLeft.addClass('focus');
        		var buttonRight = buttons.eq(1);
                buttonRight.removeClass('focus');
                buttonRight.addClass('unfocus');
        	} else {
				var buttonRight = buttons.eq(1);
                buttonRight.removeClass('unfocus')
                buttonRight.addClass('focus');
        		var buttonLeft = buttons.eq(0);
                buttonLeft.removeClass('focus')
                buttonLeft.addClass('unfocus');
        	};
        };
    };
    EventDetailPopupDrawer.prototype = Object.create(Drawer.prototype);
    EventDetailPopupDrawer.TYPE_ON_EVENT 		= 10;
    EventDetailPopupDrawer.TYPE_OFF_EVENT 		= 20;
    EventDetailPopupDrawer.TYPE_ENROLL_EVENT 	= 30;

    return EventDetailPopupDrawer;
});

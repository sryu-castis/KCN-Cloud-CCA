define(["framework/Drawer", "cca/PopupValues"], function (Drawer, PopupValues) {
    var DialogPopupDrawer = function (_id, _model) {
        Drawer.call(this, _id, _model);
        this.templateList = {'layout': new EJS({url: 'js/ui/popupViewGroup/alertPopupView/LayoutTemplate.ejs'})
							, 'layout_xlarge': new EJS({url: 'js/ui/popupViewGroup/alertPopupView/LayoutXLargeTemplate.ejs'})
							, 'layout_large03': new EJS({url: 'js/ui/popupViewGroup/alertPopupView/LayoutLarge03Template.ejs'})};
        var _this = this;
        var marqueeText = null;

        DialogPopupDrawer.prototype.onCreateLayout = function () {
        	
        };

        DialogPopupDrawer.prototype.onPaint = function () {
            var result = null;
			if(this.model.getParam().popupType == PopupValues.PopupType.ALERT_XLARGE) {
				result = _this.templateList['layout_xlarge'].render({model: this.model});
			} else if(this.model.getParam().popupType == PopupValues.PopupType.ALERT_LARGE_03) {
				result = _this.templateList['layout_large03'].render({model: this.model});
			} else {
				result = _this.templateList['layout'].render({model: this.model});
			}
			this.getContainer().html(result);
			setButtonElement();
        };
        
        DialogPopupDrawer.prototype.onAfterPaint = function () {
        	drawButton();
        };
        
        function setButtonElement() {
			var buttonGroup = _this.model.getButtonGroup();
			var buttonElementList = $('#'+_id+' .area_btn >');
			var size = buttonGroup.getSize();
			for (var i = 0; i < size; i++) {
				buttonGroup.getButton(i).setElement(buttonElementList.eq(i));
			}
		};
		
		function drawButton() {
			var buttonGroup = _this.model.getButtonGroup();
			for(var i = 0; i < buttonGroup.getSize(); i++) {
				if (buttonGroup.getButton(i).isActive()) {
					buttonGroup.getButton(i).onActive();
				} else {
					buttonGroup.getButton(i).onDeActive();
				}
				buttonGroup.getButton(i).setUnFocus();
			}

			if(_this.isActive()) {
				buttonGroup.getFocusedButton().setFocus();
			}
		}
    };
    DialogPopupDrawer.prototype = Object.create(Drawer.prototype);


    return DialogPopupDrawer;
});

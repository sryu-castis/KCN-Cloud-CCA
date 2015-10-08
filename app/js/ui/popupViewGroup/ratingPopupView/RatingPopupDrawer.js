define(["framework/Drawer", "ui/popupViewGroup/ratingPopupView/RatingPopupModel"], function (Drawer, RatingPopupModel) {
    var RatingPopupDrawer = function (_id, _model) {
        Drawer.call(this, _id, _model);
        this.templateList = {'layout': new EJS({url: 'js/ui/popupViewGroup/ratingPopupView/LayoutTemplate.ejs'})};
        var _this = this;
        var marqueeText = null;

        RatingPopupDrawer.prototype.onCreateLayout = function () {
        	
        };

        RatingPopupDrawer.prototype.onPaint = function () {
            var result = _this.templateList['layout'].render({model: this.model});
			this.getContainer().html(result);
			setButtonElement();
			setStarElement();
        };
        
        RatingPopupDrawer.prototype.onAfterPaint = function () {
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

			if(_this.model.getVIndex() == 1) {
				buttonGroup.getFocusedButton().setFocus();
			}
		}
        
		function setStarElement()	{
			if(_this.model.getVIndex() == 0) {
				$('#'+_id+' #popup_m .body_scorebox').addClass("focus").removeClass("unfocus");
			}
			else	{
				$('#'+_id+' #popup_m .body_scorebox').addClass("unfocus").removeClass("focus");
			}
			for(var i = 0; i < 5; i++)	{
				var index = i+1;
				if(_this.model.getRating() >= index)	{
					$('#'+_id+' #popup_m .a0'+index).addClass("focus").removeClass("unfocus");
				}
				else	{
					$('#'+_id+' #popup_m .a0'+index).addClass("unfocus").removeClass("focus");
				}
			}
		}
    };
    RatingPopupDrawer.prototype = Object.create(Drawer.prototype);


    return RatingPopupDrawer;
});

define(["framework/Drawer", "ui/couponPopupViewGroup/registerMonthlyCouponPopupView/RegisterMonthlyCouponPopupModel", "helper/UIHelper", "helper/DateHelper", "service/CouponManager"], 
		function (Drawer, RegisterMonthlyCouponPopupModel, UIHelper, DateHelper, CouponManager) {
    var RegisterMonthlyCouponPopupDrawer = function (_id, _model) {
        Drawer.call(this, _id, _model);
        this.templateList = {'layout': new EJS({url: 'js/ui/couponPopupViewGroup/registerMonthlyCouponPopupView/LayoutTemplate.ejs'})
        			, 'monthly': new EJS({url: 'js/ui/couponPopupViewGroup/registerMonthlyCouponPopupView/HeadlineTemplate.ejs'})
        };
        var _this = this;

        RegisterMonthlyCouponPopupDrawer.prototype.onCreateLayout = function () {
			//@같은 컨테이너를 공유하도록 처리
			_this = this;
			this.createContainer("purchasePopup");
        };

        RegisterMonthlyCouponPopupDrawer.prototype.onPaint = function () {
			var resultLayout = _this.templateList['layout'].render({model: this.model});
			this.getContainer().html(resultLayout);

        	var resultList = _this.templateList['monthly'].render({model: this.model, 'CouponManager':CouponManager, 'UIHelper':UIHelper, 'DateHelper':DateHelper});
    		$("#purchasePopup .headline_frame").html(resultList);
			setButtonElement();
			setInputFieldElement();
        };
        
        RegisterMonthlyCouponPopupDrawer.prototype.onAfterPaint = function () {
			drawButton();
			drawInputField();
        };

        function setButtonElement() {
			var buttonGroup = _this.model.getButtonGroup();

			var buttonElementList = $('#purchasePopup .area_btn >');
			var size = buttonGroup.getSize();
			for (var i = 0; i < size; i++) {
				buttonGroup.getButton(i).setElement(buttonElementList.eq(i));
			}
		}

		function setInputFieldElement() {
			var inputField = _this.model.getInputField();
			inputField.setElement($("#purchasePopup .body_serialbox_pw01"));
		}
		

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

			if(_this.isActive() && !isFocusOnInputField()) {
				buttonGroup.getFocusedButton().setFocus();
			}
		}

		function drawInputField() {
			var model = _this.model;
			var inputField = model.getInputField();

			if(inputField.getDefaultText() == CCABase.StringSources.failPasswordText) {
				$('#purchasePopup .bodyline_bb ').addClass("error");
			} else {
				$('#purchasePopup .bodyline_bb ').removeClass("error");
			}

			if (_this.isActive() && isFocusOnInputField()) {
				inputField.setFocus();
			} else {
				inputField.setUnFocus();
			}
		};

		function isFocusOnInputField() {
			return _this.model.getVIndex() == 0;
		}
    };
    RegisterMonthlyCouponPopupDrawer.prototype = Object.create(Drawer.prototype);


    return RegisterMonthlyCouponPopupDrawer;
});

define(["framework/Drawer", "ui/menuViewGroup/passwordView/PasswordModel", "helper/UIHelper", "helper/DrawerHelper"], function (Drawer, Model, UIHelper, DrawerHelper) {
	var PasswordDrawer = function(_id, _model) {
		Drawer.call(this, _id, _model);
		this.templateList = {'layout': new EJS({url: 'js/ui/menuViewGroup/passwordView/LayoutTemplate.ejs'})};
		var _this = this;

		PasswordDrawer.prototype.onCreateLayout = function() {
			//@ 패스워드뷰를 여러곳에서 new 해서 사용하게 될경우 _this가 이후 생성된 객체를 가리키게 됨으로 onStart시에 해당 객체로 바꾸도록함
			_this = this;
			DrawerHelper.cleanSubViewArea();
			var tempContainer = DrawerHelper.getEmptySubViewContainer(".bg_right .subViewArea");
			this.setContainer(tempContainer);
		};

		PasswordDrawer.prototype.onPaint = function() {
			var result = this.templateList['layout'].render({model:this.model, 'UIHelper':UIHelper});
			this.getContainer().html(result);
			setButtonElement();
			setInputFieldElement();
		};
		PasswordDrawer.prototype.onAfterPaint = function() {
			drawButton();
			drawInputField();
		};

		function setButtonElement() {
			var buttonGroup = _this.model.getButtonGroup();

			var buttonElementList = $('#password .button >');
			var size = buttonGroup.getSize();
			for (var i = 0; i < size; i++) {
				buttonGroup.getButton(i).setElement(buttonElementList.eq(i));
			}
		};

		function setInputFieldElement() {
			var inputField = _this.model.getInputField();
			inputField.setElement($("#password .txfld"));
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

			if(_this.isActive() && !isFocusOnInputField()) {
				buttonGroup.getFocusedButton().setFocus();
			}
		}

		function drawInputField() {
			var model = _this.model;
			var inputField = model.getInputField();

			if(inputField.getDefaultText() == CCABase.StringSources.failPasswordText) {
				$('#password .text_password').addClass("error");
			} else {
				$('#password .text_password').removeClass("error");
			}

			if (_this.isActive() && isFocusOnInputField()) {
				inputField.setFocus();
			} else {
				inputField.setUnFocus();
			}
		};

		function isFocusOnInputField() {
			return _this.model.getVIndex() == PasswordDrawer.STATE_INPUTFIELD;
		}


	};
	PasswordDrawer.prototype = Object.create(Drawer.prototype);
    PasswordDrawer.STATE_INPUTFIELD = 0;
    PasswordDrawer.STATE_BUTTONGROUP = 1;

	return PasswordDrawer;
});

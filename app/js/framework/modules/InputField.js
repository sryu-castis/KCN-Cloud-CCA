define(function() {	
	var InputField = function() {
		this.defaultText = ""; //비밀번호를 입력해주세요
		this.inputText = "";
        this.maximumSize = 4;
		this.element = null;
		this.visible = true;
        this.isSecurityMode = true;
        this.active = true;

		InputField.prototype.setDefaultText = function(_defaultText) {
			this.defaultText = _defaultText;
		};
		
		InputField.prototype.getDefaultText = function() {
			return this.defaultText;
		};

        InputField.prototype.setMaximumSize = function(_size) {
            this.maximumSize = _size;
        };
        InputField.prototype.setVisible = function(_value) {
            this.visible = _value;
        };
        InputField.prototype.isVisible = function() {
            return this.visible;
        };
        InputField.prototype.setActive = function(_value) {
            this.active = _value;
        };
        InputField.prototype.isActive = function() {
            return this.active;
        };

        InputField.prototype.setSecurityMode = function(_value) {
            this.isSecurityMode = _value;
        };

		
	    InputField.prototype.addText = function(_keyCode) {
            if(this.active) {
                //48 ~ 57, 96~105
                var keyNumber = this.keySwitch(_keyCode);
                if(this.inputText.length >= this.maximumSize) {
                    this.initText();
                }
                this.inputText += keyNumber;

                if(this.isFullText()) {
                    this.sendFullEvent();
                }
            }
		};
		InputField.prototype.keySwitch = function(_keyCode) {
			var tvKey = TVKeyValue;
			switch (_keyCode) {
				case tvKey.KEY_0:
					return 0;
				case tvKey.KEY_1:
					return 1;
				case tvKey.KEY_2:
					return 2;
				case tvKey.KEY_3:
					return 3;
				case tvKey.KEY_4:
					return 4;
				case tvKey.KEY_5:
					return 5;
				case tvKey.KEY_6:
					return 6;
				case tvKey.KEY_7:
					return 7;
				case tvKey.KEY_8:
					return 8;
				case tvKey.KEY_9:
					return 9;
					break;
				default:
					break;
			}
		};
		InputField.prototype.removeText = function() {
			this.inputText = this.inputText.substring(0, this.inputText.length - 1);
		};
		
		InputField.prototype.initText = function() {
			this.inputText = "";
			$(this).trigger(InputField.INIT_TEXT_EVENT);
		};
        InputField.prototype.inValidText = function() {
            this.inputText = "";
            $(this).trigger(InputField.INVALID_TEXT_EVENT);
        };
        InputField.prototype.setInputText = function(text) {
            this.inputText = text;
        };
		InputField.prototype.getInputText = function() {
			return this.inputText;			
		};
		
		InputField.prototype.sendFullEvent = function() {
			$(this).trigger(InputField.FULL_TEXT_EVENT);
		};
		InputField.prototype.setElement = function(element) {
			this.element = element;
		};
		InputField.prototype.getElement = function() {
			return this.element;
		};
		InputField.prototype.getInputTextForDraw = function() {
			var returnText = "";
			
			if(this.inputText.length == 0) {
				returnText = this.defaultText;
			} else {
                if(this.isSecurityMode) {
                    for(var i = 0; i < this.inputText.length; i++) {
                        returnText += "●";
                    }
                } else {
                    returnText = this.inputText;
                }
			}
			
			return returnText;
		};
		InputField.prototype.getSize = function() {
			var length = 0;
			if(this.inputText == this.defaultText) {
				length = 0;
			} else {
				length = this.inputText.length;
			}
			return length;
		};
        InputField.prototype.isFullText = function() {
            if(this.inputText.length >= this.maximumSize) {
                return true;
            } else {
                return false;
            }
        }
		InputField.prototype.setFocus = function() {
			$(this.element).removeClass("unfocus");
			$(this.element).addClass("focus");
		};
		InputField.prototype.setUnFocus = function() {
			$(this.element).removeClass("focus");
			$(this.element).addClass("unfocus");
		};

	};
	InputField.FULL_TEXT_EVENT = "com.castis.event.fullText";
	InputField.INIT_TEXT_EVENT = "com.castis.event.initText";
    InputField.INVALID_TEXT_EVENT = "com.castis.event.invalidText";
	
	return InputField;
});

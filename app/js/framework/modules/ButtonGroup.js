define(["framework/modules/Button"], function(Button) {
	var ButtonGroup = function(size) {
		this.buttonList = new Array();
		this.size = size;
		this.index = 0;
		this.isAutoFocus = false;
		this.rotate = false;
		
		var _this = this;
		
		ButtonGroup.prototype.createButtonList = function() {
			for(var i = 0; i < this.size; i++) {
				this.buttonList.push(new Button());
			};
		};

		ButtonGroup.prototype.setAutoFocus = function(flag) {
			this.isAutoFocus = flag;
            removeFocus();
			setFocus();
		}

		ButtonGroup.prototype.setRotate = function(flag) {
			this.rotate = flag;
		}

		ButtonGroup.prototype.getSize = function() {
			return this.size;
		}

		ButtonGroup.prototype.next = function() {
			removeFocus();
			if(this.index < this.size - 1) {
				var tempIndex = (this.index + 1) % this.size;
				if(this.getButton(tempIndex).isActive()) {
					this.index = tempIndex;
				} else {
					if(this.hasNextButton()) {
						this.index = tempIndex;
						this.next();
					}
				}
			} else if(this.rotate) {
				var tempIndex = 0;
				if(this.getButton(tempIndex).isActive()) {
					this.index = tempIndex;
				} else {
					if(this.hasNextButton()) {
						this.index = tempIndex;
						this.next();
					}
				}
			}
			setFocus();
		};

		ButtonGroup.prototype.previous = function() {
			removeFocus();
			if(this.index > 0 ) {
				var tempIndex  = Math.abs((this.index - 1) % this.size);
				if(this.getButton(tempIndex).isActive()) {
					this.index = tempIndex;
				} else {
					if(this.hasPreviousButton()) {
						this.index = tempIndex;
						this.previous();
					}
				}
			} else if(this.rotate) {
				var tempIndex  = this.size - 1;
				if(this.getButton(tempIndex).isActive()) {
					this.index = tempIndex;
				} else {
					if(this.hasPreviousButton()) {
						this.index = tempIndex;
						this.previous();
					}
				}
			}
			setFocus();
		};

		ButtonGroup.prototype.getIndex = function() {
			return this.index;
		};

		ButtonGroup.prototype.setIndex = function(index) {
			this.index = index;
		};

		ButtonGroup.prototype.getFocusedButton = function() {
			return this.buttonList[this.index];
		};

		ButtonGroup.prototype.getButton = function(index) {
			return this.buttonList[index];
		};

        ButtonGroup.prototype.setButtonList = function(buttonList) {
            this.buttonList.clean;
            this.size = buttonList.length;
            var button = null;
            for(var i = 0; i < this.size; i++) {
                button = new Button();
                button.setLabel(buttonList[i]);
                this.buttonList.push(button);
                button = null;
            };
        };
        ButtonGroup.prototype.getButtonIndex = function(label) {
            var index = -1;
                $.each(this.buttonList,function(i, button){
                if(button.label == label) {
                    index = i;
                }
            });
            return index;
        };
        ButtonGroup.prototype.setFocusWithIndex = function(index) {
            this.isAutoFocus = true;
            removeFocus();
            this.index = index;
            setFocus();
        }
		ButtonGroup.prototype.hasNextButton = function() {
			var currentIndex = this.index;
			for(var i = currentIndex + 1; i < this.size; i++) {
				if(this.getButton(i).isActive()) {
					return true;
				}
			}
			return false;
		}
		ButtonGroup.prototype.hasPreviousButton = function() {
			var currentIndex = this.index;
			for(var i = currentIndex - 1; i >= 0; i--) {
				if(this.getButton(i).isActive()) {
					return true;
				}
			}
			return false;
		}

		function setFocus() {
			if(_this.isAutoFocus) {
				var currentButton = _this.getButton(_this.index);
				currentButton.setFocus();	
			}
		}

		function removeFocus() {
			if(_this.isAutoFocus) {
				var currentButton = _this.getButton(_this.index);
				currentButton.removeFocus();	
			}
		}
		this.createButtonList();
	};
	
	return ButtonGroup;
});

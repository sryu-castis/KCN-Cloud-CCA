define(function() {	
	var Button = function(_id) {
		this.id = _id;
		this.element = null;
		this.active = true;
		this.label = "";
        this.width = 0;
        this.height = 0;

		
		Button.prototype.setID = function(id) {
			this.id = id;
		};
		Button.prototype.getID = function() {
			return this.id;
		};
		Button.prototype.setLabel = function(label) {
			this.label = label;
		};
		Button.prototype.getLabel = function() {
			return this.label;
		};
		Button.prototype.setElement = function(element) {
			this.element = element;
		};
		Button.prototype.getElement = function() {
			return this.element;
		};
        Button.prototype.setWidth = function(width) {
            this.width = width;
        };
        Button.prototype.getWidth = function() {
            return this.width;
        };
        Button.prototype.setHeight = function(height) {
            this.height = height;
        };
        Button.prototype.getHeight = function() {
            return this.height;
        };
		Button.prototype.onActive = function() {
			this.active = true;
			$(this.element).removeClass("disable");
		};
		Button.prototype.onDeActive = function() {
			this.active = false;
			$(this.element).addClass("disable");
		};
		Button.prototype.isActive = function() {
			return this.active;
		};
		Button.prototype.setFocus = function() {
			$(this.element).removeClass("unfocus");
			$(this.element).addClass("focus");
		};
		Button.prototype.setUnFocus = function() {
			this.removeFocus();
		}
		Button.prototype.removeFocus = function() {
			$(this.element).removeClass("focus");
			$(this.element).addClass("unfocus");
		};
		
	};
	
	return Button;
});

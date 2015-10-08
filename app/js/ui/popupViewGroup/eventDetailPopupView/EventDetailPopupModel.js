define(["framework/Model", "framework/modules/ButtonGroup"], function(Model, ButtonGroup) {
	var EventDetailPopupModel = function() {
		Model.call(this);

		this.event = undefined;
		
		EventDetailPopupModel.prototype.init = function() {
			Model.prototype.init.apply(this);
		};

		EventDetailPopupModel.prototype.setData = function(event) {
			this.event = event;
		};

		EventDetailPopupModel.prototype.getData = function() {
			return this.event;
		};

		EventDetailPopupModel.prototype.setType = function(type) {
			this.type = type;
		};

		EventDetailPopupModel.prototype.getType = function() {
			return this.type;
		};
	};
	EventDetailPopupModel.prototype = Object.create(Model.prototype);
	
	return EventDetailPopupModel;
});

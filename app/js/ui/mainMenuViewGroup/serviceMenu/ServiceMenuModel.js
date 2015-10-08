define(["framework/Model"], function(Model) {
	var ServiceMenuModel = function() {
		Model.call(this);

		ServiceMenuModel.prototype.init = function() {
			Model.prototype.init.apply(this);
		};
	};
	ServiceMenuModel.prototype = Object.create(Model.prototype);
	
	return ServiceMenuModel;
});
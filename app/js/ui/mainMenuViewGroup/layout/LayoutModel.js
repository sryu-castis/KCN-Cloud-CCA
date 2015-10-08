define(["framework/Model"], function(Model) {
	var LayoutModel = function() {
		Model.call(this);

		LayoutModel.prototype.init = function() {
			Model.prototype.init.apply(this);
		};

	};
	LayoutModel.prototype = Object.create(Model.prototype);
	
	return LayoutModel;
});
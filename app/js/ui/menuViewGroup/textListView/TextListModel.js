define(["ui/menuViewGroup/posterListView/PosterListModel"], function(Model) {
	var TextListModel = function() {
		Model.call(this);

		TextListModel.prototype.init = function() {
			Model.prototype.init.apply(this);
		};

	};
	TextListModel.prototype = Object.create(Model.prototype);
	
	return TextListModel;
});
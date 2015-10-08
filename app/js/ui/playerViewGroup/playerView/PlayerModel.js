define(["framework/Model"], function(Model) {
	var PlayerModel = function() {
		Model.call(this);


		PlayerModel.prototype.init = function() {
			Model.prototype.init.apply(this);
		};
	};
	PlayerModel.prototype = Object.create(Model.prototype);

	return PlayerModel;
});

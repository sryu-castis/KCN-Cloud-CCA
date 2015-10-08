define(["framework/Drawer", "helper/UIHelper"], function (Drawer, UIHelper) {
	var PlayerDrawer = function(_id, _model) {
		Drawer.call(this, _id, _model);
		var _this = this;

		PlayerDrawer.prototype.onCreateLayout = function() {

		};

		PlayerDrawer.prototype.onPaint = function() {

		};
		PlayerDrawer.prototype.onAfterPaint = function() {

		};
	};
	PlayerDrawer.prototype = Object.create(Drawer.prototype);


	return PlayerDrawer;
});

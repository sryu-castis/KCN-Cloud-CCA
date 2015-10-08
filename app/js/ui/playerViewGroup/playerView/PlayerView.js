define(["framework/View", "framework/event/CCAEvent",
		"ui/playerViewGroup/playerView/PlayerDrawer", "ui/playerViewGroup/playerView/PlayerModel"],
	function (View, CCAEvent, PlayerDrawer, PlayerModel) {

		var PlayerView = function () {
			View.call(this, "playerView");
			this.model = new PlayerModel();
			this.drawer = new PlayerDrawer(this.getID(), this.model);
			var _this = this;

			PlayerView.prototype.onInit = function() {

			};

			PlayerView.prototype.onGetData = function (param) {
			};

			this.onInit();
		};

		PlayerView.prototype = Object.create(View.prototype);

		return PlayerView;
	});
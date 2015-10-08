define(["framework/Model", "framework/modules/ButtonGroup"], function(Model, ButtonGroup) {
	var EventWinnerPopupModel = function() {
		Model.call(this);

		EventWinnerPopupModel.prototype.init = function() {
			Model.prototype.init.apply(this);
			this.winnerList = undefined;
			this.totalPage = 0;
			this.currentPage = 0;
		};

		EventWinnerPopupModel.prototype.setData = function(list) {
			this.winnerList = list;
		};

		EventWinnerPopupModel.prototype.getData = function() {
			return this.winnerList;
		};

		EventWinnerPopupModel.prototype.setTotalPage = function(totalPage) {
			this.totalPage = totalPage;
		};

		EventWinnerPopupModel.prototype.getTotalPage = function() {
			return this.totalPage;
		};

		EventWinnerPopupModel.prototype.setCurrentPage = function(currentPage) {
			this.currentPage = currentPage;
		};

		EventWinnerPopupModel.prototype.getCurrentPage = function() {
			return this.currentPage;
		};		
	};
	EventWinnerPopupModel.prototype = Object.create(Model.prototype);
	
	return EventWinnerPopupModel;
});

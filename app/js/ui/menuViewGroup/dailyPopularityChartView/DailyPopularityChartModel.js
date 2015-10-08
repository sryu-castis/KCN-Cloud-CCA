define(["framework/Model", ""], function(Model) {
	var DailyPopularityChartModel = function() {
		Model.call(this);


		DailyPopularityChartModel.prototype.init = function() {
			Model.prototype.init.apply(this);
		};

		DailyPopularityChartModel.prototype.setPopularityList = function(list) {
			this.popularityList = list;
		};

		DailyPopularityChartModel.prototype.getPopularityList = function(list) {
			return this.popularityList;
		};
	};
	DailyPopularityChartModel.prototype = Object.create(Model.prototype);
	
	return DailyPopularityChartModel;
});

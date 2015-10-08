define(["framework/Model"], function(Model) {
	var WeeklyPopularityChartModel = function() {
		Model.call(this);

		WeeklyPopularityChartModel.prototype.init = function() {
			Model.prototype.init.apply(this);
		};

		WeeklyPopularityChartModel.prototype.setPopularityList = function(list) {
			this.popularityList = list;
		};

		WeeklyPopularityChartModel.prototype.getPopularityList = function(list) {
			return this.popularityList;
		};
	};
	WeeklyPopularityChartModel.prototype = Object.create(Model.prototype);
	
	return WeeklyPopularityChartModel;
});
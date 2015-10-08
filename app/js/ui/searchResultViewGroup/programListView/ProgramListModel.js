define(["framework/Model", "service/CouponManager"], function(Model, CouponManager) {
	var ProgramListModel = function() {
		Model.call(this);

		ProgramListModel.prototype.init = function() {
			Model.prototype.init.apply(this);

			// this.programList = undefined;  // because searchResultManager set this asynchronously
		};
		ProgramListModel.prototype.setData = function(list) {
			this.programList = list;
		};
        ProgramListModel.prototype.getData = function() {
            return this.programList;
        };

	};
	ProgramListModel.prototype = Object.create(Model.prototype);
	
	return ProgramListModel;
});
define(["framework/Model", "service/CouponManager"], function(Model, CouponManager) {
	var EventListModel = function() {
		Model.call(this);

		EventListModel.prototype.init = function() {
			Model.prototype.init.apply(this);

			this.eventList = undefined;
		};
		EventListModel.prototype.setData = function(list) {
			this.eventList = list;
		};
        EventListModel.prototype.getData = function() {
            return this.eventList;
        };

	};
	EventListModel.prototype = Object.create(Model.prototype);
	
	return EventListModel;
});
define(['framework/Model'], function (Model) {
	var SearchWordModel = function () {
		Model.call(this);

		this.searchWordList = [];

		SearchWordModel.prototype.init = function () {
			this.searchWordList = [];
			this.vIndex = 0;
		};
		SearchWordModel.prototype.setData = function (list) {
			this.searchWordList = list ? list : [];
		};
		SearchWordModel.prototype.getData = function () {
			return this.searchWordList;
		};
	};
	SearchWordModel.prototype = Object.create(Model.prototype);

	return SearchWordModel;
});
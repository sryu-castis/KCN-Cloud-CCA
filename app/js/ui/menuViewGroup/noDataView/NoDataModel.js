define(["framework/Model", "cca/DefineView", '../../../../resources/strings/ko'], function (Model, DefineView, Strings) {
	var NoDataModel = function() {
        Model.call(this);
        

        NoDataModel.prototype.init = function () {
        	this.strings = Strings.noData;
        	this.message = null;
        };

        NoDataModel.prototype.setMessage = function (message) {
        	this.message = message;
        };

		NoDataModel.prototype.getMessage = function () {
			return this.message;
		};
    };
	NoDataModel.prototype = Object.create(Model.prototype);

	return NoDataModel;
});

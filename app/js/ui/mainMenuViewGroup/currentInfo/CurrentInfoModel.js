define(["framework/Model"], function (Model) {
    var CurrentInfoModel = function () {
        Model.call(this);

        CurrentInfoModel.prototype.init = function() {
            Model.prototype.init.apply(this);
            this.headerImage = null;
        }
        CurrentInfoModel.prototype.setHeaderImage = function(headerImage) {
            this.headerImage = headerImage;
        };
        CurrentInfoModel.prototype.getHeaderImage = function() {
            return this.headerImage;
        };
    };

    CurrentInfoModel.prototype = Object.create(Model.prototype);

    return CurrentInfoModel;
});
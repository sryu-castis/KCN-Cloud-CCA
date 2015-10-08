define(["ui/menuViewGroup/categoryListView/CategoryListModel"], function(Model) {
	var PreviewListModel = function() {
		Model.call(this);

        this.contentGroupList = null;

		PreviewListModel.prototype.init = function() {
			Model.prototype.init.apply(this);
			this.contentGroupList = null;
		};
		PreviewListModel.prototype.setContentGroupList = function(contentGroupList) {
			this.contentGroupList = contentGroupList;
		};
		PreviewListModel.prototype.getContentGroupList = function() {
			return this.contentGroupList;
		};

	};
	PreviewListModel.prototype = Object.create(Model.prototype);
	
	return PreviewListModel;
});
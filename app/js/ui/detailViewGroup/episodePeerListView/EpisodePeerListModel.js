define(["framework/Model"], function(Model) {
	var EpisodePeerListModel = function() {
		Model.call(this);

		this.contentGroupID = null;
		this.totalCount = 0;
		EpisodePeerListModel.prototype.init = function() {
			Model.prototype.init.apply(this);
			this.contentGroup = null;
			this.totalCount = 0;
		};
		EpisodePeerListModel.prototype.setContentGroup = function(contentGroup) {
			this.contentGroup = contentGroup;
		};
		EpisodePeerListModel.prototype.getContentGroup = function() {
			return this.contentGroup;
		};
		EpisodePeerListModel.prototype.setTotalCount = function(totalCount) {
			this.totalCount = totalCount;
		}
		EpisodePeerListModel.prototype.getTotalCount = function() {
			return this.totalCount;
		}
		EpisodePeerListModel.prototype.setStartItemIndex = function(startItemIndex) {
			this.startItemIndex = startItemIndex;
		}
		EpisodePeerListModel.prototype.getStartItemIndex = function() {
			return this.startItemIndex;
		}


	};
	EpisodePeerListModel.prototype = Object.create(Model.prototype);
	
	return EpisodePeerListModel;
});
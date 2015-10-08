define(["framework/Model", "framework/modules/ButtonGroup"], function(Model, ButtonGroup) {
	var ExitPopupModel = function() {
		Model.call(this);

		this.param = null;

		this.buttonGroup = null;

		this.title = null;
		this.headText = null;
		this.subText = null;
		this.asset = null;
		this.isEOSState = false;
		this.isHd = false;
		this.popupId=null;
        this.offset = 0;

        this.assetID = null;

        this.recommendByMD = false;
		
		ExitPopupModel.prototype.init = function() {
//			console.log("ExitPopupModel.prototype.init");
			Model.prototype.init.apply(this);

			this.param = null;
			this.buttonGroup = null;

			this.title = null;
			this.headText = null;
			this.subText = null;
			this.asset = null;
			this.isEOSState = false;
			this.isHd = false;
			this.popupId=null;

            this.assetID = null;
		};

		ExitPopupModel.prototype.setParam = function(param) {
			this.param = param;
		};
		ExitPopupModel.prototype.getParam = function() {
			return this.param;
		};

		ExitPopupModel.prototype.setButtonGroup = function(buttonGroup) {
			this.buttonGroup = buttonGroup;
		};
		ExitPopupModel.prototype.getButtonGroup = function() {
			return this.buttonGroup;
		};

		ExitPopupModel.prototype.setTitle = function(title) {
			this.title = title;
		};
		ExitPopupModel.prototype.getTitle = function() {
			return this.title;
		};

		ExitPopupModel.prototype.setHeadText = function(headText) {
			this.headText = headText;
		};
		ExitPopupModel.prototype.getHeadText = function() {
			return this.headText;
		};

		ExitPopupModel.prototype.setSubText = function(subText) {
			this.subText = subText;
		};
		ExitPopupModel.prototype.getSubText = function() {
			return this.subText;
		};
		
		ExitPopupModel.prototype.setAsset = function(asset) {
			this.asset = asset;
		};
		ExitPopupModel.prototype.getAsset = function() {
			return this.asset;
		};
		ExitPopupModel.prototype.setEOS = function(isEOS) {
			this.isEOSState = isEOS;
		};
		ExitPopupModel.prototype.isEOS = function() {
			return this.isEOSState;
		};
		ExitPopupModel.prototype.setHDContent = function(isHd) {
			this.isHd = isHd;
		};
		ExitPopupModel.prototype.isHDContent = function() {
			return this.isHd;
		};
		ExitPopupModel.prototype.setPopupId = function(popupId) {
			this.popupId = popupId;
		};
		ExitPopupModel.prototype.getPopupId = function() {
			return this.popupId;
		};
        ExitPopupModel.prototype.setOffset = function(offset) {
            this.offset = offset;
        };
        ExitPopupModel.prototype.getOffset = function() {
            return this.offset;
        };
        ExitPopupModel.prototype.setAssetID = function(assetID) {
            this.assetID = assetID;
        };
        ExitPopupModel.prototype.getAssetID = function() {
            return this.assetID;
        };
        ExitPopupModel.prototype.setRecommendByMD = function(value) {
            this.recommendByMD = value;
        };
        ExitPopupModel.prototype.isRecommendByMD = function() {
            return this.recommendByMD;
        };
	};
	ExitPopupModel.prototype = Object.create(Model.prototype);
	
	return ExitPopupModel;
});

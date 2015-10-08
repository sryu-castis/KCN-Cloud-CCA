define(["framework/View", "framework/event/CCAEvent",'cca/type/SortType', "cca/DefineView","framework/modules/ButtonGroup",
        "ui/mytvViewGroup/helpMenuView/HelpMenuDrawer","ui/mytvViewGroup/helpMenuView/HelpMenuModel",
        "service/Communicator", "helper/UIHelper", "cca/type/PlayType", "cca/type/VisibleTimeType"],
        function(View, CCAEvent, SortType, DefineView, ButtonGroup, HelpMenuDrawer, HelpMenuModel, Communicator, UIHelper, PlayType, VisibleTimeType) {

    var HelpMenuView = function() {
        View.call(this, DefineView.HELP_MENU_VIEW);
        this.model = new HelpMenuModel();
        this.drawer = new HelpMenuDrawer(this.getID(), this.model);
        var _this = this;

        HelpMenuView.prototype.onInit = function() {

        };

        HelpMenuView.prototype.onBeforeStart = function() {
        	this.transactionId = $.now() % 1000000;
        };

        HelpMenuView.prototype.onAfterStart = function() {
            _this.hideTimerContainer();
        }

        HelpMenuView.prototype.onGetData = function(param) {
//            getCouponRateInfo();
			var categoryType = param.categoryType;
            var currentCategoryID = param.focusedCategory.getCategoryID();
        	var pageIndex = 0;
        	var pageSize = 8;
        	var buttonGroup = new ButtonGroup(1);
			buttonGroup.getButton(0).setLabel(CCABase.StringSources.ButtonLabel.GUIDE);
			_this.model.setButtonGroup(buttonGroup);
        	requestAssetListByCategoryId(callBackForRequestAssetListByCategoryId, currentCategoryID, pageIndex, pageSize);
        };
        function requestAssetListByCategoryId(callback, categoryId, pageIndex, pageSize) {
			_this.isRequesting = true;
			var sortType = SortType.NOTSET;
			var assetProfile = 8;
        	var includeAdultCategory = 1;
        	var transactionId = ++_this.transactionId;
			Communicator.requestAssetListByCategoryID(callback, transactionId, categoryId, assetProfile, sortType, pageIndex, pageSize);
        };
        function callBackForRequestAssetListByCategoryId(result) {
        	_this.isRequesting = false;
        	if(Communicator.isCorrectTransactionID(_this.transactionId, result)) {
        		if(Communicator.isSuccessResponseFromHAS(result) == true) {
                	var model = _this.model;
    				var verticalVisibleSize = 1;
    				var horizontalVisibleSize = 1;
    				var verticalMaximumSize = verticalVisibleSize;
    				var horizentalMaximumSize = horizontalVisibleSize;

    				model.totalCount = result.totalAssetCount;
    				model.setSize(verticalVisibleSize, horizontalVisibleSize, verticalMaximumSize, horizentalMaximumSize);
    				model.setRotate(false, true);
    				model.setNextLineRotate(true);
    				setData(result.assetList);
                	_this.drawer.onUpdate();
                    _this.setVisibleTimer(VisibleTimeType.POSTER_TYPE);
                } else {
                	console.error("Failed to get datas from has.");
//                    _this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, {targetGroup:DefineView.POPUP_VIEWGROUP, popupType:PopupValues.PopupType.ERROR, id:result.resultCode});
                };
        	}
        };
		function setData(assetList) {
			_this.model.setAssetList(assetList);
			_this.model.setViewType(DefineView.ASSET_LIST_VIEW);
		};

        HelpMenuView.prototype.onKeyDown = function(event, param) {
            var keyCode = param.keyCode;
            var tvKey = window.TVKeyValue;
//            console.log("HelpMenuView, onKeyDown: " + keyCode );
            switch (keyCode) {
                case tvKey.KEY_LEFT:
                	_this.sendEvent(CCAEvent.FINISH_VIEW, getEventParamObject("categoryListView"));
                    break;
                case tvKey.KEY_RIGHT:
                    break;
                case tvKey.KEY_BACK:
                case tvKey.KEY_ESC:
                case tvKey.KEY_EXIT:
                	_this.sendEvent(CCAEvent.FINISH_VIEW);  
                    break;

                case tvKey.KEY_ENTER:
                    changeToPlay();
                    break;
                case tvKey.KEY_UP:
                    break;
                case tvKey.KEY_DOWN:
                    break;
                default:
                    break;
            }
        };
        function changeToPlay() {
			var param = {};
			if(_this.model.getAssetList()[0] != null)	{
				param.asset = _this.model.getAssetList()[0];
				param.product = UIHelper.getDisplayProduct(param.asset.getProductList());
				param.coupon = null;
				param.offset = 0;
				param.playType = PlayType.HELP;
				param.targetView = DefineView.PLAYER_VIEW;

				_this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, param);	
			}
		}
        function getEventParamObject(targetView) {
            var model = _this.model;
            var param = {};
            param.targetView = targetView;
            param.index = model.getVIndex();
            param.startIndex = model.getVStartIndex();
            return param;
        }
        this.onInit();
    };
    HelpMenuView.prototype = Object.create(View.prototype);

    return HelpMenuView;
});

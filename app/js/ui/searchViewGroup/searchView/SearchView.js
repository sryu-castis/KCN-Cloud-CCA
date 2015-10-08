define(['framework/View', 'framework/event/CCAEvent',
		'ui/searchViewGroup/searchView/SearchDrawer',
		'ui/searchViewGroup/searchView/SearchModel',
		'service/Communicator', "service/CouponManager",
		'cca/type/SortType', "cca/DefineView"],
		function (View, CCAEvent, SearchDrawer, SearchModel, Communicator, CouponManager, SortType, DefineView) {

			var _this = null;
			var SearchView = function () {
				View.call(this, DefineView.SEARCH_VIEW);
				this.model = new SearchModel();
				this.drawer = new SearchDrawer(this.getID(), this.model);
				this.isRequesting = false;
				this.onInit();
				_this = this;
				var requestID = null;
			};
			SearchView.prototype = Object.create(View.prototype);
			SearchView.prototype.onInit = function () {

			};
			SearchView.prototype.onBeforeStart = function(param) {
				this.transactionId = $.now() % 1000000;
			};
			SearchView.prototype.onAfterStart = function (param) {
				_this.hideTimerContainer();

				var timerHandler = setInterval(function() {
					if(CouponManager.isCompletedRequestForBalances() == true) {
						_this.drawer.onUpdate();
						clearInterval(timerHandler);
					};
				}, 300);
			};

			SearchView.prototype.onKeyDown = function (event, param) {
				var model = _this.model;
				var keyCode = param.keyCode;
				var tvKey = window.TVKeyValue;
//				console.log('SearchView, onKeyDown[keyCode: ' + keyCode + ']');

				switch (keyCode) {
					case tvKey.KEY_UP:
					case tvKey.KEY_LEFT:
					case tvKey.KEY_RIGHT:
						break;
					case tvKey.KEY_DOWN:
						sendChangeViewEvent(DefineView.SEARCH_DAILY_POPULARITY_CHART_VIEW);
						break;
					case tvKey.KEY_BACK:
					case tvKey.KEY_EXIT:
					case tvKey.KEY_ESC:
					case tvKey.KEY_BACK:
						sendFinishViewEvent();
						break;
					case tvKey.KEY_ENTER:
						sendShowKeypadEvent();
						// sendChangeViewEvent();
						break;
					default:
						break;
				};

				return true;
			};
			SearchView.prototype.onGetData = function (param) {
			};
			function requestContentList(callback, categoryId, startIndex, pageSize) {
				_this.isRequesting = true;
//				console.log('categoryId: ' + categoryId);
				var transactionId = ++_this.transactionId;
				Communicator.requestContentGroupListUseStartItemIndex(callback, transactionId, categoryId, SortType.NOTSET, startIndex, pageSize, false);
            };
            function callBackForRequestContentGroupList(result) {
            	_this.isRequesting = false;
            	if(Communicator.isCorrectTransactionID(_this.transactionId, result)) {
            		if(Communicator.isSuccessResponseFromHAS(result) == true) {
                    	var model = _this.model;
    					var verticalVisibleSize = 2;
    					var horizontalVisibleSize = 5;
    					var verticalMaximumSize = Math.ceil(result.totalCount / horizontalVisibleSize);
    					var horizentalMaximumSize = horizontalVisibleSize;

    					model.totalCount = result.totalCount;
    					model.setSize(verticalVisibleSize, horizontalVisibleSize, verticalMaximumSize, horizentalMaximumSize);
    					model.setRotate(false, true);
    					model.setNextLineRotate(true);
                    	setData(result);
                    	_this.drawer.onUpdate();
                    } else {
                    	console.error("Failed to get datas from has.");
                    };
            	}
            };
			
			function setData(result) {
				_this.model.setContentGroupList(result.contentGroupList);
//				console.log(_this.model.getContentGroupList());
			};

			function sendChangeViewEvent(targetView) {
//				console.log('sendChangeViewEvent');
				var param = {};
				param.targetView = targetView;
				param.vIndex = 0;
				_this.sendEvent(CCAEvent.CHANGE_VIEW, param);
			};
			
			function sendShowKeypadEvent() {
				_this.sendEvent(CCAEvent.SHOW_VIRTUAL_KEYPAD);	
			};

			function sendFinishViewEvent() {
                _this.sendEvent(CCAEvent.FINISH_VIEW);
            };

			return SearchView;
});
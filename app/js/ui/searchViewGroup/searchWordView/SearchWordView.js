define(['framework/View', 'framework/event/CCAEvent', 'main/CSSHandler',
		'ui/searchViewGroup/searchWordView/SearchWordDrawer',
		'ui/searchViewGroup/searchWordView/SearchWordModel',
		'service/Communicator',
		'cca/type/SortType', "cca/DefineView", "framework/modules/ButtonGroup", "../../../../resources/strings/ko"],
		function (View, CCAEvent, CSSHandler, SearchWordDrawer, SearchWordModel, Communicator, SortType, DefineView, ButtonGroup, Strings) {

			var _this = null;
			var SearchWordView = function () {
				View.call(this, DefineView.SEARCH_WORD_VIEW);
				this.model = new SearchWordModel();
				this.drawer = new SearchWordDrawer(this.getID(), this.model);
				// this.onInit();
				_this = this;
				// this.transactionId = 0;
				// this.isRequesting = false;
			};

			SearchWordView.prototype = Object.create(View.prototype);
			SearchWordView.prototype.onBeforeActive = function() {
				//@숫자 key를 받을 수 있도록 lock 을 해제
				CSSHandler.activateNumberKeys(true);
				console.log('onBeforeActive');
			};
			SearchWordView.prototype.onAfterDeActive = function() {
				//@숫자 key를 받을 수 있도록 lock 을 해제
				CSSHandler.activateNumberKeys(false);
				console.log('onAfterDeActive');
			};
			SearchWordView.prototype.onAfterStop = function() {
				CSSHandler.activateNumberKeys(false);
			};
			SearchWordView.prototype.onKeyDown = function (event, param) {
				var model = _this.model;
				var keyCode = param.keyCode;
				var tvKey = window.TVKeyValue;
				switch (keyCode) {
					case tvKey.KEY_UP:
						if(model.getVIndex() == 0) {
							var param = {};
							sendUpdateViewEvent('TYPE_SEARCH_BAR');
							sendChangeViewEvent(DefineView.KEYPAD_VIEW);
						} else {
							_this.keyNavigator.keyUp();
						};
						_this.drawer.onUpdate();
						return true;
					case tvKey.KEY_DOWN:
						if(model.getVIndex() == model.getData().length - 1) {
							model.setVIndex(0);
						} else {
							_this.keyNavigator.keyDown();
						};
						_this.drawer.onUpdate();
						return true;
					case tvKey.KEY_LEFT:
						return true;
					case tvKey.KEY_RIGHT:
						sendUpdateViewEvent('TYPE_TOP_BUTTON_GROUP');
						sendChangeViewEvent(DefineView.KEYPAD_VIEW);
						_this.drawer.onUpdate();
						return true;
					case tvKey.KEY_BACK:
					case tvKey.KEY_EXIT:
					case tvKey.KEY_BACK:
						sendFinishViewEvent();
						return true;
					case tvKey.KEY_ENTER:
						clickSearchWord();
						return true;
					case tvKey.KEY_0:
					case tvKey.KEY_1:
					case tvKey.KEY_2:
					case tvKey.KEY_3:
					case tvKey.KEY_4:
					case tvKey.KEY_5:
					case tvKey.KEY_6:
					case tvKey.KEY_7:
					case tvKey.KEY_8:
					case tvKey.KEY_9:
					case tvKey.KEY_46: //덧쓰기
					case tvKey.KEY_187: //쌍자음
					case tvKey.KEY_219: //지우기
					case tvKey.KEY_220: //한/영/수
						sendChangeViewEvent('TYPE_KEYPAD', keyCode);
						return true;
					default:
						return false;
				};
			};
			SearchWordView.prototype.onUpdate = function (param) {
				_this.model.setData(param.searchWordList);
				_this.model.setVIndex(0);
				_this.drawer.onUpdate();
			};
			SearchWordView.prototype.onGetData = function (param) {

				// this.isRequesting = false;
				// this.transactionId = 0;
				var model = _this.model;
				var verticalVisibleSize = 9;
				var horizontalVisibleSize = 1;
				var verticalMaximumSize = 9;
				var horizentalMaximumSize = 1;

				model.setSize(verticalVisibleSize, horizontalVisibleSize, verticalMaximumSize, horizentalMaximumSize);
				model.setRotate(false, false);
				model.setNextLineRotate(false);

				model.setData([]);

            	_this.drawer.onUpdate();
			};
			
			function requestSearchWord(callback, searchField, searchWord) {
				if(_this.isRequesting == true) {
					return;
				};
				_this.isRequesting = true;

				var transactionId = ++_this.transactionId;
				var includeAdultCategory = _this.model.getExpandSearch();
				var pageIndex = 0;
				var pageSize = 9;
				Communicator.requestSearchWordList(callback, _this.transactionId, searchField, includeAdultCategory, searchWord, pageIndex, pageSize);
			};
			function callbackForRequestSearchWord(result) {
				_this.isRequesting = false;
				if(Communicator.isCorrectTransactionID(_this.transactionId, result)) {
					if(Communicator.isSuccessResponseFromHAS(result) == true) {
						_this.model.totalCount = result.totalCount;
						_this.model.setData(result.searchWordList);
						_this.drawer.onUpdate();
					} else {
						console.error("Failed to get datas from has.", result );
					};
				}
				
			};
			function requestSearchContentGroup() {
				if(_this.isRequesting == true) {
					return;
				};
				_this.isRequesting = true;

			};
			function callbackForRequestSearchContentGroup(result) {
				_this.isRequesting = false;
				if(Communicator.isSuccessResponseFromHAS(result) == true) {
					console.log('result: ', result);
					// _this.model.totalCount = result.totalCount;

					// _this.model.setData(result.searchWordList);
				} else {
					console.error("Failed to get datas from has.", result);
				};
			};

			function clickSearchWord () {
				var searchWord = _this.model.getData()[_this.model.getVIndex()];
				var param = {};
				param.targetView = DefineView.KEYPAD_VIEW;
				param.targetComponent = 'TYPE_SEARCH_BAR';
				param.searchWord = searchWord;
				_this.sendEvent(CCAEvent.UPDATE_VIEW, param);
			};

			function sendUpdateViewEvent(target, keyCode) {
				var param = {};
				param.targetView = DefineView.KEYPAD_VIEW;
				param.targetComponent = target;
				param.keyCode = keyCode;
				_this.sendEvent(CCAEvent.UPDATE_VIEW, param);
			};

			function sendChangeViewEvent() {
				var param = {};
				param.targetView = DefineView.KEYPAD_VIEW;
				_this.sendEvent(CCAEvent.CHANGE_VIEW, param);
			};

			function sendFinishViewEvent() {
                _this.sendEvent(CCAEvent.FINISH_VIEW);
            };

            SearchWordView.TYPE_POSTER_CONTENTS;
            SearchWordView.TYPE_RECOMMEND_BY_MD;

			return SearchWordView;
});
define(['framework/View', 'framework/event/CCAEvent', 'main/CSSHandler',
		'ui/searchViewGroup/keypadView/KeypadDrawer',
		'ui/searchViewGroup/keypadView/KeypadModel',
		'service/Communicator', "cca/PopupValues",
		'cca/type/SortType', "cca/DefineView", "framework/modules/ButtonGroup", "../../../../resources/strings/ko"],
		function (View, CCAEvent, CSSHandler, KeypadDrawer, KeypadModel, Communicator, PopupValues, SortType, DefineView, ButtonGroup, Strings) {

			var _this = null;
			var KeypadView = function () {
				View.call(this, DefineView.KEYPAD_VIEW);
				this.model = new KeypadModel();
				this.drawer = new KeypadDrawer(this.getID(), this.model);
				this.isRequesting = false;
				// this.onInit();
				_this = this;
				this.isRequesting = false;
//				this.cursorRun = null;
				this.keypadMap = [
									49, 50, 51,
									52, 53, 54,
									55, 56, 57,
									46, 48, 187
								];
			};
			KeypadView.prototype = Object.create(View.prototype);
			KeypadView.prototype.onBeforeActive = function() {
				//@숫자 key를 받을 수 있도록 lock 을 해제
				CSSHandler.activateNumberKeys(true);
//				startBlink();// cursor code
			};
			KeypadView.prototype.onAfterDeActive = function() {
				//@숫자 key를 받을 수 있도록 lock 을 해제
				CSSHandler.activateNumberKeys(false);
//				forceStopBlink();// cursor code
			};
			KeypadView.prototype.onAfterStop = function() {
				CSSHandler.activateNumberKeys(false);
			};
			KeypadView.prototype.onInit = function () {
			};
			KeypadView.prototype.onKeyDown = function (event, param) {
				var model = _this.model;
				var keyCode = param.keyCode;
				var tvKey = window.TVKeyValue;
//				console.log('KeypadView, onKeyDown[keyCode: ' + keyCode + ']');

				var currentFocusedComponent = model.getFocusedComponent();

				switch (keyCode) {
					case tvKey.KEY_UP:
						if(currentFocusedComponent == model.TYPE_KEYPAD && model.getVIndex() > 0) {
							_this.keyNavigator.keyUp();
						} else {
							model.setFocusedComponent(currentFocusedComponent - 1);
							initIndex(currentFocusedComponent);
						};

						if(model.getFocusedComponent() == model.TYPE_KEYPAD && isEmptyKey() == true) {
							model.setHIndex(1);
						};

						_this.drawer.onUpdate();
						return true;
					case tvKey.KEY_DOWN:
						if(currentFocusedComponent == model.TYPE_KEYPAD && model.getVIndex() < 3) {
							_this.keyNavigator.keyDown();
						} else {
							if(currentFocusedComponent == model.TYPE_SEARCH_BAR) {
								if(model.getData().length > 0) {
									sendChangeViewEvent(DefineView.SEARCH_WORD_VIEW);
								} else {
									model.setFocusedComponent(model.TYPE_TOP_BUTTON_GROUP);	
								};
							} else {
								model.setFocusedComponent(currentFocusedComponent + 1);
							};
						};

						if(model.getFocusedComponent() == model.TYPE_KEYPAD && isEmptyKey() == true) {
							model.setHIndex(1);
						};

						_this.drawer.onUpdate();
						return true;
					case tvKey.KEY_LEFT:
						if(currentFocusedComponent == model.TYPE_KEYPAD && model.getHIndex() > 0) {
							_this.keyNavigator.keyLeft();
						} else if(currentFocusedComponent == model.TYPE_TOP_BUTTON_GROUP && model.getTopButtonGroup().getIndex() > 0) {
							model.getTopButtonGroup().previous();
						} else if(currentFocusedComponent == model.TYPE_BOTTOM_BUTTON_GROUP && model.getBottomButtonGroup().getIndex() > 0) {
							model.getBottomButtonGroup().previous();
						} else {
							if(model.getData().length > 0) {
								sendChangeViewEvent('searchWordView');
							} else {
								model.setFocusedComponent(model.TYPE_SEARCH_BAR);
								initIndex(currentFocusedComponent);	
							};
							initIndex(model.TYPE_KEYPAD);
						};

						if(model.getFocusedComponent() == model.TYPE_KEYPAD && isEmptyKey() == true) {
							if(model.getVIndex() == 0) {
								model.setFocusedComponent(model.TYPE_TOP_BUTTON_GROUP);
								initIndex();
							} else {
								model.setVIndex(model.getVIndex() - 1);
							};
						};

						_this.drawer.onUpdate();
						return true;
					case tvKey.KEY_RIGHT:
						if(currentFocusedComponent == model.TYPE_KEYPAD && model.getHIndex() < 2) {
							_this.keyNavigator.keyRight();
						} else if(currentFocusedComponent == model.TYPE_TOP_BUTTON_GROUP && model.getTopButtonGroup().getIndex() == 0) {
							model.getTopButtonGroup().next();
						} else if(currentFocusedComponent == model.TYPE_BOTTOM_BUTTON_GROUP && model.getBottomButtonGroup().getIndex() == 0) {
							model.getBottomButtonGroup().next();
						} else {
							model.setFocusedComponent(model.TYPE_SEARCH_BAR);
							initIndex(currentFocusedComponent);
						};

						if(model.getFocusedComponent() == model.TYPE_KEYPAD && isEmptyKey() == true) {
							model.setVIndex(model.getVIndex() - 1);
						};

						_this.drawer.onUpdate();
						return true;
					case tvKey.KEY_ESC:
					case tvKey.KEY_EXIT:
					case tvKey.KEY_BACK:
						sendFinishViewEvent();
						return true;
					case tvKey.KEY_ENTER:
						clickKeypad();
						_this.drawer.onUpdate();
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
						moveFocusAndClickKeypad(keyCode);
						return true;
					default:
						return false;
				};
			};
			KeypadView.prototype.onUpdate = function (param) {
				if(param == undefined) {
					return;
				} else if(param.keycode != undefined) {
					moveFocusAndClickKeypad(keyCode);
				} else if(param.targetComponent != undefined) {
					if(_this.model[param.targetComponent] == _this.model.TYPE_SEARCH_BAR && param.searchWord != undefined) {
						_this.model.setInputText(param.searchWord);
						initAutomata(param.searchWord);
						// sendChangeViewGroupEvent('searchResultViewGroup');
						requestSearchContentGroup();
					} else {
						this.model.setFocusedComponent(_this.model[param.targetComponent]);	
					};
				};

				View.prototype.onUpdate.call(this, param);
			};
			KeypadView.prototype.onGetData = function (param) {
				initAutomata("");
				
				this.transactionId = $.now() % 1000000;

				var model = _this.model;
				var verticalVisibleSize = 4;
				var horizontalVisibleSize = 3;
				var verticalMaximumSize = verticalVisibleSize;
				var horizentalMaximumSize = horizontalVisibleSize;

				model.setSize(verticalVisibleSize, horizontalVisibleSize, verticalMaximumSize, horizentalMaximumSize);
				model.setRotate(false, false);
				model.setNextLineRotate(false);

				model.setExpandSearch(param.expandSearch);
				console.log('expandSearch: ', this.model.getExpandSearch());

				var topButtonGroup = new ButtonGroup(2);
				topButtonGroup.setAutoFocus();
				var bottomButtonGroup = new ButtonGroup(2);
				bottomButtonGroup.setAutoFocus();
				model.setTopButtonGroup(topButtonGroup);
				model.setBottomButtonGroup(bottomButtonGroup);
            	// setData(result);
            	_this.drawer.onUpdate();
			};
			// function setData(result) {
			// 	_this.model.setContentGroupList(result.contentGroupList);
			// };

//			function startBlink() {  // cursor code
//					_this.cursorRun = setInterval(function()	{
//						_this.drawer.doBlink();
//					}, 1000);
//			} 
//			function forceStopBlink(){
//				clearInterval(_this.cursorRun);
//			}
			KeypadView.prototype.onPopupResult = function(param) {
				console.log(param);
                if (param.id == PopupValues.ID.CONFIRM_AUTH_FOR_EXT_SEARCH && param.result == Strings.ButtonLabel.CONFIRM) {
                    _this.model.setExpandSearch(_this.model.getExpandSearch() == true ? false : true);
                    _this.drawer.onUpdate();
                };
	        };

	        function initAutomata(initString) {
	        	cnmAutomata.init(initString ? initString : "", function() {
					callbackForCursorChanged();
				});
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
						sendUpdateViewEvent(result.searchWordList);
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
				
				var transactionId = ++_this.transactionId;
				var contentGroupProfile = 0; 
				var searchField = 'all';
				var includeAdultCategory = (_this.model.getExpandSearch() == true) ? 1 : 0;
				var searchKeyword = _this.model.getInputText();
				var sortType = SortType.NAME_ASC;
				var startItemIndex = 0;
				var pageSize = 1;
				Communicator.requestSearchContentGroup(callbackForRequestSearchContentGroup, transactionId, contentGroupProfile, 
					searchField, includeAdultCategory, searchKeyword, sortType, startItemIndex, pageSize);
			};
			function callbackForRequestSearchContentGroup(result) {
				_this.isRequesting = false;
				if(Communicator.isCorrectTransactionID(_this.transactionId, result)) {
					if(Communicator.isSuccessResponseFromHAS(result) == true) {
						var searchField = [];
						for(var i=0; i<result.searchResultList.length; i++) {
							searchField.push(result.searchResultList[i].searchCategory);
						};
						sendChangeViewGroupEvent(DefineView.SEARCH_RESULT_VIEWGROUP, searchField);
						// _this.model.totalCount = result.totalCount;

						// _this.model.setData(result.searchWordList);
					} else {
						console.error("Failed to get datas from has.", result);
					};
				}
			};

			function initIndex(componentType) {
				var model = _this.model;
				switch(componentType) {
					case model.TYPE_TOP_BUTTON_GROUP:
						model.getTopButtonGroup().setIndex(0);
						break;
					case model.TYPE_BOTTOM_BUTTON_GROUP:
						model.getBottomButtonGroup().setIndex(0);
						break;
					case model.TYPE_KEYPAD:
						model.setVIndex(0);
						model.setHIndex(0);
						break;
				};
			};
			function callbackForCursorChanged() {

			};
			function isEmptyKey() {
				var model = _this.model;
				var mode = model.getKeypadMode();
				var keypadMap = Strings.keypadMap[mode];
				var index = model.getVIndex() * 3 + model.getHIndex();
				var key = keypadMap[index];
				return (key.length == 0) ? true : false;
			};
			function sendChangeToAutomataResultViewEvent() {
//				console.log('sendChangeToAutomataResultViewEvent');
				var param = {focusedCategory: _this.model.focusedCategory, targetView: "automataResultView"};
				_this.sendEvent(CCAEvent.CHANGE_VIEW, param);
			};

			function moveFocusAndClickKeypad(keyCode) {
				var model = _this.model;
				if(keyCode == TVKeyValue.KEY_219) {
					model.getTopButtonGroup().setIndex(1);
					model.setFocusedComponent(model.TYPE_TOP_BUTTON_GROUP);
					clickKeypad();
				} else if(keyCode == TVKeyValue.KEY_220) {
					model.getTopButtonGroup().setIndex(0);
					model.setFocusedComponent(model.TYPE_TOP_BUTTON_GROUP);
					clickKeypad();
				} else {
					var position = getPositionByKeyCode(keyCode);
					if(position != null) {
						model.setVIndex(position.vIndex);
						model.setHIndex(position.hIndex);
						model.setFocusedComponent(model.TYPE_KEYPAD);
						clickKeypad();
					};
				};

				_this.drawer.onUpdate();
			};
			function getPositionByKeyCode(keyCode) {
				var index = _this.keypadMap.indexOf(keyCode);
				if(index < 0) {
					return null;
				};

				var vIndex = Math.floor(index / 3);
				var hIndex = index % 3;
				return {'vIndex': vIndex, 'hIndex': hIndex};
			};
			function getKeyCodeByPosition(position) {
				var index = position.vIndex * 3 + position.hIndex;
				return _this.keypadMap[index];
			};
			function sendAutomataEvent(keyCode) {
				var keyword = cnmAutomata.keydown(keyCode);
				_this.model.setInputText(keyword);
				if(keyword.length == 0) {
					_this.model.totalCount = 0;
					_this.model.setData([]);
					_this.drawer.onUpdate();
					sendUpdateViewEvent([]);
				} else {
					requestSearchWord(callbackForRequestSearchWord, 'all', keyword);	
				};
				
				_this.drawer.onUpdate();
			};
			function changeKeypad() {
				var mode = cnmAutomata.getMode();
				_this.model.setKeypadMode(mode);
				_this.drawer.onUpdate();
			};

			function clickKeypad() {
				var model = _this.model;
				switch(model.getFocusedComponent()) {
					case model.TYPE_SEARCH_BAR:
						break;
					case model.TYPE_CHECK_BOX:
						if(model.getExpandSearch() == true) {
							model.setExpandSearch(false);
							_this.drawer.onUpdate();
						} else {
							popupExpandSearch();
						};
						
						break;
					case model.TYPE_TOP_BUTTON_GROUP:
						var keyCode = (model.getTopButtonGroup().getIndex() == 0) ? window.TVKeyValue.KEY_220 : window.TVKeyValue.KEY_219;
						sendAutomataEvent(keyCode);
						changeKeypad();
						break;
					case model.TYPE_KEYPAD:
						var vIndex = model.getVIndex();
						var hIndex = model.getHIndex();
						var keyCode = getKeyCodeByPosition({'vIndex': vIndex, 'hIndex': hIndex});
						sendAutomataEvent(keyCode);
						break;
					case model.TYPE_BOTTOM_BUTTON_GROUP:
						var isOkButton = model.getBottomButtonGroup().getIndex() == 0;
						if(isOkButton == true) {
							// requestSearchContentGroup();
							if(_this.model.getInputText().length > 0) {
								// sendChangeViewGroupEvent('searchResultViewGroup');
								requestSearchContentGroup();
							};
						} else {
							sendFinishViewEvent();
						};

						break;
					default:
						break;
				};
			};


			function popupExpandSearch() {
				_this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, {targetGroup:DefineView.POPUP_VIEWGROUP, id:PopupValues.ID.CONFIRM_AUTH_FOR_EXT_SEARCH});
			};

			function getTargetView(contentGroup) {
				if(contentGroup.isEpisodePeerContent()) {
					return DefineView.EPISODE_PEER_LIST_VIEW;
				} else {
					return DefineView.DETAIL_VIEW;
				};
			};

			function sendChangeViewEvent(targetView) {
				var param = {};
				param.targetView = targetView;
				_this.sendEvent(CCAEvent.CHANGE_VIEW, param);
				_this.model.setFocusedComponent(_this.model.TYPE_SEARCH_WORD);
			};

			function sendChangeViewGroupEvent(targetViewGroup, searchField) {
				CSSHandler.activateNumberKeys(false);
				console.log('onAfterDeActive');

				var param = {};
				param.targetGroup = targetViewGroup;
				param.keyword = _this.model.getInputText();
				param.isExpandSearch = _this.model.getExpandSearch();
				param.searchField = searchField;
				_this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, param);
			};

			function sendUpdateViewEvent(data) {
				var param = {};
				param.targetView = DefineView.SEARCH_WORD_VIEW;
				param.searchWordList = data;
				_this.sendEvent(CCAEvent.UPDATE_VIEW, param);
			};

			function sendFinishViewEvent() {
				var expandSearch = _this.model.getExpandSearch();
				_this.model.init();
				// _this.model.setExpandSearch(expandSearch);
				_this.drawer.onUpdate();
                _this.sendEvent(CCAEvent.FINISH_VIEW, {'expandSearch': expandSearch});
            };

            KeypadView.TYPE_POSTER_CONTENTS;
            KeypadView.TYPE_RECOMMEND_BY_MD;

			return KeypadView;
});
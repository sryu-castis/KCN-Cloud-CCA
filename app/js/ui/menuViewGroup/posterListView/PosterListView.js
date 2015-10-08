define(['framework/View', 'framework/event/CCAEvent',
		'ui/menuViewGroup/posterListView/PosterListDrawer',
		'ui/menuViewGroup/posterListView/PosterListModel',
		'service/Communicator', 'cca/type/ViewerType',
		'cca/type/SortType', "cca/DefineView", 'main/CSSHandler', 'cca/type/VisibleTimeType'],
		function (View, CCAEvent, PosterListDrawer, PosterListModel, Communicator, ViewerType, SortType, DefineView,CSSHandler, VisibleTimeType) {

			var _this = null;
			var PosterListView = function (type) {
				View.call(this, "PosterListView");
				this.model = new PosterListModel();
				this.drawer = new PosterListDrawer(this.getID(), this.model, type);

				// this.onInit();
				var requestID = null;
			};
			PosterListView.prototype = Object.create(View.prototype);
			PosterListView.prototype.onInit = function () {

			};
			PosterListView.prototype.onBeforeStart= function() {
				_this = this;
				this.isRequesting = false;
				this.transactionId = $.now() % 1000000;
			}
			PosterListView.prototype.onAfterStart = function() {
				this.hideTimerContainer();
			};

			PosterListView.prototype.onBeforeActive = function() {
				_this = this;
                this.drawer.setActive(true);
                _this.drawer.onUpdate();
            }
			PosterListView.prototype.onAfterActive = function() {
				sendChangeFocus();
			}

            PosterListView.prototype.onAfterDeActive = function() {
                this.drawer.setActive(false);
                _this.drawer.onUpdate();
            };

			PosterListView.prototype.onKeyDown = function (event, param) {
				var model = _this.model;
				var keyCode = param.keyCode;
				var tvKey = window.TVKeyValue;
//				console.log('PosterListView, onKeyDown[keyCode: ' + keyCode + ']');

				switch (keyCode) {
					case tvKey.KEY_UP:
						if(model.getVIndex() == 0) {
							scrollUp();
						} else {
							_this.keyNavigator.keyUp();
							_this.drawer.onUpdate();
							sendChangeFocus();
						};

						return true;
					case tvKey.KEY_DOWN:
						if(model.getVIndex() > 0) {
							var carriageReturn = false;
							scrollDown(carriageReturn);									
						} else {
							_this.keyNavigator.keyDown();
							adjustHIndex();

							_this.drawer.onUpdate();
							sendChangeFocus();
						}

						return true;
					case tvKey.KEY_LEFT:
						if(_this.model.getHIndex() == 0) {
							sendFinishViewEvent();
						} else {
							_this.keyNavigator.keyLeft();
							sendChangeFocus();
						}
						
						_this.drawer.onUpdate();
						return true;
					case tvKey.KEY_RIGHT:
						//last item
						//second line and last column
						if(isLastIndex() == true || (model.getVIndex() == 1 && isLastColumn())) {
							var carriageReturn = true;
							scrollDown(carriageReturn);
						} else {
							_this.keyNavigator.keyRight();
							_this.drawer.onUpdate();
							sendChangeFocus();
						}
						return true;
					case tvKey.KEY_YELLOW:
					case tvKey.KEY_Y:
						// if(_this.drawer.type == PosterListDrawer.TYPE_NORMAL_CATEGORY) {
							sendChangeToTextViewEvent();
						// };
						return true;
					case tvKey.KEY_BACK:
					case tvKey.KEY_EXIT:
					case tvKey.KEY_BACK:
						sendFinishViewEvent();
						return true;
					case tvKey.KEY_ENTER:
						sendChangeViewEvent();
						return true;
					default:
						return false;
				};
			};
			PosterListView.prototype.onGetData = function (param) {
				this.model.focusedCategory = param.focusedCategory;

				// this.keyword = undefined;
				var resultCategory = param.resultCategory;
				var vIndex = param.vIndex;
				var hIndex = param.hIndex;
	            var vStartIndex = param.vStartIndex;

                //var selectedItemIndex = param.selectedItemIndex;
                //if( selectedItemIndex != undefined ) {
                //    vStartIndex = Math.floor(selectedItemIndex / PosterListView.HORIZONTAL_VISIBLE_SIZE);
                //    var delta = selectedItemIndex - vStartIndex * PosterListView.HORIZONTAL_VISIBLE_SIZE;
                //    vIndex = Math.floor(delta / PosterListView.HORIZONTAL_VISIBLE_SIZE);
                //    hIndex = delta % PosterListView.HORIZONTAL_VISIBLE_SIZE;
                //}

	            this.model.setVIndex(vIndex | 0);
	            this.model.setHIndex(hIndex | 0);
            	this.model.setVStartIndex(vStartIndex | 0);
            	var startItemIndex = this.model.getVStartIndex() * 5;

				if(param.keyword != null && param.keyword.length > 0) {
					this.model.setKeyword(param.keyword);
					this.model.setSearchField(param.searchField);
					this.model.setIsExpandSearch(param.isExpandSearch);
                    this.model.setResultCategory(param.resultCategory);
					// this.keyword = param.keyword;
					// this.searchField = param.searchField;
					// this.isExpandSearch = param.isExpandSearch;
				} else if(resultCategory != null) {
					this.model.setAssetID(param.assetID);
					this.model.setResultCategory(param.resultCategory);
				};
				requestSuitably(callBackForRequestContentGroupList, startItemIndex);
			};

			function requestSuitably(callBackFunc, startItemIndex) {
				if(_this.model.getKeyword() != "") {
					requestSearchContentGroup(callBackFunc, startItemIndex);
				} else if(_this.model.resultCategory != null) {
					requestRecommendContentGroupByAssetId(callBackFunc, startItemIndex);
				} else {
					requestContentList(callBackFunc, startItemIndex);
				};
			};

			function requestSearchContentGroup(callBackFunc, startItemIndex) {
				if(_this.isRequesting == true) {
					return;
				};
				_this.isRequesting = true;
				var transactionId = ++_this.transactionId;
				var contentGroupProfile = 2; 
				var searchField = _this.model.getSearchField();
				var includeAdultCategory = (_this.model.getIsExpandSearch() == true) ? 1 : 0;
				var searchKeyword = _this.model.getKeyword();
				// var searchField = _this.searchField;
				// var includeAdultCategory = (_this.isExpandSearch == true) ? 1 : 0;
				// var searchKeyword = _this.keyword;
				var sortType = SortType.NAME_ASC;
				Communicator.requestSearchContentGroup(callBackFunc, transactionId, contentGroupProfile,
					searchField, includeAdultCategory, searchKeyword, sortType, startItemIndex, PosterListView.PAGE_SIZE);
			};


			function requestRecommendContentGroupByAssetId(callBackFunc, startItemIndex) {
				if(_this.isRequesting == true) {
					return;
				};
				_this.isRequesting = true;
				var transactionId = ++_this.transactionId;
				var assetID = _this.model.getAssetID();
				var resultCategory = _this.model.getResultCategory();
				var contentGroupProfile = "2";
				var recommendField = resultCategory.getRecommendField();
				var recommendFieldValue = resultCategory.getName();

				//Communicator.setRequestID(assetID + recommendField + recommendFieldValue + startItemIndex);
                Communicator.requestRecommendContentGroupByAssetIdUseStartItemIndex(callBackFunc, transactionId, assetID, contentGroupProfile, recommendField, recommendFieldValue, PosterListView.PAGE_SIZE, startItemIndex);
			};

			function requestContentList(callback, startIndex) {
				if(_this.isRequesting == true) {
					return;
				};
				_this.isRequesting = true;
				var transactionId = ++_this.transactionId;
				var categoryId =_this.model.focusedCategory.getCategoryID();
				Communicator.requestContentGroupListUseStartItemIndex(callback, transactionId, categoryId, SortType.NOTSET, startIndex, PosterListView.PAGE_SIZE, false);
            };
            function callBackForRequestContentGroupList(result) {
            	_this.isRequesting = false;

            	if(Communicator.isCorrectTransactionID(_this.transactionId, result)) {
            		if(Communicator.isSuccessResponseFromHAS(result) == true) {
            			if((result.contentGroupList && result.contentGroupList.length == 0) || (result.searchResultList && result.searchResultList[0].length == 0)) {
            				sendChangeViewToNoDataViewEvent();
            			} else {
            				setData(result);
	    					_this.drawer.onUpdate();
            			}
					} else {
						console.error("Failed to get datas from has.");
						sendChangeViewToNoDataViewEvent(result.resultCode);
					};
					_this.setVisibleTimer(VisibleTimeType.POSTER_LIST_TYPE);
				}
            };
			function setData(response) {
				response = response.searchResultList ? response.searchResultList[0] : response;

				if(response.contentGroupList.length == 0) {
					sendChangeViewToNoDataViewEvent();
				} else {
					var model = _this.model;
					var verticalMaximumSize = Math.ceil(response.totalCount / PosterListView.HORIZONTAL_VISIBLE_SIZE);
					var horizontalMaximumSize = PosterListView.HORIZONTAL_VISIBLE_SIZE;
					
					model.setTotalCount(response.totalCount);
					model.setSize(PosterListView.VERTICAL_VISIBLE_SIZE, PosterListView.HORIZONTAL_VISIBLE_SIZE, verticalMaximumSize, horizontalMaximumSize);
					model.setRotate(false, true);
					model.setNextLineRotate(true);
					_this.model.setData(response.contentGroupList);	
				}			
			};

			function scrollUp() {
				if(_this.isRequesting == true) {
					return;
				};
				var model = _this.model;
				if(model.getVMax() > 2) {
					var vStartIndex = model.getVStartIndex() - 1;
					var isOverflow = vStartIndex < 0;
					var vIndex = isOverflow ? 1 : 0;
					vStartIndex = isOverflow ? model.getVMax() - 2 : vStartIndex;
					var startIndexForRequest = vStartIndex * model.getHVisibleSize();
					
					requestSuitably(function(result) {
						_this.isRequesting = false;
						if(Communicator.isSuccessResponseFromHAS(result) == true) {
							result = result.searchResultList ? result.searchResultList[0] : result;
							if(result.contentGroupList.length == 0) {
								sendChangeViewToNoDataViewEvent();
							} else {
								model.setData(result.contentGroupList);
								model.setVStartIndex(vStartIndex);
								model.setVIndex(vIndex);
								adjustHIndex();

								_this.drawer.onUpdate();
								//var data = {duration:300, x:295, y:100, width:620, height:430, startY:-85};
								//CSSHandler.requestAniListSlide(data);
								sendChangeFocus();	
							}
						} else {
							console.error("Failed to get datas from has.");
							sendChangeViewToNoDataViewEvent(result.resultCode);
						}
					}, startIndexForRequest);
				} else {
					var vIndex = model.getVMax() - 1;
					model.setVIndex(vIndex);
					adjustHIndex();

					_this.drawer.onUpdate();
					sendChangeFocus();
				}
			};
			function scrollDown(carriageReturn) {
				if(_this.isRequesting == true) {
					return;
				};
				var model = _this.model;
				if(model.getVMax() > 2) {
					var vStartIndex = model.getVStartIndex() + 1;
					var isOverflow = vStartIndex + model.getVIndex() > model.getVMax() - 1;
					var vIndex = isOverflow ? 0 : 1;
					vStartIndex = isOverflow ? 0 : vStartIndex;
					var startIndexForRequest = vStartIndex * model.getHVisibleSize();

					requestSuitably(function(result) {
						_this.isRequesting = false;
						if(Communicator.isSuccessResponseFromHAS(result) == true) {
							result = result.searchResultList ? result.searchResultList[0] : result;
							if(result.contentGroupList.length == 0) {
								sendChangeViewToNoDataViewEvent();
							} else {
								model.setData(result.contentGroupList);
								model.setVStartIndex(vStartIndex);
								model.setVIndex(vIndex);
								if(carriageReturn == true) {
									model.setHIndex(0);
								};
								adjustHIndex();

								_this.drawer.onUpdate();
								//var data = {duration:300, x:295, y:100, width:620, height:430, startY:285};
								//CSSHandler.requestAniListSlide(data);
								sendChangeFocus();	
							}
						} else {
							console.error("Failed to get datas from has.");
							sendChangeViewToNoDataViewEvent(result.resultCode);
						}
					}, startIndexForRequest);
				} else {
					var vIndex = 0;
					model.setVIndex(vIndex);
                	if(carriageReturn == true) {
                		var hIndex = 0;
                		model.setHIndex(hIndex);
                	}

					_this.drawer. onUpdate();
					sendChangeFocus();
				}
			};
			function adjustHIndex() {
				var model = _this.model;
				var index = getCurrentIndex();
				if(model.getData()[index] == undefined) {
					model.setHIndex(model.getData().length % model.getHVisibleSize() - 1);
				};
			};
			function isLastColumn() {
				return (_this.model.getHIndex() == _this.model.getHVisibleSize() - 1);
			};
			function isLastIndex() {
				var model = _this.model;
				var index = getCurrentIndex();
				return index == model.getData().length - 1;
				// return (isCurrentVIndexLeaf() == true && _this.model.getHIndex() == getLeafCount()-1);
			};
			function getCurrentIndex() {
				var model = _this.model;
				return model.getVIndex() * model.getHVisibleSize() + model.getHIndex();
			};
			function sendChangeToTextViewEvent() {
                //var selectedItemIndex = (_this.model.getVStartIndex() + _this.model.getVIndex()) * PosterListView.HORIZONTAL_VISIBLE_SIZE + _this.model.getHIndex();
				var param = {focusedCategory: _this.model.focusedCategory, targetView: "textListView"};
				param.resultCategory = _this.model.getResultCategory();
				param.assetID = _this.model.getAssetID();
				param.keyword = _this.model.getKeyword();
				param.searchField = _this.model.getSearchField();
				param.isExpandSearch = _this.model.getIsExpandSearch();
                //param.selectedItemIndex = selectedItemIndex;
				_this.sendEvent(CCAEvent.CHANGE_VIEW, param);
			};
			function sendChangeViewEvent() {
				var model = _this.model;
				var selectedItemIndex = model.getVIndex() * model.getHVisibleSize() + model.getHIndex();
				var selectedItem = model.getData()[selectedItemIndex];
				//console.log('selected contentGroup: ' + selectedItem.getTitle());
				var param = {};
                param.focusedCategory = _this.model.focusedCategory;

                param.targetView = getTargetView(selectedItem);
            	param.contentGroupID = selectedItem.getContentGroupID();
                _this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, param);
			};
			function sendChangeViewToNoDataViewEvent(resultCode) {
				var param = {};
				param.errorCode = resultCode;
				param.targetView = DefineView.NO_DATA_VIEW;
				param.messageType = ViewerType.POSTER_VIEW;
				_this.sendEvent(CCAEvent.CHANGE_VIEW, param);
			};

			function sendChangeFocus() {
				var model = _this.model;
				var param = {};
				param.vIndex = model.getVIndex();
				param.hIndex = model.getHIndex();
				param.vStartIndex = model.getVStartIndex();
				param.keyword = model.getKeyword();
				param.searchField = model.getSearchField();
				param.isExpandSearch = model.getIsExpandSearch();
				param.assetID = model.getAssetID();
				//param.focusedCategory = model.focusedCategory;
				param.resultCategory = model.getResultCategory();
				_this.sendEvent(CCAEvent.CHANGE_FOCUS_ON_VIEW, param);
			};

			function getTargetView(contentGroup) {
				if(contentGroup.isEpisodePeerContent()) {
					return DefineView.EPISODE_PEER_LIST_VIEW;
				} else {
					return DefineView.DETAIL_VIEW;
				}

			}

			function sendFinishViewEvent() {
                _this.sendEvent(CCAEvent.FINISH_VIEW);
            };
			PosterListView.TYPE_NORMAL_CATEGORY = PosterListDrawer.TYPE_NORMAL_CATEGORY;
			PosterListView.TYPE_RESULT_CATEGORY = PosterListDrawer.TYPE_RESULT_CATEGORY;
			PosterListView.TYPE_SEARCH_RESULT_CATEGORY = PosterListDrawer.TYPE_SEARCH_RESULT_CATEGORY;
            PosterListView.TYPE_POSTER_CONTENTS;
            PosterListView.TYPE_RECOMMEND_BY_MD;

            PosterListView.VERTICAL_VISIBLE_SIZE      = 2;
            PosterListView.HORIZONTAL_VISIBLE_SIZE    = 5;
            PosterListView.PAGE_SIZE                  = 10;

			return PosterListView;
});
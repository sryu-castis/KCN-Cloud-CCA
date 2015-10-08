define(['framework/View', 'framework/event/CCAEvent', 'cca/type/ViewerType',
		'ui/menuViewGroup/subscriberBasedRecommendationView/SubscriberBasedRecommendationDrawer',
		'ui/menuViewGroup/subscriberBasedRecommendationView/SubscriberBasedRecommendationModel',
		'service/Communicator',
		'cca/type/SortType', "cca/DefineView", 'cca/type/VisibleTimeType'],
		function (View, CCAEvent, ViewerType, AssetListDrawer, AssetListModel, 
			Communicator, SortType, DefineView, VisibleTimeType) {

			var _this = null;
			var AssetListView = function () {
				View.call(this, DefineView.ASSET_LIST_VIEW);
				this.model = new AssetListModel();
				this.drawer = new AssetListDrawer(this.getID(), this.model);
				this.isRequesting = false;
				// this.onInit();
				
				var requestID = null;
			};
			AssetListView.prototype = Object.create(View.prototype);
			AssetListView.prototype.onInit = function () {

			}
			AssetListView.prototype.onAfterStart = function() {
				_this.hideTimerContainer();
			};
			AssetListView.prototype.onBeforeActive = function() {
				_this = this;
			};
			AssetListView.prototype.onAfterActive = function() {
				sendChangeFocus();
			};
			AssetListView.prototype.onKeyDown = function (event, param) {
				var model = _this.model;
				var keyCode = param.keyCode;
				var tvKey = window.TVKeyValue;
//				console.log('AssetListView, onKeyDown[keyCode: ' + keyCode + ']');

				switch (keyCode) {
					case tvKey.KEY_UP:
						// if(model.getVIndex() == 1) {
						// 	moveFocusToFirstRow();
						// 	_this.drawer.onUpdate();
						// } else {
							scrollUp();
						// };
						
						return true;
					case tvKey.KEY_DOWN:
						// if(model.getVStartIndex() == model.getVMax() - 2 && model.getVIndex() == 0) {
						// 	moveFocusToSecondRow();
						// 	_this.drawer.onUpdate();
						// } else {
							var carriageReturn = false;
							scrollDown(carriageReturn);									
						// };
						
						return true;
					case tvKey.KEY_LEFT:
						if(_this.model.getHIndex() == 0) {
							sendFinishViewEvent();
						} else {
							_this.keyNavigator.keyLeft();	
						};
						
						sendChangeFocus();
						_this.drawer.onUpdate();

						return true;
					case tvKey.KEY_RIGHT:
                        if(isLastIndex() == true || isLastColumn()) {
                            var carriageReturn = true;
                            scrollDown(carriageReturn);
                        } else {
                            _this.keyNavigator.keyRight();
                            _this.drawer.onUpdate();
                            sendChangeFocus();
                        }
                        return true;
/*						if(isLastColumn() == true) {
							if(model.getVStartIndex() + model.getVIndex() == model.getVMax() - 2) {
								model.setVIndex(1);
								model.setHIndex(0);
								_this.drawer.onUpdate();
								sendChangeFocus();
							} else {
								var carriageReturn = true;
								scrollDown(carriageReturn);
							};
							
						} else if(isLastIndex() == true) {
							var carriageReturn = true;
							scrollDown(carriageReturn);
						} else {
							_this.keyNavigator.keyRight();
							_this.drawer.onUpdate();
							sendChangeFocus();
						};*/

						return true;
					case tvKey.KEY_YELLOW:
					case tvKey.KEY_Y:
						//sendChangeToTextViewEvent();
						break;
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
			AssetListView.prototype.onGetData = function (param) {
				/*
				 *  categoryId,
				 *  hIndex, vIndex
				 *  hStartIndex, vStartIndex
				 *  isAsset
				 */
				_this = this;
				this.transactionId = $.now() % 1000000;
				this.model.focusedCategory = param.focusedCategory;
                //var categoryType = param.categoryType;
	            //var currentCategoryID = param.focusedCategory.getCategoryID();
				var vIndex = param.vIndex;
				var hIndex = param.hIndex;
	            var vStartIndex = param.vStartIndex;
	            this.model.setVIndex(vIndex | 0);
	            this.model.setHIndex(hIndex | 0);
            	this.model.setVStartIndex(vStartIndex | 0);
                var startItemIndex = this.model.getVStartIndex() * 4;

				requestAssetListByCategoryId(function (result) {
					_this.isRequesting = false;
	            	if(Communicator.isCorrectTransactionID(_this.transactionId, result)) {
	            		if(Communicator.isSuccessResponseFromHAS(result) == true) {
                            setData(result);
	            			_this.drawer.onUpdate();
	            			_this.setVisibleTimer(VisibleTimeType.POSTER_LIST_TYPE);
	            		} else {
	            			console.error("Failed to get datas from has.", result);
	                    	sendChangeViewToNoDataViewEvent(result.resultCode);
	            		}
	            	} else {
	            		console.error("Invalid transactionId.", result);
	            	}
				}, startItemIndex);
			}

			function requestAssetListByCategoryId(callback, startItemIndex) {
				_this.isRequesting = true;
				var transactionId = ++_this.transactionId;
				var categoryId = _this.model.focusedCategory.getCategoryID();
				var sortType = SortType.NOTSET;
				var assetProfile = 7;
            	var includeAdultCategory = 1;
                var pageIndex = Math.floor(startItemIndex / AssetListView.PAGE_SIZE);
				Communicator.requestAssetListByCategoryID(callback, transactionId, categoryId, assetProfile, sortType, pageIndex, AssetListView.PAGE_SIZE);
            }

            function callBackForRequestAssetListByCategoryId(result) {
            	_this.isRequesting = false;
            	if(Communicator.isCorrectTransactionID(_this.transactionId, result)) {
            		if(Communicator.isSuccessResponseFromHAS(result) == true) {
            			if(result.assetList.length == 0) {
            				sendChangeViewToNoDataViewEvent();
            			} else {
                            setData(result);
	                    	_this.drawer.onUpdate();
	                    	sendChangeFocus();
	    					_this.setVisibleTimer(VisibleTimeType.POSTER_LIST_TYPE);	
            			}
                    } else {
                    	console.error("Failed to get datas from has.", result);
                    	sendChangeViewToNoDataViewEvent(result.resultCode);
                    }
            	}
                
            }
            function setData(result) {
                var model = _this.model;
                var verticalVisibleSize = 2;
                var horizontalVisibleSize = 4;
                var verticalMaximumSize = Math.ceil(result.totalAssetCount / horizontalVisibleSize);
                var horizontalMaximumSize = horizontalVisibleSize;
                var assetList;
                var overlapCount = model.getVStartIndex()*4 + result.assetList.length - result.totalAssetCount;
                if( overlapCount > 0) {
                    assetList = result.assetList.slice(overlapCount);
                } else {
                    assetList = result.assetList;
                }
                model.totalCount = result.totalAssetCount;
                model.setSize(verticalVisibleSize, horizontalVisibleSize, verticalMaximumSize, horizontalMaximumSize);
                model.setRotate(false, true);
                model.setNextLineRotate(true);
                if(assetList == 0) {
                    sendChangeViewToNoDataViewEvent();
                } else {
                    _this.model.setData(assetList);
                    _this.model.setViewType(DefineView.ASSET_LIST_VIEW);
                }
            }

			function scrollUp() {
				if(_this.isRequesting == true) {
					return;
				}
				var model = _this.model;
				if(model.getVMax() > 1) {
					var vStartIndex = model.getVStartIndex() - 1;
					var isOverflow = vStartIndex < 0;
					var vIndex = 0;
					vStartIndex = isOverflow ? model.getVMax() - 1 : vStartIndex;
	                var startIndexForRequest = vStartIndex * model.getHVisibleSize();

	                requestAssetListByCategoryId(function (result) {
	                    _this.isRequesting = false;
	                    if (result.transactionId != _this.transactionId) {
	                        console.error("Invalid transactionId.");
	                        return;
	                    }
	                    if (Communicator.isSuccessResponseFromHAS(result) == true) {
	                        // if(result.assetList.length == 0) {
	                        // 	sendChangeViewToNoDataViewEvent();
	                        // } else {
	                        model.setVStartIndex(vStartIndex);
	                        model.setVIndex(vIndex);
	                        adjustHIndex();
	                        // index를 가지고 검색 결과를 slice하기 때문에 set index를 먼저하고 set data를 해야함.
	                        setData(result);

	                        _this.drawer.onUpdate();
	                        sendChangeFocus();
	                        _this.setVisibleTimer(VisibleTimeType.POSTER_LIST_TYPE);
	                        // }

	                    } else {
	                        console.error("Failed to get datas from has.", result);
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
			}

			function scrollDown(carriageReturn) {
				if(_this.isRequesting == true) {
					return;
				}
                var model = _this.model;
                if(model.getVMax() > 1) {
                	var vStartIndex = model.getVStartIndex() + 1;
	                var isOverflow = vStartIndex + model.getVIndex() > model.getVMax() - 1;
	                var vIndex = 0; //isOverflow ? 0 : 1;
	                vStartIndex = isOverflow ? 0 : vStartIndex;
	                var startIndexForRequest = vStartIndex * model.getHVisibleSize();

	                requestAssetListByCategoryId(function (result) {
	                    _this.isRequesting = false;
	                    if(result.transactionId != _this.transactionId) {
	                        console.error("Invalid transactionId.");
	                        return;
	                    }
	                    if(Communicator.isSuccessResponseFromHAS(result) == true) {
	                        // if(result.assetList.length == 0) {
	                        // 	sendChangeViewToNoDataViewEvent();
	                        // } else {
	                            model.setVStartIndex(vStartIndex);
	                            model.setVIndex(vIndex);
	                            model.setHIndex(carriageReturn == true ? 0 : model.getHIndex());
	                            adjustHIndex();
	                            // index를 가지고 검색 결과를 slice하기 때문에 set index를 먼저하고 set data를 해야함.
	                            setData(result);

	                            _this.drawer.onUpdate();
	                            sendChangeFocus();
	                            _this.setVisibleTimer(VisibleTimeType.POSTER_LIST_TYPE);
	                        // }

	                    } else {
	                        console.error("Failed to get datas from has.", result);
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

                	_this.drawer.onUpdate();
                	sendChangeFocus();
                }
			}
			function moveFocusToSecondRow() {
				_this.model.setVIndex(1);
				adjustHIndex();
			}
			function moveFocusToFirstRow() {
				_this.model.setVIndex(0);
			}
			function adjustHIndex() {
				var model = _this.model;
				
				if(model.getVStartIndex() + model.getVIndex() + 1 > getVMaxForColumn(model.getHIndex())) {
//					console.log('adjustHIndex');
					model.setHIndex(getLeafCount()-1);
				}
			}
			function isLastColumn() {
				return (_this.model.getHIndex() == _this.model.getHVisibleSize() - 1) ? true : false;
			}
			function isLastIndex() {
                var model = _this.model;
                var index = getCurrentIndex();
                return index == model.getData().length - 1;
				//return (isCurrentVIndexLeaf() == true && _this.model.getHIndex() == getLeafCount()-1) ? true : false;
			}
            function getCurrentIndex() {
                var model = _this.model;
                return model.getVIndex() * model.getHVisibleSize() + model.getHIndex();
            }
			function getVMaxForColumn(hIndex) {
                var model = _this.model;
                var leafCount = getLeafCount();
                return (leafCount == model.getHVisibleSize() || leafCount > hIndex) ? model.getVMax() : model.getVMax() - 1;
            }
			function isCurrentVIndexLeaf() {
				var currentVIndex = _this.model.getVStartIndex() + _this.model.getVIndex();
				return (getVMaxForColumn(_this.model.getHIndex()) - 1 == currentVIndex) ? true : false;
			}
			function getLeafCount() {
				var leafCount = _this.model.totalCount % _this.model.getHVisibleSize();
				return (leafCount == 0) ? _this.model.getHVisibleSize() : leafCount;
			};
			function sendChangeToTextViewEvent() {
//				console.log('sendChangeToTextViewEvent');
				var param = {focusedCategory: _this.model.focusedCategory, targetView: DefineView.TEXT_LIST_VIEW};
				_this.sendEvent(CCAEvent.CHANGE_VIEW, param);
			};
			function sendChangeViewEvent() {
				var model = _this.model;
				var selectedItemIndex = model.getVIndex() * model.getHVisibleSize() + model.getHIndex();
				var selectedItem = model.getData()[selectedItemIndex];
//				console.log('selected contentGroup: ' + selectedItem.getTitle());
				var param = {};
                param.focusedCategory = _this.model.focusedCategory;
                param.targetView = DefineView.DETAIL_VIEW;
            	param.assetID = selectedItem.getAssetID();
                _this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, param);
			};
			function sendChangeViewToNoDataViewEvent(resultCode) {
				var param = {};
				param.errorCode = resultCode;
				param.targetView = DefineView.NO_DATA_VIEW;
				param.messageType = ViewerType.MD_RECOMMEND;
				_this.sendEvent(CCAEvent.CHANGE_VIEW, param);
			};
			function sendChangeFocus() {
				var model = _this.model;
				var param = {};
				param.vIndex = model.getVIndex();
				param.hIndex = model.getHIndex();
				param.vStartIndex = model.getVStartIndex();
				_this.sendEvent(CCAEvent.CHANGE_FOCUS_ON_VIEW, param);
			};
			function sendFinishViewEvent() {
                _this.sendEvent(CCAEvent.FINISH_VIEW);
            };

            AssetListView.TYPE_RECOMMEND_ASSET_SUBSCRIBER;
            AssetListView.TYPE_RECOMMEND_BY_MD;

            AssetListView.PAGE_SIZE                  = 4;
			return AssetListView;
});
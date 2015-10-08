define(['framework/View', 'framework/event/CCAEvent',
		'ui/menuViewGroup/subscriberBasedRecommendationView/SubscriberBasedRecommendationDrawer',
		'ui/menuViewGroup/subscriberBasedRecommendationView/SubscriberBasedRecommendationModel',
		'service/Communicator',
		'cca/type/SortType', "cca/DefineView", "cca/type/ViewerType", 'cca/type/VisibleTimeType'],
		function (View, CCAEvent, SubscriberBasedRecommendationDrawer, SubscriberBasedRecommendationModel, 
			Communicator, SortType, DefineView, ViewerType, VisibleTimeType) {

			var _this = null;
			var SubscriberBasedRecommendationView = function (id) {
				View.call(this, id ? id : DefineView.SUBSCRIBER_BASED_RECOMMANDATION_VIEW);
				this.model = new SubscriberBasedRecommendationModel();
				this.drawer = new SubscriberBasedRecommendationDrawer(this.getID(), this.model);
				this.isRequesting = false;
				// this.onInit();
				_this = this;
				var requestID = null;
			};
			SubscriberBasedRecommendationView.prototype = Object.create(View.prototype);
			SubscriberBasedRecommendationView.prototype.onInit = function () {

			};
			SubscriberBasedRecommendationView.prototype.onKeyDown = function (event, param) {
				var model = _this.model;
				var keyCode = param.keyCode;
				var tvKey = window.TVKeyValue;
				//console.log('SubscriberBasedRecommendationView, onKeyDown[keyCode: ' + keyCode + ']');

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
							sendChangeFocus();	
						};
						
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
						//if(isLastColumn() == true) {
						//	if(model.getVStartIndex() + model.getVIndex() == model.getVMax() - 2) {
						//		model.setVIndex(1);
						//		model.setHIndex(0);
						//		_this.drawer.onUpdate();
						//		sendChangeFocus();
						//	} else {
						//		var carriageReturn = true;
						//		scrollDown(carriageReturn);
						//	};
						//
						//} else if(isLastIndex() == true) {
						//	var carriageReturn = true;
						//	scrollDown(carriageReturn);
						//} else {
						//	_this.keyNavigator.keyRight();
						//	_this.drawer.onUpdate();
						//	sendChangeFocus();
						//};

						return true;
					// case tvKey.KEY_YELLOW:
					// 	sendChangeToTextViewEvent();
					// 	return true;
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
			SubscriberBasedRecommendationView.prototype.onBeforeStart = function (param) {
				_this = this;
				this.isRequesting = false;
				this.transactionId = $.now() % 1000000;
			};
			SubscriberBasedRecommendationView.prototype.onAfterStart = function() {
				_this.hideTimerContainer();
			};
			SubscriberBasedRecommendationView.prototype.onAfterActive = function() {
				sendChangeFocus();
			}
			SubscriberBasedRecommendationView.prototype.onGetData = function (param) {
				/*
				 *  categoryId,
				 *  hIndex, vIndex
				 *  hStartIndex, vStartIndex
				 *  isAsset
				 */
				this.model.init();
				this.type = param.type;
				this.model.focusedCategory = param.focusedCategory;
				var categoryType = param.categoryType;
	            var currentCategoryID = param.focusedCategory.getCategoryID();
				var vIndex = param.vIndex;
				var hIndex = param.hIndex;
	            var vStartIndex = param.vStartIndex;
	            this.model.setVIndex(vIndex | 0);
	            this.model.setHIndex(hIndex | 0);
            	this.model.setVStartIndex(vStartIndex | 0);
    			var startItemIndex = this.model.getVStartIndex() * 4;

    			if(_this.model.focusedCategory.getViewerType() == ViewerType.SUBSCRIBER_RECOMMEND) {
					_this.model.setViewType(DefineView.SUBSCRIBER_BASED_RECOMMANDATION_VIEW);
				} else if (_this.model.focusedCategory.getViewerType() == ViewerType.BUNDLEPRODUCT_LIST) {
					_this.model.setViewType(DefineView.BUNDLE_LIST_VIEW);
				};

    			requestSuitably(callBackForRequestAssetListBySubscriber, startItemIndex);
			};

            SubscriberBasedRecommendationView.prototype.onRetore = function (param) {
                if(_this.model.focusedCategory.getViewerType() == ViewerType.BUNDLEPRODUCT_LIST && param && param.needReloadHistory && param.purchasedProductID) {
                    var bundleProduct = _this.model.getData()[getCurrentIndex()];
                    if(bundleProduct.getProductID() != param.purchasedProductID) {
                        var bundleProductList = _this.model.getData();
                        for (var i=0; i<bundleProductList.length; i++) {
                            bundleProduct = bundleProductList[i];
                            if(bundleProduct.getProductID() == param.purchasedProductID) {
                                break;
                            } else {
                                bundleProduct = null;
                            }
                        }
                    }
                    if(bundleProduct != null) {
                        //@Fake Purchased
                        bundleProduct.setPurchasedTime('0000-00-00 00:00:00');
                        bundleProduct.setPurchasedID(1);
                        _this.drawer.onUpdate();
                    }
                }
            }

			function requestSuitably(callbackFunction, startItemIndex) {
				if(_this.model.getViewType() == DefineView.SUBSCRIBER_BASED_RECOMMANDATION_VIEW) {
					requestRecommendAssetBySubscriber(callbackFunction, startItemIndex);
				} else if(_this.model.getViewType() == DefineView.BUNDLE_LIST_VIEW) {
					requestBundleProductList(callbackFunction, startItemIndex);
				};
			};

			function requestBundleProductList(callback, startIndex) {
                if(_this.isRequesting == true) {
                    return;
                };
                _this.isRequesting = true;
                var transactionId = ++_this.transactionId;
                var productProfile = 1;
                var pageSize = 4;
                Communicator.requestBundleProductList(callback, transactionId, productProfile, startIndex, pageSize);
            };

			function requestRecommendAssetBySubscriber(callback, startItemIndex) {
				if(_this.isRequesting == true) {
					return;
				};
				_this.isRequesting = true;
				var transactionId = ++_this.transactionId;
				var sortType = SortType.NAME_ASC;
				var assetProfile = 7;
            	var includeAdultCategory = 1;
            	var pageSize = 4;
				Communicator.requestRecommendAssetBySubscriber(transactionId, callback, pageSize, startItemIndex, sortType, assetProfile, includeAdultCategory);
            };
            function callBackForRequestAssetListBySubscriber(result) {
            	_this.isRequesting = false;
            	if(Communicator.isCorrectTransactionID(_this.transactionId, result)) {
            		 if(Communicator.isSuccessResponseFromHAS(result) == true) {
                     	var model = _this.model;
     					var verticalVisibleSize = 2;
     					var horizontalVisibleSize = 4;
     					var verticalMaximumSize = Math.ceil(result.totalCount / horizontalVisibleSize);
     					var horizentalMaximumSize = horizontalVisibleSize;

     					model.totalCount = result.totalCount;
     					model.setSize(verticalVisibleSize, horizontalVisibleSize, verticalMaximumSize, horizentalMaximumSize);
     					model.setRotate(false, true);
     					model.setNextLineRotate(true);
                     	setData(result);
                     	_this.drawer.onUpdate();
                     	//sendChangeFocus();
                     	_this.setVisibleTimer(VisibleTimeType.POSTER_LIST_TYPE);
                     } else {
                     	console.error("Failed to get datas from has.", result);
                     	sendChangeViewToNoDataViewEvent(result.resultCode);
                     };
            	}
            };
			function setData(result) {
				if(result.assetList) {
					if(result.assetList.length == 0) {
						sendChangeViewToNoDataViewEvent();
					} else {
						_this.model.setData(result.assetList);
					}
				} else if(result.bundleProductList) {
					if(result.bundleProductList.length == 0) {
						sendChangeViewToNoDataViewEvent();
					} else {
						_this.model.setData(result.bundleProductList);
					}
				};
				
			};

			function scrollUp() {
				if(_this.isRequesting == true) {
					return;
				};
				var model = _this.model;
				if(model.getVMax() > 1) {
					var vStartIndex = model.getVStartIndex() - 1;
					var isOverflow = vStartIndex < 0;
					// var vIndex = isOverflow ? 1 : 0;
					var vIndex = 0;
					vStartIndex = isOverflow ? model.getVMax() - 1 : vStartIndex;
					var startIndexForRequest = vStartIndex * model.getHVisibleSize();
					var categoryId = model.focusedCategory.getCategoryID();
					// requestRecommendAssetBySubscriber(function(result) {
					requestSuitably(function(result) {
						_this.isRequesting = false;
		            	if(result.transactionId != _this.transactionId) {
		            		console.error("Invalid transactionId.");
		            		return;
		            	};
						if(Communicator.isSuccessResponseFromHAS(result) == true) {
							setData(result);
							model.setVStartIndex(vStartIndex);
							model.setVIndex(vIndex);
							adjustHIndex();
							
							_this.drawer.onUpdate();
							sendChangeFocus();
							_this.setVisibleTimer(VisibleTimeType.POSTER_LIST_TYPE);
						} else {
							console.error("Failed to get datas from has.", result);
							sendChangeViewToNoDataViewEvent();
						};
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
				if(model.getVMax() > 1) {
					var vStartIndex = model.getVStartIndex() + 1;
					var isOverflow = vStartIndex + model.getVIndex() > model.getVMax() - 1;
					var isLastRow = vStartIndex + vIndex == model.getVMax() - 1;
					var vIndex = isLastRow ? 1 : 0;
					vStartIndex = isOverflow ? 0 : vStartIndex;
					var startIndexForRequest = vStartIndex * model.getHVisibleSize();
					var categoryId = model.focusedCategory.getCategoryID();
					// requestRecommendAssetBySubscriber(function(result) {
					requestSuitably(function(result) {
						_this.isRequesting = false;
		            	if(result.transactionId != _this.transactionId) {
		            		console.error("Invalid transactionId.");
		            		return;
		            	};
						if(Communicator.isSuccessResponseFromHAS(result) == true) {
							setData(result);
							model.setVStartIndex(vStartIndex);
							model.setVIndex(vIndex);
							if(carriageReturn == true) {
								model.setHIndex(0);
							}
							adjustHIndex();

							_this.drawer.onUpdate();
							sendChangeFocus();
							_this.setVisibleTimer(VisibleTimeType.POSTER_LIST_TYPE);
						} else {
							console.error("Failed to get datas from has.", error);
							sendChangeViewToNoDataViewEvent();
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
			}
			/*function sendChangeToTextViewEvent() {
//				console.log('sendChangeToTextViewEvent');
				var param = {focusedCategory: _this.model.focusedCategory, targetView: "textListView"};
				_this.sendEvent(CCAEvent.CHANGE_VIEW, param);
			}*/
			function sendChangeViewEvent() {
				var model = _this.model;
				var selectedItemIndex = model.getVIndex() * model.getHVisibleSize() + model.getHIndex();
				var selectedItem = model.getData()[selectedItemIndex];
//				console.log('selected contentGroup: ' + selectedItem.getTitle());
				var param = {};
				if(selectedItem.getProductID != undefined) {
					param.targetView = DefineView.BUNDLE_PRODUCT_VIEW;
					param.bundleProduct = selectedItem;
				} else {
					param.focusedCategory = _this.model.focusedCategory;
	                param.targetView = DefineView.DETAIL_VIEW;
	            	param.assetID = selectedItem.getAssetID();	
				}
                
                _this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, param);
			}
			function sendChangeViewToNoDataViewEvent(resultCode) {
                var param = {};
                param.errorCode = resultCode;
                param.targetView = DefineView.NO_DATA_VIEW;
                param.messageType = ViewerType.SUBSCRIBER_RECOMMEND;
                _this.sendEvent(CCAEvent.CHANGE_VIEW, param);
            }
            function sendChangeFocus() {
				var model = _this.model;
				var param = {};
				param.vIndex = model.getVIndex();
				param.hIndex = model.getHIndex();
				param.vStartIndex = model.getVStartIndex();
				_this.sendEvent(CCAEvent.CHANGE_FOCUS_ON_VIEW, param);
			}
			function sendFinishViewEvent() {
                _this.sendEvent(CCAEvent.FINISH_VIEW);
            }

            SubscriberBasedRecommendationView.TYPE_SUBSCRIBER_RECOMMEND = "recommendBySubscriber";
            SubscriberBasedRecommendationView.TYPE_MD_RECOMMEND = "recommendByMD";

			return SubscriberBasedRecommendationView;
});

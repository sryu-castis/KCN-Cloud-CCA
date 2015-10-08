define(["framework/View", "framework/event/CCAEvent",
		"ui/detailViewGroup/bundleProductView/BundleProductModel", "ui/detailViewGroup/bundleProductView/BundleProductDrawer",
		"service/CCAInfoManager", 'service/STBInfoManager', "framework/modules/InputField", "framework/modules/ButtonGroup",
		"service/Communicator", "cca/type/SortType", "helper/UIHelper", "cca/model/Asset", "cca/model/ContentGroup", "cca/DefineView", 'cca/type/VisibleTimeType',
		'cca/model/BundleProduct', 'cca/model/BundleAsset', 'cca/type/PlayType', "cca/PopupValues"
	],
	function (View, CCAEvent, BundleProductModel, BundleProductDrawer, CCAInfoManager, STBInfoManager, InputField, ButtonGroup, Communicator, SortType, UIHelper, Asset, ContentGroup, DefineView, VisibleTimeType, BundleProduct, BundleAsset, PlayType, PopupValues) {

		var BundleProductView = function () {
			View.call(this, DefineView.BUNDLE_PRODUCT_VIEW);
			this.model = new BundleProductModel();
			this.drawer = new BundleProductDrawer(this.getID(), this.model);
			var _this = this;

			BundleProductView.prototype.onInit = function() {

			};
			BundleProductView.prototype.onBeforeStart = function () {
				_this = this;
				this.isRequesting = false;
				this.transactionId = $.now() % 1000000;
			};
			BundleProductView.prototype.onAfterStart = function() {
				_this.hideTimerContainer();
			}
			BundleProductView.prototype.onBeforeStop = function() {
				isAlreadySend = false;
			}
			BundleProductView.prototype.onBeforeActive = function() {
				this.drawer.onUpdate();
			}
			BundleProductView.prototype.onPopupResult = function(param) {
				if (param.id == PopupValues.ID.CHOICE_CONTINUE_VOD_PLAY) {
					if(param.result == CCABase.StringSources.ButtonLabel.PLAY_CONTINUE){
						changeToPlay(PlayType.NORMAL, _this.model.getOffsetToPlay(), _this.model.getAssetToPlay());
					}
					else if(param.result == CCABase.StringSources.ButtonLabel.PLAY_FIRST){
						changeToPlay(PlayType.NORMAL, 0, _this.model.getAssetToPlay());
					}
				} else if(param.id == PopupValues.ID.CONFIRM_ADULT_AUTH) {
					if(param.result == CCABase.StringSources.ButtonLabel.CONFIRM) {
						requestGetLatestOffset(callbackForRequestGetLatestOffset);
					} else {

					}
				}
			}
			BundleProductView.prototype.onGetData = function (param) {
				this.isRequesting = false;
				this.transactionId = $.now() % 1000000;

				var model = _this.model;
				var hIndex = param.hIndex;

				model.setHIndex(hIndex | 0);
				model.setButtonGroup(getButtonGroup());

                model.setNeedReloadHistory(param.needReloadHistory);

				if(param.bundleProduct != null) {
					var bundleProduct = makeBundleProductForRestore(param.bundleProduct);
					// setData(bundleProduct);
					requestGetBundleProductInfo(callbackForRequestGetBundleProductInfo, bundleProduct.getProductID());	
				} else if (param.product != null) {
					requestGetBundleProductInfo(callbackForRequestGetBundleProductInfo, param.product.getProductID());
				}
			};

			function makeBundleProductForRestore(bundleProduct) {
				if(bundleProduct != null && bundleProduct.constructor != BundleProduct) {
					var bundleAssetList = new Array();
					for(var i = 0; i < bundleProduct.jsonObject.bundleAssetList.length; i++) {
						bundleAssetList[i] = new BundleAsset(bundleProduct.jsonObject.bundleAssetList[i].jsonObject);
					}
					bundleProduct.jsonObject.bundleAssetList = bundleAssetList;
					bundleProduct = new BundleProduct(bundleProduct.jsonObject);
					// var productId = bundleProduct.jsonObject.productId;
					// requestGetBundleProductInfo(callbackForRequestGetBundleProductInfo, productId);
				}
				return bundleProduct;
			}

			function getButtonGroup() {
				var buttonGroup = new ButtonGroup(2);
				buttonGroup.setAutoFocus(true);
				return buttonGroup;
			};

			function setData(bundleProduct) {
				var verticalVisibleSize = 1;
				var horizonVisibleSize = bundleProduct.getBundleAssetList().length;
				var verticalMaximumSize = 1;
				var horizonMaximumSize = horizonVisibleSize;

				var model = _this.model;

				model.setSize(verticalVisibleSize, horizonVisibleSize, verticalMaximumSize, horizonMaximumSize);
				model.setVIndex(BundleProductView.STATE_BUTTONGROUP);

				_this.model.setData(bundleProduct);
				_this.setVisibleTimer(VisibleTimeType.POSTER_LIST_TYPE);
			};

			BundleProductView.prototype.onKeyDown = function (event, param) {
				var keyCode = param.keyCode;
				var tvKey = window.TVKeyValue;
				var buttonGroup = _this.model.getButtonGroup();
				var bundleProduct = _this.model.getData();
				switch (keyCode) {
					case tvKey.KEY_UP:
						break;
					case tvKey.KEY_DOWN:
						break;
					case tvKey.KEY_RIGHT:
						if(UIHelper.isPurchasedProduct(bundleProduct) == false) {
							buttonGroup.next();
						} else {
							_this.keyNavigator.keyRight();
							sendChangeFocus();
						};
						
						_this.drawer.onUpdate();
						break;
					case tvKey.KEY_LEFT:
						if(UIHelper.isPurchasedProduct(bundleProduct) == false) {
							buttonGroup.previous();
						} else {
							_this.keyNavigator.keyLeft();
							sendChangeFocus();
						};
						
						_this.drawer.onUpdate();
						break;
					case tvKey.KEY_ESC:
					case tvKey.KEY_BACK:
					case tvKey.KEY_EXIT:
						sendFinishViewEvent();
						break;
					case tvKey.KEY_ENTER:
						if(UIHelper.isPurchasedProduct(bundleProduct) == false) {
							clickButton();
						} else {
							// sendChangeViewEvent();
							// changeToPlay(PlayType.NORMAL, 0);
							// checkAdultAuth();
							// requestBundleAssetDetailList(callbackForRequestBundleAssetDetailList);
							requestAssetInfo(getCurrentAsset().getAssetID());
						};
						
						break;
					default:
						break;
				}
			};


			function requestGetBundleProductInfo (callback, productId) {
				if(_this.isRequesting == true) {
					return;
				};
				_this.isRequesting = true;

				var transactionId = ++_this.transactionId;
				var productProfile = 1;
				Communicator.requestGetBundleProductInfo(callback, transactionId, productId, productProfile);
			};

			function callbackForRequestGetBundleProductInfo(result) {
				_this.isRequesting = false;
            	if(Communicator.isCorrectTransactionID(_this.transactionId, result)) {
            		 if(Communicator.isSuccessResponseFromHAS(result) == true) {
                		setData(result.bundleProduct);
                		_this.drawer.onStart();
						 sendChangeFocus();
					 } else {
                     	console.error("Failed to get datas from has.", result);
                     };
            	}
			};

			function requestAssetInfo(assetID) {
				var assetProfile = 9;
				Communicator.requestAssetInfo(callBackForRequestAssetInfo, assetID, assetProfile);
			}

			function callBackForRequestAssetInfo(result) {
				_this.isRequesting = false;
            	// if(Communicator.isCorrectTransactionID(_this.transactionId, result)) {
            		 if(Communicator.isSuccessResponseFromHAS(result) == true) {
                     	// purchaseBundleProduct(result.bundleAssetDetailList);
                     	var hIndex = _this.model.getHIndex();
						var asset = result.asset;
						_this.model.setAssetToPlay(asset);
                     	if(STBInfoManager.needRatingLimit(asset.getRating())) {
                     		checkAdultAuth();
                     	} else {
	                     	requestGetLatestOffset(callbackForRequestGetLatestOffset);
                     	}
                     } else {
                     	console.error("Failed to get datas from has.", result);
                     };
            	// }
			}

			/*function callBackForRequestAssetInfo(response) {
				if(Communicator.isSuccessResponseFromHAS(response)) {
					_this.model.setAsset(response.asset);
					changeToPlay();
				}
			}*/

			/*function requestBundleAssetDetailList(callback) {
				if(_this.isRequesting == true) {
					return;
				};
				_this.isRequesting = true;
				var bundleProduct = _this.model.getData();
				var transactionId = ++_this.transactionId;
				var productId = bundleProduct.getProductID();
				var externalProductId = bundleProduct.getExternalProductID();
				var startItemIndex = 0;
				var pageSize = bundleProduct.getBundleAssetList().length;
				Communicator.requestBundleAssetDetailList(callback, transactionId, productId, externalProductId, startItemIndex, pageSize);
			};*/

			function callbackForRequestBundleAssetDetailList(result) {
				_this.isRequesting = false;
            	if(Communicator.isCorrectTransactionID(_this.transactionId, result)) {
            		 if(Communicator.isSuccessResponseFromHAS(result) == true) {
                     	// purchaseBundleProduct(result.bundleAssetDetailList);
                     	var hIndex = _this.model.getHIndex();
						var asset = result.bundleAssetDetailList[hIndex];
						_this.model.setAssetToPlay(asset);
                     	if(STBInfoManager.needRatingLimit(asset.getRating())) {
                     		checkAdultAuth();
                     	} else {
	                     	requestGetLatestOffset(callbackForRequestGetLatestOffset);
                     	}
                     } else {
                     	console.error("Failed to get datas from has.", result);
                     };
            	}
			}

			function clickButton() {
				var buttonGroup = _this.model.getButtonGroup();
				if(buttonGroup.getIndex() == 0) {
					purchaseBundleProduct();
					//requestBundleAssetDetailList(callbackForRequestBundleAssetDetailList);
				} else {
					sendFinishViewEvent();
				};
			};

			function purchaseBundleProduct(assetList) {
				var param = {};
				param.bundleProduct = _this.model.getData();
				param.bundleProduct.setAssetList(assetList);
				param.playAfterPurchase = false;
				param.targetView = DefineView.SELECT_PAYMENT_VIEW;
				_this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, param);
			};

			function checkAdultAuth() {
				var isChecked = CCAInfoManager.isAdultConfirm()
				if(isChecked == true) {
					requestGetLatestOffset(callbackForRequestGetLatestOffset);
				} else {
					sendChangeViewToPasswordViewEvent();
				}
			};

			function requestGetLatestOffset(callback) {
				var bundleAsset = getCurrentAsset();
				var assetId = bundleAsset.getAssetID();
				Communicator.requestGetLatestOffset(callback, assetId);
            };

            function callbackForRequestGetLatestOffset(result) {
        		if(Communicator.isSuccessResponseFromHAS(result) == true) {
        			// _this.model.setOffset(result.latestOffset);
					// if(_this.model.getOffset() > 0)	{
					_this.model.setOffsetToPlay(result.latestOffset);
					if(result.latestOffset > 0) {
						changeToSelectContinuousPlay();
					} else {
						changeToPlay(PlayType.NORMAL, 0, _this.model.getAssetToPlay());
					}
                } else {
                	console.error("Failed to get datas from has.", result);
                };
                
            };

            function getCurrentAsset () {
            	var hIndex = _this.model.getHIndex();
				var bundleAsset = _this.model.getData().getBundleAssetList()[hIndex];
				return bundleAsset;
            }

            function changeToSelectContinuousPlay()	{
				var id = PopupValues.ID.CHOICE_CONTINUE_VOD_PLAY;
				_this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, {targetGroup:DefineView.POPUP_VIEWGROUP, id:id});
			};

			function changeToPlay(playType, offset, asset) {
				var param = {};
				param.asset = asset;
				param.product = UIHelper.getDisplayProduct(param.asset.getProductList());
				param.coupon = null;
				param.offset = offset;
				param.playType = playType;
				param.targetView = DefineView.PLAYER_VIEW

				_this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, param);
			};

			/*function sendChangeViewEvent() {				
				var bundleAsset = getCurrentAsset();

				//console.log('selected contentGroup: ' + bundleProduct.getTitle());
				var param = {};
                param.targetView = DefineView.DETAIL_VIEW;
            	param.assetID = bundleAsset.getAssetID();
				param.startView = DefineView.BUNDLE_LIST_VIEW;
                _this.sendEvent(CCAEvent.CHANGE_VIEW, param);
			};*/

			function sendChangeFocus() {
				var model = _this.model;
				var param = {};
				param.hIndex = model.getHIndex();
				param.bundleProduct = model.getData();
				_this.sendEvent(CCAEvent.CHANGE_FOCUS_ON_VIEW, param);
			};

			function sendChangeViewToPasswordViewEvent() {
				var param = {};
				param.id = PopupValues.ID.CONFIRM_ADULT_AUTH
				// param.popupType = PopupValues.PopupType.ADULT_AUTH;
				param.targetGroup = DefineView.POPUP_VIEWGROUP;
				_this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, param);
			};

			function sendFinishViewEvent() {
                //_this.model.setNeedReloadHistory(true);
				_this.sendEvent(CCAEvent.FINISH_VIEWGROUP, {'needReloadHistory':_this.model.getNeedReloadHistory(), 'purchasedProductID':_this.model.getData().getProductID()});
			};

			this.onInit();
		};

		BundleProductView.prototype = Object.create(View.prototype);
		BundleProductView.STATE_BUNDLE_ASSET 	= 0;
		BundleProductView.STATE_BUTTONGROUP 	= 1;

		return BundleProductView;
	});
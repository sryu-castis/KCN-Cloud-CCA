define(["framework/View", "framework/event/CCAEvent",
		"ui/detailViewGroup/detailView/DetailModel", "ui/detailViewGroup/detailView/DetailDrawer",
		"service/CCAInfoManager", "framework/modules/InputField", "framework/modules/ButtonGroup",
		"service/Communicator", "cca/type/SortType", "helper/UIHelper", "cca/model/Asset", "cca/model/ContentGroup", "cca/DefineView", "cca/PopupValues", 
		'cca/type/PlayType', 'cca/type/VisibleTimeType', 'service/CouponManager', 'main/CSSHandler',
		'ui/popupViewGroup/eventDetailPopupView/EventDetailPopupView', "cca/type/ProductType"
	],
	function (View, CCAEvent, DetailDrawer, DetailModel, CCAInfoManager, InputField, ButtonGroup, Communicator, SortType, UIHelper, Asset, ContentGroup, DefineView, PopupValues, PlayType, VisibleTimeType, CouponManager, CSSHandler, EventDetailPopupView, ProductType) {

		var DetailView = function () {
			View.call(this, "detailView");
			this.model = new DetailDrawer();
			this.drawer = new DetailModel(this.getID(), this.model);
			var _this = this;
			var transactionId = "";
			var isAlreadySend = false;

			DetailView.prototype.onInit = function() {
				//addEventListener();
			}

			DetailView.prototype.onBeforeStart = function() {
				transactionId = "";
			}
			DetailView.prototype.onAfterStart = function() {
				_this.hideTimerContainer();
			}
			DetailView.prototype.onBeforeStop = function() {
				isAlreadySend = false;
			}
			DetailView.prototype.onBeforeActive = function() {
				this.drawer.onUpdate();
			}
			DetailView.prototype.onGetData = function (param) {
				var asset = param.asset;
				var contentGroup = param.contentGroup;
				var episodePeer = param.episodePeer;
				var isFirstTime = param.isFirstTime;
				//@Comment 시리즈에서 첫진입과 에피소드 인덱스 변경에 대한 판단을 위한 부분
				this.model.setFirstTimeDraw(isFirstTime);
				this.model.setEpisodePeer(episodePeer);
				if(contentGroup != undefined) {
					_this.model.setContentGroup(contentGroup);
					if(_this.model.getEpisodePeer() != null) {
						requestAssetByEpisodePeerID(_this.model.getEpisodePeer().getEpisodePeerID(), callBackForRequestAssetList)
					} else {
						requestAssetByContentGroupID(contentGroup.getContentGroupID(), callBackForRequestAssetList);
					}
				} else {
					_this.model.setCurrentAsset(asset);
					setData();
					_this.drawer.onUpdate();
					_this.setVisibleTimer(VisibleTimeType.POSTER_TYPE);
					sendChangeFocusEvent();
				}
			};
			DetailView.prototype.onPopupResult = function(param){
				if (param.id == PopupValues.ID.CHOICE_CONTINUE_VOD_PLAY) {
					if(param.result == CCABase.StringSources.ButtonLabel.PLAY_CONTINUE){
						changeToPlay(PlayType.NORMAL, _this.model.getOffset());
					}
					else if(param.result == CCABase.StringSources.ButtonLabel.PLAY_FIRST){
						changeToPlay(PlayType.NORMAL, 0);
					}
				} else if(param.popupType == PopupValues.PopupType.EVENT_DETAIL){
					var isAgreeForEvent = false;
					if(param.result == CCABase.StringSources.ButtonLabel.ENROLL){
						isAgreeForEvent = true;
					}
					changeToPurchase(isAgreeForEvent);
				} else if(param.id == PopupValues.ID.MOD_ALERT_COMPLETE) {
					var asset = _this.model.getCurrentAsset();
                    if(isAlreadyPurchaseContent(asset) != true) {
                        var contentGroup = _this.model.getContentGroup();
                        var episodePeer = _this.model.getEpisodePeer();
                        //var reloadParam = {asset:asset, contentGroup:contentGroup, episodePeer:episodePeer};
                        //_this.onGetData(reloadParam);
                        if(contentGroup != undefined) {
                            if(episodePeer != null) {
                                requestAssetByEpisodePeerID(_this.model.getEpisodePeer().getEpisodePeerID(), callBackForReloadAssetList)
                            } else {
                                requestAssetByContentGroupID(contentGroup.getContentGroupID(), callBackForReloadAssetList);
                            }
                        } else {
                            requestAssetInfoByAssetID(callBackForReloadAssetInfo, asset.getAssetId());
                        }
                    }
                }
	        };

			function addEventListener() {
				removeEventListener();
				$(_this.drawer).bind(CCAEvent.COMPLETE_TO_DRAW_VIEW, sendCompleteDrawEvent);
			}

			function removeEventListener() {
				$(_this.drawer).unbind();
			}

			function sendCompleteDrawEvent() {
				_this.sendEvent(CCAEvent.COMPLETE_TO_DRAW_VIEW);
			}

            function requestAssetInfoByAssetID(callback, assetID) {
                var assetProfile = 9;
                Communicator.requestAssetInfo(callback, assetID, assetProfile);
            }

            function callBackForReloadAssetInfo(response) {
                if(Communicator.isSuccessResponseFromHAS(response)) {
                    setData();
                    _this.drawer.onUpdate();
                    _this.setVisibleTimer(VisibleTimeType.POSTER_TYPE);
                } else {
                    //TODO HAS 에러 팝업 등 처리
                }
            }

            function callBackForReloadAssetList(response) {
                if(Communicator.isCorrectTransactionID(transactionId, response)) {
                    if(Communicator.isSuccessResponseFromHAS(response)) {
                        _this.model.getContentGroup().setAssetList(response.assetList);
                        _this.model.setCurrentAsset(getFirstAsset());
                        setData();
                        _this.drawer.onUpdate();
                        _this.setVisibleTimer(VisibleTimeType.POSTER_TYPE);
                    } else {
                        //TODO HAS 에러 팝업 등 처리
                    }
                }
            }

			function requestAssetByEpisodePeerID(episodePeerID, callBackForRequest) {
				var assetProfile = 9;
				var sortType = SortType.NONE;
				transactionId = episodePeerID;
				Communicator.requestAssetListByEpisodePeerId(callBackForRequest, transactionId, episodePeerID, assetProfile, sortType, 0, 2);
			}


			function requestAssetByContentGroupID(contentGroupID, callBackForRequest) {
				var assetProfile = 9;
				var sortType = SortType.NONE;
				var contentType = "all";
				transactionId = contentGroupID;
				Communicator.requestAssetListByContentGroupId(callBackForRequest, transactionId, contentGroupID, assetProfile, sortType, contentType, 0, 2);
			}

			function callBackForRequestAssetList(response) {
				if(Communicator.isCorrectTransactionID(transactionId, response)) {
					if(Communicator.isSuccessResponseFromHAS(response)) {
						_this.model.getContentGroup().setAssetList(response.assetList);
						_this.model.setCurrentAsset(getFirstAsset());
						setData();
						_this.drawer.onUpdate();
						_this.setVisibleTimer(VisibleTimeType.POSTER_TYPE);
						sendChangeFocusEvent();
					} else {
						//TODO HAS 에러 팝업 등 처리
					}
				}
			}

			function setData() {
				var model = _this.model;

				var verticalVisibleSize = 2;
				var horizonVisibleSize = 1;
				var verticalMaximumSize = verticalVisibleSize;
				var horizonMaximumSize = horizonVisibleSize;

				model.setSize(verticalVisibleSize, horizonVisibleSize, verticalMaximumSize, horizonMaximumSize);
				model.setVIndex(DetailView.STATE_BUTTONGROUP);
				model.setButtonGroup(getButtonGroup());
				//model.setData(getSynopsisList())
				model.setRotate(false, true);

			};

			function getFirstAsset() {
				var contentGroup = _this.model.getContentGroup();
				if(contentGroup.getHDAsset()) {
					return contentGroup.getHDAsset();
				} else {
					return contentGroup.getSDAsset();
				}
			}

			function getSynopsisList() {
				var synopsisList = new Array();
				var synopsis = _this.model.getCurrentAsset().getSynopsis();
				for(var i = 0; i< synopsis.length; i += 132) {
					synopsisList.push(synopsis.slice(i, i + 132));
				}
				//console.log(synopsisList);
				return synopsisList;
			}


			function getButtonGroup() {
				var buttonLabelList = getButtonLabelList();

				var buttonGroup = new ButtonGroup(buttonLabelList.length);
				//Label 설정

				for(var i = 0; i < buttonLabelList.length; i++) {
					buttonGroup.getButton(i).setLabel(buttonLabelList[i]);
				}

				//최초 설정
				/*if(!contentGroup.getHDAsset()) {
				 buttonGroup.getButton(0).onDeActive();
				 buttonGroup.setIndex(1);
				 }
				 if(!contentGroup.getSDAsset()) {
				 buttonGroup.getButton(1).onDeActive();
				 }*/


				return buttonGroup;
			}


			function getButtonLabelList() {
				var contentGroup = _this.model.getContentGroup();
				if(contentGroup != null) {
					return getButtonLabelListForContentGroup();
				} else {
					return getButtonLabelListForAsset();
				}
			}

			function isAlreadyPurchaseContent(asset) {
				//var asset = _this.model.getCurrentAsset();
				var product = UIHelper.getDisplayProduct(asset.getProductList());
				return UIHelper.isPurchasedProduct(product)
			}

			function isNeedShowSDContent(contentGroup) {
				var contentGroup = _this.model.getContentGroup();
				if(contentGroup.getHDAsset() && contentGroup.getSDAsset()) {
					var product = UIHelper.getProduct(contentGroup.getSDAsset().getProductList(), ProductType.RVOD);
					return product != null && product.getPurchasedTime().length > 1;
				} else {
					return false;
				}
			}

			function getButtonLabelListForContentGroup() {
				var contentGroup = _this.model.getContentGroup();
				var asset = _this.model.getCurrentAsset();
				var buttonLabelList = new Array();

				if(isNeedShowSDContent(contentGroup)) {
					if(isAlreadyPurchaseContent(contentGroup.getHDAsset())) {
						buttonLabelList.push(CCABase.StringSources.ButtonLabel.PLAY_HD);
					} else {
						buttonLabelList.push(CCABase.StringSources.ButtonLabel.PURCHASE_HD);
					}
					buttonLabelList.push(CCABase.StringSources.ButtonLabel.PLAY_SD);
				} else if(contentGroup.getHDAsset()) {
					if(isAlreadyPurchaseContent(contentGroup.getHDAsset())) {
						buttonLabelList.push(CCABase.StringSources.ButtonLabel.PLAY_HD);
					} else {
						buttonLabelList.push(CCABase.StringSources.ButtonLabel.PURCHASE_HD);
					}
				} else if(contentGroup.getSDAsset()) {
					if(isAlreadyPurchaseContent(contentGroup.getSDAsset())) {
						buttonLabelList.push(CCABase.StringSources.ButtonLabel.PLAY_SD);
					} else {
						buttonLabelList.push(CCABase.StringSources.ButtonLabel.PURCHASE_SD);
					}
				}

				if(!isAlreadyPurchaseContent(asset)) {
					if(hasPreview(asset)) {
						buttonLabelList.push(CCABase.StringSources.ButtonLabel.PREVIEW);
					}
					if(hasTrailer(asset)) {
						buttonLabelList.push(CCABase.StringSources.ButtonLabel.TRAILER);
					}	
				}
				if(UIHelper.isMODAsset(asset)) {
					buttonLabelList.push(CCABase.StringSources.ButtonLabel.OST_SMARTPHONE);
					buttonLabelList.push(CCABase.StringSources.ButtonLabel.OST_MONKEY);
				}

				return buttonLabelList;
			}

			function getButtonLabelListForAsset() {
				var asset = _this.model.getCurrentAsset();
				var buttonLabelList = new Array();

				if(asset.isHDContent()) {
					if(isAlreadyPurchaseContent(asset)) {
						buttonLabelList.push(CCABase.StringSources.ButtonLabel.PLAY_HD);
					} else {
						buttonLabelList.push(CCABase.StringSources.ButtonLabel.PURCHASE_HD);
					}
				} else {
					if(isAlreadyPurchaseContent(asset)) {
						buttonLabelList.push(CCABase.StringSources.ButtonLabel.PLAY_SD);
					} else {
						buttonLabelList.push(CCABase.StringSources.ButtonLabel.PURCHASE_SD);
					}
				}

				if(!isAlreadyPurchaseContent(asset)) {
					if(hasPreview(asset)) {
						buttonLabelList.push(CCABase.StringSources.ButtonLabel.PREVIEW);
					}
					if(hasTrailer(asset)) {
						buttonLabelList.push(CCABase.StringSources.ButtonLabel.TRAILER);
					}
				}

				return buttonLabelList;
			}


			function hasPreview(content) {
				if(content instanceof Asset) {
					return content.hasPreview();
				} else {
					var assetList = content.getAssetList();
					for(var i = 0; i < assetList.length; i++) {
						if(assetList[i].hasPreview()) {
							return true;
						}
					}
					return false;
				}
			}

			function hasTrailer(content) {
				if(content instanceof Asset) {
					return content.hasTrailer();
				} else {
					var assetList = content.getAssetList();
					for(var i = 0; i < assetList.length; i++) {
						if(assetList[i].hasTrailer()) {
							return true;
						}
					}
					return false;
				}
			}
			function requestGetLatestOffset(callback, assetId) {
				Communicator.requestGetLatestOffset(callback, assetId);
            }

            function callbackForRequestGetLatestOffset(result) {
        		if(Communicator.isSuccessResponseFromHAS(result) == true) {
        			_this.model.setOffset(result.latestOffset);
					if(_this.model.getOffset() > 0)	{
						changeToSelectContinuousPlay();	
					}
					else	{
						changeToPlay(PlayType.NORMAL, 0);
					}
					
                } else {
                	console.error("Failed to get datas from has.", result);
                }
                
            }

			DetailView.prototype.onKeyDown = function (event, param) {
				var keyCode = param.keyCode;
				var tvKey = window.TVKeyValue;
				var buttonGroup = _this.model.getButtonGroup();
				switch (keyCode) {
					case tvKey.KEY_UP:
						if(isButtonGroupState()) {
							_this.keyNavigator.keyUp();
							_this.drawer.onUpdate();
						}
						break;
					case tvKey.KEY_DOWN:
						if(buttonGroup.getButton(0).isActive()) {
							buttonGroup.setIndex(0);
						} else {
							buttonGroup.setIndex(1);
						}
						changeAsset();

						if(isButtonGroupState()) {
							sendChangeViewEvent();
						} else {
							_this.keyNavigator.keyDown();
							_this.drawer.onUpdate();
						}

						break;
					case tvKey.KEY_RIGHT:
						if(isButtonGroupState()) {
							buttonGroup.next();
							changeAsset();
							_this.drawer.onUpdate();
						} else if(isSynopsisState()) {
							_this.keyNavigator.keyRight();
							_this.drawer.onUpdate();
						}
						break;
					case tvKey.KEY_LEFT:
						if(isSynopsisState()) {
							_this.keyNavigator.keyLeft();
							_this.drawer.onUpdate();
						} else {
							if(buttonGroup.hasPreviousButton()) {
								buttonGroup.previous();
								changeAsset();
								_this.drawer.onUpdate();
							} else {
								sendFinishViewEvent();
							}
						}
						break;
					case tvKey.KEY_BACK:
					case tvKey.KEY_EXIT:
					case tvKey.KEY_ESC:
						sendFinishViewEvent();
						break;
					case tvKey.KEY_YELLOW:
					case tvKey.KEY_Y:
						sendChangeEventToSearchViewGroup();
						break;

					case tvKey.KEY_ENTER:
						if(isButtonGroupState()) {
							var buttonLabel = buttonGroup.getFocusedButton().getLabel();
							selectButtonHandler(buttonLabel);
						}
						break;
					default:
						break;
				}
			};

			function selectButtonHandler(buttonLabel) {
				switch (buttonLabel) {
					case CCABase.StringSources.ButtonLabel.PURCHASE_HD:
					case CCABase.StringSources.ButtonLabel.PURCHASE_SD:
						if(hasEventInfo()) {
							changeToEventDetail();
							//changeToPurchase();
						} else {
							changeToPurchase();
						}
						break;
					case CCABase.StringSources.ButtonLabel.PLAY_HD:
					case CCABase.StringSources.ButtonLabel.PLAY_SD:
						requestGetLatestOffset(callbackForRequestGetLatestOffset, _this.model.getCurrentAsset().getAssetID());
						break;
					case CCABase.StringSources.ButtonLabel.TRAILER:
						changeToPlay(PlayType.TRAILER, 0);
						break;
					case CCABase.StringSources.ButtonLabel.PREVIEW:
						changeToPlay(PlayType.PREVIEW, 0);
						break;
					case CCABase.StringSources.ButtonLabel.OST_SMARTPHONE:
						_this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, {targetGroup:DefineView.MOD_VIEWGROUP, targetView:DefineView.MOD_REQUEST_PHONE_LIST, asset:_this.model.getCurrentAsset()});
						break;
					case CCABase.StringSources.ButtonLabel.OST_MONKEY:
						runMonkey3(_this.model.getCurrentAsset());
						break;
				}
			}

			function runMonkey3(asset) {
				Communicator.requestSetExtSvcSource(function(result){
					if(Communicator.isSuccessResponseFromHAS(result) == true) {
						CSSHandler.runThirdApp(CSSHandler.APP_ID_MONKEY3);
					} else {
						_this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, {targetGroup:DefineView.POPUP_VIEWGROUP, popupType:PopupValues.PopupType.ERROR, id:result.resultCode});
					}
				}, asset.getExtContentDomainId(), asset.getExtContentType(), asset.getExtContentId(), 'content');
			}

			function changeToEventDetail() {
				var event = UIHelper.getUnEnrolledEvent(_this.model.getCurrentAsset().getEventList());
				var eventID = event.getEventID();
				var param = {};
				param.popupType = PopupValues.PopupType.EVENT_DETAIL;
				param.eventId = eventID;
				param.targetGroup = DefineView.POPUP_VIEWGROUP;
				param.type = EventDetailPopupView.TYPE_ENROLL_EVENT;

				_this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, param);
			}

			function hasEventInfo() {
				var event = UIHelper.getUnEnrolledEvent(_this.model.getCurrentAsset().getEventList());
				return event != null;
			}

			function changeToSelectContinuousPlay()	{
				var id = PopupValues.ID.CHOICE_CONTINUE_VOD_PLAY;
				_this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, {targetGroup:DefineView.POPUP_VIEWGROUP, id:id});
			}
			function changeToPurchase(isAgreeForEvent){
				var param = {};
				param.asset = _this.model.getCurrentAsset();
				param.product = UIHelper.getDisplayProduct(param.asset.getProductList());
				param.coupon = getCoupon();
				param.isAgreeForEvent = isAgreeForEvent;
				param.targetView = DefineView.SELECT_PRODUCT_VIEW;

				_this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, param);
			}

			function getCoupon() {
				var asset = _this.model.getCurrentAsset();
				var product = UIHelper.getDisplayProduct(asset.getProductList());
				if(product.getListPrice() != null && product.getListPrice() != product.getPrice()) {
					//@반짝할인 케이스. 해당 케이스는 쿠폰을 가질 수 없음
					return null;
				} else {
					return CouponManager.getAssetCoupon(asset.getDiscountCouponMasterIdList())
				}
			}

			function changeToPlay(playType, offset) {
				var param = {};
				param.asset = _this.model.getCurrentAsset();
				param.product = UIHelper.getDisplayProduct(param.asset.getProductList());
				param.coupon = null;
				param.offset = offset;
				param.playType = playType;
				param.targetView = DefineView.PLAYER_VIEW

				_this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, param);
			}


			function changeAsset() {
				if(_this.model.getContentGroup()) {
					var label = _this.model.getButtonGroup().getFocusedButton().getLabel();
					var contentGroup = _this.model.getContentGroup();
					switch (label) {
						case CCABase.StringSources.ButtonLabel.PURCHASE_HD:
						case CCABase.StringSources.ButtonLabel.PLAY_HD:
							_this.model.setCurrentAsset(contentGroup.getHDAsset());
							break;
						case CCABase.StringSources.ButtonLabel.PURCHASE_SD:
						case CCABase.StringSources.ButtonLabel.PLAY_SD:
							_this.model.setCurrentAsset(contentGroup.getSDAsset());
							break;
						case CCABase.StringSources.ButtonLabel.PREVIEW:
						case CCABase.StringSources.ButtonLabel.TRAILER:
							_this.model.setCurrentAsset(getFirstAsset());
							break;
					}
				} else {

				}

			}

			function sendFinishViewEvent() {
				_this.sendEvent(CCAEvent.FINISH_VIEW);
			}

			function isSynopsisState() {
				return _this.model.getVIndex() == DetailView.STATE_SYNOPSIS;
			}

			function isButtonGroupState() {
				return _this.model.getVIndex() == DetailView.STATE_BUTTONGROUP;
			}

			function sendChangeFocusEvent() {
				if(_this.model.getEpisodePeer()) {
					if(_this.model.isFirstTimeDraw()) {
						var param = {'assetID': _this.model.getCurrentAsset().getAssetID()};
						_this.sendEvent(CCAEvent.CHANGE_FOCUS_ON_VIEW, param);
					}
				} else {
					var param = {'assetID': _this.model.getCurrentAsset().getAssetID()};
					_this.sendEvent(CCAEvent.CHANGE_FOCUS_ON_VIEW, param);
				}
			}

			function sendChangeViewEvent() {
				_this.sendEvent(CCAEvent.CHANGE_VIEW);
			}

			function sendChangeEventToSearchViewGroup() {
				var param = {};
				param.targetView = DefineView.SEARCH_VIEW

				_this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, param);
			}

			this.onInit();
		};

		DetailView.prototype = Object.create(View.prototype);
		DetailView.STATE_SYNOPSIS = 0;
		DetailView.STATE_BUTTONGROUP = 1;

		return DetailView;
	});
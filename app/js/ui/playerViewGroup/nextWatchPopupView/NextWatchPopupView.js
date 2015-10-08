define(["framework/View", "framework/event/CCAEvent","service/Communicator", 'helper/UIHelper',
        "ui/playerViewGroup/nextWatchPopupView/NextWatchPopupDrawer", "ui/playerViewGroup/nextWatchPopupView/NextWatchPopupModel", 
        "framework/modules/ButtonGroup", "cca/PopupValues", "cca/DefineView", "cca/type/VisibleTimeType",
        'service/CouponManager', 'ui/popupViewGroup/eventDetailPopupView/EventDetailPopupView', 'cca/type/PlayType', "helper/UIComponentHelper"
    ],
        function(View, CCAEvent, Communicator, UIHelper,
                 NextWatchPopupDrawer, NextWatchPopupModel,
                 ButtonGroup, PopupValues, DefineView, VisibleTimeType,
                 CouponManager, EventDetailPopupView, PlayType, UIComponentHelper
        ) {

    var NextWatchPopupView = function() {
        View.call(this, DefineView.NEXT_WATCH_POPUP_VIEW);
        this.model = new NextWatchPopupModel();
        this.drawer = new NextWatchPopupDrawer(this.getID(), this.model);
        var _this = this;

        NextWatchPopupView.prototype.onInit = function() {

        };

        NextWatchPopupView.prototype.onStart = function() {
            View.prototype.onStart.apply(this, arguments);
        };
        NextWatchPopupView.prototype.onAfterStart = function() {
            _this.hideTimerContainer();
        }
        NextWatchPopupView.prototype.onStop = function() {
            View.prototype.onStop.apply(this);
        };
        NextWatchPopupView.prototype.onPopupResult = function(param){
            if (param.id == PopupValues.ID.CHOICE_CONTINUE_VOD_PLAY) {
                if(param.result == CCABase.StringSources.ButtonLabel.PLAY_CONTINUE){
                    changeToPlay(PlayType.NORMAL, _this.model.getOffset());
                }
                else if(param.result == CCABase.StringSources.ButtonLabel.PLAY_FIRST){
                    changeToPlay(PlayType.NORMAL, 0);
                }
            } else if(param.popupType = PopupValues.PopupType.EVENT_DETAIL){
                var isAgreeForEvent = false;
                if(param.result == CCABase.StringSources.ButtonLabel.ENROLL){
                    isAgreeForEvent = true;
                }
                changeToPurchase(isAgreeForEvent);
            } else if (param.popupType = PopupValues.PopupType.ERROR) {
                sendFinishViewEvent('stop');
            }
        };


        NextWatchPopupView.prototype.onGetData = function(param) {
        	setData(param);
        };
        function setData(param) {
			var model = _this.model;

            model.setCurrentAsset(param.asset);
            model.setPopupId(param.popupID);
            model.setEOS(param['isEOS']);
            var popupValue = PopupValues[param.popupID];
            var buttonGroup = null;
            var verticalVisibleSize = 1;
			var horizonVisibleSize = 2;
			var verticalMaximumSize = 1;
			var horizonMaximumSize = 2;

            if(UIHelper.isHaveOST(model.getCurrentAsset())) {
                buttonGroup = new ButtonGroup(4);
                buttonGroup.getButton(0).setLabel(CCABase.StringSources.ButtonLabel.NEXTWATCH);
                buttonGroup.getButton(1).setLabel(CCABase.StringSources.ButtonLabel.OST);
                buttonGroup.getButton(2).setLabel(CCABase.StringSources.ButtonLabel.EXIT_PLAYER);
                buttonGroup.getButton(3).setLabel(CCABase.StringSources.ButtonLabel.CANCEL);
            } else {
                buttonGroup = new ButtonGroup(3);
                buttonGroup.getButton(0).setLabel(CCABase.StringSources.ButtonLabel.NEXTWATCH);
                buttonGroup.getButton(1).setLabel(CCABase.StringSources.ButtonLabel.EXIT_PLAYER);
                buttonGroup.getButton(2).setLabel(CCABase.StringSources.ButtonLabel.CANCEL);
            }

        	model.setButtonGroup(buttonGroup);

			model.setSize(verticalVisibleSize, horizonVisibleSize, verticalMaximumSize, horizonMaximumSize);
            
            var assetProfile = 8;
			Communicator.requestAssetInfo(callBackForRequestNextAssetInfo, model.getCurrentAsset().getNextWatchAssetId(), assetProfile);	
		};
		
		function  callBackForRequestNextAssetInfo(response) {
			if(Communicator.isSuccessResponseFromHAS(response)) {
				_this.model.setNextAsset(response.asset);
				_this.drawer.onUpdate();

			} else {
				console.error("Failed to get datas from has.");
                //_this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, {targetGroup:DefineView.POPUP_VIEWGROUP, popupType:PopupValues.PopupType.ERROR, id:response.resultCode});
                _this.sendEvent(CCAEvent.CHANGE_VIEW, {targetView:DefineView.EXIT_POPUP_VIEW, assetID:_this.model.getCurrentAsset().getAssetID()});
			}
            _this.setVisibleTimer(VisibleTimeType.POSTER_LIST_TYPE);

		}
        NextWatchPopupView.prototype.onKeyDown = function(event, param) {
            var keyCode = param.keyCode;
            var tvKey = window.TVKeyValue;
            var buttonGroup = _this.model.getButtonGroup();
            //console.log("NextWatchPopupView, onKeyDown: " + keyCode );
            switch (keyCode) {
            	case tvKey.KEY_RIGHT:
            		buttonGroup.next();
					_this.drawer.onUpdate();
					break;
                case tvKey.KEY_LEFT:
                	if(buttonGroup.hasPreviousButton()) {
						buttonGroup.previous();
						_this.drawer.onUpdate();
					}
                	break;
                case tvKey.KEY_EXIT:
                case tvKey.KEY_BACK:
                    //sendFinishViewEvent('cancel');
                    if(_this.model.isEOS()) {
                        sendFinishViewEvent('stop');
                    } else {
                        sendFinishViewEvent('cancel');
                    }
                    break;
				case tvKey.KEY_ENTER:
                    var buttonLabel = buttonGroup.getFocusedButton().getLabel();

                    if(buttonLabel == CCABase.StringSources.ButtonLabel.NEXTWATCH) {
                        var asset = _this.model.getNextAsset();

                        var isAlreadyPurchase = UIHelper.isPurchasedProduct(UIHelper.getDisplayProduct(asset.getProductList()));
                        if(isAlreadyPurchase) {
                            requestGetLatestOffset();
                        } else if(hasEventInfo()) {
                            changeToEventDetail();
                        } else {
                            changeToPurchase();
                        }
                    }
                    else if(buttonLabel == CCABase.StringSources.ButtonLabel.OST) {
                        var param = {targetGroup:DefineView.MOD_VIEWGROUP, targetView:DefineView.MOD_CHOICE_DEVICE_VIEW, asset:_this.model.getCurrentAsset()};
                        param.uiDomainID = UIComponentHelper.UIDomainID.PLAYING;
                        param.uiComponentID = UIComponentHelper.UIComponentID.PLAYING_MOD;
                        _this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, param);
                    }
                    else if(buttonLabel == CCABase.StringSources.ButtonLabel.EXIT_PLAYER)	{
                    	sendFinishViewEvent('stop');
                    }
                    else if(buttonLabel == CCABase.StringSources.ButtonLabel.CANCEL)	{
                    	if(_this.model.isEOS()) {
                            sendFinishViewEvent('stop');
                        } else {
                            sendFinishViewEvent('cancel');
                        }
                    }
                    else	{
                    	console.log("버튼에 따른 기능 연결 되어야 함 !!!!");	
                    }
                    
                	break;
                case tvKey.KEY_UP:
                	_this.keyNavigator.keyUp();
                	_this.drawer.onUpdate();
                    break;
                case tvKey.KEY_DOWN:
                    _this.keyNavigator.keyDown();
                	_this.drawer.onUpdate();
                    break;
                default:
                    break;
            }
        };

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
        function requestGetLatestOffset() {
            var asset = _this.model.getNextAsset();
            Communicator.requestGetLatestOffset(callbackForRequestGetLatestOffset, asset.getAssetID());
        };

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
            };

        };
        function changeToPurchase(isAgreeForEvent){
            var param = {};
            param.asset = _this.model.getNextAsset();
            param.product = UIHelper.getDisplayProduct(param.asset.getProductList());
            param.coupon = getCoupon();
            param.isAgreeForEvent = isAgreeForEvent;
            param.targetView = DefineView.SELECT_PRODUCT_VIEW;
            param.isNextPlay = true;


            _this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, param);
        }

        function getCoupon() {
            var asset = _this.model.getNextAsset();
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
            param.asset = _this.model.getNextAsset();
            param.product = UIHelper.getDisplayProduct(param.asset.getProductList());
            param.coupon = null;
            param.offset = offset;
            param.playType = playType;
            param.targetView = DefineView.PLAYER_VIEW
            param.isNextPlay = true;

            _this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, param);
        }

        function sendFinishViewEvent(action) {
            _this.sendEvent(CCAEvent.FINISH_VIEW, {'action' : action});
        }

        this.onInit();
    };

    NextWatchPopupView.prototype = Object.create(View.prototype);
	
    return NextWatchPopupView;
});

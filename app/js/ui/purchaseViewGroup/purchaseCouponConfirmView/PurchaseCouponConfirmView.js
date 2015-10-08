define(["service/STBInfoManager", "framework/View", "framework/event/CCAEvent", "cca/DefineView",
        "ui/purchaseViewGroup/purchaseCouponConfirmView/PurchaseCouponConfirmDrawer", "ui/purchaseViewGroup/purchaseCouponConfirmView/PurchaseCouponConfirmModel", 
        "framework/modules/ButtonGroup", "framework/modules/InputField", "service/Communicator", "main/CSSHandler", 'cca/PopupValues', "helper/UIHelper",
		'service/CouponManager', "cca/type/VisibleTimeType"
	],
        function(STBInfoManager, View, CCAEvent, DefineView, 
        		PurchaseCouponConfirmDrawer, PurchaseCouponConfirmModel, 
        		ButtonGroup, InputField, Communicator, CSSHandler, PopupValues ,UIHelper, CouponManager, VisibleTimeType) {

	var PurchaseCouponConfirmView = function() {
        View.call(this, DefineView.PURCHASE_COUPON_CONFIRM_VIEW);
        this.model = new PurchaseCouponConfirmModel();
        this.drawer = new PurchaseCouponConfirmDrawer(this.getID(), this.model);
        var _this = this;

        PurchaseCouponConfirmView.prototype.onInit = function() {

		};
		PurchaseCouponConfirmView.prototype.onBeforeStart = function (param) {
			this.transactionId = $.now() % 1000000;
			_this = this;
		};

		PurchaseCouponConfirmView.prototype.onAfterStart = function() {
			_this.hideTimerContainer();
		};
		PurchaseCouponConfirmView.prototype.onBeforeActive = function() {
			//@숫자 key를 받을 수 있도록 lock 을 해제
			CSSHandler.activateNumberKeys(true);
		};
		PurchaseCouponConfirmView.prototype.onAfterDeActive = function() {
			//@숫자 key를 받을 수 있도록 lock 을 해제
			CSSHandler.activateNumberKeys(false);
		};
		PurchaseCouponConfirmView.prototype.onAfterStop = function() {
			CSSHandler.activateNumberKeys(false);
		};
		PurchaseCouponConfirmView.prototype.onGetData = function (param) {
			setData();
			requestCouponProductList();
		};
		
        function requestCouponProductList() {
        	var transactionId = ++_this.transactionId;
        	Communicator.requestCouponProductList(callBackForRequestCouponProductList, transactionId);
        }
        function callBackForRequestCouponProductList(response) {
        	if(Communicator.isCorrectTransactionID(_this.transactionId, response)) {
        		if(Communicator.isSuccessResponseFromHAS(response)) {
//    				var couponProductList = new CouponProductList(response.couponProductList);
    				_this.model.setData(response.couponProductList);
    				_this.drawer.onUpdate();
    			} else {
    				console.error("Failed to get datas from has.");
    				_this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, {targetGroup:DefineView.POPUP_VIEWGROUP, popupType:PopupValues.PopupType.ERROR, id:response.resultCode});
    			}
        	}
			_this.setVisibleTimer(VisibleTimeType.POSTER_TYPE);
		}
		function setData() {
			var model = _this.model;
			
			var verticalVisibleSize = 3;
			var horizonVisibleSize = 3;
			var verticalMaximumSize = verticalVisibleSize;
			var horizonMaximumSize = horizonVisibleSize;

			model.setSize(verticalVisibleSize, horizonVisibleSize, verticalMaximumSize, horizonMaximumSize);
			model.setButtonGroup(getButtonGroup());
			model.setInputField(getInputField());
			model.setVIndex(0);
			model.setSubSpanClass("normal"); // TODO 나중에 적정한 곳으로 normal과 error를 빼도록 하자
//			model.setSubSpanText(CCABase.StringSources.inputPurchasePasswordText);
		};

		  function subscribeCoupon() {
			  _this.transactionId += 1;
			  var coupon = _this.model.getData()[_this.model.getHIndex()];
              Communicator.requestChargeCoupon(callbackSubscribeCoupon, _this.transactionId, coupon.getCouponProductId());
			  //callbackSubscribeCoupon({resultCode:200});
	        }
		  function callbackSubscribeCoupon(response)	{
			  if(Communicator.isSuccessResponseFromHAS(response)) {
				  CouponManager.requestCouponBalance();
				  changeToSuccessPurchaseCouponPopup();
			  } else {
				  _this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, {targetGroup:DefineView.POPUP_VIEWGROUP, popupType:PopupValues.PopupType.ERROR, id:response.resultCode});
			  }

      	}

		function changeToSuccessPurchaseCouponPopup() {
			var coupon = _this.model.getData()[_this.model.getHIndex()];
			var id = PopupValues.ID.ALERT_PURCHASE_COUPON_COMPLETED;
			PopupValues[id].headText= UIHelper.addThousandSeparatorCommas(coupon.getCouponProductPrice()) + CCABase.StringSources.alertPurchaseCouponCompletedHeadText;
			_this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, {targetGroup:DefineView.POPUP_VIEWGROUP, id:id});
		}

		function getButtonGroup() {
			var buttonGroup = new ButtonGroup(2);
			//Label 설정
			buttonGroup.getButton(0).setLabel(CCABase.StringSources.ButtonLabel.CONFIRM);
			buttonGroup.getButton(1).setLabel(CCABase.StringSources.ButtonLabel.CANCEL);
			buttonGroup.getButton(0).onDeActive();
			buttonGroup.setIndex(1);
			return buttonGroup;
		}
		function getInputField() {
			var buttonGroup = _this.model.getButtonGroup();

			var inputField = new InputField();
			inputField.setDefaultText(CCABase.StringSources.inputPurchasePasswordText);

			$(inputField).bind(InputField.FULL_TEXT_EVENT, function () {
				_this.model.setVIndex(2);
				buttonGroup.getButton(0).onActive();
				buttonGroup.setIndex(0);
				_this.drawer.onUpdate();
			});
			$(inputField).bind(InputField.INIT_TEXT_EVENT, function () {
				_this.model.setSubSpanClass("normal"); 
				buttonGroup.getButton(0).onDeActive();
				buttonGroup.setIndex(1);
				_this.drawer.onUpdate();
			});
			$(inputField).bind(InputField.INVALID_TEXT_EVENT, function () {
				_this.model.setVIndex(1);
				_this.model.getInputField().setDefaultText(CCABase.StringSources.failPasswordText);
				_this.model.setSubSpanClass("error"); // TODO 나중에 따로 정의해서 빼야 함
				buttonGroup.getButton(0).onDeActive();
				buttonGroup.setIndex(1);

				_this.drawer.onUpdate();
			});
			return inputField;
		}
		function closePopup()	{
			_this.model.getInputField().initText();
			_this.sendEvent(CCAEvent.FINISH_VIEW);
		}
		
		PurchaseCouponConfirmView.prototype.onKeyDown = function(event, param) {
            var keyCode = param.keyCode;
            var tvKey = window.TVKeyValue;

            switch (keyCode) {
	            case tvKey.KEY_219:
	            	if(_this.model.getVIndex() == 0) {// coupon에 focus
	        		}
	            	else if(_this.model.getVIndex() == 2) {// button에 focus
	            	}
	        		else	{// inputfield에 focus
	        			_this.model.getInputField().removeText();
	                    _this.drawer.onUpdate();
	        		}
					break;
                case tvKey.KEY_LEFT:
                	if(_this.model.getVIndex() == 0) {// coupon에 focus
                		if(_this.model.getHIndex() == 0)	{
                    		// do nothing
                    	}
                    	else	{
                    		_this.keyNavigator.keyLeft();
                            _this.drawer.onUpdate();	
                    	}
                	}
                	else if(_this.model.getVIndex() == 2) {// button에 focus
                        if(_this.model.getButtonGroup().getIndex() == 0)	{
                        }
                        else	{
                        	_this.model.getButtonGroup().previous();
                            _this.drawer.onUpdate();
                        }
                    }
                	else 	{// inputfield에 focus
                		_this.model.getInputField().removeText();
                        _this.drawer.onUpdate();
                    }
                    break;
                case tvKey.KEY_RIGHT:
                	if(_this.model.getVIndex() == 0) {// coupon에 focus
	                	_this.keyNavigator.keyRight();
	                    _this.drawer.onUpdate();
            		}
                	else if(_this.model.getVIndex() == 2) {// button에 focus
                    	_this.model.getButtonGroup().next();
                        _this.drawer.onUpdate();
                    }
                    else 	{// inputfield에 focus
                    }
                    break;
                case tvKey.KEY_EXIT:
				case tvKey.KEY_BACK:
                	closePopup();
                    break;

                case tvKey.KEY_ENTER:
                	if(_this.model.getVIndex() == 0) {// coupon에 focus
                		_this.model.setVIndex(1); 
                    	_this.model.getInputField().initText();
                        _this.drawer.onUpdate();
                	}
                	else if(_this.model.getVIndex() == 2) {// button에 focus
//                    	console.log("ok 키  처리 되어야 함 !!!:"+_this.model.getInputField().getInputText());
                    	if(_this.model.getButtonGroup().getIndex() == 0){
                    		checkPincode();	
                    	}
                    	else	{
                    		closePopup();
                    	}
                    }
                    else 	{// inputfield에 focus
                    }
                    break;
                case tvKey.KEY_UP:
                	if(_this.model.getVIndex() == 0) {// coupon에 focus
                	}
                	else if(_this.model.getVIndex() == 2) {// button에 focus
                    	_this.model.setVIndex(1); 
                    	_this.model.getInputField().initText();
                    	
                        _this.drawer.onUpdate();
                    }
                    else {// inputfield에 focus
                    	_this.model.setVIndex(0); 
                    	_this.model.getInputField().initText();
                        _this.drawer.onUpdate();
                    }
                    break;
                case tvKey.KEY_DOWN:
                	if(_this.model.getVIndex() == 0) {// coupon에 focus
                		_this.model.setVIndex(1); 
                		_this.model.getInputField().initText();
                        _this.drawer.onUpdate();
                	}
                	else if(_this.model.getVIndex() == 2) {// button에 focus
                        // do nothing
                    }
                    else {// inputfield에 focus
                        _this.model.setVIndex(2);
                        _this.model.getButtonGroup().setIndex(1);
                        _this.drawer.onUpdate();
                    }
                    break;
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
                	if(_this.model.getVIndex() == 1) {
						_this.model.getInputField().addText(keyCode);
						_this.drawer.onUpdate();
                	}
                	break;
               
                default:
                    break;
            }
        };

		function checkPincode() {
			CSSHandler.isCorrectPurchasePIN(_this.model.getInputField().getInputText(), callBackForCheckPurchasePIN);
		}

		function callBackForCheckPurchasePIN(isSuccess) {
			if(isSuccess) {
				subscribeCoupon();
			} else {
				_this.model.getInputField().inValidText();
			}
		}

		this.onInit();
	};

	PurchaseCouponConfirmView.prototype = Object.create(View.prototype);

	return PurchaseCouponConfirmView;
});

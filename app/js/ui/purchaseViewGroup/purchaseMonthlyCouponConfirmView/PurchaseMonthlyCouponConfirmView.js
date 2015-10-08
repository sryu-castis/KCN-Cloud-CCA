define(["service/STBInfoManager", "framework/View", "framework/event/CCAEvent", "cca/DefineView", 
        "ui/purchaseViewGroup/purchaseMonthlyCouponConfirmView/PurchaseMonthlyCouponConfirmDrawer", "ui/purchaseViewGroup/purchaseMonthlyCouponConfirmView/PurchaseMonthlyCouponConfirmModel", 
        "framework/modules/ButtonGroup", "framework/modules/InputField", "service/Communicator", "main/CSSHandler", 'cca/PopupValues', 'service/CouponManager', "cca/type/VisibleTimeType"],
        function(STBInfoManager, View, CCAEvent, DefineView, 
        		PurchaseMonthlyCouponConfirmDrawer, PurchaseMonthlyCouponConfirmModel, 
        		ButtonGroup, InputField, Communicator, CSSHandler, PopupValues, CouponManager, VisibleTimeType) {

	var PurchaseMonthlyCouponConfirmView = function() {
        View.call(this, "PurchaseMonthlyCouponConfirmView");
        this.model = new PurchaseMonthlyCouponConfirmModel();
        this.drawer = new PurchaseMonthlyCouponConfirmDrawer(this.getID(), this.model);
        var _this = this;

        PurchaseMonthlyCouponConfirmView.prototype.onInit = function() {

		};
		PurchaseMonthlyCouponConfirmView.prototype.onBeforeActive = function() {
			//@숫자 key를 받을 수 있도록 lock 을 해제
			CSSHandler.activateNumberKeys(true);
		};
		PurchaseMonthlyCouponConfirmView.prototype.onAfterDeActive = function() {
			//@숫자 key를 받을 수 있도록 lock 을 해제
			CSSHandler.activateNumberKeys(false);
		};
		PurchaseMonthlyCouponConfirmView.prototype.onAfterStop = function() {
			CSSHandler.activateNumberKeys(false);
		};
		PurchaseMonthlyCouponConfirmView.prototype.onAfterStart = function() {
			_this.hideTimerContainer();
		};
		PurchaseMonthlyCouponConfirmView.prototype.onBeforeStart = function (param) {
			this.transactionId = $.now() % 1000000;
			_this = this;
		};

		PurchaseMonthlyCouponConfirmView.prototype.onGetData = function (param) {
			setData();
			requestMonthlyCouponList();
		};
		function requestMonthlyCouponList() {
			var transactionId = ++_this.transactionId;
        	Communicator.requestAutopayCouponProductList(callBackForRequestMonthlyCouponList, transactionId);
        }
        function callBackForRequestMonthlyCouponList(response) {
        	if(Communicator.isCorrectTransactionID(_this.transactionId, response)) {
        		if(Communicator.isSuccessResponseFromHAS(response)) {
					_this.model.setData(response.couponProductList);
					if(isAlreadySubscribe(response.couponProductList)) {
						changeToDuplicateSubscribePopup(getCouponOfAlreadySubscribe().getCouponProductName());
					} else {
						_this.drawer.onUpdate();
						_this.setVisibleTimer(VisibleTimeType.POSTER_TYPE);
					}
    			} else {
    				console.error("Failed to get datas from has.");
    				_this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, {targetGroup:DefineView.POPUP_VIEWGROUP, popupType:PopupValues.PopupType.ERROR, id:response.resultCode});
    			}
        	}
		}

		function isAlreadySubscribe() {
			return (getCouponOfAlreadySubscribe() != null);
		}

		function getCouponOfAlreadySubscribe() {
			var couponProductList = _this.model.getData();
			for(var i = 0; i < couponProductList.length; i++) {
				if(couponProductList[i].isSubscribed()) {
					return couponProductList[i];
				}
			}
			return null;
		}

		function changeToDuplicateSubscribePopup(couponProductName) {
			var id = PopupValues.ID.ALERT_DUPLICATE_MONTHLY_COUPON;
			PopupValues[id].headText = couponProductName + CCABase.StringSources.alertDuplicateMonthlyCouponHeadText;
			PopupValues[id].subText= CCABase.StringSources.alertDuplicateMonthlyCouponSubText + STBInfoManager.getNumberOfCallCenter();
			_this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, {targetGroup:DefineView.POPUP_VIEWGROUP, id:id});
		}

		function changeToSuccessPurchasePopup(couponProductName) {
			var id = PopupValues.ID.ALERT_PURCHASE_MONTHLY_COUPON_COMPLETED;
			PopupValues[id].headText = couponProductName;
			_this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, {targetGroup:DefineView.POPUP_VIEWGROUP, id:id});
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
		};

		  function subscribeMonthlyCoupon() {
			  var selectedCouponProduct = _this.model.getData()[_this.model.getHIndex()];

			  Communicator.requestSubscribeAutopayCouponProduct(callbackForRequestSubscribeAutopayCouponProduct, selectedCouponProduct.getCouponProductId());
		  }

		function callbackForRequestSubscribeAutopayCouponProduct(response) {
			if(Communicator.isSuccessResponseFromHAS(response)) {
				CouponManager.requestCouponBalance();
				changeToSuccessPurchasePopup(response.couponProductName);
			} else {
				if(response.resultCode == 281) {
					changeToDuplicateSubscribePopup(response.couponProductName)
				}
				else	{
					_this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, {targetGroup:DefineView.POPUP_VIEWGROUP, popupType:PopupValues.PopupType.ERROR, id:response.resultCode});
				}
			}
		}
		function getButtonGroup() {
			var buttonGroup = new ButtonGroup(2);
			//Label 설정
			buttonGroup.getButton(0).setLabel(CCABase.StringSources.ButtonLabel.CONFIRM);
			buttonGroup.getButton(1).setLabel(CCABase.StringSources.ButtonLabel.CANCEL);
			buttonGroup.setIndex(1);
			buttonGroup.getButton(0).onDeActive();
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
		
		PurchaseMonthlyCouponConfirmView.prototype.onKeyDown = function(event, param) {
            var keyCode = param.keyCode;
            var tvKey = window.TVKeyValue;
//            console.log("PurchaseMonthlyCouponConfirmView, onKeyDown: " + keyCode +" "+_this.model.getVIndex() );
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
				case tvKey.KEY_BACK:
				case tvKey.KEY_EXIT:
                	closePopup();
                    break;

                case tvKey.KEY_ENTER:
                	if(_this.model.getVIndex() == 0) {// coupon에 focus
                		_this.model.setVIndex(1); 
                		_this.model.getInputField().initText();
                        _this.drawer.onUpdate();
                	}
                	else if(_this.model.getVIndex() == 2) {// button에 focus
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
                	if(_this.model.getVIndex() == 0) {// coupon에 focus
                		// do nothing
                	}
                	if(_this.model.getVIndex() == 2) {// button에 focus
                        // do nothing
                    }
                    else {// inputfield에 focus
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
				subscribeMonthlyCoupon();
			} else {
				_this.model.getInputField().inValidText();
			}
		}

		this.onInit();
	};

	PurchaseMonthlyCouponConfirmView.prototype = Object.create(View.prototype);

	return PurchaseMonthlyCouponConfirmView;
});

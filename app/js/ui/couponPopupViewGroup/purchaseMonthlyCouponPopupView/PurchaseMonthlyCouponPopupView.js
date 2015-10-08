define(["service/STBInfoManager", "framework/View", "framework/event/CCAEvent", "cca/DefineView", 
        "ui/couponPopupViewGroup/purchaseMonthlyCouponPopupView/PurchaseMonthlyCouponPopupDrawer", "ui/couponPopupViewGroup/purchaseMonthlyCouponPopupView/PurchaseMonthlyCouponPopupModel", 
        "framework/modules/ButtonGroup", "framework/modules/InputField", "service/Communicator", "main/CSSHandler"],
        function(STBInfoManager, View, CCAEvent, DefineView, PurchaseMonthlyCouponPopupDrawer, PurchaseMonthlyCouponPopupModel, ButtonGroup, InputField, Communicator, CSSHandler) {

    var PurchaseMonthlyCouponPopupView = function() {
        View.call(this, "purchaseMonthlyCouponPopupView");
        
        this.model = new PurchaseMonthlyCouponPopupModel();
        this.drawer = new PurchaseMonthlyCouponPopupDrawer(this.getID(), this.model);
        var _this = this;



        PurchaseMonthlyCouponPopupView.prototype.onInit = function() {

		};

		PurchaseMonthlyCouponPopupView.prototype.onBeforeStart = function() {
			_this = this;
		};
		PurchaseMonthlyCouponPopupView.prototype.onBeforeActive = function() {
			//@숫자 key를 받을 수 있도록 lock 을 해제
			CSSHandler.activateNumberKeys(true);
		};
		PurchaseMonthlyCouponPopupView.prototype.onAfterDeActive = function() {
			//@숫자 key를 받을 수 있도록 lock 을 해제
			CSSHandler.activateNumberKeys(false);
		};
		PurchaseMonthlyCouponPopupView.prototype.onAfterStop = function() {
			CSSHandler.activateNumberKeys(false);
		};
		PurchaseMonthlyCouponPopupView.prototype.onGetData = function (param) {
			_this.model.setParam(param);
			setData(param.couponProduct);
		};

		function setData(couponProduct) {
			var model = _this.model;

			model.setData(couponProduct);
			
			
			var verticalVisibleSize = 2;
			var horizonVisibleSize = 1;
			var verticalMaximumSize = verticalVisibleSize;
			var horizonMaximumSize = horizonVisibleSize;

			model.setSize(verticalVisibleSize, horizonVisibleSize, verticalMaximumSize, horizonMaximumSize);
			model.setButtonGroup(getButtonGroup());
			model.setInputField(getInputField());
			model.setVIndex(0);
			_this.model.getInputField().initText();
		};
		
		function subscribeMonthlyCoupon(couponProductId) {
        	Communicator.requestSubscribeAutopayCouponProduct(function(response)	{
        		var param = _this.model.getParam();
				param.resultCode = response.resultCode;
				param.couponProductName = response.couponProductName;
				
				_this.sendEvent(CCAEvent.FINISH_VIEWGROUP_WITH_RESULT, _this.model.getParam()); // 결과에 관계 없이 던지면 될 듯...혹시 결과에 따른 분기가 필요하면 아래 코드 사용
//        		if(Communicator.isSuccessResponseFromHAS(response)) {
//        			_this.sendEvent(CCAEvent.FINISH_VIEWGROUP_WITH_RESULT, _this.model.getParam());
//				} else {
//					if(response.resultCode == 281){ // 다른 상품이 기가입되어 있어 요청 상품 가입 불가
//						_this.sendEvent(CCAEvent.FINISH_VIEWGROUP_WITH_RESULT, _this.model.getParam());
//					}
//					
//				}
				
        	}, couponProductId);
            
        }
		function getInputField() {
			var buttonGroup = _this.model.getButtonGroup();

			var inputField = new InputField();
			inputField.setDefaultText(CCABase.StringSources.inputPurchasePasswordText);

			$(inputField).bind(InputField.FULL_TEXT_EVENT, function () {
				_this.model.setVIndex(1);
				buttonGroup.getButton(0).onActive();
				buttonGroup.setIndex(0);
				_this.drawer.onUpdate();
			});
			$(inputField).bind(InputField.INIT_TEXT_EVENT, function () {
				_this.model.setSubSpanClass("normal"); 
				buttonGroup.getButton(0).onDeActive();
				buttonGroup.setIndex(0);
				_this.drawer.onUpdate();
			});
			$(inputField).bind(InputField.INVALID_TEXT_EVENT, function () {
				_this.model.setVIndex(0);
				_this.model.getInputField().setDefaultText(CCABase.StringSources.failPasswordText);
				_this.model.setSubSpanClass("error"); // TODO 나중에 따로 정의해서 빼야 함
				buttonGroup.getButton(0).onDeActive();
				buttonGroup.setIndex(1);

				_this.drawer.onUpdate();
			});
			return inputField;
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
		
		function closePopup()	{
			_this.model.getInputField().initText();
			_this.sendEvent(CCAEvent.FINISH_VIEWGROUP);	 
		}
		
		PurchaseMonthlyCouponPopupView.prototype.onKeyDown = function(event, param) {
            var keyCode = param.keyCode;
            var tvKey = window.TVKeyValue;
            switch (keyCode) {
            	case tvKey.KEY_BACK:
            		closePopup();
            		break;
            	case tvKey.KEY_219:
            		if(_this.model.getVIndex() == 1) {// button에 focus
            		}
            		else	{// inputfield에 focus
            			_this.model.getInputField().removeText();
                        _this.drawer.onUpdate();
            		}
            		break;
                case tvKey.KEY_LEFT:
                	if(_this.model.getVIndex() == 1) {// button에 focus
                        if(_this.model.getButtonGroup().getIndex() == 0)	{
                        }
                        else	{
                        	_this.model.getButtonGroup().previous();
                            _this.drawer.onUpdate();
                        }
                    }
                	else	{// inputfield에 focus
                		_this.model.getInputField().removeText();
                        _this.drawer.onUpdate();
                	}
                   
                    break;
                case tvKey.KEY_RIGHT:
                    if(_this.model.getVIndex() == 1) {// button에 focus
                    	_this.model.getButtonGroup().next();
                        _this.drawer.onUpdate();
                    }
                    else 	{// inputfield에 focus
                    }
                    break;
                case tvKey.KEY_EXIT:
                	closePopup();
                    break;

                case tvKey.KEY_ENTER:
                    if(_this.model.getVIndex() == 1) {// button에 focus
//                    	console.log("ok 키  처리 되어야 함 !!!:"+_this.model.getInputField().getInputText());
                    	var buttonLabel = _this.model.getButtonGroup().getFocusedButton().getLabel();
						switch (buttonLabel) {
							case CCABase.StringSources.ButtonLabel.CONFIRM:
								checkPincode();
								break;
							case CCABase.StringSources.ButtonLabel.CANCEL:
								closePopup();
								break;
						}
                    	
                    }
                    break;
                case tvKey.KEY_UP:
                    if(_this.model.getVIndex() == 1) {// button에 focus
                    	_this.model.setVIndex(0); 
                    	_this.model.getInputField().initText();
                        _this.drawer.onUpdate();
                    }
                    else {// inputfield에 focus
                        // do nothing
                    }
                    break;
                case tvKey.KEY_DOWN:
                    if(_this.model.getVIndex() == 1) {// button에 focus
                        // do nothing
                    }
                    else {// inputfield에 focus
                        _this.model.setVIndex(1);
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
                	if(_this.model.getVIndex() == 1) {// button에 focus
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
				subscribeMonthlyCoupon(_this.model.getData().getCouponProductId());
				
			} else {
				_this.model.getInputField().inValidText();
			}
		}

		function sendFinishViewEvent(type) {
			_this.model.getInputField().initText();
			_this.model.setVIndex(PasswordView.STATE_INPUTFIELD);
			_this.sendEvent(CCAEvent.FINISH_VIEW);
		}

		this.onInit();
	};

	PurchaseMonthlyCouponPopupView.prototype = Object.create(View.prototype);

	return PurchaseMonthlyCouponPopupView;
});

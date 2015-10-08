define(["framework/View", "framework/event/CCAEvent", "cca/DefineView", "cca/PopupValues",
        "ui/mytvViewGroup/registrationCouponView/RegistrationCouponDrawer", "ui/mytvViewGroup/registrationCouponView/RegistrationCouponModel",
        "framework/modules/ButtonGroup", "service/Communicator", "main/CSSHandler"],
        function(View, CCAEvent, DefineView, PopupValues, RegistrationCouponDrawer, RegistrationCouponModel, ButtonGroup, Communicator, CSSHandler) {

    var RegistrationCouponView = null;
    RegistrationCouponView = function() {
        View.call(this, DefineView.REGISTRATION_COUPON_VIEW);
        this.model = new RegistrationCouponModel();
        this.drawer = new RegistrationCouponDrawer(this.getID(), this.model);
        var _this = this;
        var count = 0; // for test . should be removed !!!
        RegistrationCouponView.prototype.onInit = function() {

        };

        RegistrationCouponView.prototype.onStart = function() {
        	this.transactionId = $.now() % 1000000;
            View.prototype.onStart.apply(this, arguments);
            /*
                @Tip Sync 로 데이터를 가져오는경우 onStart 내부에서 onGetData -> drawer.onStart 가 이루어진다
                ASync 로 데이터를 획득 할 경우 이미 drawer.onStart()가 호출된 이후임으로 drawer.onUpdate를 명시적으로 해줄 필요가 있다
            */
        };
        // category list view에서 number key를 받을 수 있도록 start에서 setting
        RegistrationCouponView.prototype.onAfterStart = function() {
			//@숫자 key를 받을 수 있도록 lock 을 해제
			CSSHandler.activateNumberKeys(true);
		};
		RegistrationCouponView.prototype.onAfterDeActive= function() {
			resetCouponRegistration();
		}
		RegistrationCouponView.prototype.onBeforeStop = function() {
			//@숫자 key를 받을 수 있도록 lock 을 해제
			CSSHandler.activateNumberKeys(false);
		};
        RegistrationCouponView.prototype.onGetData = function(param) {
        	var model = _this.model;
        	
        	model.setButtonGroup(new ButtonGroup(2));
        	model.getButtonGroup().getButton(0).setLabel(CCABase.StringSources.ButtonLabel.REGISTER);
            model.getButtonGroup().getButton(1).setLabel(CCABase.StringSources.ButtonLabel.CANCEL);
        	model.getButtonGroup().setIndex(1);
        	 _this.model.getButtonGroup().getButton(0).onDeActive();
        };

        
        function subscribeCoupon(couponProductId) {
        	var transactionId = ++_this.transactionId;
        	_this.model.setCouponProductId(couponProductId);
        	Communicator.requestChargeCoupon(callbackSubscribeCoupon, transactionId, 'PIN:' + couponProductId);
        }
        function callbackSubscribeCoupon(response)	{
        	if(Communicator.isCorrectTransactionID(_this.transactionId, response)) {
        		if(response.resultCode != 100)	{
        			resetCouponRegistration();
        			setResultStatus(response.resultCode);
        			_this.drawer.onUpdate();
        			
        		}
        		else	{ //성공
        			if(response.couponType == "money")	{
                        var id = PopupValues.ID.ALERT_REGISTER_COUPON_COMPLETED;
        				PopupValues[id].headText=response.couponName+CCABase.StringSources.alertRegisterCouponCompletedHeadText;
                    	_this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, {targetGroup:DefineView.POPUP_VIEWGROUP, id:id});
                    	setResultStatus(0);
                    	resetCouponRegistration();	
                    	_this.drawer.onUpdate();
        			}
        			else if(response.couponType == "svod")	{
        				if(response.getPossibleYesOrNo == 'N')	{
        					setResultStatus('N');
                			_this.drawer.onUpdate();
        				}
        				else	{
        					var param = {};
        		            param.targetGroup = DefineView.COUPON_POPUP_VIEWGROUP;
        		            param.targetView = DefineView.REGISTER_MONTHLY_COUPON_POPUP_VIEW;
        		            param.chargeAmount = response.chargeAmount;
        		            param.notice_1 = response.notice_1;
        		            param.notice_2 = response.notice_2;
        		            param.notice_3 = response.notice_3;
        		            param.notice_4 = response.notice_4;
        		            param.productCode = response.prodCode;
        		            param.couponProductId = _this.model.getCouponProductId();
        				_this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, param); 
        				resetCouponRegistration();	
        				_this.drawer.onUpdate();
        				}
        				 
        			}
        		}
        	}
    	}
        function clearInputField(index)	{
        	switch(index){
        	case 0:
        		_this.model.getInputField1().initText();
        		break;
        	case 1:
            	_this.model.getInputField2().initText();
            	break;
        	case 2:
        		_this.model.getInputField3().initText();
        		break;
        		
        	}
        }
        function resetCouponRegistration()	{
        	_this.model.getInputField1().initText();
        	_this.model.getInputField2().initText();
        	_this.model.getInputField3().initText();
        	
        	_this.model.setVIndex(0); 
        	_this.model.setHIndex(0); 
            _this.model.getButtonGroup().setIndex(1);
            _this.model.getButtonGroup().getButton(0).onDeActive();
        }
        
        function setResultStatus(errorCode){
	    	_this.model.setErrorCode(errorCode);// TODO code가 있다면 코드 값을 맞추고 string은 나중에 StringValues로 옮기도록 한다
	    	switch(errorCode)	{
	    	case 0:
	    		_this.model.setInfoString("쿠폰 인증번호 12자리를 입력해 주세요.");
	    		break;
	    	case 271:
	    		_this.model.setInfoString("쿠폰 번호가 틀렸습니다. 다른 번호를 입력해주세요.");
	    		break;
	    	case 272:
	    		_this.model.setInfoString("유효기간이 만료된 쿠폰입니다. 다른 번호를 입력해주세요.");
	    		break;
	    	case 'N':
	    		_this.model.setInfoString("해당 상품은 가입된 상태입니다. 다른 번호를 입력해주세요.");
	    		break;
	    	case 273:
	    	case 274:
	    	case 275:
	    		_this.model.setInfoString("이미 사용된 쿠폰입니다. 다른 번호를 입력해 주세요.");
	    		break;
	        case 281:
	            _this.model.setInfoString("고객님의 STB은 쿠폰사용이 불가한 상태입니다. 콜센터에 문의해주세요.");
	            break;
	    	default:
	    		_this.model.setInfoString("쿠폰 등록에 실패하였습니다. ["+errorCode+"]");
	    		break;
	    	}
    	}
        function isInputFieldEmpty(inputField)	{
        	if(inputField.getSize() == 0)	{
        		return true;
        	}
        	else	{
        		return false;
        	}
        }
        RegistrationCouponView.prototype.onKeyDown = function(event, param) {
            var keyCode = param.keyCode;
            var tvKey = window.TVKeyValue;
//            console.log("CouponRegistrationView, onKeyDown: " + keyCode );
            switch (keyCode) {
            	case tvKey.KEY_BACK:
            		setResultStatus(0);
                	_this.sendEvent(CCAEvent.FINISH_VIEW, getEventParamObject("categoryListView"));
            		break;
            	case tvKey.KEY_219:
            		if(_this.model.getVIndex() == 1) {// button에 focus
                    }
                    else {// coupon에 focus
                    	switch(_this.model.getHIndex())	{
                    	case 0:
                    		_this.model.getInputField1().removeText();
                    		break;
                    	case 1:
                    		_this.model.getInputField2().removeText();
                    		if(isInputFieldEmpty(_this.model.getInputField2()))	{
                    			_this.keyNavigator.keyLeft();
                    		}
                    		
                            break;
                    	case 2:
                    		_this.model.getInputField3().removeText();
                    		if(isInputFieldEmpty(_this.model.getInputField3()))	{
                    			_this.keyNavigator.keyLeft();
                    		}
                            break;
                    	}
                    	_this.drawer.onUpdate();
                    	
                    }
                    break;
					break;
                case tvKey.KEY_LEFT:
                	if(_this.model.getVIndex() == 1) {// button에 focus
                		if(_this.model.getButtonGroup().hasPreviousButton()) {
    						_this.model.getButtonGroup().previous();
    						_this.drawer.onUpdate();
    					}
                    	else	{
                    		setResultStatus(0);
                        	_this.sendEvent(CCAEvent.FINISH_VIEW, getEventParamObject("categoryListView"));
                    	}
                        
                    }
                    else {// coupon에 focus
                    	switch(_this.model.getHIndex())	{
                    	case 0:
                    		_this.model.getInputField1().removeText();
                    		if(isInputFieldEmpty(_this.model.getInputField1()))	{
                    			setResultStatus(0);
                        		_this.sendEvent(CCAEvent.FINISH_VIEW, getEventParamObject("categoryListView"));
                    		}
                    		break;
                    	case 1:
                    		_this.model.getInputField2().removeText();
                    		if(isInputFieldEmpty(_this.model.getInputField2()))	{
                    			_this.keyNavigator.keyLeft();
                    		}
                    		
                            break;
                    	case 2:
                    		_this.model.getInputField3().removeText();
                    		if(isInputFieldEmpty(_this.model.getInputField3()))	{
                    			_this.keyNavigator.keyLeft();
                    		}
                            break;
                    	}
                    	_this.drawer.onUpdate();
                    	
                    }
                    break;
                case tvKey.KEY_RIGHT:
                    if(_this.model.getVIndex() == 1) {// button에 focus
                    	_this.model.getButtonGroup().next();
                        _this.drawer.onUpdate();
                    }
                    else 	{// coupon에 focus
                    	switch(_this.model.getHIndex())	{
                    	case 0:
                    		if(!isInputFieldEmpty(_this.model.getInputField2()))	{
                    			_this.model.setHIndex(1);
                        		_this.drawer.onUpdate();
                    		}
                    		break;
                    	case 1:
                    		if(!isInputFieldEmpty(_this.model.getInputField3()))	{
                    			_this.model.setHIndex(2);
                        		_this.drawer.onUpdate();
                    		}
                    		break;
                    	case 2:
                    		break;
                    	}
                    }
                    break;
                case tvKey.KEY_EXIT:
                    if(_this.model.getVIndex() == 1) {// button에 focus
                        _this.sendEvent(CCAEvent.FINISH_VIEW);    
                    }
                    break;

                case tvKey.KEY_ENTER:
                    if(_this.model.getVIndex() == 1) {// button에 focus
//                    	console.log("ok 키  처리 되어야 함 !!!:"+_this.model.getInputField1().getInputText()+"-"+_this.model.getInputField2().getInputText()+"-"+_this.model.getInputField3().getInputText());
                    	if(_this.model.getButtonGroup().getFocusedButton().getLabel() == CCABase.StringSources.ButtonLabel.REGISTER)	{
                    		subscribeCoupon(_this.model.getInputField1().getInputText()+_this.model.getInputField2().getInputText()+_this.model.getInputField3().getInputText());
//                    		setResultStatus(0);
                    		resetCouponRegistration();
                    		// _this.drawer.onUpdate();
                    	}
                    	else	{
                    		setResultStatus(0);
                        	_this.sendEvent(CCAEvent.FINISH_VIEW, getEventParamObject("categoryListView"));
                    	}
                    }
                    else {// coupon에 focus
                    	clearInputField(_this.model.getHIndex());
                    	_this.model.getButtonGroup().getButton(0).onDeActive();
                    	_this.model.getButtonGroup().setIndex(1);
                        _this.drawer.onUpdate();
                    }
                    break;
                case tvKey.KEY_UP:
                    if(_this.model.getVIndex() == 1) {// button에 focus
                    	_this.model.setVIndex(0); 
                        _this.drawer.onUpdate();
                    }
                    else {// coupon에 focus
                        // do nothing
                    }
                    break;
                case tvKey.KEY_DOWN:
                    if(_this.model.getVIndex() == 1) {// button에 focus
                        // do nothing
                    }
                    else {// coupon에 focus
                        _this.model.setVIndex(1); 
//                        console.log(_this.model.getInputField1().getSize()+", "+_this.model.getInputField2().getSize()+", "+_this.model.getInputField3().getSize());
                        if(isInputFieldFilled())	{
                			_this.model.getButtonGroup().getButton(0).onActive();
                			_this.model.getButtonGroup().setIndex(0);
//                			_this.model.setHIndex(0);
                		}
                        else	{
                        	_this.model.getButtonGroup().getButton(0).onDeActive();
                        	_this.model.getButtonGroup().setIndex(1);
                        }
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
                    else {// coupon에 focus
                    	switch(_this.model.getHIndex())	{
                    	case 0:
                    		if(_this.model.getInputField1().getSize() == 4)	{
                    			_this.model.setHIndex(1);
                    			_this.model.getInputField2().addText(keyCode);
                    		}
                    		else	{
                    			_this.model.getInputField1().addText(keyCode);	
                    			if(_this.model.getInputField1().getSize() == 4)	{
                    				_this.model.setHIndex(1);
                    			}
                    		}
                    		break;
                    	case 1:
                    		
                    		if(_this.model.getInputField2().getSize() == 4)	{
                    			_this.model.setHIndex(2);
                    			_this.model.getInputField3().addText(keyCode);
                    		}
                    		else	{
                    			_this.model.getInputField2().addText(keyCode);	
                    			if(_this.model.getInputField2().getSize() == 4)	{
                    				_this.model.setHIndex(2);
                    			}
                    		}
                    		break;
                    	case 2:
                    		_this.model.getInputField3().addText(keyCode);
                    		if(_this.model.getInputField3().getSize() == 4)	{
                    			_this.model.getButtonGroup().getButton(0).onActive();
                    			_this.model.getButtonGroup().setIndex(0);
//                    			_this.model.setHIndex(0);
                    			_this.model.setVIndex(1);
                    		}
                    		break;
                    	}
                    	if(isInputFieldFilled())	{
                    		_this.model.getButtonGroup().getButton(0).onActive();
                    	}
                    	else	{
                    		_this.model.getButtonGroup().getButton(0).onDeActive();
                    		_this.model.getButtonGroup().setIndex(1);
                    	}
                    	_this.drawer.onUpdate();
                    }
                	
                	break;
                default:
                    break;
            }
        };
        function isInputFieldFilled()	{
        	if(_this.model.getInputField1().getSize() == 4 && _this.model.getInputField2().getSize() == 4 && _this.model.getInputField3().getSize() == 4)
        		return true;
        	else
        		return false;
        }
        function getEventParamObject(targetView) {
            var model = _this.model;
            var param = {};
            param.targetView = targetView;
            param.index = model.getVIndex();
            param.startIndex = model.getVStartIndex();
            return param;
        }
        this.onInit();
    };
    RegistrationCouponView.prototype = Object.create(View.prototype);

    return RegistrationCouponView;
});

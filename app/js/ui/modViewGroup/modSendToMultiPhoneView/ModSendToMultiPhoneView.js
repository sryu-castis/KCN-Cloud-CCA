define(["framework/View", "framework/event/CCAEvent",
        "ui/modViewGroup/modSendToMultiPhoneView/ModSendToMultiPhoneDrawer", "ui/modViewGroup/modSendToMultiPhoneView/ModSendToMultiPhoneModel", "framework/modules/ButtonGroup"
        , "cca/PopupValues", "cca/DefineView", "helper/UIHelper", "cca/model/Asset", "service/Communicator", "cca/type/ModSvcType", "cca/model/Phone", "framework/modules/InputField"
        , 'cca/type/PaymentType', 'main/CSSHandler', "cca/type/ProductType", "service/CCAInfoManager"
        , "cca/model/Product", "cca/model/ExtContentInfo"],
        function(View, CCAEvent, ModSendToMultiPhoneDrawer, ModSendToMultiPhoneModel, ButtonGroup
            , PopupValues, DefineView, UIHelper, Asset, Communicator, ModSvcType, Phone, InputField
            , PaymentType, CSSHandler, ProductType, CCAInfoManager
            , Product, ExtContentInfo) {

    var ModSendToMultiPhoneView = function() {
        View.call(this, DefineView.MOD_SEND_TO_MULTI_PHONE_VIEW);
        this.model = new ModSendToMultiPhoneModel();
        this.drawer = new ModSendToMultiPhoneDrawer(this.getID(), this.model);
        var _this = this;

        ModSendToMultiPhoneView.prototype.onInit = function() {
        };

        ModSendToMultiPhoneView.prototype.onBeforeActive = function() {
            //@숫자 key를 받을 수 있도록 lock 을 해제
            CSSHandler.activateNumberKeys(true);
        };
        ModSendToMultiPhoneView.prototype.onAfterDeActive = function() {
            //@숫자 key를 받을 수 있도록 lock 을 해제
            CSSHandler.activateNumberKeys(false);
        };
        ModSendToMultiPhoneView.prototype.onAfterStop = function() {
            CSSHandler.activateNumberKeys(false);
        };

        ModSendToMultiPhoneView.prototype.onGetData = function(param) {
        	setData(param);
        };

        function setData(param) {

			var model = _this.model;

            model.setParam(param);
            model.setData(param.result.phoneList);
            model.setSmsSendCount(param.result.smsSendCount);
            model.setSmsTotalCount(param.result.smsTotalCount);
            model.setAsset(param.asset);

            var phoneList = model.getData();
            phoneList.push(new Phone({number:'', phoneAppInstalled:false})); //new input phone

            model.setSelectedPhoneIndex(0);

			var verticalVisibleSize = model.getData().length+1;
			var horizonVisibleSize = 1;
			var verticalMaximumSize = model.getData().length+1;
			var horizonMaximumSize = 1;

			model.setSize(verticalVisibleSize, horizonVisibleSize, verticalMaximumSize, horizonMaximumSize);
            model.setVIndex(verticalVisibleSize-1);
            model.setButtonGroup(getButtonGroup());
            model.setInputField(getInputField());
		};

        function getButtonGroup() {
			var buttonGroup = new ButtonGroup(4);
            var buttonText1 = CCABase.StringSources.ButtonLabel.MOD_SMS.replace('_CURRUNT_', _this.model.getSmsSendCount());
            buttonText1 = buttonText1.replace('_TOTAL_', _this.model.getSmsTotalCount());

            buttonGroup.getButton(0).setLabel(buttonText1);
            buttonGroup.getButton(1).setLabel(CCABase.StringSources.ButtonLabel.MOD_MK3);
            buttonGroup.getButton(2).setLabel(CCABase.StringSources.ButtonLabel.DELETE);
            buttonGroup.getButton(3).setLabel(CCABase.StringSources.ButtonLabel.CANCEL);

			//최초 설정
            if(_this.model.getData()[0].isPhoneAppInstalled() == false) {
                buttonGroup.getButton(1).onDeActive();
            }

			buttonGroup.setIndex(0);

			return buttonGroup;
		}

        function getInputField() {
            //var buttonGroup = _this.model.getButtonGroup();
            var inputField = new InputField();
            inputField.setSecurityMode(false);
            inputField.setMaximumSize(11);
            $(inputField).bind(InputField.FULL_TEXT_EVENT, function () {
                goEnterAction();
            });
            return inputField;
        }

        ModSendToMultiPhoneView.prototype.onKeyDown = function(event, param) {
            var keyCode = param.keyCode;
            var tvKey = window.TVKeyValue;
            var inputField = _this.model.getInputField();
            var buttonGroup = _this.model.getButtonGroup();
            console.log("ModSendToMultiPhoneView, onKeyDown: " + keyCode );
            switch (keyCode) {
            	case tvKey.KEY_RIGHT:
                    if(isButtonGroupState()) {
                        buttonGroup.next();
                        _this.drawer.onUpdate();
                    }
					break;
            	case tvKey.KEY_219:
            		if(isButtonGroupState() && buttonGroup.hasPreviousButton()) {
                        //nothing
					} else if(isInputFieldState()) {
                        inputField.removeText();
                        var phone = _this.model.getData()[_this.model.getVIndex()];
                        phone.setNumber(UIHelper.addHyphenForMobileNumber(inputField.getInputText()));
                        setActiveButtonGroup();
                        _this.drawer.onUpdate();
                    }
					break;
                case tvKey.KEY_LEFT:
                	if(isButtonGroupState() && buttonGroup.hasPreviousButton()) {
						buttonGroup.previous();
						_this.drawer.onUpdate();
					} else if(isInputFieldState()) {
                        inputField.removeText();
                        var phone = _this.model.getData()[_this.model.getVIndex()];
                        phone.setNumber(UIHelper.addHyphenForMobileNumber(inputField.getInputText()));
                        setActiveButtonGroup();
                        _this.drawer.onUpdate();
                    }
                	break;
                case tvKey.KEY_EXIT:
                case tvKey.KEY_ESC:
                case tvKey.KEY_BACK:
                    goBack();
                    break;
				case tvKey.KEY_ENTER:
                    goEnterAction();
                	break;
                case tvKey.KEY_UP:
                	_this.keyNavigator.keyUp();
                	_this.drawer.onUpdate();
                    break;
                case tvKey.KEY_DOWN:
                    if(isButtonGroupState() == false) {
                        _this.keyNavigator.keyDown();
                        //setActiveButtonGroup();
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
                    if(isInputFieldState()) {
                        _this.model.setSelectedPhoneIndex(_this.model.getVIndex());
                        var phone = _this.model.getData()[_this.model.getVIndex()];
                        inputField.addText(keyCode);
                        phone.setNumber(UIHelper.addHyphenForMobileNumber(inputField.getInputText()));
                        setActiveButtonGroup();
                        _this.drawer.onUpdate();
                    }
                    break;
                default:
                    break;
            }
        };

        function goEnterAction() {
            var buttonGroup = _this.model.getButtonGroup();
            if(isButtonGroupState()) {
                switch (buttonGroup.getIndex()) {
                    case 0:
                        sendMessage(ModSvcType.SMS);
                        break;
                    case 1:
                        sendMessage(ModSvcType.PUSH);
                        break;
                    case 2:
                        goDelete();
                        break;
                    default:
                        goBack();
                        break;
                }
            } else if(isInputFieldState()) {
                var selectedPhoneIndex = _this.model.getVIndex();
                _this.model.setSelectedPhoneIndex(selectedPhoneIndex);
                var phone = _this.model.getData()[selectedPhoneIndex];
                phone.setNumber(UIHelper.addHyphenForMobileNumber(_this.model.getInputField().getInputText()));
                if(phone.getNumber().length > 0) {
                    _this.model.setVIndex(_this.model.getVVisibleSize() - 1);
                }
                setActiveButtonGroup();
                _this.drawer.onUpdate();
            } else {
                _this.model.getInputField().setInputText('');
                _this.model.getData()[_this.model.getData().length-1].setNumber('');
                var selectedPhoneIndex = _this.model.getVIndex();
                _this.model.setSelectedPhoneIndex(selectedPhoneIndex);
                _this.model.setVIndex(_this.model.getVVisibleSize()-1);
                setActiveButtonGroup();
                _this.drawer.onUpdate();
            }
        }

        function sendMessage(svcType) {
            var asset = _this.model.getAsset();
            //var product = UIHelper.getProduct(asset.getProductList(), ProductType.SVOD);
            var phoneNumber = getSelectedPhoneNumber();

            requestGetExtContentInfo(asset, phoneNumber, svcType);

            //if(UIHelper.isPurchasedProduct(product)) {
            //    requestExtPhoneSvc(asset, phoneNumber, svcType);
            //} else if(product != null){
            //    startModPurchaseProductConfirmView(svcType);
            //}
        }

        function requestGetExtContentInfo(asset, phoneNumber, svcType) {
            _this.onDeActive();
            Communicator.requestGetExtContentInfo(function(result){
                _this.onActive();
                if(Communicator.isSuccessResponseFromHAS(result) == true) {

                    var extContentInfo = new ExtContentInfo(result);

                    if(extContentInfo.isPurchased()) {
                        requestExtPhoneSvc(asset, phoneNumber, svcType);
                    } else {
                        requestGetProductInfo(asset, extContentInfo, svcType);
                    }

                } else {
                    _this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, {targetGroup:DefineView.POPUP_VIEWGROUP, popupType:PopupValues.PopupType.ERROR, id:result.resultCode});
                }
            }, asset.getExtContentDomainId(), asset.getExtContentType(), asset.getExtContentId());
        }

        function requestGetProductInfo(asset, extContentInfo, svcType) {
            _this.onDeActive();
            Communicator.requestGetProductInfo(function(result){
                _this.onActive();
                if(Communicator.isSuccessResponseFromHAS(result) == true) {

                    result.product.price = result.product.productPolicyList[0].price;

                    var product = new Product(result.product);
                    startModPurchaseProductConfirmView(asset, product, svcType);

                } else {
                    _this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, {targetGroup:DefineView.POPUP_VIEWGROUP, popupType:PopupValues.PopupType.ERROR, id:result.resultCode});
                }
            }, extContentInfo.getProductId(), extContentInfo.getGoodId(), 2);
        }

        function startModPurchaseProductConfirmView(asset, product, svcType){
            _this.onDeActive();

            Communicator.requestAvailablePaymentType(function(result){
                _this.onActive();
                if(Communicator.isSuccessResponseFromHAS(result) == true) {
                    CCAInfoManager.setAvailablePaymentTypeList(result.paymentTypeList);
                }

                var phoneNumber = getSelectedPhoneNumber();
                var smsTotalCount = _this.model.getSmsTotalCount();

                if(CCAInfoManager.isMobileUser()) {
                    _this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, {targetGroup:DefineView.POPUP_VIEWGROUP, id:PopupValues.ID.ALERT_LIMITED_PURCHASE});
                } else {
                    _this.sendEvent(CCAEvent.CHANGE_VIEW, {targetView:DefineView.MOD_PURCHASE_PRODUCT_CONFIRM_VIEW
                        , paymentType:PaymentType.Monthly
                        , phoneNumber:phoneNumber
                        , smsTotalCount:smsTotalCount
                        , svcType:svcType
                        , asset:asset
                        , product:product});
                }
            });
        }

        function setActiveButtonGroup() {
            var buttonGroup = _this.model.getButtonGroup();
            var selectedPhoneIndex = _this.model.getSelectedPhoneIndex();
            if(selectedPhoneIndex == _this.model.getData().length-1) {//input field
                if(getSelectedPhoneNumber().length > 10) {
                    buttonGroup.getButton(0).onActive();
                    buttonGroup.getButton(1).onDeActive();
                    buttonGroup.getButton(2).onDeActive();
                    buttonGroup.getButton(3).onActive();
                    buttonGroup.setIndex(0);
                } else {
                    buttonGroup.getButton(0).onDeActive();
                    buttonGroup.getButton(1).onDeActive();
                    buttonGroup.getButton(2).onDeActive();
                    buttonGroup.getButton(3).onActive();
                    buttonGroup.setIndex(3);
                }
            } else {
                var phone = _this.model.getData()[selectedPhoneIndex];
                if(phone.isPhoneAppInstalled()) {
                    buttonGroup.getButton(0).onActive();
                    buttonGroup.getButton(1).onActive();
                    buttonGroup.getButton(2).onActive();
                    buttonGroup.getButton(3).onActive();
                    buttonGroup.setIndex(0);
                } else {
                    buttonGroup.getButton(0).onActive();
                    buttonGroup.getButton(1).onDeActive();
                    buttonGroup.getButton(2).onActive();
                    buttonGroup.getButton(3).onActive();
                    buttonGroup.setIndex(0);
                }
            }
        }

        function getSelectedPhoneNumber() {
            var phone = _this.model.getData()[_this.model.getSelectedPhoneIndex()];
            return phone.getNumber().replace(/[^0-9]/g,'');
        }

        function requestExtPhoneSvc(asset, phoneNumber, svcType) {
            Communicator.requestExtPhoneSvc(function(result){
                callBackRequestExtPhoneSvc(result, svcType);
            }, asset.getExtContentDomainId(), asset.getExtContentType(), asset.getExtContentId(), phoneNumber, svcType);

            //callBackRequestExtPhoneSvc({resultCode:277, errorRecoveryUrl:'http://mky3.kr/tv/qTH'});
        }

        function callBackRequestExtPhoneSvc(result, svcType) {
            if(Communicator.isSuccessResponseFromHAS(result) == true) {
                var id = null;
                if(svcType == ModSvcType.SMS) {
                    id = PopupValues.ID.MOD_ALERT_COMPLETE_SMS;
                    PopupValues[id].headText = CCABase.StringSources.modAlertSMSCompleteHeadText.replace('_URL_', result.errorRecoveryUrl);
                } else {
                    id = PopupValues.ID.MOD_ALERT_COMPLETE_PUSH;
                }
                _this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, {targetGroup: DefineView.POPUP_VIEWGROUP, id: id});
            } else {
                switch(result.resultCode) {
                    case 277:
                        var param = _this.model.getParam();
                        var id = PopupValues.ID.MOD_ALERT_SMS_LIMIT_COUNT;
                        PopupValues[id].headText = CCABase.StringSources.modAlertSMSLimitCountHeadText.replace('_TOTAL_', param.result.smsTotalCount);
                        PopupValues[id].subText = CCABase.StringSources.modAlertSMSLimitCountSubText.replace('_URL_', result.errorRecoveryUrl);
                        _this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, {targetGroup:DefineView.POPUP_VIEWGROUP, id:id});
                        break;
                    default :
                        _this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, {targetGroup:DefineView.POPUP_VIEWGROUP, popupType:PopupValues.PopupType.ERROR, id:result.resultCode});
                        break;
                }
            }
        }

        ModSendToMultiPhoneView.prototype.onPopupResult = function(param) {
            console.log("ModSendToMultiPhoneView.prototype.onPopupResult");
            if(param.id == PopupValues.ID.MOD_CONFIRM_DELETE_SMART_PHONE ) {
                if(param.result == CCABase.StringSources.ButtonLabel.CONFIRM) {
                    requestDeletePhone();
                } else {
                    _this.onActive();
                    _this.onShow();
                }
            } else if(param.id == PopupValues.ID.MOD_ALERT_COMPLETE_PUSH) {
                var popupValue = PopupValues[param.id];
                switch (param.result) {
                    case popupValue.buttonText1:
                        _this.sendEvent(CCAEvent.FINISH_VIEWGROUP_WITH_RESULT, {id:PopupValues.ID.MOD_ALERT_COMPLETE});
                        break;
                    case popupValue.buttonText2:
                        runMonkey3(_this.model.getAsset());
                        break;
                    default:
                        _this.sendEvent(CCAEvent.FINISH_VIEWGROUP);
                        break;
                }
            } else if(param.id == PopupValues.ID.MOD_ALERT_COMPLETE_SMS) {
                _this.sendEvent(CCAEvent.FINISH_VIEWGROUP_WITH_RESULT, {id:PopupValues.ID.MOD_ALERT_COMPLETE});
            }
        };

        function runMonkey3(asset) {
            Communicator.requestSetExtSvcSource(function(result){
                //result.resultCode = 204;
                if(Communicator.isSuccessResponseFromHAS(result) == true) {
                    CSSHandler.runThirdApp(CSSHandler.APP_ID_MONKEY3);
                    //_this.sendEvent(CCAEvent.FINISH_VIEWGROUP);
                } else {
                    _this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, {targetGroup:DefineView.POPUP_VIEWGROUP, popupType:PopupValues.PopupType.ERROR, id:result.resultCode});
                }
            }, asset.getExtContentDomainId(), asset.getExtContentType(), asset.getExtContentId(), 'content');
        }

        function requestDeletePhone() {
            var asset = _this.model.getParam().asset;
            Communicator.requestDeleteExtSvcPhone(function(result) {
                if(Communicator.isSuccessResponseFromHAS(result) == true) {
                    _this.sendEvent(CCAEvent.CHANGE_VIEW, {targetView:DefineView.MOD_REQUEST_PHONE_LIST, finish:true, asset:asset});
                } else {
                    console.error("Failed to get datas from has.");
                    _this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, {targetGroup:DefineView.POPUP_VIEWGROUP, popupType:PopupValues.PopupType.ERROR, id:result.resultCode});
                };
            }, asset.getExtContentDomainId(), getSelectedPhoneNumber());
        }

        function goDelete() {
            var phoneNumber = getSelectedPhoneNumber();
            var id = PopupValues.ID.MOD_CONFIRM_DELETE_SMART_PHONE;
            PopupValues[id].headText = UIHelper.addHyphenForMobileNumber(phoneNumber);
            _this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, {targetGroup:DefineView.POPUP_VIEWGROUP, id:id, phoneNumber:phoneNumber});
        }

        function goBack() {
            _this.sendEvent(CCAEvent.FINISH_VIEW);
        }

        function isButtonGroupState() {
            return _this.model.getVIndex() == _this.model.getVVisibleSize()-1;
        }

        function isInputFieldState() {
            return _this.model.getVIndex() == _this.model.getData().length-1;
        }


        this.onInit();
    };

    ModSendToMultiPhoneView.prototype = Object.create(View.prototype);
	
    return ModSendToMultiPhoneView;
});

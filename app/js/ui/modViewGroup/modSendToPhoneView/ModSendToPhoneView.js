define(["ui/popupViewGroup/smartPhonePopupView/SmartPhonePopupView", "service/STBInfoManager", "framework/event/CCAEvent", "cca/DefineView","cca/PopupValues"
        , "ui/popupViewGroup/smartPhonePopupView/SmartPhonePopupDrawer", "ui/popupViewGroup/smartPhonePopupView/SmartPhonePopupModel", 'cca/type/PaymentType', "service/CCAInfoManager"
        , "framework/modules/ButtonGroup", "framework/modules/InputField", "cca/DefineView", "helper/UIHelper", "cca/model/Asset", "service/Communicator", "cca/type/ModSvcType", "cca/type/ProductType"
        , "cca/model/Product", "cca/model/ExtContentInfo"
    ],
    function(SmartPhonePopupView, STBInfoManager, CCAEvent, DefineView, PopupValues
        , SmartPhonePopupDrawer, SmartPhonePopupModel, PaymentType, CCAInfoManager
        , ButtonGroup, InputField, DefineView, UIHelper, Asset, Communicator, ModSvcType, ProductType
        , Product, ExtContentInfo
    ) {

        var ModSendToPhoneView = function() {
            var _id = DefineView.MOD_SEND_TO_PHONE_VIEW;
            SmartPhonePopupView.call(this, _id);
            this.id = _id;
            this.model = new SmartPhonePopupModel();
            this.drawer = new SmartPhonePopupDrawer(_id, this.model);
            var _this = this;

            ModSendToPhoneView.prototype.onStart = function() {
                _this = this;
                SmartPhonePopupView.prototype.onStart.apply(_this, arguments);
            };

            ModSendToPhoneView.prototype.onGetData = function(param) {
                var result = param.result;
                param.id = PopupValues.ID.MOD_CONFIRM_SMS;
                var buttonText1 = CCABase.StringSources.ButtonLabel.MOD_SMS.replace('_CURRUNT_', result.smsSendCount);
                buttonText1 = buttonText1.replace('_TOTAL_', result.smsTotalCount);
                PopupValues[param.id].buttonText1 = buttonText1;
                SmartPhonePopupView.prototype.onGetData.call(_this, param);
            };

            ModSendToPhoneView.prototype.closePopup = function()	{
                console.log("ModSendToPhoneView.prototype.closePopup");
                _this.model.getInputField().setInputText("");
                _this.sendEvent(CCAEvent.FINISH_VIEW);
            }

            ModSendToPhoneView.prototype.closePopupWithResult = function() {
                console.log("ModSendToPhoneView.prototype.closePopupWithResult");
                var param = _this.model.getParam();
                var buttonGroup = _this.model.getButtonGroup();
                var asset = param.asset;
                var phoneNumber = _this.model.getInputField().getInputText();

                switch (buttonGroup.getIndex()) {
                    case 0:
                        requestGetExtContentInfo(asset, phoneNumber);
                        break;
                    case 1:
                        _this.closePopup();
                        break;
                }
            }

            function requestGetExtContentInfo(asset, phoneNumber) {
                _this.onDeActive();
                Communicator.requestGetExtContentInfo(function(result){
                    _this.onActive();
                    if(Communicator.isSuccessResponseFromHAS(result) == true) {

                        var extContentInfo = new ExtContentInfo(result);

                        if(extContentInfo.isPurchased()) {
                            requestExtPhoneSvc(asset, phoneNumber);
                        } else {
                            requestGetProductInfo(asset, extContentInfo);
                        }

                    } else {
                        _this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, {targetGroup:DefineView.POPUP_VIEWGROUP, popupType:PopupValues.PopupType.ERROR, id:result.resultCode});
                    }
                }, asset.getExtContentDomainId(), asset.getExtContentType(), asset.getExtContentId());
            }

            function requestGetProductInfo(asset, extContentInfo) {
                _this.onDeActive();
                Communicator.requestGetProductInfo(function(result){
                    _this.onActive();
                    if(Communicator.isSuccessResponseFromHAS(result) == true) {

                        result.product.price = result.product.productPolicyList[0].price;

                        var product = new Product(result.product);
                        startModPurchaseProductConfirmView(asset, product);

                    } else {
                        _this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, {targetGroup:DefineView.POPUP_VIEWGROUP, popupType:PopupValues.PopupType.ERROR, id:result.resultCode});
                    }
                }, extContentInfo.getProductId(), extContentInfo.getGoodId(), 2);
            }

            function startModPurchaseProductConfirmView(asset, product){
                _this.onDeActive();
                Communicator.requestAvailablePaymentType(function(result){
                    _this.onActive();
                    if(Communicator.isSuccessResponseFromHAS(result) == true) {
                        CCAInfoManager.setAvailablePaymentTypeList(result.paymentTypeList);
                    }

                    var param = _this.model.getParam();
                    var phoneNumber = _this.model.getInputField().getInputText();
                    var smsTotalCount = param.result.smsTotalCount;
                    //var product = UIHelper.getProduct(asset.getProductList(), ProductType.SVOD);

                    if(CCAInfoManager.isMobileUser()) {
                        _this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, {targetGroup:DefineView.POPUP_VIEWGROUP, id:PopupValues.ID.ALERT_LIMITED_PURCHASE});
                    } else {
                        _this.sendEvent(CCAEvent.CHANGE_VIEW, {targetView:DefineView.MOD_PURCHASE_PRODUCT_CONFIRM_VIEW
                            , paymentType:PaymentType.Monthly
                            , phoneNumber:phoneNumber
                            , smsTotalCount:smsTotalCount
                            , svcType:ModSvcType.SMS
                            , asset:asset
                            , product:product});
                    }
                });
            }

            function requestExtPhoneSvc(asset, phoneNumber) {
                _this.onDeActive();
                Communicator.requestExtPhoneSvc(callBackRequestExtPhoneSvc, asset.getExtContentDomainId(), asset.getExtContentType(), asset.getExtContentId(), phoneNumber, ModSvcType.SMS);

                //callBackRequestExtPhoneSvc({resultCode:277, errorRecoveryUrl:'http://mky3.kr/tv/qTH'});
            }

            function callBackRequestExtPhoneSvc(result) {
                _this.onActive();
                if(Communicator.isSuccessResponseFromHAS(result) == true) {
                    var id = PopupValues.ID.MOD_ALERT_COMPLETE_SMS;
                    PopupValues[id].headText = CCABase.StringSources.modAlertSMSCompleteHeadText.replace('_URL_', result.errorRecoveryUrl);
                    _this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, {targetGroup:DefineView.POPUP_VIEWGROUP, id:id});
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

            ModSendToPhoneView.prototype.onPopupResult = function(param) {
                console.log("ModSendToPhoneView.prototype.onPopupResult");
                if(param.id == PopupValues.ID.MOD_ALERT_COMPLETE_SMS) {
                    _this.sendEvent(CCAEvent.FINISH_VIEWGROUP_WITH_RESULT, {id:PopupValues.ID.MOD_ALERT_COMPLETE});
                }
            };

            this.onInit();
        };

        ModSendToPhoneView.prototype = Object.create(SmartPhonePopupView.prototype);

        return ModSendToPhoneView;
    });

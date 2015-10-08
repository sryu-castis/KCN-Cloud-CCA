define(["service/STBInfoManager", "ui/purchaseViewGroup/purchaseProductConfirmView/PurchaseProductConfirmView", "framework/event/CCAEvent", "cca/DefineView",
        "ui/purchaseViewGroup/purchaseProductConfirmView/PurchaseProductConfirmDrawer", "ui/purchaseViewGroup/purchaseProductConfirmView/PurchaseProductConfirmModel",
        "framework/modules/ButtonGroup", "framework/modules/InputField", "service/Communicator",
        'main/CSSHandler', 'cca/type/PlayType', 'cca/type/PaymentType', 'cca/PopupValues', "cca/type/ModSvcType", 'helper/UIHelper'],
    function(STBInfoManager, View, CCAEvent, DefineView,
             PurchaseProductConfirmDrawer, PurchaseProductConfirmModel,
             ButtonGroup, InputField, Communicator,
             CSSHandler, PlayType, PaymentType, PopupValues, ModSvcType, UIHelper) {

        var ModPurchaseProductConfirmView = function() {
            var _id = DefineView.MOD_PURCHASE_PRODUCT_CONFIRM_VIEW;
            View.call(this, _id);
            this.id = _id;
            this.model = new PurchaseProductConfirmModel();
            this.drawer = new PurchaseProductConfirmDrawer(_id, this.model);
            var _this = this;

            var phoneNumber = '';
            var smsTotalCount = 10;
            var svcType = '';

            ModPurchaseProductConfirmView.prototype.onStart = function() {
                _this = this;
                View.prototype.onStart.apply(_this, arguments);
            };

            ModPurchaseProductConfirmView.prototype.onGetData = function (param) {
                phoneNumber = param.phoneNumber;
                smsTotalCount = param.smsTotalCount;
                svcType = param.svcType;
                View.prototype.onGetData.call(_this, param);
            };

            function runMonkey3(asset) {
                Communicator.requestSetExtSvcSource(function(result){
                    if(Communicator.isSuccessResponseFromHAS(result) == true) {
                        CSSHandler.runThirdApp(CSSHandler.APP_ID_MONKEY3);
                        //_this.sendEvent(CCAEvent.FINISH_VIEWGROUP);
                    } else {
                        _this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, {targetGroup:DefineView.POPUP_VIEWGROUP, popupType:PopupValues.PopupType.ERROR, id:result.resultCode});
                    }
                }, asset.getExtContentDomainId(), asset.getExtContentType(), asset.getExtContentId(), 'content');
            }

            function requestExtPhoneSvc(asset, phoneNumber, svcType) {
                Communicator.requestExtPhoneSvc(function(result){
                    callBackRequestExtPhoneSvc(result, svcType);
                }, asset.getExtContentDomainId(), asset.getExtContentType(), asset.getExtContentId(), phoneNumber, svcType);

                //callBackRequestExtPhoneSvc({resultCode:277, errorRecoveryUrl:'http://mky3.kr/tv/qTH'});
            }

            function callBackRequestExtPhoneSvc(result, svcType) {
                //result.resultCode = 100;
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
                            var id = PopupValues.ID.MOD_ALERT_SMS_LIMIT_COUNT;
                            PopupValues[id].headText = CCABase.StringSources.modAlertSMSLimitCountHeadText.replace('_TOTAL_', smsTotalCount);
                            PopupValues[id].subText = CCABase.StringSources.modAlertSMSLimitCountSubText.replace('_URL_', result.errorRecoveryUrl);
                            _this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, {targetGroup:DefineView.POPUP_VIEWGROUP, id:id});
                            break;
                        default :
                            _this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, {targetGroup:DefineView.POPUP_VIEWGROUP, popupType:PopupValues.PopupType.ERROR, id:result.resultCode});
                            break;
                    }
                }
            }

            ModPurchaseProductConfirmView.prototype.callBackForCheckPurchasePIN = function(isSuccess) {
                if(isSuccess) {
                    var asset = _this.model.getAsset();
                    var product = _this.model.getProduct();
                    Communicator.requestPurchaseAssetEx2(callbackForPurchase, asset.getAssetID(), asset.getCategoryID(), product.getProductID(), product.getGoodId(), product.getPrice(), false);
                } else {
                    _this.model.getInputField().inValidText();
                }
            }

            function callbackForPurchase(response) {
                if(Communicator.isSuccessResponseFromHAS(response)) {
                    changeToPurchaseSuccessPopup();
                } else {
                    _this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, {targetGroup:DefineView.POPUP_VIEWGROUP, popupType:PopupValues.PopupType.ERROR, id:response.resultCode});
                }
            }

            function changeToPurchaseSuccessPopup() {
                var id =  PopupValues.ID.ALERT_PURCHASE_MONTHLY_COMPLETED;
                _this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, {targetGroup:DefineView.POPUP_VIEWGROUP, id:id});
            }

            ModPurchaseProductConfirmView.prototype.onPopupResult = function(param) {
                console.log("ModPurchaseProductConfirmView.prototype.onPopupResult phoneNumber="+phoneNumber);
                if(param.id == PopupValues.ID.ALERT_PURCHASE_MONTHLY_COMPLETED) {
                    requestExtPhoneSvc(_this.model.getAsset(), phoneNumber, svcType);
                    //_this.sendEvent(CCAEvent.FINISH_VIEW, {id:PopupValues.ID.ALERT_PURCHASE_MONTHLY_COMPLETED});
                } else if(param.id == PopupValues.ID.MOD_ALERT_COMPLETE_PUSH) {
                    var popupValue = PopupValues[param.id];
                    switch (param.result) {
                        case popupValue.buttonText2:
                            runMonkey3(_this.model.getAsset());
                            break;
                        case popupValue.buttonText1:
                        default:
                            _this.sendEvent(CCAEvent.FINISH_VIEWGROUP_WITH_RESULT, {id:PopupValues.ID.MOD_ALERT_COMPLETE});
                            break;
                    }
                } else {
                    _this.sendEvent(CCAEvent.FINISH_VIEWGROUP_WITH_RESULT, {id:PopupValues.ID.MOD_ALERT_COMPLETE});
                }
            }

            this.onInit();
        };

        ModPurchaseProductConfirmView.prototype = Object.create(View.prototype);

        return ModPurchaseProductConfirmView;
    });

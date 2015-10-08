define(["ui/popupViewGroup/choicePopupView/ChoicePopupView", "service/STBInfoManager", "framework/event/CCAEvent", "cca/DefineView","cca/PopupValues",
        "ui/popupViewGroup/choicePopupView/ChoicePopupDrawer", "ui/popupViewGroup/choicePopupView/ChoicePopupModel","service/Communicator",
        "framework/modules/ButtonGroup", "framework/modules/InputField", "cca/DefineView", "helper/UIHelper", 'main/CSSHandler'],
    function(ChoicePopupView, STBInfoManager, CCAEvent, DefineView, PopupValues,
             ChoicePopupDrawer, ChoicePopupModel, Communicator,
             ButtonGroup, InputField, DefineView, UIHelper, CSSHandler) {

        var ModChoiceDeviceView = function() {
            var _id = DefineView.MOD_CHOICE_DEVICE_VIEW;
            ChoicePopupView.call(this, _id);
            this.id = _id;
            this.model = new ChoicePopupModel();
            this.drawer = new ChoicePopupDrawer(_id, this.model);
            var _this = this;

            ModChoiceDeviceView.prototype.onStart = function() {
                _this = this;
                //arguments.id = PopupValues.ID.MOD_CHOICE_DEVICE_OST;
                ChoicePopupView.prototype.onStart.apply(_this, arguments);
            };

            ModChoiceDeviceView.prototype.onGetData = function(param) {
                console.log("ModChoiceDeviceView.prototype.onGetData="+param.id);
                param.id = PopupValues.ID.MOD_CHOICE_DEVICE_OST;
                ChoicePopupView.prototype.onGetData.call(_this, param);
            };

            ModChoiceDeviceView.prototype.closePopup = function()	{
                console.log("ModChoiceDeviceView.prototype.closePopup");
                _this.sendEvent(CCAEvent.FINISH_VIEW);
            }

            ModChoiceDeviceView.prototype.closePopupWithResult = function()	{
                console.log("ModChoiceDeviceView.prototype.closePopupWithResult");
                var param = _this.model.getParam();
                var buttonGroup = _this.model.getButtonGroup();
                switch(buttonGroup.getIndex()) {
                    case 0:
                        _this.sendEvent(CCAEvent.CHANGE_VIEW, {targetView:DefineView.MOD_REQUEST_PHONE_LIST, asset:param.asset});
                        break;
                    case 1:
                        runMonkey3(param.asset);
                        break;
                    default :
                        _this.sendEvent(CCAEvent.FINISH_VIEWGROUP);
                        break;
                }
            }

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

            this.onInit();
        };

        ModChoiceDeviceView.prototype = Object.create(ChoicePopupView.prototype);

        return ModChoiceDeviceView;
    });

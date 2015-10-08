define([ "framework/ViewGroup", "framework/event/CCAEvent", "framework/utils/ViewHistoryStack", 'cca/type/ProductType', 'cca/type/PaymentType', "cca/PopupValues", "service/Communicator", "cca/DefineView"
        , "ui/modViewGroup/modSendToPhoneView/ModSendToPhoneView"
        , "ui/modViewGroup/modSendToMultiPhoneView/ModSendToMultiPhoneView"
        , "ui/modViewGroup/modChoiceDeviceView/ModChoiceDeviceView"
        , "ui/modViewGroup/modPurchaseProductConfirmView/ModPurchaseProductConfirmView"
        , "ui/modViewGroup/modTriggerDetailView/ModTriggerDetailView"
        , "service/CCAStateManager"
        , 'main/CSSHandler'
    ],
    function(ViewGroup, CCAEvent, ViewHistoryStack, ProductType, PaymentType, PopupValues, Communicator, DefineView
        , ModSendToPhoneView
        , ModSendToMultiPhoneView
        , ModChoiceDeviceView
        , ModPurchaseProductConfirmView
        , ModTriggerDetailView
        , CCAStateManager
        , CSSHandler
    ) {

        var ModViewGroupManager = function(id) {
            ViewGroup.call(this, id);

            this.modViews = {};

            var historyStack = null;
            
            var modSendToPhoneView = new ModSendToPhoneView();
            var modChoiceDeviceView = new ModChoiceDeviceView();
            var modSendToMultiPhoneView = new ModSendToMultiPhoneView();
            var modPurchaseProductConfirmView = new ModPurchaseProductConfirmView();
            var modTriggerDetailView = new ModTriggerDetailView();

            this.modViews[modSendToPhoneView.getID()] = modSendToPhoneView;
            this.modViews[modChoiceDeviceView.getID()] = modChoiceDeviceView;
            this.modViews[modSendToMultiPhoneView.getID()] = modSendToMultiPhoneView;
            this.modViews[modPurchaseProductConfirmView.getID()] = modPurchaseProductConfirmView;
            this.modViews[modTriggerDetailView.getID()] = modTriggerDetailView;
            
            var currentView = null;
            var _this = this;

            ModViewGroupManager.prototype.onInit = function() {
                addEventListener();
            };

            ModViewGroupManager.prototype.onStart = function(param) {
                ViewGroup.prototype.onStart.call(this);
                historyStack = new ViewHistoryStack();
                pushViewHistory(param);
                startViewGroup(param);
            };
            ModViewGroupManager.prototype.onStop = function() {
                //currentView.onDeActive();
                currentView.onStop();
            }
            ModViewGroupManager.prototype.onHide = function() {
                currentView.onStop();
            }

            function pushViewHistory(param) {
                var CCAHistory = {};
                if(param.uiDomainID) {
                    CCAHistory.uiDomainID = param.uiDomainID;
                }
                if(param.uiComponentID){
                    CCAHistory.uiComponentID = param.uiComponentID;
                }
                CSSHandler.pushHistory(_this.getID(), "MOD", CCAHistory);
            }

            function startViewGroup(param) {

                if (param.targetView == DefineView.MOD_REQUEST_PHONE_LIST) {
                    selectSendToPhone(null, param);
                } else if (param.targetView == DefineView.MOD_TRIGGER_DETAIL_VIEW) {
                    if(param.asset != undefined && param.asset.getExtContentDomainId() != undefined && param.asset.getExtContentDomainId() != null) {
                        currentView = _this.modViews[param.targetView];
                        currentView.onStart(param);
                        currentView.onActive();
                    } else {
                        requestAssetInfo4ModTrigger(param);
                    }
                } else {
                    currentView = _this.modViews[param.targetView];
                    currentView.onStart(param);
                    currentView.onActive();
                }
            }

            function selectSendToPhone(event, param) {
                var asset = param.asset;
                Communicator.requestExtSvcPhoneList(function(result) {
                    //result.resultCode = 500;
                    if(Communicator.isSuccessResponseFromHAS(result) == true) {

                        param.result = result;

                        //validation
                        var phoneList = result.phoneList.slice(0);
                        for(var i=0, j=0; i<phoneList.length; i++) {
                            var phone = phoneList[i];
                            if(phone.getNumber().indexOf('--') > -1){
                                result.phoneList.splice(i-j, 1);
                                j++;
                            }
                        }

                        if(result.phoneList != null && result.phoneList.length > 0) {
                            param.targetView = DefineView.MOD_SEND_TO_MULTI_PHONE_VIEW;
                        } else {
                            param.targetView = DefineView.MOD_SEND_TO_PHONE_VIEW;
                        }

                        console.log("event="+event);

                        if(event != null) {
                            viewChangeViewListener(event, param)
                        } else {
                            startViewGroup(param);
                        }
                    } else {
                        console.error("Failed to get datas from has.");
                        if(currentView != null) {
                            currentView.onHide();
                        }
                        _this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, {targetGroup:DefineView.POPUP_VIEWGROUP, popupType:PopupValues.PopupType.ERROR, id:result.resultCode});
                    };
                }, asset.getExtContentDomainId(), 'content');//fix content
            }

            function requestAssetInfo4ModTrigger(param) {
                Communicator.requestAssetInfo(function (result) {
                    if(Communicator.isSuccessResponseFromHAS(result)) {
                        param.asset = result.asset;
                        currentView = _this.modViews[param.targetView];
                        currentView.onStart(param);
                        currentView.onActive();
                    } else {
                        console.error("Failed to get datas from has.");
                        _this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, {targetGroup:DefineView.POPUP_VIEWGROUP, popupType:PopupValues.PopupType.ERROR, id:result.resultCode});
                    }
                }, param.assetID, 9);
            }

            ModViewGroupManager.prototype.onShow = function() {
                if(currentView != null) {
                    currentView.onActive();
                    currentView.onShow();
                    sendCompleteDrawEvent();
                }
            };

            ModViewGroupManager.prototype.onResult = function(param) {
                if(currentView != null) {
                    currentView.onResult(param);
                }
            };

            ModViewGroupManager.prototype.onPopupResult = function(param) {

                if(param.id == PopupValues.ID.MOD_ALERT_SMS_LIMIT_COUNT
                    || (currentView != modTriggerDetailView && param.popupType != undefined && param.popupType == PopupValues.PopupType.ERROR)) {
                    //currentView != modChoiceDeviceView &&

                    viewGroupFinishListener(CCAEvent.FINISH_VIEWGROUP_WITH_RESULT, {id:PopupValues.ID.MOD_ALERT_COMPLETE});

                } else if(param.id == PopupValues.ID.MOD_CONFIRM_DELETE_SMART_PHONE
                    || param.id == PopupValues.ID.MOD_ALERT_COMPLETE_PUSH
                    || param.id == PopupValues.ID.ALERT_PURCHASE_MONTHLY_COMPLETED
                    || param.id == PopupValues.ID.MOD_ALERT_COMPLETE_SMS) {

                    currentView.onPopupResult(param);

                } else if(currentView  == modTriggerDetailView && param.popupType == PopupValues.PopupType.ERROR) {
                    viewGroupFinishListener(CCAEvent.FINISH_VIEWGROUP);

                } else if(currentView != null) {
                    _this.onShow();
                    currentView.onPopupResult(param);
                }
            };

            ModViewGroupManager.prototype.onUpdate = function() {

            };

            function addEventListener() {
                removeEventListener();

                for (var view in _this.modViews) {
                    $(_this.modViews[view]).bind(CCAEvent.CHANGE_VIEW, viewChangeViewListener);
                    $(_this.modViews[view]).bind(CCAEvent.FINISH_VIEW, viewFinishEventListener);
                    $(_this.modViews[view]).bind(CCAEvent.CHANGE_VIEWGROUP, viewGroupChangeListener);
                    $(_this.modViews[view]).bind(CCAEvent.FINISH_VIEWGROUP, viewGroupFinishListener);
                    $(_this.modViews[view]).bind(CCAEvent.FINISH_VIEWGROUP_WITH_RESULT, viewGroupFinishListener);
                }

            }

            function removeEventListener() {

                for (var view in _this.modViews) {
                    $(_this.modViews[view]).unbind();
                }
            }

            function sendCompleteDrawEvent() {
                _this.sendEvent(CCAEvent.COMPLETE_TO_DRAW_VIEW);
            }

            function viewChangeViewListener(event, param) {
                console.log("viewChangeViewListener");
                if(currentView != null) {
                    currentView.onDeActive();
                }
                if(param.targetView == DefineView.MOD_REQUEST_PHONE_LIST) {
                    if(param.finish) {
                        historyStack.pop();
                        currentView.onStop();
                        currentView = null;
                    }
                    selectSendToPhone(event, param);
                } else {
                    var nextView = _this.modViews[param.targetView];
                    if(nextView) {
                        if(currentView != null) {
                            historyStack.push({'view': currentView});
                            currentView.onHide();
                        }
                        currentView = nextView;
                        currentView.onStart(param);
                    }
                    if(currentView != null) {
                        currentView.onActive();
                    }
                }
            }

            function viewFinishEventListener(event, param) {
                //currentView.onDeActive();
                //currentView.onStop();
                if(historyStack.getSize() > 0) {
                    currentView.onDeActive();
                    currentView.onStop();
                    currentView = historyStack.pop().view;
                    currentView.onUpdate();
                    currentView.onActive();
                    currentView.onShow();
                } else {
                    viewGroupFinishListener(CCAEvent.FINISH_VIEWGROUP);
                }
            }


            function viewGroupChangeListener(event, param) {
                if(currentView != null) {
                    //currentView.onDeActive();
                    //currentView.onStop();
                    currentView.onHide();
                }
                _this.sendEvent(event, param);
            }

            function viewGroupFinishListener(event, param) {
                CSSHandler.popHistory();
                if(currentView != null) {
                    //currentView.onDeActive();
                    //currentView.onStop();
                    currentView.onHide();
                }
                _this.sendEvent(event, param);
            }

            //function changeViewGroupListener(event, param) {
            //    if(currentView) {
            //        currentView.onHide();
            //    }
            //    _this.sendEvent(event, param);
            //}
            //
            //function viewGroupFinishEventListener(event, param) {
            //    console.log("viewGroupFinishEventListener");
            //    if(currentView) {
            //        currentView.onHide();
            //    }
            //    _this.sendEvent(CCAEvent.FINISH_VIEWGROUP);
            //}
            //
            //function viewGroupFinishWithResultEventListener(event, param) {
            //    console.log("viewGroupFinishWithResultEventListener");
            //    if(currentView) {
            //        currentView.onHide();
            //    }
            //    _this.sendEvent(CCAEvent.FINISH_VIEWGROUP_WITH_RESULT, param);
            //}


            this.onInit();
        };
        ModViewGroupManager.prototype = Object.create(ViewGroup.prototype);


        return ModViewGroupManager;
    });

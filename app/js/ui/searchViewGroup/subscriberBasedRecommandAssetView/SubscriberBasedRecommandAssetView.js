define(["framework/View", "framework/event/CCAEvent",
        "ui/searchViewGroup/subscriberBasedRecommandAssetView/SubscriberBasedRecommandAssetDrawer", 
        "ui/searchViewGroup/subscriberBasedRecommandAssetView/SubscriberBasedRecommandAssetModel",
        "service/Communicator", "cca/DefineView", "cca/type/SortType", "service/STBInfoManager", 'cca/type/VisibleTimeType'],
    function (View, CCAEvent, SubscriberBasedRecommandAssetDrawer, SubscriberBasedRecommandAssetModel, Communicator, DefineView, SortType, STBInfoManager, VisibleTimeType) {

        var SubscriberBasedRecommandAssetView = function () {
            View.call(this, DefineView.SEARCH_SUBSCRIBER_BASED_RECOMMANDATION_VIEW);
            this.model = new SubscriberBasedRecommandAssetModel();
            this.drawer = new SubscriberBasedRecommandAssetDrawer(this.getID(), this.model);
            var _this = this;

            SubscriberBasedRecommandAssetView.prototype.onInit = function() {

            };

            SubscriberBasedRecommandAssetView.prototype.onAfterStart = function() {
                //_this.hideTimerContainer();
            };

            SubscriberBasedRecommandAssetView.prototype.onKeyDown = function(event, param) {
                 var model = _this.model;
                var keyCode = param.keyCode;
                var tvKey = window.TVKeyValue;
//                console.log('SubscriberBasedRecommandAssetView, onKeyDown[keyCode: ' + keyCode + ']');

                switch (keyCode) {
                    case tvKey.KEY_UP:
                        if(model.getVIndex() == 0) {
                        	sendChangeViewEvent(DefineView.SEARCH_VIEW);
                        } 
                        else {
                            _this.keyNavigator.keyUp();   
                            sendChangeFocus();
                        };
                        _this.drawer.onUpdate(); 

                        break;
                    case tvKey.KEY_DOWN:
                        _this.keyNavigator.keyDown();
                        _this.drawer.onUpdate();
                        sendChangeFocus();
                        break;
                    case tvKey.KEY_LEFT:
                    	if(model.getHIndex() == 0){
                    		sendChangeViewEvent(DefineView.SEARCH_WEEKLY_POPULARITY_CHART_VIEW);
                    	}
                    	else	{
                    		model.setHIndex(0);
                            _this.drawer.onUpdate();
                            sendChangeFocus();
                    	}
                        

                        break;
                    case tvKey.KEY_RIGHT:
                    	if(model.getHIndex() == 0){
                    		model.setHIndex(1);
                            _this.drawer.onUpdate();
                            sendChangeFocus();
                    	}
                    	else	{
                    		sendChangeViewEvent(DefineView.SEARCH_DAILY_POPULARITY_CHART_VIEW);
                    	}
                        
                        break;
                    case tvKey.KEY_EXIT:
                    case tvKey.KEY_BACK:
                        sendFinishViewEvent();
                        break;
                    case tvKey.KEY_ENTER:
                        sendChangeViewGroupEvent();
                        break;
                    default:
                        break;
                }
//                console.log(_this.model);
                return true;
            };

            SubscriberBasedRecommandAssetView.prototype.onGetData = function (param) {
                this.isRequesting = false;
                this.transactionId = $.now() % 1000000;
                var verticalVisibleSize = 2;
                var horizontalVisibleSize = 2;
                var verticalMaximumSize = verticalVisibleSize;
                var horizentalMaximumSize = horizontalVisibleSize;                
                var vIndex = param.vIndex != null ? param.vIndex : 0;
                var hIndex = param.hIndex != null ? param.hIndex : 0;
                
                this.model.setVIndex(vIndex);
                this.model.setHIndex(hIndex);

                requestContentList(callBackForRequestRecommendAssetBySubscriber, 0, 4);
            };

           

            function isLastRowInCurrentPage() {
                var model = _this.model;
                if(model.getVIndex() == model.getVVisibleSize() - 1 || 
                    model.getVStartIndex() + model.getVIndex() + 1 == model.getPopularityList().length) {
                    return true;
                };

                return false;
            };

            function getSelectedItem() {
                var selectedItemIndex = _this.model.getVStartIndex() + _this.model.getVIndex();
                var selectedItem = _this.model.getPopularityList()[selectedItemIndex];
                return selectedItem;
            };

            // function callBackForRequestAssetInfo(result) {
            //     _this.isRequesting = false;
            //     if(Communicator.isSuccessResponseFromHAS(result) == true) {
            //     } else {
            //         console.error("Failed to get datas from has." );
            //     };
            // };

            // function requestAssetInfo(callback, assetId) {
            //     _this.isRequesting = true;
            //     Communicator.requestAssetInfo(callback, assetId, 3);
            // };

            function requestContentList(callback, pageIndex, pageSize) {
                _this.isRequesting = true;
                var transactionId = ++_this.transactionId;
                var categoryId = STBInfoManager.getMDCategoryID();
                var assetProfile = 7;
                var sortType = SortType.NOTSET;
                // var sortType = SortType.NAME_ASC;
                // var includeAdultCategory = 1;
                // Communicator.requestRecommendAssetBySubscriber(callback, pageSize, pageIndex, sortType, assetProfile, includeAdultCategory);
                Communicator.requestAssetListByCategoryID(callback, transactionId, categoryId, assetProfile, sortType, pageIndex, pageSize);
            };
            function callBackForRequestRecommendAssetBySubscriber(result) {
                _this.isRequesting = false;
                if(Communicator.isCorrectTransactionID(_this.transactionId, result)) {
                	if(Communicator.isSuccessResponseFromHAS(result) == true) 
                    {
                        var model = _this.model;
//                        console.log(result);

                        var verticalVisibleSize = 2;
                        var horizontalVisibleSize = 2;
                        var verticalMaximumSize = result.assetList.length > 2 ? 2 : 1;
                        var horizentalMaximumSize = horizontalVisibleSize;
                        
                        model.setSize(verticalVisibleSize, horizontalVisibleSize, verticalMaximumSize, horizentalMaximumSize);
                        model.setRotate(false, false);
//                        console.log(model);
                        model.setNextLineRotate(false);
                        setData(result.assetList);
                        _this.drawer.onUpdate();
                    }
                    else {
                        console.error("Failed to get datas from has. error: ", result);
                    }
                }
                _this.setVisibleTimer(VisibleTimeType.POSTER_TYPE);

            };
            function setData(assetList) {
                _this.model.setAssetList(assetList);
            };
            function getEventParamObject()	{
            	var param = {};
                param.focusedCategory = _this.model.focusedCategory;
                param.vIndex = _this.model.getVIndex();
                param.hIndex = _this.model.getHIndex();
                param.vStartIndex = null;
                return param;
           }
            function sendChangeViewEvent(targetView) {
//                console.log('sendChangeViewEvent');

            	var param = getEventParamObject();
                param.targetView = targetView;
                if(_this.model.getVIndex() == 0)	{
                	param.vIndex = 1;
                }
                else	{
                	param.vIndex = 5;
                }
                	
                _this.sendEvent(CCAEvent.CHANGE_VIEW, param);
            };
            function sendFinishViewEvent() {
                _this.sendEvent(CCAEvent.FINISH_VIEW);
            };
            function sendChangeFocus()	{
                _this.sendEvent(CCAEvent.CHANGE_FOCUS_ON_VIEW, getEventParamObject());
            }
            function sendChangeViewGroupEvent() {
                var param = {};
                param.focusedCategory = _this.model.focusedCategory;
                param.targetView = DefineView.DETAIL_VIEW;
                var index = _this.model.getVIndex()*2+_this.model.getHIndex();
                var asset = _this.model.getAssetList()[index];
                param.assetID = asset.getAssetID();
                _this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, param);
            };

            this.onInit();
        };

        SubscriberBasedRecommandAssetView.prototype = Object.create(View.prototype);

        return SubscriberBasedRecommandAssetView;
    });
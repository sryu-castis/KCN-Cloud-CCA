define(["framework/View", "framework/event/CCAEvent", "main/CSSHandler",
        "ui/searchResultViewGroup/programListView/ProgramListDrawer", "ui/searchResultViewGroup/programListView/ProgramListModel",
        "service/Communicator",'cca/type/SortType', "cca/DefineView", "cca/PopupValues",'cca/model/Program', 'cca/type/ViewerType', 'cca/type/VisibleTimeType'],
    function (View, CCAEvent, CSSHandler, ProgramListDrawer, ProgramListModel, Communicator, SortType, DefineView, PopupValues, Program, ViewerType, VisibleTimeType) {

        var ProgramListView = function () {
            View.call(this, "programListView");
            this.model = new ProgramListModel();
            this.drawer = new ProgramListDrawer(this.getID(), this.model);

            var _this = this;

            ProgramListView.prototype.onInit = function() {

            };

            ProgramListView.prototype.onAfterStart = function (param) {
                _this = this;
                this.model.keyword = param.keyword;
                this.isRequesting = false;
                this.transactionId = $.now() % 1000000;

                _this.hideTimerContainer();
            };

            ProgramListView.prototype.onKeyDown = function (event, param) {
                var model = _this.model;
                var keyCode = param.keyCode;
                var tvKey = window.TVKeyValue;
//              console.log('PosterListView, onKeyDown[keyCode: ' + keyCode + ']');

                switch (keyCode) {
                    case tvKey.KEY_UP:
                        if(model.getVIndex() == 0) {
                            scrollUp();
                        } else {
                            _this.keyNavigator.keyUp();
                            _this.drawer.onUpdate();    
                        };
                        
                        return true;
                    case tvKey.KEY_DOWN:
                        if(model.getVIndex() == model.getVVisibleSize()-1 || isLastItem() == true) {
                            scrollDown();
                        } else {
                            _this.keyNavigator.keyDown();
                            _this.drawer.onUpdate();    
                        };
                        
                        return true;
                    case tvKey.KEY_RIGHT:
                        return true;
                    case tvKey.KEY_LEFT:
                    case tvKey.KEY_BACK:
                    case tvKey.KEY_EXIT:
                    case tvKey.KEY_BACK:
                        sendFinishViewEvent();
                        return true;
                    case tvKey.KEY_ENTER:
                        goToChannel();
                        return true;
                    default:
                        return false;
                };
            };

            ProgramListView.prototype.onBeforeActive = function () {
                if(_this.model.getData() == undefined || _this.model.getData().length == 0) {
                    sendFinishViewEvent();
                };
            };            

            ProgramListView.prototype.onGetData = function (param) {
                var programList = this.model.getData();
                if(programList == undefined) {
                	sendChangeViewToNoDataViewEvent();
                } else if(programList.length == 0) {
                    sendChangeViewToNoDataViewEvent();
                } else {
                    var verticalVisibleSize = 7;
                    var horizonVisibleSize = 1;
                    var verticalMaximumSize = programList.length;
                    var horizonMaximumSize = 1;

                    _this.model.setSize(verticalVisibleSize, horizonVisibleSize, verticalMaximumSize, horizonMaximumSize);
                    _this.model.setRotate(true, false);

                    this.setVisibleTimer(VisibleTimeType.TEXT_TYPE);
                }
                // requestProgramList(callbackForRequestProgramList);
            };

            /*function requestProgramList (callback) {
                if(_this.isRequesting == true) {
                    return;
                };
                _this.isRequesting = true;
                var keyword = _this.model.keyword;
                CSSHandler.requestSearchProgram(keyword, callback);
                
                // result = {};
                // result.keyword = keyword;
                // result.programList = [
                //     new Program({'channelNumber': 1, 'channelName': '11111111', 'title': '1111111111111111111111', 'beginDate': '11:11', 'endDate': '11:11', 'rating': '12', 'HD': 'HD'}),
                //     new Program({'channelNumber': 2, 'channelName': '22222222', 'title': '2222222222222222222222', 'beginDate': '22:22', 'endDate': '22:22', 'rating': '15', 'HD': 'SD'}),
                //     new Program({'channelNumber': 3, 'channelName': '33333333', 'title': '3333333333333333333333', 'beginDate': '33:33', 'endDate': '33:33', 'rating': '12', 'HD': 'HD'}),
                //     new Program({'channelNumber': 4, 'channelName': '44444444', 'title': '4444444444444444444444', 'beginDate': '44:44', 'endDate': '44:44', 'rating': '12', 'HD': 'SD'}),
                //     new Program({'channelNumber': 5, 'channelName': '55555555', 'title': '5555555555555555555555', 'beginDate': '55:55', 'endDate': '55:55', 'rating': '12', 'HD': 'HD'}),
                //     new Program({'channelNumber': 6, 'channelName': '66666666', 'title': '6666666666666666666666', 'beginDate': '66:66', 'endDate': '66:66', 'rating': '12', 'HD': 'SD'}),
                //     new Program({'channelNumber': 7, 'channelName': '77777777', 'title': '7777777777777777777777', 'beginDate': '77:77', 'endDate': '77:77', 'rating': '12', 'HD': 'HD'}),
                //     new Program({'channelNumber': 8, 'channelName': '88888888', 'title': '8888888888888888888888', 'beginDate': '88:88', 'endDate': '88:88', 'rating': '12', 'HD': 'SD'}),
                //     new Program({'channelNumber': 9, 'channelName': '99999999', 'title': '9999999999999999999999', 'beginDate': '99:99', 'endDate': '99:99', 'rating': '12', 'HD': 'HD'}),
                //     new Program({'channelNumber': 11, 'channelName': '11111111', 'title': '1111111111111111111111', 'beginDate': '11:11', 'endDate': '11:11', 'rating': '12', 'HD': 'HD'}),
                //     new Program({'channelNumber': 12, 'channelName': '22222222', 'title': '2222222222222222222222', 'beginDate': '22:22', 'endDate': '22:22', 'rating': '15', 'HD': 'SD'}),
                //     new Program({'channelNumber': 13, 'channelName': '33333333', 'title': '3333333333333333333333', 'beginDate': '33:33', 'endDate': '33:33', 'rating': '12', 'HD': 'HD'}),
                //     new Program({'channelNumber': 14, 'channelName': '44444444', 'title': '4444444444444444444444', 'beginDate': '44:44', 'endDate': '44:44', 'rating': '12', 'HD': 'SD'}),
                //     new Program({'channelNumber': 15, 'channelName': '55555555', 'title': '5555555555555555555555', 'beginDate': '55:55', 'endDate': '55:55', 'rating': '12', 'HD': 'HD'}),
                //     new Program({'channelNumber': 16, 'channelName': '66666666', 'title': '6666666666666666666666', 'beginDate': '66:66', 'endDate': '66:66', 'rating': '12', 'HD': 'SD'}),
                //     new Program({'channelNumber': 17, 'channelName': '77777777', 'title': '7777777777777777777777', 'beginDate': '77:77', 'endDate': '77:77', 'rating': '12', 'HD': 'HD'}),
                //     new Program({'channelNumber': 18, 'channelName': '88888888', 'title': '8888888888888888888888', 'beginDate': '88:88', 'endDate': '88:88', 'rating': '12', 'HD': 'SD'}),
                //     new Program({'channelNumber': 19, 'channelName': '99999999', 'title': '9999999999999999999999', 'beginDate': '99:99', 'endDate': '99:99', 'rating': '12', 'HD': 'HD'})
                // ];

                // setTimeout(function() {
                //     callbackForRequestProgramList(result);
                // }, 1000);
            };

            function callbackForRequestProgramList(result) {
                if(result.programList == null || result.programList == undefined || result.programList.length == 0) {
                    sendChangeViewToNoDataViewEvent("noDataView");
                } else {
                    _this.isRequesting = false;
                    var verticalVisibleSize = 7;
                    var horizonVisibleSize = 1;
                    var verticalMaximumSize = result.programList.length;
                    var horizonMaximumSize = 1;

                    _this.model.setSize(verticalVisibleSize, horizonVisibleSize, verticalMaximumSize, horizonMaximumSize);
                    _this.model.setRotate(true, false);
                    setData(result.programList);
                }
            };

            function setData(programList) {
                _this.model.setData(programList);
                _this.drawer.onUpdate();
                _this.setVisibleTimer(VisibleTimeType.TEXT_TYPE);
            };*/

            function isLastItem() {
                return (_this.model.getVStartIndex() + _this.model.getVIndex() == _this.model.getData().length - 1);
            };

            function scrollUp() {
                var model = _this.model;
                var vStartIndex = model.getVStartIndex() - model.getVVisibleSize();
                var totalPage = Math.ceil(model.getData().length / model.getVVisibleSize());
                var vIndexOfLastPage = model.getData().length % model.getVVisibleSize() - 1;
                var isOverflow = vStartIndex < 0;
                vStartIndex = isOverflow ? (totalPage - 1) * model.getVVisibleSize() : vStartIndex; 
                var vIndex = (isOverflow == true) ? vIndexOfLastPage : model.getVVisibleSize() - 1;
                model.setVStartIndex(vStartIndex);
                model.setVIndex(vIndex);
                _this.drawer.onUpdate();
            };

            function scrollDown() {
                var model = _this.model;
                var vStartIndex = model.getVStartIndex() + model.getVVisibleSize();
                var isOverflow = vStartIndex > model.getData().length - 1;
                vStartIndex = isOverflow ? 0 : vStartIndex;
                var vIndex = 0;
                model.setVStartIndex(vStartIndex);
                model.setVIndex(vIndex);
                _this.drawer.onUpdate();
            };

            function goToChannel() {
                var model = _this.model;
                var index = model.getVIndex() + model.getVStartIndex();
                var program = model.getData()[index];
                CSSHandler.goToChannel(program.getChannelNumber());
                console.log('goToChannel: ' + program.getChannelNumber());
            };

            function sendChangeViewToNoDataViewEvent() {
                param = {};
                param.targetView = DefineView.NO_DATA_VIEW;
                param.messageType = ViewerType.PROGRAM_LIST;
                _this.sendEvent(CCAEvent.CHANGE_VIEW, param);
            };

            function sendChangeViewGroupEvent() {
                var model = _this.model;
                var selectedItem = model.getData()[model.getVStartIndex() + model.getVIndex()];
                // console.log(selectedItem);
                // _this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, param);
            };

            function sendFinishViewEvent() {
                _this.sendEvent(CCAEvent.FINISH_VIEW);
            };

            this.onInit();
        };

        ProgramListView.prototype = Object.create(View.prototype);
        ProgramListView.TYPE_ON_EVENT = 10;
        ProgramListView.TYPE_OFF_EVENT = 20;

        return ProgramListView;
    });
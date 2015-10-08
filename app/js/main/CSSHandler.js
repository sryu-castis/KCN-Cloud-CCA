/*

 -       onNoti*() : STB to WebApp Notification 함수 ok
 -       onReq*() : STB to WebApp Request 함수
 -       onRes*() : STB to WebApp Response 함수 ok

 noti*() : WebApp to STB Notification 함수 ok
 req*() : WebApp to STB Request 함수 ok
 res*() : WebApp to STB Response 함수
 */


define(['cca/type/JumpType', 'cca/type/PlayType', "service/STBInfoManager", 'service/CCAStateManager', 'service/CCAInfoManager', "cca/DefineView",
        "service/Communicator", "helper/UIHelper", "cca/type/EntryType"]
    , function (JumpType, PlayType, STBInfoManager, CCAStateManager, CCAInfoManager, DefineView, Communicator, UIHelper, EntryType) {
        var CSSHandler = {};
        var ccaService = null;
        var cssInterface = window.cssWrapper;

        var MENU_JUMP = '315';

        var passwordCallbackFunc = null;
        var stopPlayerCallbackFunc = null;
        var searchProgramCallbackFunc = null;
        var gotoEPGCallbackFunc = null;
        var requestStartVODCallbackFunc = null;
        var requestCCAInfoCallbackFunc = new Array();
        var historeRestoreCallBack = null;

        CSSHandler.setCCAService = function (_CCAService) {
            ccaService = _CCAService;
        };

        CSSHandler.notifyCCALoadComplete = function () {
            console.info('notifyCCALoadComplete');
            cssInterface.appLoaded();
        };


        /**
         * move 에 대한 처리 (메뉴이동)
         * @param data
         */
        CSSHandler.moveRequestHandler = function (data) {
            console.info('moveRequestHandler');
            ccaService.clearTask();
            startCCAService(data);
        }

        CSSHandler.moveRecoverRequestHandler = function (data) {
            console.info('moveRecoverRequestHandler');
            ccaService.clearTask();
            CCAStateManager.setRestoreRepository(data);
            ccaService.restoreHistory();
            CSSHandler.sendResponseForMove(CSSHandler.RESPONSE_SUCCESS);

        }

        /**
         * recover 에 대한 처리 (세션 복원으로 인한 메뉴이동)
         * @param data
         */
        CSSHandler.recoverRequestHandler = function (data) {
            console.info("recover not yet")
            CCAStateManager.setRestoreRepository(data);
            ccaService.restoreHistory()
            this.sendResponseForRecover(CSSHandler.RESPONSE_SUCCESS);
        }

        CSSHandler.historyRequestHandler = function (data) {
            console.info('historyRequestHandler');
            if (data != null && data.type != null) {
                var type = data.type;
                switch (type) {
                    case "clear":
                        CCAStateManager.clearHistory();
                        this.sendResponseForHistory({'result': true});
                        break;
                    case "all":
                        //전체 히스토리 목록을 전달
                        this.sendResponseForHistory({'historyList': {'history': CCAStateManager.getAllHistory()}});
                        break;
                }
            }
        }


        CSSHandler.notifyStartPlayRequestHandler = function (data) {
            console.info('notifyStartPlayRequestHandler');
            ccaService.notifyToHASAboutStartPlay(data);
        }

        function startCCAService(entryInfo) {
            var entryDomain = entryInfo.entryDomain;
            switch (entryDomain) {
                case CSSHandler.SHOW_VOD_MENU:
                    if (CSSHandler.SHOW_SEARCH_MENU == entryInfo.entryPointID) {
                        startSearchViewGroup(entryInfo);
                    } else if (MENU_JUMP == entryInfo.entryContext) {
                        startMenuGroupByJump(entryInfo);
                    } else {
                        startMenuGroup(entryInfo);
                    }
                    break;
                case CSSHandler.SHOW_DETAIL_FROM_AD:
                    startDetailGroup(entryInfo);
                    break;
                case CSSHandler.SHOW_LIST_FROM_AD:
                    startListView(entryInfo);
                    break;
                case CSSHandler.SHOW_CLOSE_PLAYER:
                    startPlayerClosePopup(entryInfo);
                    //beforeStartPlayerClosePopup(entryInfo)
                    break;
                case CSSHandler.SHOW_MOD:
                    startMODTrigger(entryInfo);
                    break;
                case CSSHandler.SHOW_MAIN_MENU:
                    //startMainMenuGroup(entryInfo);
                    break;
                case CSSHandler.VOD_HOTKEY:
                    //ccaService.clearTask();
                    //CCAStateManager.clearHistory();

                    var data = {
                        "entryDomain": "menu",
                        "entryPointID": STBInfoManager.getMovieCategoryId(),
                        "entryContext": "영화"
                    };
                    startMenuGroup(data);
                    break;
                case CSSHandler.TV_HOTKEY:
                    var data = {
                        "entryDomain": "menu",
                        "entryPointID": STBInfoManager.getTVCategoryID(),
                        "entryContext": "TV 다시보기"
                    };
                    startMenuGroup(data);
                    break;
                case CSSHandler.SEARCH_HOTKEY:
                    var data = {"entryDomain": "menu", "entryPointID": "search", "entryContext": "null"};
                    startSearchViewGroup(data);
                    break;
            }
        }

        function startMainMenuGroup(entryInfo) {
            var info = {};
            if (CSSHandler.MAIN_MENU_APPTYPE == entryInfo.entryPointID) {
                info = {
                    'targetView': DefineView.SERVICE_MENU_VIEW,
                    'appKey': entryInfo.entryContext
                };
            } else if (CSSHandler.MAIN_MENU_MENUTYPE == entryInfo.entryPointID) {
                info = {
                    'targetView': DefineView.SERVICE_MENU_VIEW,
                    'menuKey': entryInfo.entryContext
                };
            }
            ccaService.startMainMenu(info);
        }

        function startMenuGroup(entryInfo) {
            //@Comment 건내 받은 데이터를 필요한 형태로 가공한다.
            var info = {
                'currentCategoryID': entryInfo.entryPointID,
                'rootCategoryName': entryInfo.entryContext,
                'index': 0,
                'startIndex': 0
            };
            ccaService.startMenuGroup(info, EntryType.OTHERS);
        }

        function startDetailGroup(entryInfo) {
            var info = {'assetID': entryInfo.entryPointID, 'callerID': entryInfo.entryContext};
            ccaService.startDetailGroup(info, EntryType.OTHERS);
        }

        function startMenuGroupByJump(entryInfo) {
            //@Comment 건내 받은 데이터를 필요한 형태로 가공한다.
            var info = {
                'currentCategoryID': entryInfo.entryPointID.split('|')[1],
                'rootCategoryName': '',
                'index': 0,
                'startIndex': 0,
                'jumpType': JumpType.ONTHE_CATEGORY
            };
            ccaService.startMenuGroup(info, EntryType.OTHERS);
        }

        function startSearchViewGroup(entryInfo) {
            //@Comment 건내 받은 데이터를 필요한 형태로 가공한다.
            var info = {
                'currentCategoryID': entryInfo.entryPointID,
                'rootCategoryName': entryInfo.entryContext,
                'index': 0,
                'startIndex': 0
            };
            ccaService.startSearchViewGroup(info, EntryType.OTHERS);
        }

        function startPlayerClosePopup(entryInfo) {
            //@Comment 건내 받은 데이터를 필요한 형태로 가공한다.
            var playType = entryInfo.entryPointID.split('|')[0];
            var ratio = entryInfo.entryPointID.split('|')[1];
            var info = {'playType': playType, 'ratio': ratio, 'assetID': entryInfo.entryContext};
            ccaService.startPlayerClosePopup(info, EntryType.OTHERS);
        }

        function startMODTrigger(entryInfo) {
            var assetID = entryInfo.entryContext;
            ccaService.startMODTrigger({
                targetView: DefineView.MOD_TRIGGER_DETAIL_VIEW,
                assetID: assetID
            }, EntryType.OTHERS);
        }

        function startListView(entryInfo) {
            var info = {'assetID': entryInfo.entryPointID, 'callerID': entryInfo.entryContext};
            ccaService.startListView(info, EntryType.OTHERS);
        }


        CSSHandler.setSTBInfoHandler = function (data) {
            console.info('setSTBInfoHandler');
            if (data != null) {
                STBInfoManager.initialize(data);
            }
            ccaService.prepareStartApp();
        }

        CSSHandler.activateNumberKeys = function (isUse) {
            var data = {};
            data.numKeyUse = isUse ? "on" : "off";

            console.info('activateNumberKeys : ' + isUse);
            cssInterface.notiKeyInfo(data);
        }

        CSSHandler.allKeyBlock = function (time) {
            var data = {};
            data.allKeyBlock = time;

            cssInterface.notiKeyInfo(data);
        };

        CSSHandler.runThirdApp = function (srcID) {
            if (CCAStateManager.isPlay()) {
                console.info('runThirdApp But VOD playing');
                runThirdAppWithVODStop(srcID)
            } else {
                var data = {};
                data.srcId = srcID;
                console.info('runThirdApp : ' + data.srcId);
                cssInterface.notiLaunchApp(data);
            }
        }

        function runThirdAppWithVODStop(srcID) {
            //@Comment 재생을 위한 데이터 (param)을 멤버로 저장하기  싫어서 noname 함수를 만들어 사용
            CSSHandler.requestStopPlayer('stop', false, function (data) {
                if (data.result) {
                    Communicator.requestNotifyStopPlay(function () {
                        CSSHandler.runThirdApp(srcID);
                    }, data.assetId, data.playEventId, data.offset);
                }
            });
        }

        CSSHandler.runThirdMenu = function (menu) {
            var data = {};
            data.menu = menu;
            console.info('runThirdMenu : ' + data.menu);
            cssInterface.notiGoToTUI(data);
        }

        CSSHandler.runCSApp = function (appId) {
            console.info('runCSApp : ' + appId);
            cssInterface.launchCSApp(appId);
        };


        CSSHandler.pushHistory = function (viewGroupID, viewID, option) {
            option = JSON.stringify(option);
            var history = {'entryDomain': viewGroupID, 'entryPointID': viewID, 'entryContext': option};
            CCAStateManager.pushHistory(history);
            //this.notifyCCAState('push', history);
        }
        CSSHandler.popHistory = function () {
            var history = CCAStateManager.popHistory();
            return history;
        }
        CSSHandler.updateHistory = function (viewGroupID, viewID, option) {
            option = JSON.stringify(option);
            var history = {'entryDomain': viewGroupID, 'entryPointID': viewID, 'entryContext': option};
            CCAStateManager.updateHistory(history);
            //this.notifyCCAState('present', history);
        }

        CSSHandler.notifyCCAState = function (type, history) {
            var data = {};
            data.type = type; //push. pop , present
            data.history = history;
            //console.log(data);

            console.info('notifyCCAState : ' + type);
            cssInterface.notiHistory(data);
        }

        CSSHandler.notifyHideUI = function (action) {
            var data = {};
            data.action = action;

            console.info('notiHideUI : ' + action);
            cssInterface.notiHideUI(data);
        }


        CSSHandler.requestRebootSTB = function () {
            console.info('requestRebootSTB');
            cssInterface.notiPatch();
        }

        CSSHandler.updateSTBInfoHandler = function (data) {
            var field = data.target
            var value = data.value;
            console.info('updateSTBInfoHandler : ' + field + " : " + value);
            switch (field) {
                case "adultCheckType":
                    STBInfoManager.setAdultMenuSetting(value);
                    break;
                case "currentParentalRating":
                    STBInfoManager.setAgeLimit(value);
                    break;
            }
        }

        CSSHandler.notifyUpdate = function (type, value) {
            var data = {};
            data.target = type;
            data.value = value;
            console.info('notifyUpdate');
            cssInterface.notiUpdate(data);
        }

        CSSHandler.goToChannel = function (channelNumber) {
            if (CCAStateManager.isPlay()) {
                changeChannelWithVODStop(channelNumber);
            } else {
                var data = {'channelNumber': channelNumber};
                console.info('goToChannel : ' + channelNumber);
                cssInterface.notiGoToChannel(data);
            }
        }

        function changeChannelWithVODStop(channelNumber) {
            //@Comment 재생을 위한 데이터 (param)을 멤버로 저장하기  싫어서 noname 함수를 만들어 사용
            CSSHandler.requestStopPlayer('stop', false, function (data) {
                if (data.result) {
                    Communicator.requestNotifyStopPlay(function () {
                        console.info('goToChannel : ' + channelNumber);
                        var data = {'channelNumber': channelNumber};
                        cssInterface.notiGoToChannel(data);
                    }, data.assetId, data.playEventId, data.offset);
                }
            });
        }

        CSSHandler.gotoEPGState = function (callbackFunc) {
            /*var data = {};
             data.menuId = "";
             data.searchKeyword = "";*/
            gotoEPGCallbackFunc = callbackFunc;
            console.info('gotoEPGState');
            cssInterface.reqGoToEPG();
        }

        CSSHandler.goToEPGResponseHandler = function (data) {
            console.info('goToEPGResponseHandler');
            gotoEPGCallbackFunc(data)
        }

        CSSHandler.sendAllHistory = function () {
            CCAStateManager.makeCleanForStartPlay();
            var param = {'type': 'replace', 'historyList': {'history': CCAStateManager.getAllHistory()}};
            cssInterface.notiHistory(param);
        }

        CSSHandler.sendHistoryToSettopBox = function () {
            if (!CCAStateManager.isPlay()) {
                var param = {'type': 'replace', 'historyList': {'history': CCAStateManager.getAllHistory()}};
                cssInterface.notiHistory(param);
            }
        }


        CSSHandler.requestStartPlayer = function (asset, product, playType, offset, isMOD, callbackFunc) {
            var data = {};
            data.title = asset.getTitle();
            data.fileName = ( PlayType.TRAILER == playType ) ? asset.getPreviewInfo().getPreviewFileName() : asset.getFileName();

            data.offset = offset;
            data.playType = playType;
            data.categoryId = asset.getCategoryID();
            data.assetId = asset.getAssetID();
            var rating = UIHelper.getNormalizationRating(asset.getRating());
            data.rating = rating >= 18 ? 19 : rating;
            data.resolution = asset.isHDContent() ? "HD" : "SD";
            data.previewPeriod = asset.getPreviewPeriod();
            data.notifyStartPlayTime = ( PlayType.NORMAL == playType ) ? CCAInfoManager.getNotifyStartDelayTime() : -1;
            data.MODTrigger = isMOD ? 95 : 0;
            data.productId = product.getProductID();
            data.goodId = product.getGoodId();
            //data.nextWatchId = asset.getNextWatchAssetId();
            //data.tmpSeriesPlayOn = false // false;
            //data.monkey3TriggerOn = false /DevelopmentMode/ false;
            requestStartVODCallbackFunc = callbackFunc;
            console.info('requestStartPlayer');
            cssInterface.reqStartVOD(data);
            CCAStateManager.setPlay(true);
            CCAInfoManager.setAdultConfirmToSTB();
        }

        CSSHandler.startPlayerResponseHandler = function (data) {
            console.info('startPlayerResponseHandler');
            requestStartVODCallbackFunc(data);

        }
        CSSHandler.requestStopPlayer = function (action, isNextVodPlay, callbackFunc) {
            console.info('requestStopPlayer');

            if (CCAStateManager.isPlay()) {
                stopPlayerCallbackFunc = callbackFunc;
                var data = {};
                data.action = action;
                data.nextVodPlay = isNextVodPlay;
                cssInterface.reqStopVOD(data);
                if (data.action == "stop") {
                    CCAStateManager.setPlay(false);
                    CCAStateManager.setShowEOSPopup(false);
                }
            }
        }

        CSSHandler.stopPlayerResponseHandler = function (data) {
            console.info('stopPlayerResponseHandler');
            data.result = data.result == "true";

            stopPlayerCallbackFunc(data);
        }

        CSSHandler.putAllAppDataToSTB = function (tempAppData) {
            var tempAppDataStr = JSON.stringify(tempAppData);

            this.requestCCAInfo("put", "CCAAppData", tempAppDataStr);
        }


        CSSHandler.requestCCAInfo = function (action, key, value, callbackFunc) {
            var data = {};
            data.type = action;//get, put
            data.key = key;
            data.value = value;

            requestCCAInfoCallbackFunc[key] = callbackFunc;
            console.info('requestCCAInfo');
            cssInterface.reqAppData(data);
        }

        CSSHandler.ccaInfoResponseHandler = function (data) {
            console.info('ccaInfoResponseHandler');
            if (data != null && data != undefined && requestCCAInfoCallbackFunc[data.key] != null) {
                requestCCAInfoCallbackFunc[data.key](data);
            }
        }

        CSSHandler.requestSearchProgram = function (keyword, callbackFunc) {
            searchProgramCallbackFunc = callbackFunc;
            var data = {};
            data.keyword = keyword;
            console.info('requestSearchProgram');
            cssInterface.reqSearchProgram(data);
        }

        CSSHandler.searchProgramResponseHandler = function (data) {
            console.info('searchProgramResponseHandler');
            searchProgramCallbackFunc(data);
        }

        CSSHandler.isCorrectAdultPIN = function (pin, callbackFunc) {
            passwordCallbackFunc = callbackFunc;
            var data = {'target': 'pin_user', 'value': pin};
            this.isCheckPassword(data);

        }
        CSSHandler.isCorrectPurchasePIN = function (pin, callbackFunc) {
            passwordCallbackFunc = callbackFunc;
            var data = {'target': 'pin_buy', 'value': pin};
            this.isCheckPassword(data);

        };
        CSSHandler.isCheckPassword = function (data) {
            console.info('isCheckPassword');
            cssInterface.reqCheck(data);
        }

        CSSHandler.checkPasswordResponseHandler = function (data) {
            console.info('checkPasswordResponseHandler');
            var isSuccess = data.result == "true";
            passwordCallbackFunc(isSuccess);
        }

        CSSHandler.requestTimeout = function (value, callbackFunc) {
            var data = {'time': value};
            console.info('requestTimeout');
            cssInterface.reqTimeout(data);
        }

        CSSHandler.timeoutResponseHandler = function (data) {
            console.info('timeoutResponseHandler');
        }

        CSSHandler.requestAllHistory = function (callbackFunc) {
            historeRestoreCallBack = callbackFunc;
            console.info('requestAllHistory');
            cssInterface.reqHistory({'type': 'all'});
            //this.allHistoryResponseHandler(CCAStateManager.getAllHistory());
        }

        CSSHandler.allHistoryResponseHandler = function (data) {
            //var object = JSON.parse(JSON.stringify( data )); //참조없는 복사
            console.info('allHistoryResponseHandler');

            CCAStateManager.setRestoreRepository(data);
            historeRestoreCallBack();
        }

        CSSHandler.sendResponseForMove = function (value) {
            var data = {'returnCode': value};
            console.info('sendResponseForMove');
            cssInterface.resMove(data);
        }
        CSSHandler.sendResponseForRecover = function (value) {
            //0 100 200
            var data = {'returnCode': value};
            console.info('sendResponseForRecover');
            cssInterface.resRecover(data);
        }
        CSSHandler.sendResponseForHistory = function (data) {
            console.info('sendResponseForHistory');
            cssInterface.resHistory(data);
        }
        CSSHandler.sendResponseForStartPlay = function (data) {
            console.info('sendResponseForStartPlay');
            cssInterface.resNotifyStartPlay(data);
        }

        CSSHandler.requestAniListSlide = function (data) {
            console.info('requestAniListSlide');
            cssInterface.aniListSlide(data);
        }

        CSSHandler.exitKeyPressedHandler = function () {
            console.info('notifyKeyPressedRequestHandler');
            ccaService.exitKeyPressedHandler();
        }

        CSSHandler.forcedStopVODHandler = function () {
            console.info('forcedStopVODHandler');
            ccaService.forcedStopVOD();
        }


        CSSHandler.SHOW_VOD_MENU = "menu";
        CSSHandler.SHOW_SEARCH_MENU = "search";
        CSSHandler.SHOW_DETAIL_FROM_AD = "detail";
        CSSHandler.SHOW_LIST_FROM_AD = "list";
        CSSHandler.GO_TO_VOD_MENU = "menu";
        CSSHandler.SHOW_CLOSE_PLAYER = "closingVOD";
        CSSHandler.SHOW_MOD = "MOD";
        CSSHandler.SHOW_MAIN_MENU = "mainMenu";
        CSSHandler.VOD_HOTKEY = "VODHotKey";
        CSSHandler.TV_HOTKEY = "TVHotKey";
        CSSHandler.SEARCH_HOTKEY = "SearchHotKey";
        CSSHandler.MAIN_MENU_APPTYPE = "appKey";
        CSSHandler.MAIN_MENU_MENUTYPE = "menuKey";


        CSSHandler.RESPONSE_SUCCESS = 0;
        CSSHandler.RESPONSE_FAIL_WITH_POPUP = 100;
        CSSHandler.RESPONSE_FAIL_WITHOUT_POPUP = 200;
        CSSHandler.APP_ID_MONKEY3 = 601;
        CSSHandler.APP_ID_TVPOINT = 607;
        CSSHandler.MENU_CHANNEL_GUIDE = "CHEPG";
        CSSHandler.MENU_NOTIFICATION = "NOTIFY";
        CSSHandler.MENU_SETUP = "SETUP";
        CSSHandler.MENU_JOYNLIFE = "JOYNLIFE";

        CSSHandler.HIDE_TYPE_EXIT = 'exit';
        CSSHandler.HIDE_TYPE_CLOSE = 'close';

        CSSHandler.TIME_OF_TIMEOUT_NORMAL = 90;
        CSSHandler.TIME_OF_TIMEOUT_MOBILE_PURCHASE = 180;

        return CSSHandler;
    });
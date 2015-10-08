
var cssWrapper = (function(){

    var api = {};
    var cssHandler = null;
    var resultOfSearchProgram  = null;
    var appLoadedFlag = false;

    // move 명령어에 해당하는 entryDomainList
    var moveEntryDomainList = ["menu", "search", "detail", "list", "menu", "closingVOD", "MOD", "mainMenu", "VODHotKey", "TVHotKey", "SearchHotKey"];

    /**
     * WebApp 로딩이 완료된 후 호출
     */
    api.appLoaded = function() {
        setTimeout(function() {
            cssApi.appLoaded();
        }, 100);

        if (appLoadedFlag)
            api.notiOnLoad({"result" : "true"});
        else
            appLoadedFlag = true;
    };

    api.setHandler = function(handler) {
        cssHandler = handler;
    };


    /****************************************************************/
    // Animation start
    /**
     * 전체 페이지 슬라이드 효과
     * @param data
     *      {
     *          direction: 'left' or 'right'    // left: ←, right: →
     *          duration: 300       // msec
     *      }
     * @returns {*}
     */
    api.aniPageSlide = function(data) {
        if (data == null || data.direction == null || (data.direction != 'left' && data.direction != 'right'))
            return false;

        if (data.duration == null)
            data.duration = 300;

        return cssApi.isTV ? cssApi.aniPageSlide(data) : true;
    };

    /**
     * List 슬라이드 효과
     * @param data
     *      {
     *          duration: 300       // msec
     *          x: 100              // x 좌표 (end x좌표)
     *          y: 100              // y 좌표 (end y좌표)
     *          width: 200          // width
     *          height: 200         // height
     *          startY: 200         // animation start y 좌표
     *      }
     * @returns {*}
     */
    api.aniListSlide = function(data) {
        if (data == null)
            return false;

        if (data.duration == null)
            data.duration = 300;

        return cssApi.isTV ? cssApi.aniListSlide(data) : true;
    };
    // Animation end
    /****************************************************************/



    /****************************************************************/
    // WebApp to STB Notification start
    /**
     * keyInfo 숫자키 사용여부를 STB에 전송한다.
     * @param data
     * @returns {*}
     */
    api.notiKeyInfo = function(data) {
        if (data == null)
            return false;

        return cssApi.isTV ? cssApi.notiKeyInfo(data) : true;
    };

    /**
     * 독립형 App. 호출
     * @param data
     * @returns {*}
     */
    api.notiLaunchApp = function(data) {
        if (data == null || data.srcId == null)
            return false;

        return cssApi.isTV ? cssApi.notiLaunchApp(data) : true;
    };

    /**
     * History 관리 (추가/삭제/변경)
     * @param data
     * @returns {*}
     */
    api.notiHistory = function(data) {
        if (data == null || data.type == null)
            return false;
        //testFunction(data);
        //console.log('notiHistory')
        //console.log(testRepository);
        return cssApi.isTV ? cssApi.notiHistory(data) : true;
    };

    function testFunction(data) {
        if(data.type == 'push') {
            var history = {'history':{'entryDomain':data.entryDomain, 'entryPointID' : data.entryPointID, 'entryContext' : data.entryContext}};
            testRepository.push(history);
        } else if(data.type == 'present') {
            testRepository.pop();
            var history = {'history':{'entryDomain':data.entryDomain, 'entryPointID' : data.entryPointID, 'entryContext' : data.entryContext}};
            testRepository.push(history);
        } else if(data.type == 'pop') {
            testRepository.pop();
        }
    }

    var testRepository = new  Array();

    /**
     * STB 재부팅
     * @returns {*}
     */
    api.notiPatch = function() {
        return cssApi.isTV ? cssApi.notiPatch() : true;
    };

    /**
     * 사용자 설정값이 바뀌었을 경우
     * @param data
     * @returns {*}
     */
    api.notiUpdate = function(data) {
        if (data == null || data.target == null)
            return false;

        return cssApi.isTV ? cssApi.notiUpdate(data) : true;
    };

    /**
     * 프로그램 검색 > 해당 프로그램 시청
     * @param data
     * @returns {*}
     */
    api.notiGoToChannel = function(data) {
        if (data == null || data.channelNumber == null)
            return false;

        return cssApi.isTV ? cssApi.notiGoToChannel(data) : true;
    };

    /**
     * CloudUI를 hide 시킴: MOD 트리거 팝업에서 "취소"등
     * @returns {*}
     */
    api.notiHideUI = function(data) {
        if (data == null || data.action == null)
            return false;

        return cssApi.isTV ? cssApi.notiHideUI(data) : true;
    };


    /**
     * TUI 메뉴로 이동
     * @returns {*}
     */
    api.notiGoToTUI = function(data) {
        if (data == null || data.menu == null)
            return false;

        return cssApi.isTV ? cssApi.notiGoToTUI(data) : true;
    };


    /**
     * LoadApp으로 로드된 웹 앱 window.onload 이벤트에서 STB으로 로드가 완료됨을 알려줌
     * @returns {*}
     */
    api.notiOnLoad = function(data) {
        if (data == null || data.result == null)
            return false;

        return cssApi.isTV ? cssApi.notiOnLoad(data) : true;
    };
    // WebApp to STB Notification end
    /****************************************************************/



    /****************************************************************/
    // WebApp to STB Request start
    /**
     * STB에 저장된 History 요청
     * @param data
     * @returns {*}
     */
    api.reqHistory = function(data) {
        /*setTimeout(function() {
            api.onResHistory(testRepository)
        }, 10);*/
        return cssApi.isTV ? cssApi.reqHistory(data) : true;
    };

    /**
     * EPG 화면으로 이동
     * @returns {*}
     */
    api.reqGoToEPG = function() {
        return cssApi.isTV ? cssApi.reqGoToEPG() : true;
    };

    /**
     * STB 에 저장된 구매비밀번호, 사용자 인증번호 확인
     * @param data
     * @returns {*}
     */
    api.reqCheck = function(data) {
        if (data == null || data.target == null)
            return false;

        return cssApi.isTV ? cssApi.reqCheck(data) : true;
    };

    /**
     * VOD 재생을 시작한다
     * @param data
     * @returns {*}
     */
    api.reqStartVOD = function(data) {
        if (data == null || data.fileName == null)
            return false;

        return cssApi.isTV ? cssApi.reqStartVOD(data) : true;
    };

    /**
     * VOD 재생을 중지한다.
     * @param data
     * @returns {*}
     */
    api.reqStopVOD = function(data) {
        if (data == null || data.action == null)
            return false;

        return cssApi.isTV ? cssApi.reqStopVOD(data) : true;
    };

    /**
     * WebApp에서 STB에 데이터 저장시 사용 (ex: 성인인증 재인증 여부 등)
     * @param data
     * @returns {*}
     */
    api.reqAppData = function(data) {
        if (data == null || data.type == null || data.key == null)
            return false;

        return cssApi.isTV ? cssApi.reqAppData(data) : true;
    };


    /**
     * 검색 > 방송프로그램 검색
     * @param data
     * @returns {*}
     */
    api.reqSearchProgram = function(data) {
        if (data == null || data.keyword == null)
            return false;

        resultOfSearchProgram = {
            "keyword": data.keyword,
            "transactionId": new Date().getTime(),
            "programList": {
                "program":[]
            }
        };
        data.transactionId = resultOfSearchProgram.transactionId;

        return cssApi.isTV ? cssApi.reqSearchProgram(data) : true;
    };

    /**
     * Timeout 시간 통지
     * @param data
     * @returns {*}
     */
    api.reqTimeout = function(data) {
        if (data == null || data.time == null)
            return false;

        return cssApi.isTV ? cssApi.reqTimeout(data) : true;
    };


    /**
     * CSS App 실행
     * @returns {*}
     */
    api.reqLaunchCSApp = function(data) {
        if (data == null || data.launchInfo == null)
            return false;

        return cssApi.isTV ? cssApi.reqLaunchCSApp(data) : true;
    };

    // WebApp to STB Request end
    /****************************************************************/



    /****************************************************************/
    // WebApp to STB Response start
    /**
     * Move request 의 response
     * @param data
     * @returns {*}
     */
    api.resMove = function(data) {
        if (data == null || data.returnCode == null)
            return false;

        return cssApi.isTV ? cssApi.resMove(data) : true;
    };

    /**
     * Recover request 의 response
     * @param data
     * @returns {*}
     */
    api.resRecover = function(data) {
        if (data == null || data.returnCode == null)
            return false;

        return cssApi.isTV ? cssApi.resRecover(data) : true;
    };

    /**
     * History request 의 response
     * @param data
     * @returns {*}
     */
    api.resHistory = function(data) {
        if (data == null)
            return false;

        return cssApi.isTV ? cssApi.resHistory(data) : true;
    };

    /**
     * NotifyStartPlay request 의 response
     * @param data
     * @returns {*}
     */
    api.resNotifyStartPlay = function(data) {
        if (data == null || data.result == null)
            return false;

        return cssApi.isTV ? cssApi.resNotifyStartPlay(data) : true;
    };

    /**
     * LoadApp request 의 response
     * @param data
     * @returns {*}
     */
    api.resLoadApp = function(data) {
        if (data == null || data.result == null)
            return false;

        return cssApi.isTV ? cssApi.resLoadApp(data) : true;
    };

    /**
     * NotifyKeyPressed request 의 response
     * @param data
     * @returns {*}
     */
    api.resNotifyKeyPressed = function(data) {
        if (data == null || data.result == null)
            return false;

        return cssApi.isTV ? cssApi.resNotifyKeyPressed(data) : true;
    };

    /**
     * NotifyStopVOD request 의 response
     * @param data
     * @returns {*}
     */
    api.resNotifyStopVOD = function(data) {
        if (data == null || data.result == null)
            return false;

        return cssApi.isTV ? cssApi.resNotifyStopVOD(data) : true;
    };
    // WebApp to STB Response end
    /****************************************************************/



    /****************************************************************/
    // STB to WebApp Notification start
    api.onNotiStatusInfo = function(data) {
        if (data.mac.indexOf("ff:ff:ff:ff") == 0) {
            data.mac = "00:00:F0:CF:5E:16";
        }
        cssHandler.setSTBInfoHandler(data);
    };

    api.onNotiUpdate = function(data) {
        cssHandler.updateSTBInfoHandler(data);
    }
    // STB to WebApp Notification end
    /****************************************************************/



    /****************************************************************/
    // STB to WebApp Request start
    api.onReqMove = function(data) {
        // todo WebApp
        if (data.historyList == null || data.historyList == "undefined") {
            cssHandler.moveRequestHandler(data);
        }
        else {
            if (Array.isArray(data.historyList.history)) {
                cssHandler.moveRecoverRequestHandler(data);
            }
            else {
                if (moveEntryDomainList.indexOf(data.historyList.history.entryDomain) >= 0)
                    cssHandler.moveRequestHandler(data.historyList.history);
                else
                    cssHandler.moveRecoverRequestHandler(data);
            }
        }
    };

    api.onReqRecover = function(data) {
        // todo WebApp
        //api.resRecover({menuId:"101", returnCode:"0"});
        cssHandler.recoverRequestHandler(data);
    };

    api.onReqHistory = function(data) {
        // todo WebApp
        //cssApi.log(">>> api.onReqHistory: " + JSON.stringify(data));
        cssHandler.historyRequestHandler(data);
    };

    api.onReqNotifyStartPlay = function(data) {
        cssHandler.notifyStartPlayRequestHandler(data);
    };

    // for gateway
    api.onReqLoadApp = function(data) {
        // set default subAppId
        if (data.launchInfo.subAppId == null || data.launchInfo.subAppId == "undefined" || data.launchInfo.subAppId == "")
            data.launchInfo.subAppId = "0";

        if (data.launchInfo.subAppId == "0") {      // gateway(mainUI)
            api.resLoadApp({"result" : "true"});
            if (appLoadedFlag)
                api.notiOnLoad({"result" : "true"});
            else
                appLoadedFlag = true;
        }
        else {
            var appKey = cssApi.getAppKey(data.launchInfo.appId, data.launchInfo.subAppId);
            if (appKey == null) {
                api.resLoadApp({"result" : "false"});
            }
            else {
                api.resLoadApp({"result" : "true"});
                window.location.href = cssApi.appList[appKey].url;
            }
        }
    };

    api.onReqNotifyKeyPressed = function(data) {
        cssWrapper.resNotifyKeyPressed({
            "value" : data.value,
            "result" : "true"
        });
        cssHandler.exitKeyPressedHandler();
    };

    api.onReqNotifyStopVOD = function(data) {
        cssWrapper.resNotifyStopVOD({
            "result" : "true"
        });
        cssHandler.forcedStopVODHandler();
    };
    // STB to WebApp Request end
    /****************************************************************/



    /****************************************************************/
    // STB to WebApp Response start
    api.onResHistory = function(data) {
        cssHandler.allHistoryResponseHandler(data);
    };
    api.onResGoToEPG = function(data) {
        cssHandler.goToEPGResponseHandler(data);
    };

    api.onResCheck = function(data) {
        cssHandler.checkPasswordResponseHandler(data);
    };

    api.onResStartVOD = function(data) {
        cssHandler.startPlayerResponseHandler(data);
    };

    api.onResStopVOD = function(data) {
        cssHandler.stopPlayerResponseHandler(data);
    };

    api.onResAppData = function(data) {
        cssHandler.ccaInfoResponseHandler(data);
    };

    api.onResSearchProgram = function(data) {

        if (resultOfSearchProgram.keyword != data.keyword && resultOfSearchProgram.transactionId != data.transactionId)
            return;

        if (data.programList.program == null) {
            resultOfSearchProgram.programList = "";
            cssHandler.searchProgramResponseHandler(resultOfSearchProgram);
        }
        else if (Array.isArray(data.programList.program)) {
            resultOfSearchProgram.programList.program = resultOfSearchProgram.programList.program.concat(data.programList.program);
        }
        else {
            resultOfSearchProgram.programList.program.push(data.programList.program);
        }

        var totalPage = Math.ceil(data.totalCount / data.pageSize);
        if (data.pageIndex * 1 < totalPage)
            return;

        api.log(JSON.stringify(resultOfSearchProgram));
        cssHandler.searchProgramResponseHandler(resultOfSearchProgram);
    };

    api.onResTimeout = function(data) {
        cssHandler.timeoutResponseHandler(data);
    };

    api.onResLaunchCSApp = function(data) {
        // do nothing
    };
    // STB to WebApp Response end
    /****************************************************************/


    /****************************************************************/
    // 기타 함수
    api.log = function(data) {
        cssApi.isTV ? cssApi.log("WebApp", data) : console.log(data);
    };

    // CSApp 실행
    api.launchCSApp = function(appKey) {
        if (!cssApi.isTV)
            return true;

        var moveInfo = {};

        if (appKey == cssApi.appKey["appPortal"]) {        // appPortal main
            moveInfo = {
                "entryDomain" : "main",
                "entryPointID" : "",
                "entryContext" : ""
            };
        }
        else {
            moveInfo = {
                "entryDomain" : "contents",
                "entryPointID" : appKey.substring(6),
                "entryContext" : ""
            };
        }
        var data = {
            "launchInfo" : {
                "csType" : cssApi.appList[cssApi.appKey["appPortal"]].csType,
                "appType" : cssApi.appList[cssApi.appKey["appPortal"]].appType,
                "appId" : cssApi.appList[cssApi.appKey["appPortal"]].appId,
                "subAppId" : cssApi.appList[cssApi.appKey["appPortal"]].subAppId,
                "extInfo" : {
                    "historyList" : {
                        "history" : moveInfo
                    }
                }
            },
            "backInfo" : {
                "csType" : cssApi.appList[cssApi.appKey["mainUI"]].csType,
                "appType" : cssApi.appList[cssApi.appKey["mainUI"]].appType,
                "appId" : cssApi.appList[cssApi.appKey["mainUI"]].appId,
                "subAppId" : cssApi.appList[cssApi.appKey["mainUI"]].subAppId,
                "extInfo" : {
                    "historyList" : {
                        "history" : {
                            "entryDomain" : "mainMenu",
                            "entryPointID" : "appKey",
                            "entryContext" : cssApi.appKey["appPortal"]
                        }
                    }
                }
            }
        };

        return api.reqLaunchCSApp(data);
    };
    /****************************************************************/

    return api;

})();

define([ "framework/ViewGroup", "framework/event/CCAEvent", "framework/utils/ViewHistoryStack", "main/CSSHandler",
		"cca/type/ViewerType", "service/STBInfoManager", "service/CCAInfoManager",
		"ui/searchResultViewGroup/resultCategoryListView/ResultCategoryListView",
		"ui/menuViewGroup/coinBalanceView/CoinBalanceView",
		"ui/menuViewGroup/posterListView/PosterListView",
        "ui/menuViewGroup/textListView/TextListView",
		"ui/menuViewGroup/noDataView/NoDataView",
		"ui/searchResultViewGroup/programListView/ProgramListView",
		'cca/model/Program', "helper/StructureHelper", "helper/DrawerHelper", 'helper/SessionHistoryHelper',
        "helper/UIComponentHelper", "cca/DefineView"
        ],
    function(ViewGroup, CCAEvent, ViewHistoryStack, CSSHandler, ViewerType, STBInfoManager, CCAInfoManager, ResultCategoryListView
        , CoinBalanceView, PosterListView, TextListView, NoDataView, ProgramListView, Program, StructureHelper, DrawerHelper, SessionHistoryHelper, UIComponentHelper, DefineView) {

    var SearchResultViewGroupManager = function(id) {
        ViewGroup.call(this, id);
        var historyStack = null;
		var resultCategoryListView = new ResultCategoryListView();
		var posterListView = new PosterListView(PosterListView.TYPE_SEARCH_RESULT_CATEGORY);
        var textListView = new TextListView(PosterListView.TYPE_SEARCH_RESULT_CATEGORY);
		var programListView = new ProgramListView();
		var noDataView = new NoDataView();
		var currentSubView = null;
		var coinBalanceView = new CoinBalanceView();

		var _this = this;
        var subViewParam = null;

		SearchResultViewGroupManager.prototype.onInit = function() {
            addEventListener();
		};

		SearchResultViewGroupManager.prototype.onStart = function(param) {
			ViewGroup.prototype.onStart.call(this);
            historyStack = new ViewHistoryStack();

            subViewParam = param.subViewParam;
            currentSubView = null;
            addCompleteToDrawEventListener();
			startViewGroup(param);
            pushResultCategoryViewHistory(param.searchField, param.keyword, param.isExpandSearch);
		};
		SearchResultViewGroupManager.prototype.onStop = function() {
			resultCategoryListView.onStop();
			if(currentSubView) currentSubView.onStop();
			programListView.model.setData(undefined);
			//coinBalanceView.onStop();
		};
		SearchResultViewGroupManager.prototype.onHide = function() {
			resultCategoryListView.onHide();
            if(currentSubView) currentSubView.onHide();
			//coinBalanceView.onHide();
		};

		SearchResultViewGroupManager.prototype.onShow = function() {
            resultCategoryListView.onShow();
            coinBalanceView.onShow();
            if (currentSubView) {
                currentSubView.onShow();
                currentSubView.onActive();
            }

            sendCompleteDrawEvent();
		};

		SearchResultViewGroupManager.prototype.onUpdate = function() {

		};

        function startViewGroup(param) {
            historyStack.push(param);
			resultCategoryListView.onStart(param);
			resultCategoryListView.onActive();
			coinBalanceView.onStart();

			requestProgramList(callbackForRequestProgramList, param.keyword);
        }

        function pushResultCategoryViewHistory(searchField, keyword, isExpandSearch) {
            var CCAHistory = {'searchField' : searchField , 'keyword': keyword, 'isExpandSearch' : isExpandSearch};
            CSSHandler.pushHistory(_this.getID(), resultCategoryListView.getID(), CCAHistory);
            CSSHandler.sendHistoryToSettopBox();
        }

        function updateResultCategoryViewHistory() {
            var CCAHistory = {};
            var searchField = [];
            for(var i=0; i<resultCategoryListView.model.getData().length; i++) {
                searchField.push(resultCategoryListView.model.getData()[i].jsonObject.searchField);
            }
            CCAHistory.searchField = searchField;
            CCAHistory.keyword = resultCategoryListView.model.getKeyword();
            CCAHistory.currentCategoryID = resultCategoryListView.model.getCurrentCategory().getCategoryID();
            CCAHistory.rootCategoryName = resultCategoryListView.model.getRootCategoryName();
            CCAHistory.vIndex = resultCategoryListView.model.getVIndex();
            CCAHistory.vStartIndex = resultCategoryListView.model.getVStartIndex();
            if(currentSubView) {
                CCAHistory.currentSubViewType = currentSubView.getID();
            }

            CCAHistory.uiDomainID = UIComponentHelper.UIDomainID.SEARCH;
            CCAHistory.uiComponentID = UIComponentHelper.UIComponentID.SEARCH_RESULT;

            CSSHandler.updateHistory(_this.getID(), resultCategoryListView.getID(), CCAHistory);
        }

        function pushSubViewHistory() {
            var CCAHistory = {};

            CSSHandler.pushHistory(_this.getID(), currentSubView.getID(), CCAHistory);
        }

        function updateSubViewHistory(event, param) {
            CSSHandler.updateHistory(_this.getID(), currentSubView.getID(), param);
        }

        function popHistory() {
            CSSHandler.popHistory();
        }

        function requestProgramList (callback, keyword) {
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

            // result = {"keyword":"OBS","programList":{"program":{"channelNumber":"11","channelName":"MBC","title":"OBS 뉴스 M","beginDate":"2015-01-21 19:45:00","endDate":"2015-01-21 20:25:00","parentalRating":"15","HD":"HD"}}};
            // result = {"keyword":"1","programList":{"program":[{"channelNumber":"11","channelName":"MBC","title":"힐러(11회)(재)","beginDate":"2015-01-21 19:15:00","endDate":"2015-01-21 20:25:00","parentalRating":"15","HD":"HD"},{"channelNumber":"11","channelName":"MBC","title":"달콤한 비밀(51회)","beginDate":"2015-01-21 19:50:00","endDate":"2015-01-21 20:30:00","parentalRating":"15","HD":"HD"},{"channelNumber":"11","channelName":"MBC","title":"갈데까지 가보자(105회)(재)","beginDate":"2015-01-21 19:20:00","endDate":"2015-01-21 20:20:00","parentalRating":"15","HD":"HD"},{"channelNumber":"11","channelName":"MBC","title":"오늘 뭐 먹지?(13회)","beginDate":"2015-01-21 19:50:00","endDate":"2015-01-21 20:20:00","parentalRating":"15","HD":"HD"},{"channelNumber":"11","channelName":"MBC","title":"왕의 얼굴(16회)(재)","beginDate":"2015-01-21 19:15:00","endDate":"2015-01-21 20:25:00","parentalRating":"15","HD":"HD"},{"channelNumber":"11","channelName":"MBC","title":"별에서 온 그대(15회)","beginDate":"2015-01-21 19:30:00","endDate":"2015-01-21 20:40:00","parentalRating":"15","HD":"HD"},{"channelNumber":"11","channelName":"MBC","title":"힐러(11회)(재)","beginDate":"2015-01-21 19:15:00","endDate":"2015-01-21 20:25:00","parentalRating":"15","HD":"HD"},{"channelNumber":"11","channelName":"MBC","title":"극한 직업(108회)(재)","beginDate":"2015-01-21 19:30:00","endDate":"2015-01-21 20:00:00","parentalRating":"15","HD":"HD"},{"channelNumber":"11","channelName":"MBC","title":"삼국지(자막본)(15회)","beginDate":"2015-01-21 19:20:00","endDate":"2015-01-21 20:20:00","parentalRating":"15","HD":"HD"},{"channelNumber":"11","channelName":"MBC","title":"더 쇼 시즌4(12회)(재)","beginDate":"2015-01-21 19:00:00","endDate":"2015-01-21 20:20:00","parentalRating":"15","HD":"HD"},{"channelNumber":"11","channelName":"MBC","title":"나루토 3(10회)","beginDate":"2015-01-21 19:30:00","endDate":"2015-01-21 20:00:00","parentalRating":"15","HD":"HD"},{"channelNumber":"11","channelName":"MBC","title":"전국 TOP10 가요쇼(46회)(재)","beginDate":"2015-01-21 19:00:00","endDate":"2015-01-21 20:00:00","parentalRating":"15","HD":"HD"},{"channelNumber":"11","channelName":"MBC","title":"런닝맨 테마 컬렉션<하이드 지킬, 나 스페셜>(105회)(재)","beginDate":"2015-01-21 18:14:00","endDate":"2015-01-21 20:05:00","parentalRating":"15","HD":"HD"},{"channelNumber":"11","channelName":"MBC","title":"이색요리 S1(5회)","beginDate":"2015-01-21 19:00:00","endDate":"2015-01-21 20:00:00","parentalRating":"15","HD":"HD"},{"channelNumber":"11","channelName":"MBC","title":"펀앤이지 줌바(13회)","beginDate":"2015-01-21 19:55:00","endDate":"2015-01-21 20:25:00","parentalRating":"15","HD":"HD"},{"channelNumber":"11","channelName":"MBC","title":"인간극장 (16회)(재)","beginDate":"2015-01-21 19:35:00","endDate":"2015-01-21 20:15:00","parentalRating":"15","HD":"HD"},{"channelNumber":"11","channelName":"MBC","title":"101 Inventions That Changed The World","beginDate":"2015-01-21 18:00:00","endDate":"2015-01-21 20:00:00","parentalRating":"15","HD":"HD"},{"channelNumber":"11","channelName":"MBC","title":"2014 KLPGA 시청률 BEST7(재)","beginDate":"2015-01-21 19:30:00","endDate":"2015-01-21 21:00:00","parentalRating":"15","HD":"HD"},{"channelNumber":"11","channelName":"MBC","title":"2015 유러피언투어 커머셜뱅크 카타르 마스터스","beginDate":"2015-01-21 17:00:00","endDate":"2015-01-21 20:00:00","parentalRating":"15","HD":"HD"},{"channelNumber":"11","channelName":"MBC","title":"14-15 V리그 남자부","beginDate":"2015-01-21 18:45:00","endDate":"2015-01-21 21:00:00","parentalRating":"15","HD":"HD"},{"channelNumber":"11","channelName":"MBC","title":"2014/2015 여자프로농구","beginDate":"2015-01-21 18:50:00","endDate":"2015-01-21 21:00:00","parentalRating":"15","HD":"HD"},{"channelNumber":"11","channelName":"MBC","title":"14-15 프로농구","beginDate":"2015-01-21 19:00:00","endDate":"2015-01-21 21:00:00","parentalRating":"15","HD":"HD"},{"channelNumber":"11","channelName":"MBC","title":"14-15 프로농구","beginDate":"2015-01-21 18:40:00","endDate":"2015-01-21 21:00:00","parentalRating":"15","HD":"HD"},{"channelNumber":"11","channelName":"MBC","title":"아트 울프의 포토 다이어리(21회)","beginDate":"2015-01-21 19:30:00","endDate":"2015-01-21 20:00:00","parentalRating":"15","HD":"HD"},{"channelNumber":"11","channelName":"MBC","title":"음악은 어떻게 우리를 사로잡는가 (1회)","beginDate":"2015-01-21 19:00:00","endDate":"2015-01-21 20:00:00","parentalRating":"15","HD":"HD"},{"channelNumber":"11","channelName":"MBC","title":"마운틴 스페셜 지구의 정맥 하수도(1회)","beginDate":"2015-01-21 19:00:00","endDate":"2015-01-21 20:00:00","parentalRating":"15","HD":"HD"},{"channelNumber":"11","channelName":"MBC","title":"빌리어즈TV 개국1주년기념 제7회 아시아 3쿠션 당구선수권대회","beginDate":"2015-01-21 18:00:00","endDate":"2015-01-21 20:00:00","parentalRating":"15","HD":"HD"},{"channelNumber":"11","channelName":"MBC","title":"정성을의 헬스 송송송(15회)","beginDate":"2015-01-21 19:00:00","endDate":"2015-01-21 20:00:00","parentalRating":"15","HD":"HD"},{"channelNumber":"11","channelName":"MBC","title":"샤크(125회)","beginDate":"2015-01-21 19:00:00","endDate":"2015-01-21 20:00:00","parentalRating":"15","HD":"HD"},{"channelNumber":"11","channelName":"MBC","title":"시크릿 가든(14회)","beginDate":"2015-01-21 18:40:00","endDate":"2015-01-21 20:00:00","parentalRating":"15","HD":"HD"},{"channelNumber":"11","channelName":"MBC","title":"삼국지(자막본)(15회)","beginDate":"2015-01-21 19:20:00","endDate":"2015-01-21 20:20:00","parentalRating":"15","HD":"HD"},{"channelNumber":"11","channelName":"MBC","title":"감격시대 : 투신의 탄생(15회)","beginDate":"2015-01-21 19:15:00","endDate":"2015-01-21 20:25:00","parentalRating":"15","HD":"HD"},{"channelNumber":"11","channelName":"MBC","title":"별에서 온 그대(15회)","beginDate":"2015-01-21 19:30:00","endDate":"2015-01-21 20:40:00","parentalRating":"15","HD":"HD"},{"channelNumber":"11","channelName":"MBC","title":"전국 TOP10 가요쇼(46회)(재)","beginDate":"2015-01-21 19:00:00","endDate":"2015-01-21 20:00:00","parentalRating":"15","HD":"HD"},{"channelNumber":"11","channelName":"MBC","title":"토크인가요 1부","beginDate":"2015-01-21 19:48:00","endDate":"2015-01-21 20:20:00","parentalRating":"15","HD":"HD"},{"channelNumber":"11","channelName":"MBC","title":"더 쇼 시즌4(12회)(재)","beginDate":"2015-01-21 19:00:00","endDate":"2015-01-21 20:20:00","parentalRating":"15","HD":"HD"},{"channelNumber":"11","channelName":"MBC","title":"KM 쥬크박스 (2015 컴백 예고 가수)(708회)","beginDate":"2015-01-21 19:00:00","endDate":"2015-01-21 20:00:00","parentalRating":"15","HD":"HD"},{"channelNumber":"11","channelName":"MBC","title":"런닝맨 테마 컬렉션<하이드 지킬, 나 스페셜>(105회)(재)","beginDate":"2015-01-21 18:14:00","endDate":"2015-01-21 20:05:00","parentalRating":"15","HD":"HD"},{"channelNumber":"11","channelName":"MBC","title":"이색요리 S1(5회)","beginDate":"2015-01-21 19:00:00","endDate":"2015-01-21 20:00:00","parentalRating":"15","HD":"HD"},{"channelNumber":"11","channelName":"MBC","title":"스위트 룸 시즌2(10회)","beginDate":"2015-01-21 19:20:00","endDate":"2015-01-21 20:15:00","parentalRating":"15","HD":"HD"},{"channelNumber":"11","channelName":"MBC","title":"펀앤이지 줌바(13회)","beginDate":"2015-01-21 19:55:00","endDate":"2015-01-21 20:25:00","parentalRating":"15","HD":"HD"},{"channelNumber":"11","channelName":"MBC","title":"대한맛국(13회)","beginDate":"2015-01-21 19:30:00","endDate":"2015-01-21 20:00:00","parentalRating":"15","HD":"HD"},{"channelNumber":"11","channelName":"MBC","title":"왕의 얼굴(16회)(재)","beginDate":"2015-01-21 19:15:00","endDate":"2015-01-21 20:25:00","parentalRating":"15","HD":"HD"},{"channelNumber":"11","channelName":"MBC","title":"정성을의 헬스 송송송(15회)","beginDate":"2015-01-21 19:00:00","endDate":"2015-01-21 20:00:00","parentalRating":"15","HD":"HD"},{"channelNumber":"11","channelName":"MBC","title":"SafeNews(120회)","beginDate":"2015-01-21 19:00:00","endDate":"2015-01-21 20:00:00","parentalRating":"15","HD":"HD"},{"channelNumber":"11","channelName":"MBC","title":"뮤직짱짱(1481회)","beginDate":"2015-01-21 18:00:00","endDate":"2015-01-21 20:00:00","parentalRating":"15","HD":"HD"},{"channelNumber":"11","channelName":"MBC","title":"천하무적 한자 900(1)","beginDate":"2015-01-21 19:55:00","endDate":"2015-01-21 20:00:00","parentalRating":"15","HD":"HD"},{"channelNumber":"11","channelName":"MBC","title":"신 도라에몽 5(17회)(재)","beginDate":"2015-01-21 19:30:00","endDate":"2015-01-21 20:00:00","parentalRating":"15","HD":"HD"},{"channelNumber":"11","channelName":"MBC","title":"짱구는못말려X파일(14회)(재)","beginDate":"2015-01-21 19:22:00","endDate":"2015-01-21 20:00:00","parentalRating":"15","HD":"HD"},{"channelNumber":"11","channelName":"MBC","title":"나루토 3(10회)","beginDate":"2015-01-21 19:30:00","endDate":"2015-01-21 20:00:00","parentalRating":"15","HD":"HD"},{"channelNumber":"11","channelName":"MBC","title":"페기+캣의 숫자놀이(11회)(재)","beginDate":"2015-01-21 19:40:00","endDate":"2015-01-21 20:10:00","parentalRating":"15","HD":"HD"},{"channelNumber":"11","channelName":"MBC","title":"노래하는 왕자님 진심 LOVE 1000%(2회)","beginDate":"2015-01-21 19:30:00","endDate":"2015-01-21 20:00:00","parentalRating":"15","HD":"HD"},{"channelNumber":"11","channelName":"MBC","title":"클로즈업 기업현장(173회)","beginDate":"2015-01-21 19:35:00","endDate":"2015-01-21 20:00:00","parentalRating":"15","HD":"HD"},{"channelNumber":"11","channelName":"MBC","title":"CTV스페셜 2015 소비트렌드 대전망 및 대응전략 세미나","beginDate":"2015-01-21 19:00:00","endDate":"2015-01-21 20:00:00","parentalRating":"15","HD":"HD"},{"channelNumber":"11","channelName":"MBC","title":"음악은 어떻게 우리를 사로잡는가 (1회)","beginDate":"2015-01-21 19:00:00","endDate":"2015-01-21 20:00:00","parentalRating":"15","HD":"HD"},{"channelNumber":"11","channelName":"MBC","title":"희망특강 36.5(13회)(재)","beginDate":"2015-01-21 19:30:00","endDate":"2015-01-21 20:00:00","parentalRating":"15","HD":"HD"},{"channelNumber":"11","channelName":"MBC","title":"극한 직업(108회)(재)","beginDate":"2015-01-21 19:30:00","endDate":"2015-01-21 20:00:00","parentalRating":"15","HD":"HD"},{"channelNumber":"11","channelName":"MBC","title":"인간극장 (16회)(재)","beginDate":"2015-01-21 19:35:00","endDate":"2015-01-21 20:15:00","parentalRating":"15","HD":"HD"},{"channelNumber":"11","channelName":"MBC","title":"슈퍼사이즈 지구(1회)","beginDate":"2015-01-21 19:25:00","endDate":"2015-01-21 20:20:00","parentalRating":"15","HD":"HD"},{"channelNumber":"11","channelName":"MBC","title":"14-15 V리그 남자부","beginDate":"2015-01-21 18:45:00","endDate":"2015-01-21 21:00:00","parentalRating":"15","HD":"HD"},{"channelNumber":"11","channelName":"MBC","title":"2014/2015 여자프로농구","beginDate":"2015-01-21 18:50:00","endDate":"2015-01-21 21:00:00","parentalRating":"15","HD":"HD"},{"channelNumber":"11","channelName":"MBC","title":"14-15 프로농구","beginDate":"2015-01-21 19:00:00","endDate":"2015-01-21 21:00:00","parentalRating":"15","HD":"HD"},{"channelNumber":"11","channelName":"MBC","title":"2014 KLPGA 시청률 BEST7(재)","beginDate":"2015-01-21 19:30:00","endDate":"2015-01-21 21:00:00","parentalRating":"15","HD":"HD"},{"channelNumber":"11","channelName":"MBC","title":"2015 유러피언투어 커머셜뱅크 카타르 마스터스","beginDate":"2015-01-21 17:00:00","endDate":"2015-01-21 20:00:00","parentalRating":"15","HD":"HD"},{"channelNumber":"11","channelName":"MBC","title":"Australian Open 2015, Presented by KIA Motors","beginDate":"2015-01-21 17:00:00","endDate":"2015-01-21 21:00:00","parentalRating":"15","HD":"HD"},{"channelNumber":"11","channelName":"MBC","title":"2015 SBENU LOL Champions Korea Spring(7회)","beginDate":"2015-01-21 18:00:00","endDate":"2015-01-21 21:10:00","parentalRating":"15","HD":"HD"},{"channelNumber":"11","channelName":"MBC","title":"아트 울프의 포토 다이어리(21회)","beginDate":"2015-01-21 19:30:00","endDate":"2015-01-21 20:00:00","parentalRating":"15","HD":"HD"},{"channelNumber":"11","channelName":"MBC","title":"샤크(125회)","beginDate":"2015-01-21 19:00:00","endDate":"2015-01-21 20:00:00","parentalRating":"15","HD":"HD"},{"channelNumber":"11","channelName":"MBC","title":"부부피싱투어(12회)","beginDate":"2015-01-21 19:30:00","endDate":"2015-01-21 20:00:00","parentalRating":"15","HD":"HD"},{"channelNumber":"11","channelName":"MBC","title":"마운틴 스페셜 지구의 정맥 하수도(1회)","beginDate":"2015-01-21 19:00:00","endDate":"2015-01-21 20:00:00","parentalRating":"15","HD":"HD"},{"channelNumber":"11","channelName":"MBC","title":"해조(1회)","beginDate":"2015-01-21 19:00:00","endDate":"2015-01-21 20:00:00","parentalRating":"15","HD":"HD"},{"channelNumber":"11","channelName":"MBC","title":"믿음의 씨앗 고향교회와 함께(17회)","beginDate":"2015-01-21 19:30:00","endDate":"2015-01-21 20:10:00","parentalRating":"15","HD":"HD"},{"channelNumber":"11","channelName":"MBC","title":"TV 신앙상담 따뜻한 동행 (910회)","beginDate":"2015-01-21 19:20:00","endDate":"2015-01-21 20:00:00","parentalRating":"15","HD":"HD"},{"channelNumber":"11","channelName":"MBC","title":"감격시대 : 투신의 탄생(15회)","beginDate":"2015-01-21 19:15:00","endDate":"2015-01-21 20:25:00","parentalRating":"15","HD":"HD"},{"channelNumber":"11","channelName":"MBC","title":"놀랍지 아니한가(1회)(재)","beginDate":"2015-01-21 19:30:00","endDate":"2015-01-21 20:00:00","parentalRating":"15","HD":"HD"},{"channelNumber":"11","channelName":"MBC","title":"시크릿 가든(14회)","beginDate":"2015-01-21 18:40:00","endDate":"2015-01-21 20:00:00","parentalRating":"15","HD":"HD"},{"channelNumber":"11","channelName":"MBC","title":"짱구는못말려X파일(14회)(재)","beginDate":"2015-01-21 19:22:00","endDate":"2015-01-21 20:00:00","parentalRating":"15","HD":"HD"},{"channelNumber":"11","channelName":"MBC","title":"노래하는 왕자님 진심 LOVE 1000%(2회)","beginDate":"2015-01-21 19:30:00","endDate":"2015-01-21 20:00:00","parentalRating":"15","HD":"HD"},{"channelNumber":"11","channelName":"MBC","title":"페기+캣의 숫자놀이(11회)(재)","beginDate":"2015-01-21 19:40:00","endDate":"2015-01-21 20:10:00","parentalRating":"15","HD":"HD"},{"channelNumber":"11","channelName":"MBC","title":"2015 SBENU LOL Champions Korea Spring(7회)","beginDate":"2015-01-21 18:00:00","endDate":"2015-01-21 21:10:00","parentalRating":"15","HD":"HD"},{"channelNumber":"11","channelName":"MBC","title":"클로즈업 기업현장(173회)","beginDate":"2015-01-21 19:35:00","endDate":"2015-01-21 20:00:00","parentalRating":"15","HD":"HD"},{"channelNumber":"11","channelName":"MBC","title":"바둑리뷰 The Best 시즌2 1부(44회)","beginDate":"2015-01-21 19:40:00","endDate":"2015-01-21 20:30:00","parentalRating":"15","HD":"HD"},{"channelNumber":"11","channelName":"MBC","title":"Gourmet Farmer s1","beginDate":"2015-01-21 19:30:00","endDate":"2015-01-21 20:00:00","parentalRating":"15","HD":"HD"},{"channelNumber":"11","channelName":"MBC","title":"빌리어즈TV 개국1주년기념 제7회 아시아 3쿠션 당구선수권대회","beginDate":"2015-01-21 18:00:00","endDate":"2015-01-21 20:00:00","parentalRating":"15","HD":"HD"},{"channelNumber":"11","channelName":"MBC","title":"도전 수퍼대디(16회)","beginDate":"2015-01-21 19:30:00","endDate":"2015-01-21 20:00:00","parentalRating":"15","HD":"HD"},{"channelNumber":"11","channelName":"MBC","title":"2011 슈퍼시리즈","beginDate":"2015-01-21 19:30:00","endDate":"2015-01-21 20:30:00","parentalRating":"15","HD":"HD"},{"channelNumber":"11","channelName":"MBC","title":"모즈(10회)","beginDate":"2015-01-21 19:00:00","endDate":"2015-01-21 20:00:00","parentalRating":"15","HD":"HD"}]}};

            // setTimeout(function() {
            //     callbackForRequestProgramList(result);
            // }, 1000);
        }

        function callbackForRequestProgramList(result) {
            if(result.programList == null || result.programList == undefined || result.programList.length == 0) {
                programListView.model.setData([]);
            } else {
            	var programList = StructureHelper.createProgramStructure(result).programList;
            	programListView.model.setData(programList);
            }
        }


		function addEventListener() {
			removeEventListener();
			$(resultCategoryListView).bind(CCAEvent.CHANGE_VIEW, resultCategoryListViewChangeViewListener);
			$(resultCategoryListView).bind(CCAEvent.CHANGE_FOCUS_ON_VIEW, resultCategoryListViewChangeFocusListener);
			$(resultCategoryListView).bind(CCAEvent.FINISH_VIEW, resultCategoryListViewFinishViewListener);
			$(posterListView).bind(CCAEvent.CHANGE_VIEWGROUP, changeViewGroupListener);
            $(posterListView).bind(CCAEvent.CHANGE_FOCUS_ON_VIEW, updateSubViewHistory);
            $(posterListView).bind(CCAEvent.CHANGE_VIEW, subViewChangeViewListener);
			$(posterListView).bind(CCAEvent.FINISH_VIEW, subViewFinishViewListener);


            $(textListView).bind(CCAEvent.CHANGE_VIEWGROUP, changeViewGroupListener);
            $(textListView).bind(CCAEvent.CHANGE_FOCUS_ON_VIEW, updateSubViewHistory);
            $(textListView).bind(CCAEvent.CHANGE_VIEW, subViewChangeViewListener);
            $(textListView).bind(CCAEvent.FINISH_VIEW, subViewFinishViewListener);
            $(programListView).bind(CCAEvent.CHANGE_FOCUS_ON_VIEW, updateSubViewHistory);
			$(programListView).bind(CCAEvent.CHANGE_VIEW, subViewChangeViewListener);
            $(programListView).bind(CCAEvent.FINISH_VIEW, subViewFinishViewListener);
        }

        function addCompleteToDrawEventListener() {
            $(posterListView).bind(CCAEvent.COMPLETE_TO_DRAW_VIEW, sendCompleteDrawEvent);
            $(programListView).bind(CCAEvent.COMPLETE_TO_DRAW_VIEW, sendCompleteDrawEvent);
            $(noDataView).bind(CCAEvent.COMPLETE_TO_DRAW_VIEW, sendCompleteDrawEvent);
        }

		function removeEventListener() {
			$(resultCategoryListView).unbind();
		}

        function sendCompleteDrawEvent() {
            _this.sendEvent(CCAEvent.COMPLETE_TO_DRAW_VIEW);
        }

		function resultCategoryListViewChangeFocusListener(event, param) {
            startSubView(SessionHistoryHelper.mergeParameter(param, subViewParam));
            updateResultCategoryViewHistory();
            if(subViewParam) {
                //function
                activateSubview();
                subViewParam = null;
            }
		}

        function startSubView(param) {
            //closeSubView();
            var previousViewContainer = null;
            if(currentSubView != null) {
                previousViewContainer = currentSubView.drawer.getContainer();
            }

            switch(param.resultCategory.jsonObject.viewerType) {
                case ViewerType.CONTENTGROUP_LIST:
                    currentSubView = posterListView;
                    break;
                case ViewerType.PROGRAM_LIST:
                    currentSubView = programListView;
                    break;
                default:
                    break;
            }
            currentSubView.onStart(param);
            coinBalanceView.onUpdate();
            bindHideViewAfterCompleteDrawEvent(previousViewContainer, currentSubView.drawer.getContainer(), currentSubView);

        }

        function bindHideViewAfterCompleteDrawEvent(previousViewContainer, nextViewContainer, currentSubView) {
            if(previousViewContainer != null) {
                DrawerHelper.stopPreviousSubViewAfterCompleteDrawEvent(previousViewContainer, nextViewContainer, currentSubView);
            }
        }


        function activateSubview() {
            if(currentSubView != null) {
                resultCategoryListView.onDeActive();
                currentSubView.onActive();
                pushSubViewHistory();
            }
        }

        function closeSubView() {
			if (currentSubView) {
				currentSubView.onStop();
			}
		}

		function subViewChangeViewListener(event, param) {
            currentSubView.onDeActive();
            var previousViewContainer = null;
            if(currentSubView != null) {
                previousViewContainer = currentSubView.drawer.getContainer();
            }

			if(param.targetView == DefineView.NO_DATA_VIEW) {
				currentSubView = noDataView;
            } else if(param.targetView == DefineView.TEXT_LIST_VIEW) {
                currentSubView = textListView;
            } else if (param.targetView == DefineView.POSTER_LIST_VIEW) {
                currentSubView = posterListView;
			}
            currentSubView.onStart(param);
            currentSubView.onActive();

            if(currentSubView == noDataView) {
                resultCategoryListView.onActive();
            }

            bindHideViewAfterCompleteDrawEvent(previousViewContainer, currentSubView.drawer.getContainer(), currentSubView);
		}

		function changeViewGroupListener(event, param) {
			_this.sendEvent(event, param);
		}

		function resultCategoryListViewChangeViewListener(event, param) {
			if(currentSubView == noDataView) {
				//noop
			} else if(currentSubView != null) {
                activateSubview();
			}
		}

		function subViewFinishViewListener(event, param) {
			currentSubView.onDeActive();
            if(currentSubView != noDataView) {
                popHistory();
            }

			resultCategoryListView.onActive();
		}

		function resultCategoryListViewFinishViewListener(event, param) {
            popHistory();
            CSSHandler.sendHistoryToSettopBox();
			_this.sendEvent(CCAEvent.FINISH_VIEWGROUP);
		}

        this.onInit();
	};
	SearchResultViewGroupManager.prototype = Object.create(ViewGroup.prototype);
//  SearchResultViewGroupManager.prototype = new ViewGroup();


    return SearchResultViewGroupManager;
});
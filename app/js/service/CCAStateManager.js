define(['cca/DefineView'], function(DefineView) {
	var CCAStateManager = {};
	var localRepository = new Array();
	var playInfo = null;
	var isPlayVOD = false;
	var isShowEOSExitPopup = false;

	CCAStateManager.pushHistory = function (history) {
		localRepository.push({'history':history});
		//console.log('pushHistory')
	}

	CCAStateManager.popHistory = function () {

		//console.log(localRepository)
		return localRepository.pop();
	}

	CCAStateManager.updateHistory = function (history) {
		this.popHistory();
		this.pushHistory(history);
	}

	CCAStateManager.printAllHistory = function () {
		console.log(localRepository);
	}

	CCAStateManager.getAllHistory = function () {
		var temp = new Array();
		for(var i = 0; i < localRepository.length; i++) {
			temp[i] = localRepository[i].history;
		}
		return temp;
	}

    CCAStateManager.getLastUiDomainComponentEntryContext = function () {
        var lastUiDomainComponentEntryContext = null;
        for(var i = localRepository.length-1; i >= 0; i--) {
            var entryContext = JSON.parse(localRepository[i].history.entryContext);
            if(entryContext
                && entryContext.uiDomainID != undefined && entryContext.uiDomainID != null
                && entryContext.uiComponentID != undefined && entryContext.uiComponentID != null) {
                lastUiDomainComponentEntryContext = entryContext;
                break;
            }
        }
        return lastUiDomainComponentEntryContext;
    }

    CCAStateManager.isEpisodePeerContentPurchase = function () {
        var isEpisodePeerContentPurchase = false;
        for(var i = localRepository.length-1; i >= 0; i--) {
            var history = localRepository[i].history;
            var entryDomain = history.entryDomain;
            if(entryDomain == "DetailViewGroupManager") {
                if(history.entryContext) {
                    var entryContext = JSON.parse(history.entryContext);
                    if(entryContext.episodePeer) {
                        isEpisodePeerContentPurchase = true;
                    }
                }
                break;
            }
        }
        console.log("isEpisodePeerContentPurchase="+isEpisodePeerContentPurchase);
        return isEpisodePeerContentPurchase;
    }


	CCAStateManager.clearHistory = function () {
		localRepository = new Array();
	}

	CCAStateManager.setRestoreRepository = function (data) {
		CCAStateManager.clearHistory();
		if(data.historyList != null && data.historyList.history != null) {
			if(data.historyList.history instanceof Array && data.historyList.history.length > 0) {
				var historyList = data.historyList.history;
				for(var i = 0; i < historyList.length; i++) {
					var temp = {};
					temp.entryDomain = historyList[i].entryDomain;
					temp.entryPointID = historyList[i].entryPointID;
					//temp.entryContext = JSON.parse(historyList[i].entryContext);
					temp.entryContext = historyList[i].entryContext;
					//localRepository[i] = {'history':temp};
					localRepository.unshift({'history':temp});
				}
			} else {
				var history = data.historyList.history;
				var temp = {};
				temp.entryDomain = history.entryDomain;
				temp.entryPointID = history.entryPointID;
				//temp.entryContext = JSON.parse(history.entryContext);
				temp.entryContext = history.entryContext;
				localRepository.push({'history':temp});
			}
		}
		//console.log(localRepository)
	}
	CCAStateManager.hasRestoreData = function () {
		return localRepository != null && localRepository.length > 0;
	}
	CCAStateManager.makeCleanForClosePlayPopup = function () {
		var tempRespository = new Array();
		for(var i = 0; i < localRepository.length; i++) {
			var history = localRepository[i].history;
			if(isEXITPlayPopup(history)) {
				break;
			} else {
				tempRespository.push({'history':history});
			}
		}
		localRepository = tempRespository;
	}
	CCAStateManager.makeCleanForStartPlay = function () {
		var tempRespository = new Array();

		var max = localRepository.length;
		for(var i = 0; i < max; i++) {
			var history = localRepository.pop().history;
			if(isEXITPlayPopup(history)) {
				break;
			} else {
				tempRespository.unshift({'history':history});
			}
		}
		localRepository = tempRespository;
	}

	function isEXITPlayPopup(history) {
		return (history.entryDomain == DefineView.PLAYER_VIEWGROUP_MANAGER && history.entryPointID == DefineView.CLOSE_PLAYER_VIEW) ||
			(history.entryDomain == DefineView.PLAYER_VIEWGROUP_MANAGER && history.entryPointID == DefineView.NEXT_WATCH_POPUP_VIEW);
	}

	CCAStateManager.hasEXITPopup = function () {
		for(var i = 0; i < localRepository.length; i++) {
			var history = localRepository[i].history;
			if(isEXITPlayPopup(history)) {
				return true;
			}
		}
		return false;
	}

	CCAStateManager.setPlay =function (isPlay) {
		isPlayVOD = isPlay;
	}

	CCAStateManager.isPlay =function () {
		return isPlayVOD;
	}

	CCAStateManager.setShowEOSPopup = function (showEOSPopup) {
		isShowEOSExitPopup = showEOSPopup;
	}

	CCAStateManager.isShowEOSPopup = function () {
		return isShowEOSExitPopup;
	}

	return CCAStateManager;
});
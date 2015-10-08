define(["service/STBInfoManager", "service/Communicator", "cca/model/Category"], function(STBInfoManager, Communicator, Category) {

	var CategoryManager = {};

	var categoryTree = new Array();

	var callBackForGetCategoryList = null;
	var requestCategoryID = "";

	CategoryManager.cleanCategory = function () {
		categoryTree = new Array();
	}

	CategoryManager.getCategoryForJump = function(categoryID, _callBackForGetCategoryList) {
		requestCategoryID = categoryID;
		callBackForGetCategoryList = _callBackForGetCategoryList;
		requestCategoryList(categoryID, callBackForRequestCategoryListForJump);

	}

	CategoryManager.getRootCategory = function(categoryID) {
		var categoryProfile = "1";
		var depth = 1;
		return Communicator.requestCategorySync(categoryProfile, categoryID, depth);
	}


	CategoryManager.getCategory = function(_currentCategoryID, _callBackForGetCategoryList) {
		var targetCategory = getTargetCategory(_currentCategoryID);
		if(needRequestCategory(targetCategory)) {
			requestCategoryID = _currentCategoryID;
			callBackForGetCategoryList = _callBackForGetCategoryList;

			requestCategoryList(_currentCategoryID, callBackForRequestCategoryList);
		} else {
			_callBackForGetCategoryList(targetCategory);
		}
	}

	function needRequestCategory(category) {
		if(category != null) {
			if(category.isLeafCategory()) {
				return false;
			} else if(hasSubCategory(category)) {
				return false;
			} else  {
				return true;
			}
		} else {
			return true;
		}
	}

	function getTargetCategory(currentCategoryID) {
		var targetCategory = null;
		if(categoryTree.length > 0) {
			targetCategory = findCategory(currentCategoryID, categoryTree);
		}

		return targetCategory;
	}

	function requestCategoryList(currentCategoryID, callBack) {
		var categoryProfile = "4";
		var depth = 2;
		Communicator.requestCategoryList(categoryProfile, currentCategoryID, depth, callBack);
	}

	function callBackForRequestCategoryListForJump(response) {
		if(Communicator.isSuccessResponseFromHAS(response)) {
			var categoryList = response.categoryList;

			var currentCategory = categoryList[0];
			if(hasParentCategory(currentCategory)) {
				requestCategoryList(currentCategory.getParentCategoryID(), callBackForRequestParentCategory);
			} else {
				var targetCategory = getTargetCategoryAndSetRootCategoryByCategoryList(categoryList);
				callBackForGetCategoryList(targetCategory);
			}
		} else {
			callBackForGetCategoryList(null);
		}
	}

	function callBackForRequestParentCategory(response) {
		if(Communicator.isSuccessResponseFromHAS(response)) {
			var categoryList = response.categoryList;
			var targetCategory = getTargetCategoryAndSetRootCategoryByCategoryList(categoryList);
			callBackForGetCategoryList(targetCategory);
		} else {
			callBackForGetCategoryList(null);
		}
	}

	function getTargetCategoryAndSetRootCategoryByCategoryList(categoryList) {
		var targetCategory = categoryList[0];
		setRootCategory(targetCategory);
		targetCategory.setSubCategoryList(filteringCategoryList(targetCategory.getCategoryID(), categoryList));
		return targetCategory;
	}

	function getTargetCategoryAndSetRootCategory(requestCategoryID, currentCategory){
		var targetCategory = getTargetCategory(requestCategoryID);
		if (targetCategory == null) {
			targetCategory = currentCategory;
			setRootCategory(targetCategory);
		}
		return targetCategory;
	}

	function callBackForRequestCategoryList(response) {
		var targetCategory = null;

		if(Communicator.isSuccessResponseFromHAS(response) && isRequestCategory(response.categoryList[0])) {
			var currentCategory = response.categoryList[0];
			if(isLinkCategory(currentCategory)) {
				targetCategory = getTargetCategoryAndSetRootCategory(requestCategoryID, currentCategory);
				var linkCategoryID = currentCategory.getLinkInterfaceId();
				requestLinkCategoryList(linkCategoryID);
			} else {
				targetCategory = getTargetCategoryAndSetRootCategory(requestCategoryID, currentCategory);
				targetCategory.setSubCategoryList(filteringCategoryList(targetCategory.getCategoryID(), response.categoryList));
				callBackForGetCategoryList(targetCategory);
			}
		} else {
			callBackForGetCategoryList(targetCategory);
		}
	}

	function isLinkCategory(category) {
		return category.getLinkInterfaceId().length > 0;
	}


	function requestLinkCategoryList(linkCategoryID) {
		var categoryProfile = "4";
		var depth = 2;
		Communicator.requestLinkCategoryList(categoryProfile, linkCategoryID, depth, callBackForRequestLinkCategoryList);
	}

	function callBackForRequestLinkCategoryList(response) {
		var targetCategory = null;
		var categoryList = response.categoryList;
		if(categoryList != null) {
			targetCategory = getTargetCategoryAndSetRootCategory(requestCategoryID, categoryList[0]);
			targetCategory.setSubCategoryList(filteringCategoryList(categoryList[0].getCategoryID(), categoryList));
		}
		callBackForGetCategoryList(targetCategory);
	}

	function filteringCategoryList(filteringCategoryID, categoryList) {
		var newCategoryList = new Array();
		categoryList =filteringAdultCategory(categoryList)

		var max = categoryList.length;
		for(var i = 0; i < max; i++) {
			var category = categoryList[i];
			if(category.getCategoryID() != filteringCategoryID) {
				newCategoryList.push(category);
			}
		}

		return newCategoryList;
	}


	function setRootCategory(targetCategory) {
		categoryTree.push(targetCategory);
	}

	//@ Async 로 동작함으로 요청이 여러번 들어가여 요청한 categoryID와 결과 리스트가 다를 수 있어 방어함
	function isRequestCategory(category) {
		return requestCategoryID == category.getCategoryID();
	}
	function findCategory(categoryID, categoryList) {
		var category = null;
		for(var i = 0; i < categoryList.length; i++) {
			if(categoryList[i].getCategoryID() == categoryID) {
				category = categoryList[i];
				break;
			} else if(hasSubCategory(categoryList[i])) {
				category = findCategory(categoryID, categoryList[i].getSubCategoryList());
				if(category) {
					break;
				}
			}
		}
		return category;
	}

	function hasSubCategory(category) {
		return category.getSubCategoryList() != null;
	}


	function hasParentCategory(category) {
		var parentCategoryID = category.getParentCategoryID();
		return parentCategoryID != '0' && parentCategoryID != '-1'
	}

	function filteringAdultCategory(categoryList) {
		var filteredCategoryList = new Array();

		if(STBInfoManager.getAdultMenuSetting() == 2 && categoryList != null) {
			for(var i = 0; i < categoryList.length; i++) {
				if(!categoryList[i].isAdultCategory()) {
					filteredCategoryList.push(categoryList[i]);
				}
			}
		} else {
			filteredCategoryList = categoryList;
		}
		return filteredCategoryList;
	}

	return CategoryManager;
});
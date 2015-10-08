/**
 * element 를 조작 하거나 그리는 부분이 중복되는 경우 사용
 */
define(["helper/UIHelper", "helper/DateHelper", "framework/event/CCAEvent"], function(UIHelper, DateHelper, CCAEvent) {
	var DrawerHelper = {};
	var targetOfCompleteDrawEvent = null;
	DrawerHelper.drawReviewRating = function(assetInfo, reviewRatingTextElement, reviewRatingStartElement) {

	};


    DrawerHelper.drawScroll = function() {

	};

	//@고민... 같은뷰그룹으로 이동할때는 이미 start 되어 show 가 되어있는중이라 hide 나 stop 을하면 망함...
	DrawerHelper.hidePreviousViewAfterCompleteDrawEvent = function(previousView, nextView) {
		$(nextView).unbind(CCAEvent.COMPLETE_TO_DRAW_VIEW);
		$(nextView).bind(CCAEvent.COMPLETE_TO_DRAW_VIEW, function() {
			$(nextView).unbind(CCAEvent.COMPLETE_TO_DRAW_VIEW);
			if(previousView.constructor == Array) {
				for(var i = 0; i < previousView.length; i++) {
					previousView[i].onHide();
				}
			} else {
				previousView.onHide();
			}
		});
	}

	DrawerHelper.stopPreviousViewAfterCompleteDrawEvent = function(previousView, nextView) {
		$(nextView).unbind(CCAEvent.COMPLETE_TO_DRAW_VIEW);
		$(nextView).bind(CCAEvent.COMPLETE_TO_DRAW_VIEW, function() {
			$(nextView).unbind(CCAEvent.COMPLETE_TO_DRAW_VIEW);
			if(previousView.constructor == Array) {
				for(var i = 0; i < previousView.length; i++) {
					previousView[i].onStop();
				}
			} else {
				previousView.onStop();
			}
		});
	}

	DrawerHelper.stopPreviousSubViewAfterCompleteDrawEvent = function(previousViewContainer, nextViewContainer, nextView) {
		targetOfCompleteDrawEvent = nextView;

		$(nextView).unbind(CCAEvent.COMPLETE_TO_DRAW_VIEW);
		$(nextView).bind(CCAEvent.COMPLETE_TO_DRAW_VIEW, function() {
			$(nextView).unbind(CCAEvent.COMPLETE_TO_DRAW_VIEW);
			//@Comment 셀렉트된 element 를 비교연산자로 비교할수 없음. get을 이용하면 비교가능
			if(previousViewContainer.get(0) != nextViewContainer.get(0)) {

				previousViewContainer.hide();
				previousViewContainer.html("");

				//@Comment 방어코드
				if(nextViewContainer.css("display") == "none") {
					nextViewContainer.show();
				}
			} else {
				//@Comment 방어코드
				var parentElement = nextViewContainer.parent();
				if(isFirstSubContainer(nextViewContainer)) {
					var target = parentElement.find('.container2');
				} else {
					var target = parentElement.find('.container1');
				}
				target.hide();
				target.html("");
			}
		});
	}


	DrawerHelper.getEmptySubViewContainer = function(subviewAreaString) {
		var container1 = $(subviewAreaString + '.container1');
		var container2 = $(subviewAreaString + '.container2');
		if(container1.children().size() > 0) {
			return container2;
		} else {
			return container1;
		}
	}

	DrawerHelper.cleanSubViewArea = function() {
		var subView_1 = $(".bg_right .subViewArea.container1");
		var subView_2 = $(".bg_right .subViewArea.container2");
		subView_1.html("");
		subView_1.hide();
		subView_2.html("");
		subView_2.hide();

		if(targetOfCompleteDrawEvent != null) {
			$(targetOfCompleteDrawEvent).unbind(CCAEvent.COMPLETE_TO_DRAW_VIEW);
		}
	}

	function isFirstSubContainer(container) {
		return container.hasClass("container1");
	}


	function getEveryItems(_this) {
			return _this.myRootElement.find('.list_group01 .list');
	};

	function getArrow (_this) {
		return _this.myRootElement.find('.area_page .arw');
	}

	function getFocusIndexItem(_this) {
		var vIndex = _this.model.getVIndex();

		return getEveryItems(_this).eq(vIndex);
	};

	DrawerHelper.drawFocus = function (_this) {
		DrawerHelper.drawUnfocus(_this);
		getFocusIndexItem(_this).addClass('focus');

		var arrow = getArrow(_this);
		arrow.addClass('focus');
	};
	DrawerHelper.drawUnfocus = function(_this) {
		var everyList = getEveryItems(_this);
		everyList.removeClass('dima');
		everyList.removeClass('focus');
		everyList.addClass('unfocus');
	};
	DrawerHelper.drawDim = function(_this) {
		var everyList = getEveryItems(_this);
		everyList.removeClass('focus');
		everyList.removeClass('unfocus');
		everyList.addClass('dima');

		var arrow = getArrow(_this);
		arrow.removeClass('focus');
	};

	DrawerHelper.setLoadTimer = function(imageList) {
		var max = imageList.length;
		var count = 0;
		for(var i = 0; i < max; i++) {
			var imageElement = $(imageList[i]);
			imageElement.hide();
			imageElement.load(function() {
				count += 1;
				if(max === count) {
					clearTimeout(timerForShowImageList);
					showImageList(imageList);
				}
			});
		}
		setShowTimer(imageList);
	}

	function setShowTimer(imageList) {
		clearTimeout(timerForShowImageList);
		timerForShowImageList = setTimeout(function() {
			showImageList(imageList);
		}, ONE_SECOND);
	}

	function showImageList(imageList) {
		if(timerForShowImageList != null) {
			var max = imageList.length;
			for(var i = 0; i < max; i++) {
				$(imageList[i]).show();
			}
			timerForShowImageList = null;
		}
	}

	var timerForShowImageList = null;
	var ONE_SECOND = 1000;
	return DrawerHelper;
});

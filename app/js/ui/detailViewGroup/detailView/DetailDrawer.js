define(["framework/Drawer", "ui/detailViewGroup/detailView/DetailModel", "helper/DateHelper", "helper/UIHelper"], function (Drawer, Model, DateHelper, UIHelper) {
	var DetailDrawer = function(_id, _model) {
		Drawer.call(this, _id, _model);
		this.templateList = {'layout': new EJS({url: 'js/ui/detailViewGroup/detailView/LayoutTemplate.ejs'})};
		var _this = this;

		DetailDrawer.prototype.onCreateLayout = function() {
			//@같은 컨테이너를 공유하도록 처리
			this.createContainer("detailGroup");
			if(!hasLayout()) {
				var result = this.templateList['layout'].render({model:this.model, 'DateHelper':DateHelper, 'UIHelper' : UIHelper});
				this.getContainer().html(result);
			}
			var pagerTimer = setInterval(function() {
				if($('.synopsis .story')[0] == null) {
					clearInterval(pagerTimer);
				} else {
					if($('.synopsis .story')[0].scrollHeight > 0) {
						drawSynopsisPager();
						drawSynopsisPadding();
						clearInterval(pagerTimer);
					}
				}
			}, 50);

			if(this.model.getEpisodePeer() == null || this.model.isFirstTimeDraw()) {
				this.timerContainer = $('#detailGroup');
			} else {
				this.timerContainer = $('#detailTemplateArea');
			}
		};

		DetailDrawer.prototype.onPaint = function() {
			if(hasLayout() == true) {
				setButtonElement();
				setDataOnElement();	
			}
		};

		DetailDrawer.prototype.onAfterPaint = function() {
			if(hasLayout() == true) {
				drawButton();
				//drawInputField();
				drawSynopsis();	
			}
		};

		function isMODAsset() {
			return UIHelper.isMODAsset(_this.model.getCurrentAsset());
		}

		function setDataOnElement() {
			var asset = _this.model.getCurrentAsset();
			if(asset != null) {
				if(UIHelper.isMODProvider(_this.model.getCurrentAsset())) {
					hideElementForMOD();
					drawRatingIconForMOD();
					drawViewablePeriodForMOD();
				} else {
					drawGenre();
					drawDirector();
					drawActor();
					drawReleaseDate();
				}
				drawGenre();
				drawPrice();
				drawRatingIcon();
				drawPoster();
				drawTitle();
				drawReviewRating();
				if($('.synopsis .story').text() != _this.model.getCurrentAsset().getSynopsis()) {
					drawSynopsisText();
				}
				
			}
		}

		function hideElementForMOD() {
			$('#detail_view_full .mini_tit.letter_space12.position_5').hide();
			$('#detail_view_full .mini_tit.position_9').hide();
			$('#detail_view_full .content.position_2 .icon.date').hide();
			$('#detail_view_full .content_info').hide();
		}

		function drawPoster() {
			$('#detail_view_full .main_poster img').attr('src', _this.model.getCurrentAsset().getImageFileName());

            var focusedButton = _this.model.getButtonGroup().getFocusedButton();
            if(focusedButton == null
                || focusedButton.getLabel() == CCABase.StringSources.ButtonLabel.PURCHASE_HD
                || focusedButton.getLabel() == CCABase.StringSources.ButtonLabel.PURCHASE_SD
                || focusedButton.getLabel() == CCABase.StringSources.ButtonLabel.PLAY_HD
                || focusedButton.getLabel() == CCABase.StringSources.ButtonLabel.PLAY_SD) {

                $('#detail_view_full .main_poster .ribbon').removeClass().addClass('ribbon').addClass(UIHelper.getPosterRibbonNameForDetailView(_this.model.getCurrentAsset()));

            } else {
                $('#detail_view_full .main_poster .ribbon').removeClass().addClass('ribbon');
            }

		}

		function drawTitle() {
			var titleText = "";
			if(_this.model.getContentGroup() != null) {
				titleText = _this.model.getContentGroup().getTitle();
			}  else {
				titleText = _this.model.getCurrentAsset().getTitle();
			}

			$('#detail_view_full .vod_tit').html(titleText);
		}

		function drawReviewRating() {
			var reviewRating = _this.model.getCurrentAsset().getReviewRating();
			for(var i = 0; i < 5; i++) {
				var className = 'unfocus';
				if (reviewRating >= (i + 1)) {
					className = 'focus';
				} else if (reviewRating >= i + 0.5) {
					className = 'half';
				}
				//$('#detail_view_full .grade .star').removeClass('unfocus');
				$('#detail_view_full .grade .star').eq(i).attr('class', 'star ' + className);
			}
		}

		function drawGenre() {
			if(!UIHelper.isMODProvider(_this.model.getCurrentAsset())) {
				var asset = _this.model.getCurrentAsset();
				var genre = asset.getGenre();
				var runningTime = DateHelper.getMinuteByRunningTime(asset.getRunningTime());

				$('#detail_view_full .content_info').eq(0).text(genre + ' • ' + runningTime + '분 • ');	
			}
		}

		function drawRatingIcon() {
			var rating = UIHelper.getNormalizationRating(_this.model.getCurrentAsset().getRating());
			var ratingIconClassName = "a" + rating;
			ratingIconClassName = (ratingIconClassName == 'a0') ? 'all' : ratingIconClassName;
			$('#detail_view_full .content.position_2 .icon').eq(0).addClass(ratingIconClassName);
		}

		function drawRatingIconForMOD() {
			$('#detail_view_full .mini_tit.letter_space12.position_1').html('시청연령').removeClass("letter_space12");
		}

		function drawViewablePeriodForMOD() {
			var asset = _this.model.getCurrentAsset();
			var product = UIHelper.getDisplayProduct(asset.getProductList());

			$('#detail_view_full .mini_tit.letter_space12.position_3').html('제공기간').removeClass("letter_space12");

			var viewableDateText = UIHelper.getDisplayViewablePeriod(asset, product).replace(/-/gi, '.');
			console.log("viewableDateText:"+viewableDateText);
			$('#detail_view_full .content.position_4').removeClass('position_4').addClass('position_4_a').html(viewableDateText);
		}

		function drawReleaseDate() {
			var point = $('#detail_view_full .content.position_2 .content_info').eq(1)
			var icon = $('#detail_view_full .content.position_2 .icon.date');
			var dateText = $('#detail_view_full .content.position_2 .content_info').eq(2);
			if(_this.model.getEpisodePeer() && _this.model.getEpisodePeer().getReleaseDate().length > 0) {
				var releaseDate = DateHelper.getReleaseDate(_this.model.getEpisodePeer().getReleaseDate());
				// $('#detail_view_full .content.position_2 .icon_date').text(' • ' + releaseDate);
				dateText.text(releaseDate);
				point.show();
				icon.show();
				dateText.show();
			} else {
				point.hide();
				icon.hide();
				dateText.hide();
			}
		}

		function drawDirector() {
			var director = _this.model.getCurrentAsset().getDirector();
			$('#detail_view_full .content.position_4').text(director);
		}

		function drawActor() {
			var actor = _this.model.getCurrentAsset().getStarring();
			$('#detail_view_full .content.position_6').text(actor);
		}

		function drawPrice() {
			var label = _this.model.getButtonGroup().getFocusedButton().getLabel();
			var asset = _this.model.getCurrentAsset();
			var contentTypeIconClassName = "";
			var product = UIHelper.getDisplayProduct(asset.getProductList());
			var priceText = UIHelper.getDisplayPrice(product);

			if(CCABase.StringSources.ButtonLabel.PURCHASE_HD == label || CCABase.StringSources.ButtonLabel.PLAY_HD == label) {
				contentTypeIconClassName = "hd";
			} else if(CCABase.StringSources.ButtonLabel.PURCHASE_SD == label || CCABase.StringSources.ButtonLabel.PLAY_SD == label) {
				contentTypeIconClassName = "sd";
			} else if(CCABase.StringSources.ButtonLabel.PREVIEW == label || CCABase.StringSources.ButtonLabel.TRAILER == label) {
				contentTypeIconClassName = "free_2";
				priceText = CCABase.StringSources.freeVODPrice;
			}

			// mock for test product.jsonObject.listPrice = 100000;
			// console.log(product.getListPrice(), product.getPrice());
			var price = $('#detail_view_full .content.position_8 .price');
			var price2 = $('#detail_view_full .content.position_8 .price2');
			if(product.getListPrice() > product.getPrice() && UIHelper.isPurchasedProduct(product) == false && priceText != CCABase.StringSources.freeVODPrice) {
				price.hide();
				price2.show();
				var listPriceText = UIHelper.addThousandSeparatorCommas(product.getListPrice()) + "원";
				price2.find('.before').text(listPriceText);
				price2.find('.after').text(priceText)
			} else {
				price.show();
				price.text(priceText);
				price2.hide();
			}

			if(UIHelper.isMODProvider(_this.model.getCurrentAsset()) == false) {
				drawViewableDate(asset, product)
				drawContentTypeIcon(contentTypeIconClassName);
			} else {
				$('#detail_view_full .content.position_8 .icon').hide();
			}

		}

		function drawViewableDate (asset, product) {
			var viewableDateText = UIHelper.getDisplayViewablePeriod(asset, product)
			$('#detail_view_full .content.position_10').text(viewableDateText);
		}

		function drawContentTypeIcon(contentTypeIconClassName) {
			var contentTypeIcon = $('#detail_view_full .content.position_8 .icon');
			contentTypeIcon.removeClass('hd');
			contentTypeIcon.removeClass('sd');
			contentTypeIcon.removeClass('free_2');
			contentTypeIcon.addClass(contentTypeIconClassName);
		}

		function drawSynopsisText() {
			$('#detail_view_full .synopsis .story').text(_this.model.getCurrentAsset().getSynopsis());
			// $('#detail_view_full .synopsis .story').html("If your collection size is very large and your app has a lot of traffic, it is recommended to use the anchor method. You pass it the number of items to be shown per page, and the anchor id. If you are requesting for the first page, you don't have to specify the anchor id. You will get the anchorId in the response of the first page, if there are more pages; which can then be used to request for the next page.    If your collection size is very large and your app has a lot of traffic, it is recommended to use the anchor method. You pass it the page.    If your collection size is very large and your app has a lot of traffic, it is recommended to use the anchor method. You pass it the number of items to be shown per page, and the anchor id. If you are requesting for the first page, you don't have to specify the anchor id. You will get the anchorId in the response of the first page, if there are more pages; which can then be used to request for the next page.");
		}

		function drawSynopsisPadding () {
			var pageSize = getSynopsisSize();
			var lineHeight = 19;
			var width = 600;
			var synopsisElement = $('.synopsis .story')[0];
			var scrollHeight = synopsisElement.scrollHeight;
			var paddingHeight = pageSize * 57 - scrollHeight;
			//synopsisElement.innerHTML += '<div style="width:' + width + 'px; height:' + paddingHeight + 'px;"></div>';
			$('.synopsis .story').append($("<div>").css("width", width).css("height", paddingHeight));
		}

		//@Comment episodepeer를 그릴경우 해당 view 에서 layout 을 그리게 됨으로 layout 이 존재한다.
		function hasLayout() {
			return $('#detail_view_full .detailTemplateArea')[0] != null ? true: false;
		}

		function setButtonElement() {
			var buttonGroup = _this.model.getButtonGroup();
			if(buttonGroup != null) {
				var buttonElementList = $('#detail_view_full .vod_detail_info .button >');
				buttonElementList.hide();

				var size = buttonGroup.getSize();
				for (var i = 0; i < size; i++) {
					var button = buttonGroup.getButton(i);
					button.setElement(buttonElementList.eq(i));
					button.getElement().text(button.getLabel());
					button.getElement().show();
				}
			}
		};

		function drawButton() {
			var buttonGroup = _this.model.getButtonGroup();
			if(buttonGroup != null) {
				for(var i = 0; i < buttonGroup.getSize(); i++) {
					if (buttonGroup.getButton(i).isActive()) {
						buttonGroup.getButton(i).onActive();
					} else {
						buttonGroup.getButton(i).onDeActive();
					}
					buttonGroup.getButton(i).setUnFocus();
				}

				if(_this.isActive() && !isSynopsisState()) {
					buttonGroup.getFocusedButton().setFocus();
				}
			}
		}


		function drawSynopsis() {
			drawSynopsisPager()
			drawSynopsisFocus();
			drawSynopsisScroll();
		}

		function drawSynopsisPager() {
			var pageSize = getSynopsisSize();
			$('.page_synop').html('');
			for(var i =0; i < pageSize; i++) {
				var dot = $('<li class="dot unfocus"></li>');
				$('.page_synop').append(dot)
			}
			// $('.synopsis .story')[0];
			// var padding = (_this.model.getHIndex() == pageSize - 1) ? pageSize * 57 - synopsisElement.scrollHeight : 0;
			// $(synopsisElement).css('paddingBottom', padding + 'px');
			// if(_this.model.getHIndex() == pageSize - 1) console.log(padding);

			drawSynopsisPagerFocus();
		}

		function getSynopsisSize() {
			var synopsisElement = $('.synopsis .story')[0];
			var pageSize = Math.ceil(synopsisElement.scrollHeight / 57);
			//@ 미니멈값
			if(pageSize == 0 ) {
				pageSize = 1;
			}
			_this.model.setHVisibleSize(pageSize);
			_this.model.setHMax(pageSize);
			return pageSize;
		}

		function drawSynopsisPagerFocus() {
			var dot  		= $('.page_synop > .dot').eq(_this.model.getHIndex());
			var arrowLeft	= $('.synopsis .arr_left');
			var arrowRight	= $('.synopsis .arr_right');

			dot.removeClass('unfocus');
			dot.addClass('focus');
			if(getSynopsisSize() <= 1) {
				arrowRight.removeClass('unfocus');
				arrowRight.removeClass('focus');
				arrowLeft.removeClass('unfocus');
				arrowLeft.removeClass('focus');
			} else {
				if(isSynopsisState() && _this.isActive()) {
					if(_this.model.getHIndex() < _this.model.getHVisibleSize() - 1) {
						arrowRight.removeClass('unfocus');
						arrowRight.addClass('focus');
					} else {
						arrowRight.removeClass('focus');
						arrowRight.addClass('unfocus');
					}
					if(_this.model.getHIndex() > 0) {
						arrowLeft.removeClass('unfocus');
						arrowLeft.addClass('focus');
					} else {
						arrowLeft.removeClass('focus');
						arrowLeft.addClass('unfocus');
					}
				} else {
					arrowLeft.removeClass('focus');
					arrowRight.removeClass('focus');
					arrowLeft.addClass('unfocus');
					arrowRight.addClass('unfocus');
				}	
			}
		}

		function drawSynopsisFocus() {
			var synopsis = $('.vod_detail_info .synopsis');
			if(isSynopsisState() && _this.isActive()) {
				synopsis.removeClass('unfocus');
				synopsis.addClass('focus');
			} else {
				synopsis.removeClass('focus');
				synopsis.addClass('unfocus');
			}
		}

		function drawSynopsisScroll() {
			// $('.synopsis .story').scrollTop( (_this.model.getHIndex() * 57) );
			$('.synopsis .story').scrollTop( (_this.model.getHIndex() * (57)) );
			/*if(synopsisElement.offsetHeight < synopsisElement.scrollHeight) {
			 $('.synopsis .story').scrollTop(55 * (_this.model.getHIndex() + 1));
			 }*/

		}


		function isSynopsisState() {
			return _this.model.getVIndex() == 0;
		}


	};
	DetailDrawer.prototype = Object.create(Drawer.prototype);


	return DetailDrawer;
});

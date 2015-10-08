define(['framework/Drawer', 'helper/UIHelper', '../../../../resources/strings/ko'],
	function (Drawer, UIHelper, Strings) {
		var _this = null;
		var KeypadDrawer = function (_id, _model) {
			Drawer.call(this, _id, _model);
			this.templateList = {
				'layout'	: new EJS({url: 'js/ui/searchViewGroup/keypadView/LayoutTemplate.ejs'}),
				'keypad'	: new EJS({url: 'js/ui/searchViewGroup/keypadView/KeypadTemplate.ejs'})
			};
			_this = this;
			this.myRootElement = null;
		}

		KeypadDrawer.prototype = Object.create(Drawer.prototype);
		KeypadDrawer.prototype.onCreateLayout = function () {
			var container = $("#ranking_search .keypad");
			this.setContainer(container);
			var result = _this.templateList.layout.render({model: this.model});
			this.getContainer().html(result);
			this.myRootElement = $('#ranking_search .keypad .key');
		};
		KeypadDrawer.prototype.onPaint = function () {
			var mode = _this.model.getKeypadMode();
			var keypadMap = Strings.keypadMap[mode];
			var keypadResult = _this.templateList.keypad.render({'keypadMap': keypadMap, model: _this.model});
			$('#ranking_search .key').html(keypadResult);
			setButtonElement();
			setSearchBar();
		};
		KeypadDrawer.prototype.onAfterPaint = function () {
			if(this.active) {
				// showLayout();
				drawFocus();
			} else {
				drawUnfocus();
				// hideLayout();
			};
		};	
		KeypadDrawer.prototype.doBlink = function()	{
			var blink = $(".blink"); // TODO cursor class name mapping
			for (var i=0; i < blink.length; i++) {
				blink[i].style.visibility = blink[i].style.visibility == "" ? "hidden" : ""	
			}
		};
		function getFocusIndexItem() {
			var vIndex = _this.model.getVIndex();
			var hIndex = _this.model.getHIndex();
//			console.log('vIndex: ' + vIndex + ', hIndex: ' + hIndex);
			drawUnfocus();

			var row = _this.myRootElement.find('.key_line').eq(vIndex);
			var focusItem = row.find('.keybg2').eq(hIndex);
			return focusItem;
		};

		function getSearchBar() {
			return _this.getContainer().find('.bar_search');
		};
		function getCheckBox() {
			return _this.getContainer().find('.chkbox');
		};

		function setSearchBar() {
			var keyword = _this.model.getInputText();
			if(keyword != null) {
				$('#ranking_search .keypad .bar_search span.text').text(keyword);
//				$('#ranking_search .keypad .bar_search').html("<span class='text'>"+keyword+"<div class='blink'>|</div></span>"); // cursor code
			};
		};
		function setButtonElement () {
			var topButtonGroup = _this.model.getTopButtonGroup();
			var topButtonList = _this.getContainer().find('.keybg1');
			for (var index = 0; index < topButtonList.size(); index++) {
				topButtonGroup.getButton(index).setElement(topButtonList.eq(index));
			};

			var bottomButtonGroup = _this.model.getBottomButtonGroup();
			var bottomButtonList = _this.getContainer().find('.keybg3');
			for (var index = 0; index < bottomButtonList.size(); index++) {
				bottomButtonGroup.getButton(index).setElement(bottomButtonList.eq(index));
			};
		};

		function drawFocus () {
			drawUnfocus();
			var currentFocusedComponent = _this.model.getFocusedComponent();
			var checkBox = getCheckBox();

			switch (currentFocusedComponent) {
				case _this.model.TYPE_SEARCH_BAR:
					var searchBar = getSearchBar();
					searchBar.addClass('focus');
					var input = searchBar.find('.text');
					input.removeClass('default');
					break;
				case _this.model.TYPE_CHECK_BOX:
				// focus(checked=false, focus=true), unfocus(checked=false, focus=false), 
				// check(checked=true, focus=true), selected(checked=true, focus=false) 
					drawCheckBox();
					break;
				case _this.model.TYPE_TOP_BUTTON_GROUP:
					_this.model.getTopButtonGroup().getFocusedButton().setFocus();
					break;
				case _this.model.TYPE_KEYPAD:
					var row = _this.getContainer().find('.key_line').eq(_this.model.getVIndex());
					var button = row.find('.keybg2').eq(_this.model.getHIndex());
					button.removeClass('unfocus');
					button.addClass('focus');
					return true;
				case _this.model.TYPE_BOTTOM_BUTTON_GROUP:
					_this.model.getBottomButtonGroup().getFocusedButton().setFocus();
					break;
				default:
					break;
			};

			
		};

		function drawCheckBox() {
			var checkBox = getCheckBox();
			// focus(checked=false, focus=true), unfocus(checked=false, focus=false), 
			// check(checked=true, focus=true), selected(checked=true, focus=false) 
			if(_this.model.getFocusedComponent() == _this.model.TYPE_CHECK_BOX) {
				if(_this.model.getExpandSearch() == true) {
					checkBox.removeClass('focus').removeClass('unfocus').removeClass('selected').addClass('check');
				} else {
					checkBox.removeClass('selected').removeClass('unfocus').removeClass('check').addClass('focus');
				};
			} else {
				if(_this.model.getExpandSearch() == true) {
					checkBox.removeClass('check').removeClass('unfocus').removeClass('focus').addClass('selected');
				} else {
					checkBox.removeClass('selected').removeClass('check').removeClass('focus').addClass('unfocus');
				};
			};
		};

		function drawUnfocus () {
			var searchBar = getSearchBar();
			searchBar.removeClass('focus').addClass('unfocus');
			var input = searchBar.find('.text');
			input.addClass('default');

			drawCheckBox();
			// var checkBox = getCheckBox();
			// checkBox.removeClass('focus');
			// checkBox.addClass('unfocus');

			// _this.model.getTopButtonGroup().getFocusedButton().onDeActive();
			// _this.model.getBottomButtonGroup().getFocusedButton().onDeActive();

			var buttons = $('#ranking_search .keypad .keybg1,.keybg2,.keybg3');
			buttons.removeClass('focus');
			buttons.addClass('unfocus');
		};
		function showLayout() {
			_this.getContainer().show();
		};
		function hideLayout() {
			_this.getContainer().hide();
		};

		return KeypadDrawer;
});
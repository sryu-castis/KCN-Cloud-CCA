define(["framework/View", "framework/event/CCAEvent", "service/Communicator", 
        "ui/popupViewGroup/ratingPopupView/RatingPopupDrawer", "ui/popupViewGroup/ratingPopupView/RatingPopupModel", "framework/modules/ButtonGroup", "cca/PopupValues", "cca/DefineView"],
        function(View, CCAEvent, Communicator, RatingPopupDrawer, RatingPopupModel, ButtonGroup, PopupValues, DefineView) {

    var RatingPopupView = function() {
        View.call(this, DefineView.RATING_POPUP_VIEW);
        this.model = new RatingPopupModel();
        this.drawer = new RatingPopupDrawer(this.getID(), this.model);
        var _this = this;

        RatingPopupView.prototype.onInit = function() {

        };

        RatingPopupView.prototype.onStart = function() {
            View.prototype.onStart.apply(this, arguments);
            /*
                @Tip Sync 로 데이터를 가져오는경우 onStart 내부에서 onGetData -> drawer.onStart 가 이루어진다
                ASync 로 데이터를 획득 할 경우 이미 drawer.onStart()가 호출된 이후임으로 drawer.onUpdate를 명시적으로 해줄 필요가 있다
            */
        };

        RatingPopupView.prototype.onStop = function() {
            View.prototype.onStop.apply(this);
        };


        RatingPopupView.prototype.onGetData = function(param) {
        	setData(param);
        };
        
        function setData(param) {
//        	console.log("ratingPopupView setdata:"+param.assetId);
			var model = _this.model;

            model.setParam(param);
            model.setAssetId(param.asset.getAssetID());
            model.setRating(3);
            var verticalVisibleSize = 2;
            var horizonVisibleSize = 4;
            var verticalMaximumSize = verticalVisibleSize;
            var horizonMaximumSize = horizonVisibleSize;

            model.setSize(verticalVisibleSize, horizonVisibleSize, verticalMaximumSize, horizonMaximumSize);
            model.setButtonGroup(getButtonGroup());
		};
        
        function getButtonGroup() {
			var buttonGroup = new ButtonGroup(2);
			//Label 설정
            buttonGroup.getButton(0).setLabel(CCABase.StringSources.ButtonLabel.CONFIRM);
            buttonGroup.getButton(1).setLabel(CCABase.StringSources.ButtonLabel.CANCEL);

			//최초 설정
            
			buttonGroup.setIndex(0);

			return buttonGroup;
		}
        function sendRatingInfo()	{
        	Communicator.requestSetReviewRating(callbackForSendRatingInfo, _this.model.getAssetId(), _this.model.getRating());
        }
        function callbackForSendRatingInfo(result)	{
//        	if(Communicator.isSuccessResponseFromHAS(result) == true) {
//        		console.log("sending rating info succeeded-- do nothing for now");
//        	}
//        	else	{
//        		console.error("sending rating info error-- do nothing for now");
//        	}
            var returnParam = _this.model.getParam();
        	returnParam.rating = _this.model.getRating(); 
			returnParam.result = _this.model.getButtonGroup().getFocusedButton().getLabel();
        	 _this.sendEvent(CCAEvent.FINISH_VIEWGROUP_WITH_RESULT, returnParam);
        }
        RatingPopupView.prototype.onKeyDown = function(event, param) {
            var keyCode = param.keyCode;
            var tvKey = window.TVKeyValue;
            var buttonGroup = _this.model.getButtonGroup();

//            console.log("ratingPopupView, onKeyDown: " + keyCode );
            switch (keyCode) {
            	case tvKey.KEY_RIGHT:
            		if(_this.model.getVIndex() == 1)	{	// button focused
            			buttonGroup.next();	
            		}
            		else	{	// star focused
            			if(_this.model.getRating() <= 4)	{
            				_this.model.setRating(_this.model.getRating()+1);
            			}
            		}
					_this.drawer.onUpdate();
					break;
                case tvKey.KEY_LEFT:
                	if(_this.model.getVIndex() == 1)	{	// button focused
                		if(buttonGroup.hasPreviousButton()) {
    						buttonGroup.previous();
    					}
                	}
                	else	{	// star focused
                		if(_this.model.getRating() > 1)	{
            				_this.model.setRating(_this.model.getRating()-1);
            			}
                	}
                	_this.drawer.onUpdate();
                	break;
                case tvKey.KEY_ESC:
                case tvKey.KEY_EXIT:
                case tvKey.KEY_BACK:
                	_this.sendEvent(CCAEvent.FINISH_VIEWGROUP);
                	break;
				case tvKey.KEY_ENTER:
					if(_this.model.getVIndex() == 1)	{	// button focused
						if(_this.model.getButtonGroup().getFocusedButton().getLabel() == CCABase.StringSources.ButtonLabel.CONFIRM)	{
							sendRatingInfo();	
						}
						else	{
							_this.sendEvent(CCAEvent.FINISH_VIEWGROUP);		
						}
                	}
                	else	{	// star focused
                		_this.keyNavigator.keyDown();
                		_this.drawer.onUpdate();
                	}
                	break;
                case tvKey.KEY_UP:
                	_this.keyNavigator.keyUp();
                	_this.drawer.onUpdate();
                    break;
                case tvKey.KEY_DOWN:
                    _this.keyNavigator.keyDown();
                	_this.drawer.onUpdate();
                    break;
                default:
                    break;
            }
        };
        

        this.onInit();
    };
    RatingPopupView.prototype = Object.create(View.prototype);
	
    return RatingPopupView;
});

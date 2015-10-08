define(function () {
    var Event = {};

    Event.FINISH_APP = "com.castis.event.finishAPP";

    /** View 이번트. 파라미터로 타겟뷰그룹 + 뷰가 들어간다*/

    Event.CHANGE_VIEW = "com.castis.event.changeView";
    Event.CHANGE_FOCUS_ON_VIEW = "com.castis.event.changeFocusView";
    Event.UPDATE_VIEW = "com.castis.event.updateView";
    Event.FINISH_VIEW = "com.castis.event.finishView";

    /** ViewGroup 이번트 */
    Event.CHANGE_VIEWGROUP = "com.castis.event.changeViewGroup";
    Event.CHANGE_FOCUS_ON_VIEWGROUP = "com.castis.event.changeFocusViewGroup";
    Event.FINISH_VIEWGROUP_WITH_RESULT = "com.castis.event.finishViewGroupWithResult";
    Event.FINISH_VIEWGROUP = "com.castis.event.finishViewGroup";

    Event.SEND_KEYEVENT = "com.castis.event.sendKeyEvent";
    
    /* 마우스 관련 이벤트 */
    Event.ACTIVATE_BY_CLICK = "com.castis.event.activateByClick";
    Event.onMouseOuted = 13;
    Event.onMouseEntered = 14;
    Event.onMouseWheeled = 15;
    Event.onMouseClicked = 16;

    Event.onShowIME = 'showIme';
    Event.SHOW_VIRTUAL_KEYPAD = "showVirtualKeypad";
    Event.HIDE_VIRTUAL_KEYPAD = "hideVirtualKeypad";

    Event.COMPLETE_TO_DRAW_VIEW = "com.castis.event.completeToDrawView";


    return Event;
});

define(function () {
    var UIComponentHelper = {};

    //미니EPG 에서 진입
    UIComponentHelper.CALLER_ID_MINI_EPG = 0;

    //홍보 윈도우에서 진입
    UIComponentHelper.CALLER_ID_PROMOTION_WINDOWS = 1;

    //0번 프로모션 채널에서 진입
    UIComponentHelper.CALLER_ID_PROMOTION_CHANNEL = 2;

    //채널 VOD 에서 진입
    UIComponentHelper.CALLER_ID_CHANNEL_VOD = 3;

    //공지사항에서 진입
    UIComponentHelper.CALLER_ID_NOTICE = 4;

    //데이터 방송에서 진입
    UIComponentHelper.CALLER_ID_DP = 5;

    //특정 채널의 추천 VOD 에서 진입
    UIComponentHelper.CALLER_ID_RECOMMEND_CHANNEL = 6;

    //리모컨 키의 추천 VOD 에서 진입
    UIComponentHelper.CALLER_ID_RECOMMEND_LIST = 7;

    UIComponentHelper.CALLER_ID_CLOUD_PROMOTION_WINDOW = 10;
    UIComponentHelper.CALLER_ID_CLOUD_RECOMMENT_CONTENT = 11;

    UIComponentHelper.UIComponentID = {};
    UIComponentHelper.UIComponentID[UIComponentHelper.CALLER_ID_MINI_EPG] = 310;
    UIComponentHelper.UIComponentID[UIComponentHelper.CALLER_ID_PROMOTION_WINDOWS] = 311;
    UIComponentHelper.UIComponentID[UIComponentHelper.CALLER_ID_PROMOTION_CHANNEL] = 312;
    UIComponentHelper.UIComponentID[UIComponentHelper.CALLER_ID_CHANNEL_VOD] = 313;
    UIComponentHelper.UIComponentID[UIComponentHelper.CALLER_ID_NOTICE] = 314;
    UIComponentHelper.UIComponentID[UIComponentHelper.CALLER_ID_DP] = 316;
    UIComponentHelper.UIComponentID[UIComponentHelper.CALLER_ID_RECOMMEND_CHANNEL] = 317;
    UIComponentHelper.UIComponentID[UIComponentHelper.CALLER_ID_RECOMMEND_LIST] = 318;
    UIComponentHelper.UIComponentID[UIComponentHelper.CALLER_ID_CLOUD_RECOMMENT_CONTENT] = 700;
    UIComponentHelper.UIComponentID[UIComponentHelper.CALLER_ID_CLOUD_PROMOTION_WINDOW] = 710;

    UIComponentHelper.UIComponentID.MYTV_BOUGHT = 210;
    UIComponentHelper.UIComponentID.MYTV_WATCHED = 211;
    UIComponentHelper.UIComponentID.MYTV_WISH = 212;

    UIComponentHelper.UIComponentID.EXT_MINI_EPG = 310;
    UIComponentHelper.UIComponentID.EXT_AD_WINDOW = 311;
    UIComponentHelper.UIComponentID.EXT_AD_CHANNEL = 312;
    UIComponentHelper.UIComponentID.EXT_CH_VOD = 313;
    UIComponentHelper.UIComponentID.EXT_NOTICE = 314;
    UIComponentHelper.UIComponentID.EXT_RCP_PORTAL = 315;
    UIComponentHelper.UIComponentID.EXT_CH_RECOMM = 317;
    UIComponentHelper.UIComponentID.EXT_REMOTE_RECOMM = 318;

    UIComponentHelper.UIComponentID.SEARCH_WINDOW = 410;
    UIComponentHelper.UIComponentID.SEARCH_RESULT = 411;

    UIComponentHelper.UIComponentID.RECOMMEND_FIELD = 510;
    UIComponentHelper.UIComponentID.RECOMMEND_ALL = 511;
    UIComponentHelper.UIComponentID.RECOMMEND_PLAY_END = 520;
    UIComponentHelper.UIComponentID.RECOMMEND_PLAY_END_MD = 521;

    UIComponentHelper.UIComponentID.PLAYING_NEXT = 610;
    UIComponentHelper.UIComponentID.PLAYING_TRAILER = 620;
    UIComponentHelper.UIComponentID.PLAYING_PREVIEW = 621;
    UIComponentHelper.UIComponentID.PLAYING_MOD = 622;

    UIComponentHelper.UIDomainID = {};
    UIComponentHelper.UIDomainID.CATEGORY = 0;
    UIComponentHelper.UIDomainID.MYTV = 200;
    UIComponentHelper.UIDomainID.EXT = 300;
    UIComponentHelper.UIDomainID.SEARCH = 400;
    UIComponentHelper.UIDomainID.RECOMMEND = 500;
    UIComponentHelper.UIDomainID.PLAYING = 600;
    UIComponentHelper.UIDomainID.MAIN_MENU = 700;



    UIComponentHelper.getUIComponentId = function (callerID) {
        return UIComponentHelper.UIComponentID[callerID];
    }

    return UIComponentHelper;
});
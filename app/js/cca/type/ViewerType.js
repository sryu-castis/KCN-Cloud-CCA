define(function() {	
	var ViewerType = {};
	ViewerType.DEFAULT = 0;
	ViewerType.LINK_CATEGORY = 10;
	ViewerType.ASSET = 20;
	ViewerType.CONTENTGROUP_LIST = 30;
	ViewerType.CHART_LIST = 40;
	// ViewerType.BUNDLEPRODUCT_LIST = 42;
	ViewerType.BUNDLEPRODUCT_LIST = 41;
	ViewerType.EVENT = 50;
	ViewerType.FINISHED_EVENT = 1051;
	ViewerType.PROMOTION_BANNER = 60;
	
	ViewerType.POPULARITY_CHART = 200;
	ViewerType.SHOW_SEARCH_MENU = 300;
	ViewerType.RECOMMEND = 310;

	ViewerType.PURCHASE_COUPON = 2000;		// 쿠폰 구매
	ViewerType.REGISTRATION_COUPON = 2010;	// 쿠폰등록
	ViewerType.USED_COUPON_LIST = 2020;		// 쿠폰사용내역
	ViewerType.COUPON_GUIDE = 2030;			// 이용안내
	ViewerType.PURCHASE_MONTHLY_COUPON = 2040;			// vod 쿠폰 요금제
	ViewerType.DISCOUNT_COUPON_USED_LIST = 2050;		// 할인권 사용내역
	
	ViewerType.PURCHASED_LIST = 100;	//구매목록
	ViewerType.WATCHED_LIST = 110;	//시청목록
	ViewerType.PURCHASED_SVOD_LIST = 1130;	//월정액 사용내역
	ViewerType.REGISTRATION_MOBILE = 2100;	//스마트폰 등록
	ViewerType.WISH_LIST = 2110;	//찜목록
	ViewerType.HELP_MENU = 2200;	//이용자 가이드

	//SITE별 정의 타입
	ViewerType.MD_RECOMMEND = 1021;
	ViewerType.SUBSCRIBER_RECOMMEND = 1311;
	ViewerType.POSTERLIST = 1031;
	ViewerType.PROMOTIONLIST2 = 1032;
	ViewerType.SMART_RECOMMEND = 1033;
	ViewerType.SOCIAL_RANKING = 1201; // HOTISSUE

	ViewerType.PROGRAM_LIST = 3000; //searchResult > program list

	return ViewerType;
});

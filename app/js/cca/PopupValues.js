define(['../../resources/strings/ko'], function(StringValues) {

    var PopupValues = {
        ID: {}
        , PopupType: {}
        , IconType: {}
        , HeadTextClass : {}
        , SubTextClass : {}
        , SubSpanClass : {}
        , TextClass : {}
    };

    PopupValues.PopupType.DIALOG = "dialog"; //two button
    PopupValues.PopupType.DIALOG_XLARGE = "dialogXLarge"; //two button
    PopupValues.PopupType.DIALOG_LARGE_03 = "dialogLarge03"; //two button
    PopupValues.PopupType.ALERT = "alert"; //one button
    PopupValues.PopupType.ALERT_XLARGE = "alertXLarge"; //one button
    PopupValues.PopupType.ALERT_LARGE_03 = "alertLarge03"; //one button
    PopupValues.PopupType.ERROR = "error"; //one button
    PopupValues.PopupType.ERROR_PLAY = "errorPlay"; //one button
    PopupValues.PopupType.CHOICE = "choice";  //three button
    PopupValues.PopupType.NO_BUTTON = "noButton"; //no button small
    PopupValues.PopupType.NO_BUTTON_MEDIUM = "noButtonMedium"; //no button medium
    PopupValues.PopupType.ADULT_AUTH = "adultAuth"; //adult auth
    PopupValues.PopupType.SMART_PHONE = "smartPhone"; //스마트폰 등록 설정
    PopupValues.PopupType.RATING = "rating"; //평점등록
    PopupValues.PopupType.UNJOIN_RCP = "unjoinRcp"; //RCP 해지
    PopupValues.PopupType.EVENT_DETAIL = "eventDetail"; //EVENT 상세
    PopupValues.PopupType.EVENT_WINNER = "eventWinner"; //당첨자 리스트

    PopupValues.IconType.NONE = "";
    PopupValues.IconType.CHECK = "check";
    PopupValues.IconType.WON = "won";
    PopupValues.IconType.DELETE = "del";
    PopupValues.IconType.NOTE = "note";
    PopupValues.IconType.CLOCK = "clock";
    PopupValues.IconType.ARROW = "arrow";
    PopupValues.IconType.ACTION = "action";
    PopupValues.IconType.ADULT = "adult";
    PopupValues.IconType.PLUS = "plus";
    PopupValues.IconType.POINT = "point";
    PopupValues.IconType.LOCK = "lock";

    PopupValues.HeadTextClass.DEFAULT = "body_headtext"; //기본 subText와 같이 있는 경우
    PopupValues.HeadTextClass.LINE_01 = "body_headtext_line01"; //subText 없이 headText만 있는 경우
    PopupValues.HeadTextClass.CONFIRM_01 = "body_headtext_confirm01";
    PopupValues.HeadTextClass.SMS = "body_headtext_sms";
    PopupValues.HeadTextClass.UPGRADE = "body_headtext_upgrade";
    PopupValues.HeadTextClass.INFO_01 = "body_headtext_info01";
    PopupValues.HeadTextClass.INFO_02 = "body_headtext_info02";

    PopupValues.SubTextClass.DEFAULT = "body_subtext"; //기본 headText와 같이 있는 경우
    PopupValues.SubTextClass.CONFIRM_01 = "body_subtext_confirm01";
    PopupValues.SubTextClass.SMS = "body_subtext_sms";
    PopupValues.SubTextClass.INFO_01 = "body_subtext_info01";
    PopupValues.SubTextClass.INFO_02 = "body_subtext_info02";
    PopupValues.SubTextClass.HIDDEN = "hidden_subtext";

    PopupValues.TextClass.TITLE = "body_title";
    PopupValues.TextClass.TITLE_03 = "body_title03";
    PopupValues.TextClass.TITLE_04_A = "body_title04_a";
    PopupValues.TextClass.TITLE_04_B = "body_title04_b";
    PopupValues.TextClass.LINE_II = "bodyline_ii";
    PopupValues.TextClass.LINE_BB = "bodyline_bb";
    PopupValues.TextClass.HEAD_LINE_BG_02 = "headline_bg02";

    PopupValues.TextClass.ADD_MIDDLE = " middle";

    PopupValues.SubSpanClass.NORMAL = "normal";
    PopupValues.SubSpanClass.IMPACT = "impact";
    PopupValues.SubSpanClass.ERROR = "error";

    PopupValues.ID.CONFIRM_PUSH_COUPON = "confirmPushCoupon"; //쿠폰 발급 확인
    PopupValues[PopupValues.ID.CONFIRM_PUSH_COUPON] = {
        popupType: PopupValues.PopupType.DIALOG_LARGE_03
        , iconType: PopupValues.IconType.NONE
        , title : StringValues.confirmPushCouponTitle
        , headTextClass: PopupValues.TextClass.TITLE
        , headText: StringValues.confirmPushCouponHeadText
        , subTextClass: PopupValues.TextClass.HEAD_LINE_BG_02
        , subText: StringValues.confirmPushCouponSubText
        , subSubTextClass: PopupValues.TextClass.LINE_BB
        , subSubText: StringValues.confirmPushCouponSubSubText
        , buttonText1 :StringValues.ButtonLabel.VOD_VIEW
        , buttonText2 :StringValues.ButtonLabel.COUPON_VIEW
    };

    PopupValues.ID.ALERT_PUSH_DISCOUNT_COUPON = "alertPushDiscountCoupon"; //할인권 발급 알림
    PopupValues[PopupValues.ID.ALERT_PUSH_DISCOUNT_COUPON] = {
        popupType: PopupValues.PopupType.ALERT_LARGE_03
        , iconType: PopupValues.IconType.NONE
        , title : ""
        , headTextClass: PopupValues.TextClass.TITLE
        , headText: ""
        , subTextClass: PopupValues.TextClass.HEAD_LINE_BG_02
        , subText: StringValues.confirmPushDiscountCouponSubText
        , subSubTextClass: PopupValues.TextClass.LINE_BB
        , subSubText: StringValues.confirmPushDiscountCouponSubSubText
    };

    PopupValues.ID.CHOICE_CONTINUE_VOD_PLAY = "choiceContinueVodPlay"; //VOD 이어보기/처음부터/취소 선택
    PopupValues[PopupValues.ID.CHOICE_CONTINUE_VOD_PLAY] = {
        popupType: PopupValues.PopupType.CHOICE
        , iconType: PopupValues.IconType.ACTION
        , title : StringValues.choiceContinuePlayTitle
        , headTextClass: PopupValues.HeadTextClass.DEFAULT
        , headText: StringValues.choiceContinuePlayHeadText
        , subTextClass: PopupValues.SubTextClass.DEFAULT
        , subText: StringValues.choiceContinuePlaySubText
        , buttonText1 : StringValues.ButtonLabel.PLAY_CONTINUE
        , buttonText2 : StringValues.ButtonLabel.PLAY_FIRST
    };

    PopupValues.ID.CONFIRM_DELETE_PURCHASED_VOD = "confirmDeletePurchasedVOD"; //구매목록 삭제
    PopupValues[PopupValues.ID.CONFIRM_DELETE_PURCHASED_VOD] = {
        popupType: PopupValues.PopupType.DIALOG
        , iconType: PopupValues.IconType.DELETE
        , title : StringValues.confirmDeletePurchasedVODTitle
        , headTextClass: PopupValues.HeadTextClass.DEFAULT
        , headText: StringValues.confirmDeletePurchasedVODHeadText
        , subTextClass: PopupValues.SubTextClass.DEFAULT
        , subText: StringValues.confirmDeletePurchasedVODSubText
    };

    PopupValues.ID.CONFIRM_DELETE_SERVICE_LOG = "confirmDeleteServiceLog"; //시청목록 삭제
    PopupValues[PopupValues.ID.CONFIRM_DELETE_SERVICE_LOG] = {
        popupType: PopupValues.PopupType.DIALOG
        , iconType: PopupValues.IconType.DELETE
        , title : StringValues.confirmDeleteServiceLogTitle
        , headTextClass: PopupValues.HeadTextClass.DEFAULT
        , headText: StringValues.confirmDeleteServiceLogHeadText
        , subTextClass: PopupValues.SubTextClass.DEFAULT
        , subText: StringValues.confirmDeleteServiceLogSubText
    };

    PopupValues.ID.CONFIRM_DELETE_WISH_ITEM = "confirmDeleteWishItem"; //찜목록 삭제
    PopupValues[PopupValues.ID.CONFIRM_DELETE_WISH_ITEM] = {
        popupType: PopupValues.PopupType.DIALOG
        , iconType: PopupValues.IconType.DELETE
        , title : StringValues.confirmDeleteWishItemTitle
        , headTextClass: PopupValues.HeadTextClass.LINE_01
        , headText: StringValues.confirmDeleteWishItemHeadText
    };

    PopupValues.ID.ALERT_COUPON_USED_VOD = "alertCouponUsedVOD"; //쿠폰으로 VOD 구매 사용한 정보
    PopupValues[PopupValues.ID.ALERT_COUPON_USED_VOD] = {
        popupType: PopupValues.PopupType.ALERT
        , iconType: PopupValues.IconType.NONE
        , title : StringValues.alertCouponUsedVODTitle
        , headTextClass: PopupValues.HeadTextClass.DEFAULT
        , headText: StringValues.alertCouponUsedVODHeadText
        , subTextClass: PopupValues.SubTextClass.DEFAULT
        , subText: StringValues.alertCouponUsedVODSubText
    };

    PopupValues.ID.ALERT_DUPLICATE_MONTHLY_COUPON="alertDuplicateMonthlyCoupon"; // vod 쿠폰 요금제 중복가입제한
    PopupValues[PopupValues.ID.ALERT_DUPLICATE_MONTHLY_COUPON] = {
        popupType: PopupValues.PopupType.ALERT
        , iconType: PopupValues.IconType.NONE
        , title : StringValues.alertDuplicateMonthlyCouponTitle
        , headTextClass: PopupValues.HeadTextClass.DEFAULT
        , headText: StringValues.alertDuplicateMonthlyCouponHeadText
        , subTextClass: PopupValues.SubTextClass.DEFAULT
        , subText: StringValues.alertDuplicateMonthlyCouponSubText
    };
    PopupValues.ID.ALERT_RATING_SUCCEEDED="alertRatingSucceeded"; // 관랙평점 완료
    PopupValues[PopupValues.ID.ALERT_RATING_SUCCEEDED] = {
        popupType: PopupValues.PopupType.NO_BUTTON
        , iconType: PopupValues.IconType.NONE
        , title : StringValues.alertRatingSucceededTitle
        , headTextClass: PopupValues.HeadTextClass.DEFAULT
        , headText: StringValues.alertRatingSucceededHeadText
        , subTextClass: null
        , subText: null
        , timeout: 3
    };
    PopupValues.ID.ALERT_REGISTER_MONTHLY_COUPON_COMPLETED="alertRegisterMonthlyCouponCompleted";// 월정액 쿠폰 등록 완료 
    PopupValues[PopupValues.ID.ALERT_REGISTER_MONTHLY_COUPON_COMPLETED] = {
            popupType: PopupValues.PopupType.ALERT
            , iconType: PopupValues.IconType.WON
            , title : StringValues.alertRegisterMonthlyCouponCompletedTitle
            , headTextClass: PopupValues.HeadTextClass.DEFAULT
            , headText: StringValues.alertRegisterMonthlyCouponCompletedHeadText
            , subTextClass: PopupValues.SubTextClass.DEFAULT
            , subText: null
        };
    PopupValues.ID.ALERT_PURCHASE_MONTHLY_COUPON_COMPLETED="alertPurchaseMonthlyCouponCompleted"; // vod 쿠폰 요금제 가입 완료
    PopupValues[PopupValues.ID.ALERT_PURCHASE_MONTHLY_COUPON_COMPLETED] = {
        popupType: PopupValues.PopupType.NO_BUTTON
        , iconType: PopupValues.IconType.NONE
        , title : StringValues.alertPurchaseMonthlyCouponCompletedTitle
        , headTextClass: PopupValues.HeadTextClass.DEFAULT
        , headText: StringValues.alertPurchaseMonthlyCouponCompletedHeadText
        , subTextClass: PopupValues.SubTextClass.DEFAULT
        , subText: StringValues.alertPurchaseMonthlyCouponCompletedSubText
        , timeout: 3
    };
    PopupValues.ID.ALERT_PURCHASE_COMPLETED="alertPurchaseCompleted"; // 일반 구매 가입 완료
    PopupValues[PopupValues.ID.ALERT_PURCHASE_COMPLETED] = {
        popupType: PopupValues.PopupType.NO_BUTTON_MEDIUM
        , iconType: PopupValues.IconType.NONE
        , title : StringValues.alertPurchaseCompletedTitle
        , headTextClass: PopupValues.HeadTextClass.DEFAULT
        , headText: StringValues.alertPurchaseCompletedHeadText
        , subTextClass: PopupValues.SubTextClass.DEFAULT
        , subText: StringValues.alertPurchaseCompletedSubText
        , timeout: 1
        , ignoreNumPad: true
    };
    PopupValues.ID.ALERT_PURCHASE_MONTHLY_COMPLETED="alertPurchaseMonthlyCompleted"; // 월정액 구매 가입 완료
    PopupValues[PopupValues.ID.ALERT_PURCHASE_MONTHLY_COMPLETED] = {
        popupType: PopupValues.PopupType.NO_BUTTON_MEDIUM
        , iconType: PopupValues.IconType.NONE
        , title : StringValues.alertPurchaseMonthlyCompletedTitle
        , headTextClass: PopupValues.HeadTextClass.DEFAULT
        , headText: StringValues.alertPurchaseMonthlyCompletedHeadText
        , subTextClass: PopupValues.SubTextClass.DEFAULT
        , subText: StringValues.alertPurchaseMonthlyCompletedSubText
        , timeout: 1
    };
    
    PopupValues.ID.ALERT_LACK_OF_TVPOINT="alertLackOfTvPoint"; // tv 포인트 부족
    PopupValues[PopupValues.ID.ALERT_LACK_OF_TVPOINT] = {
        popupType: PopupValues.PopupType.DIALOG
        , iconType: PopupValues.IconType.NONE
        , title : StringValues.alertTvPointTitle
        , headTextClass: PopupValues.HeadTextClass.DEFAULT
        , headText: StringValues.alertLackOfTvPointHeadText
        , subTextClass: PopupValues.SubTextClass.DEFAULT
        , subText: StringValues.alertLackOfTvPointSubText
        , buttonText1: StringValues.ButtonLabel.RECHARGE
    };
    
    PopupValues.ID.ALERT_REGISTER_TVPOINT="alertRegisterTvPoint"; // tv 포인트 회원가입
    PopupValues[PopupValues.ID.ALERT_REGISTER_TVPOINT] = {
        popupType: PopupValues.PopupType.DIALOG
        , iconType: PopupValues.IconType.POINT
        , title : StringValues.alertTvPointTitle
        , headTextClass: PopupValues.HeadTextClass.DEFAULT
        , headText: StringValues.alertRegisterTvPointHeadText
        , subTextClass: PopupValues.SubTextClass.DEFAULT
        , subText: StringValues.alertRegisterTvPointSubText
    };

    PopupValues.ID.ALERT_PURCHASE_COUPON_COMPLETED="alertPurchaseCouponCompleted"; // coupon 구매 완료
    PopupValues[PopupValues.ID.ALERT_PURCHASE_COUPON_COMPLETED] = {
        popupType: PopupValues.PopupType.NO_BUTTON
        , iconType: PopupValues.IconType.NONE
        , title : StringValues.alertPurchaseCouponCompletedTitle
        , headTextClass: PopupValues.HeadTextClass.DEFAULT
        , headText: StringValues.alertPurchaseCouponCompletedAddHeadText
        , subTextClass: PopupValues.SubTextClass.DEFAULT
        , subText: StringValues.alertPurchaseCouponCompletedSubText
        , timeout: 3
    };

    PopupValues.ID.ALERT_REGISTER_COUPON_COMPLETED="alertRegisterCouponCompleted"; // coupon 등록 완료
    PopupValues[PopupValues.ID.ALERT_REGISTER_COUPON_COMPLETED] = {
        popupType: PopupValues.PopupType.NO_BUTTON
        , iconType: PopupValues.IconType.NONE
        , title : StringValues.alertRegisterCouponCompletedTitle
        , headTextClass: PopupValues.HeadTextClass.DEFAULT
        , headText: null
        , subTextClass: PopupValues.SubTextClass.DEFAULT
        , subText: StringValues.alertRegisterCouponCompletedSubText
        , timeout: 3
    };

    PopupValues.ID.ALERT_VOD_LICENSE_END = "alertVODlicenseEnd"; //라이센스 종료
    PopupValues[PopupValues.ID.ALERT_VOD_LICENSE_END] = {
        popupType: PopupValues.PopupType.ALERT
        , iconType: PopupValues.IconType.NONE
        , title : StringValues.alertVODlicenseEndTitle
        , headTextClass: PopupValues.HeadTextClass.LINE_01
        , headText: StringValues.alertVODlicenseEndHeadText
    };

    PopupValues.ID.ALERT_VOD_LICENSE_END_WISH_ITEM = "alertVODlicenseEndWishItem"; //찜목록 라이센스 종료
    PopupValues[PopupValues.ID.ALERT_VOD_LICENSE_END_WISH_ITEM] = {
        popupType: PopupValues.PopupType.ALERT
        , iconType: PopupValues.IconType.NONE
        , title : StringValues.alertVODlicenseEndTitle
        , headTextClass: PopupValues.HeadTextClass.DEFAULT
        , headText: StringValues.alertVODlicenseEndHeadText
        , subTextClass: PopupValues.SubTextClass.DEFAULT
        , subText: StringValues.alertVODlicenseEndSubText
    };

    PopupValues.ID.CONFIRM_UNJOIN_RCP_PRODUCT = "confimUnjoinRCPProduct" //RCP 해지 확인
    PopupValues[PopupValues.ID.CONFIRM_UNJOIN_RCP_PRODUCT] = {
        popupType: PopupValues.PopupType.DIALOG
        , iconType: PopupValues.IconType.NONE
        , title : StringValues.confirmUnjoinRCPProductTitle
        , headTextClass: PopupValues.HeadTextClass.LINE_01
        , headText: StringValues.confirmUnjoinRCPProductHeadText
    };

    PopupValues.ID.ALERT_UNJOIN_RCP_PRODUCT_COMPLETE = "alertUnjoinRCPProductComplete" //RCP 해지 완료
    PopupValues[PopupValues.ID.ALERT_UNJOIN_RCP_PRODUCT_COMPLETE] = {
        popupType: PopupValues.PopupType.NO_BUTTON
        , iconType: PopupValues.IconType.NONE
        , title : StringValues.completeUnjoinRCPProductTitle
        , headTextClass: PopupValues.HeadTextClass.DEFAULT
        , headText: StringValues.completeUnjoinRCPProductHeadText
        , subTextClass: PopupValues.SubTextClass.DEFAULT
        , subText: StringValues.completeUnjoinRCPProductSubText
        , timeout: 3
    };
    
    PopupValues.ID.CONFIRM_AUTH_FOR_EXT_SEARCH = "confirmAuthForExtSearch" //확장 검색 성인인증
    PopupValues[PopupValues.ID.CONFIRM_AUTH_FOR_EXT_SEARCH] = {
        popupType: PopupValues.PopupType.ADULT_AUTH
        , iconType: PopupValues.IconType.LOCK
        , title : StringValues.needAdultPassword
        , headTextClass: PopupValues.HeadTextClass.CONFIRM_01
        , headText: StringValues.confirmAuthForExtSearchHeadText
        , subTextClass: PopupValues.SubTextClass.CONFIRM_01
        , subText: StringValues.confirmAuthForExtSearchSubText
        , subSpanClass: PopupValues.SubSpanClass.IMPACT
        , subSpanText: StringValues.inputPasswordText
    };

    PopupValues.ID.CONFIRM_ADULT_AUTH = "confirmAdultAuth" //성인인증
    PopupValues[PopupValues.ID.CONFIRM_ADULT_AUTH] = {
        popupType: PopupValues.PopupType.ADULT_AUTH
        , iconType: PopupValues.IconType.LOCK
        , title : StringValues.needAdultPassword
        , headTextClass: PopupValues.HeadTextClass.CONFIRM_01
        , headText: StringValues.confirmAuthForExtSearchHeadText
        , subSpanClass: PopupValues.SubSpanClass.IMPACT
        , subSpanText: StringValues.inputPasswordText
    };


    PopupValues.ID.REGISTER_SMART_PHONE = "registerSmartPhone" //스마트폰 전화번호 입력
    PopupValues[PopupValues.ID.REGISTER_SMART_PHONE] = {
        popupType: PopupValues.PopupType.SMART_PHONE
        , iconType: PopupValues.IconType.PLUS
        , title : StringValues.registerSmartPhoneTitle
        , headTextClass: PopupValues.HeadTextClass.INFO_01
        , headText: StringValues.registerSmartPhoneHeadText
        , subTextClass: PopupValues.SubTextClass.INFO_02
        , subText: StringValues.registerSmartPhoneSubText
        , buttonText1: StringValues.ButtonLabel.SEND
        , focusablePhone: true
    };

    PopupValues.ID.REGISTER_SMART_PHONE_AUTH = "registerSmartPhoneAuth" //스마트폰 인증번호 (for CNM 가이드앱)
    PopupValues[PopupValues.ID.REGISTER_SMART_PHONE_AUTH] = {
        popupType: PopupValues.PopupType.DIALOG
        , iconType: PopupValues.IconType.PLUS
        , title : StringValues.registerSmartPhoneTitle
        , headTextClass: PopupValues.HeadTextClass.INFO_01
        , headText: StringValues.registerSmartPhoneAuthHeadText
        , subTextClass: PopupValues.SubTextClass.INFO_01
        , subText: StringValues.registerSmartPhoneAuthSubText
        , buttonText1: StringValues.ButtonLabel.REG_CONFIRM
    };

    PopupValues.ID.UNREGISTER_SMART_PHONE = "unregisterSmartPhone" //스마트폰 등록해제 (for CNM 가이드앱)
    PopupValues[PopupValues.ID.UNREGISTER_SMART_PHONE] = {
        popupType: PopupValues.PopupType.SMART_PHONE
        , iconType: PopupValues.IconType.DELETE
        , title : StringValues.unregisterSmartPhoneTitle
        , headTextClass: PopupValues.HeadTextClass.UPGRADE
        , headText: StringValues.unregisterSmartPhoneHeadText
        , subTextClass: null
        , subText: null
        , buttonText1: StringValues.ButtonLabel.REG_TERMINATE
        , focusablePhone: false
    };

    PopupValues.ID.ALERT_DUPLICATE_SMART_PHONE = "alertDuplicateSmartPhone" //스마트폰 중복 알림 (for CNM 가이드앱)
    PopupValues[PopupValues.ID.ALERT_DUPLICATE_SMART_PHONE] = {
        popupType: PopupValues.PopupType.ALERT
        , iconType: PopupValues.IconType.PLUS
        , title : StringValues.registerSmartPhoneTitle
        , headTextClass: PopupValues.HeadTextClass.DEFAULT
        , headText: StringValues.alertDuplicateSmartPhoneHeadText
        , subTextClass: PopupValues.SubTextClass.DEFAULT
        , subText: StringValues.alertDuplicateSmartPhoneSubText
    };

    //MOD
    PopupValues.ID.MOD_CHOICE_DEVICE_OST = "modChoiceDeviceOST" //OST 듣기 디바이스 선택 (for MOD)
    PopupValues[PopupValues.ID.MOD_CHOICE_DEVICE_OST] = {
        popupType: PopupValues.PopupType.CHOICE
        , iconType: PopupValues.IconType.NOTE
        , title : StringValues.modChoiceDeviceOSTTitle
        , headTextClass: PopupValues.HeadTextClass.DEFAULT
        , headText: StringValues.modChoiceDeviceOSTHeadText
        , subTextClass: PopupValues.SubTextClass.DEFAULT
        , subText: StringValues.modChoiceDeviceOSTSubText
        , buttonText1 : StringValues.ButtonLabel.MOD_PLAY_SMART_PHONE
        , buttonText2 : StringValues.ButtonLabel.MOD_PLAY_MK3
    };

    PopupValues.ID.MOD_CONFIRM_SMS = "modConfirmSMS" //스마트폰 SMS 받기 (for MOD 등록된 폰번호 없을 경우)
    PopupValues[PopupValues.ID.MOD_CONFIRM_SMS] = {
        popupType: PopupValues.PopupType.SMART_PHONE
        , iconType: PopupValues.IconType.ACTION
        , title : StringValues.modConfirmSMSTitle
        , headTextClass: PopupValues.HeadTextClass.INFO_01
        , headText: StringValues.modConfirmSMSHeadText
        , subTextClass: PopupValues.SubTextClass.INFO_01
        , subText: StringValues.modConfirmSMSSubText
        , buttonText1: StringValues.ButtonLabel.MOD_SMS
        , focusablePhone: true
    };

    PopupValues.ID.MOD_CONFIRM_DELETE_SMART_PHONE = "modConfirmDeleteSmartPhone" //스마트폰 번호 삭제 확인
    PopupValues[PopupValues.ID.MOD_CONFIRM_DELETE_SMART_PHONE] = {
        popupType: PopupValues.PopupType.DIALOG
        , iconType: PopupValues.IconType.DELETE
        , title : StringValues.modConfirmDeleteSmartPhoneTitle
        , headTextClass: PopupValues.HeadTextClass.DEFAULT
        , headText: null
        , subTextClass: PopupValues.SubTextClass.DEFAULT
        , subText: StringValues.modConfirmDeleteSmartPhoneSubText
    };

    PopupValues.ID.MOD_ALERT_COMPLETE = "modAlertComplete"; //MOD 완료 후 상세뷰 새로 고침을 위한 ID

    PopupValues.ID.MOD_ALERT_COMPLETE_SMS = "modAlertCompleteSMS" //스마트폰 SMS 전송 완료
    PopupValues[PopupValues.ID.MOD_ALERT_COMPLETE_SMS] = {
        popupType: PopupValues.PopupType.ALERT
        , iconType: PopupValues.IconType.NONE
        , title : StringValues.modAlertSMSCompleteTitle
        , headTextClass: PopupValues.HeadTextClass.SMS + PopupValues.TextClass.ADD_MIDDLE
        , headText: StringValues.modAlertSMSCompleteHeadText
        //, subTextClass: PopupValues.SubTextClass.SMS
        //, subText: StringValues.modAlertSMSCompleteSubText
    };

    PopupValues.ID.MOD_ALERT_COMPLETE_PUSH = "modAlertCompletePush" //스마트폰 PUSH 전송 완료
    PopupValues[PopupValues.ID.MOD_ALERT_COMPLETE_PUSH] = {
        popupType: PopupValues.PopupType.DIALOG_XLARGE
        , iconType: PopupValues.IconType.NONE
        , title : StringValues.modAlertPushCompleteTitle
        , headTextClass: PopupValues.TextClass.TITLE_04_A
        , headText: StringValues.modAlertPushCompleteHeadText
        , subTextClass: PopupValues.TextClass.TITLE_04_B
        , subText: StringValues.modAlertPushCompleteSubText + StringValues.modAlertPushCompleteSubTextVOD
        , subSubTextClass: PopupValues.TextClass.LINE_II
        , subSubText: StringValues.modAlertPushCompleteSubSubText
        , buttonText1: StringValues.ButtonLabel.CONFIRM
        , buttonText2: StringValues.ButtonLabel.MOD_PLAY_TV
    };

    PopupValues.ID.MOD_ALERT_SMS_LIMIT_COUNT = "modAlertSMSLimitCount" //스마트폰 SMS 전송 횟수 에러
    PopupValues[PopupValues.ID.MOD_ALERT_SMS_LIMIT_COUNT] = {
        popupType: PopupValues.PopupType.ALERT_XLARGE
        , iconType: PopupValues.IconType.NONE
        , title : StringValues.modAlertSMSLimitCountTitle
        , headTextClass: PopupValues.TextClass.TITLE_03
        , headText: StringValues.modAlertSMSLimitCountHeadText
        , subTextClass: PopupValues.TextClass.LINE_II
        , subText: StringValues.modAlertSMSLimitCountSubText
    };

    PopupValues.ID.CONFIRM_PURCHASE_CANCEL = "confirmPurchaseCancel" //모바일 결제 취소
    PopupValues[PopupValues.ID.CONFIRM_PURCHASE_CANCEL] = {
        popupType: PopupValues.PopupType.DIALOG
        , iconType: PopupValues.IconType.NONE
        , title : StringValues.confirmPurchaseCancelTitle
        , headTextClass: PopupValues.HeadTextClass.LINE_01
        , headText: StringValues.confirmPurchaseCancelHeadText
    };

    PopupValues.ID.ALERT_LIMITED_PURCHASE = "alertLimitedPurchase" //가입/결제 제한 상태
    PopupValues[PopupValues.ID.ALERT_LIMITED_PURCHASE] = {
        popupType: PopupValues.PopupType.ALERT
        , iconType: PopupValues.IconType.CHECK
        , title : StringValues.alertLimitedPurchaseTitle
        , headTextClass: PopupValues.HeadTextClass.DEFAULT
        , headText: StringValues.alertLimitedPurchaseHeadText
        , subTextClass: PopupValues.SubTextClass.DEFAULT
        , subText: StringValues.alertLimitedPurchaseSubText
    };

    PopupValues.ID.ALERT_LIMITED_MENU = "alertLimitedMenu" //메뉴 진입 제한
    PopupValues[PopupValues.ID.ALERT_LIMITED_MENU] = {
        popupType: PopupValues.PopupType.ALERT
        , iconType: PopupValues.IconType.CHECK
        , title : StringValues.alertLimitedMenuTitle
        , headTextClass: PopupValues.HeadTextClass.DEFAULT
        , headText: StringValues.alertLimitedMenuHeadText
        , subTextClass: PopupValues.SubTextClass.DEFAULT
        , subText: StringValues.alertLimitedMenuSubText
    };

    PopupValues.ID.RATING = "rating" //평점 등록
    PopupValues[PopupValues.ID.RATING] = {
        popupType: PopupValues.PopupType.RATING
    };

    PopupValues.ID.UNJOIN_RCP = "unjoinRcp" //월정액 가입 해지
    PopupValues[PopupValues.ID.UNJOIN_RCP] = {
        popupType: PopupValues.PopupType.UNJOIN_RCP
    };

    PopupValues.ID.DEFAULT_ERROR = "defaultError"; //기본 에러
    PopupValues[PopupValues.ID.DEFAULT_ERROR] = {
        popupType: PopupValues.PopupType.ERROR
        , iconType: PopupValues.IconType.NONE
        , title : StringValues.errorCommonTitle
        , headTextClass: PopupValues.HeadTextClass.DEFAULT
        , headText: StringValues.errorCommonHeadText
        , subTextClass: PopupValues.SubTextClass.DEFAULT
        , subText: StringValues.errorCommonSubText
    };
    PopupValues.ID.COMMUNICATION_ERROR = "communicationError"; //통신 에러
    PopupValues[PopupValues.ID.COMMUNICATION_ERROR] = {
        popupType: PopupValues.PopupType.ERROR
        , iconType: PopupValues.IconType.CHECK
        , title : StringValues.errorCommunicationTitle
        , headTextClass: PopupValues.HeadTextClass.DEFAULT
        , headText: StringValues.errorCommunicationHeadText
        , subTextClass: PopupValues.SubTextClass.DEFAULT
        , subText: StringValues.errorCommunicationSubText
    };
    PopupValues[202] = {
        popupType: PopupValues.PopupType.ERROR
        , iconType: PopupValues.IconType.NONE
        , title : StringValues.errorCommonTitle
        , headTextClass: PopupValues.HeadTextClass.DEFAULT
        , headText: StringValues.errorAuthHeadText
        , subTextClass: PopupValues.SubTextClass.DEFAULT
        , subText: StringValues.errorCommonSubText
    };
    PopupValues[205] = {
        popupType: PopupValues.PopupType.ERROR
        , iconType: PopupValues.IconType.CHECK
        , title : StringValues.errorNotExistTitle
        , headTextClass: PopupValues.HeadTextClass.DEFAULT
        , headText: StringValues.errorNotExistHeadText
        , subTextClass: PopupValues.SubTextClass.DEFAULT
        , subText: StringValues.errorNotExistSubText
    };
    PopupValues[209] = {
        popupType: PopupValues.PopupType.ERROR
        , iconType: PopupValues.IconType.NONE
        , title : StringValues.errorSuspendTitle
        , headTextClass: PopupValues.HeadTextClass.DEFAULT
        , headText: StringValues.errorSuspendHeadText
        , subTextClass: PopupValues.SubTextClass.DEFAULT
        , subText: StringValues.errorSuspendSubText
    };
    //@STB INFO 못받은 에러
    PopupValues.ID.STB_INFO_IS_NULL = "STBInfoIsNull";
    PopupValues[PopupValues.ID.STB_INFO_IS_NULL] = {
        popupType: PopupValues.PopupType.ERROR
        , iconType: PopupValues.IconType.CHECK
        , title : StringValues.errorSTBInfoNullTitle
        , headTextClass: PopupValues.HeadTextClass.DEFAULT
        , headText: StringValues.errorSTBInfoNullHeadText
        , subTextClass: PopupValues.SubTextClass.DEFAULT
        , subText: StringValues.errorSTBInfoNullSubText
    };

    //@MainMenu 에러팝업
    PopupValues.ID.MAIN_MENU_ERROR = "mainMenuError";
    PopupValues[PopupValues.ID.MAIN_MENU_ERROR] = {
        popupType: PopupValues.PopupType.ERROR
        , iconType: PopupValues.IconType.CHECK
        , title : StringValues.errorMainMenuRequestTitle
        , headTextClass: PopupValues.HeadTextClass.DEFAULT
        , headText: StringValues.errorMainMenuRequestHeadText
        , subTextClass: PopupValues.SubTextClass.DEFAULT
        , subText: StringValues.errorMainMenuRequestSubText
    };
    //@존재하지 않는 카테고리 점프 에러
    PopupValues.ID.ABSENCE_CATEGORY = "AbsenceCategory";
    PopupValues[PopupValues.ID.ABSENCE_CATEGORY] = {
        popupType: PopupValues.PopupType.ERROR
        , iconType: PopupValues.IconType.CHECK
        , title : StringValues.errorNotExistTitle
        , headTextClass: PopupValues.HeadTextClass.DEFAULT
        , headText: StringValues.errorNotExistHeadText
        , subTextClass: PopupValues.SubTextClass.DEFAULT
        , subText: StringValues.errorNotExistSubText
    };
    
    PopupValues.ID.DEFAULT_ERROR_PLAY = "defaultErrorPlay"; //play error
    PopupValues[PopupValues.ID.DEFAULT_ERROR_PLAY] = {
        popupType: PopupValues.PopupType.ERROR_PLAY
        , iconType: PopupValues.IconType.NONE
        , title : StringValues.errorCommonTitle
        , headTextClass: PopupValues.HeadTextClass.DEFAULT
        , headText: StringValues.errorPlayHeadText
        , subTextClass: PopupValues.SubTextClass.DEFAULT
        , subText: StringValues.errorCommonSubText
    };

    // player popup - popupviewgroup 안에 속하지 않음 
    PopupValues.ID.EXIT_PREVIEW = "exitPreview"; //미리보기 종료 
    PopupValues[PopupValues.ID.EXIT_PREVIEW] = {
        popupType: PopupValues.PopupType.DIALOG
        , title : StringValues.exitPreviewTitle
        , headText: StringValues.exitPreviewHeadText
        , subText: StringValues.exitPreviewSubText
    };
    PopupValues.ID.EXIT_TRAILER = "exitTrailer"; //예고편 종료 
    PopupValues[PopupValues.ID.EXIT_TRAILER] = {
    	popupType: PopupValues.PopupType.CHOICE
        , title : StringValues.exitTrailerTitle
        , headText: StringValues.exitTrailerHeadText
        , subText: StringValues.exitTrailerSubText
    };
    PopupValues.ID.EXIT_NORMAL_PLAY = "exitNormalPlay"; //play 종료
    PopupValues[PopupValues.ID.EXIT_NORMAL_PLAY] = {
        popupType: PopupValues.PopupType.CHOICE
        , title : StringValues.exitPlayerTitle
        , headText: StringValues.exitPlayerHeadText
        , subText: StringValues.exitPlayerSubText
    };
    
    PopupValues.ID.HIDDEN = "hidden" //hidden
        PopupValues[PopupValues.ID.HIDDEN] = {
        popupType: PopupValues.PopupType.ALERT_XLARGE
        , iconType: PopupValues.IconType.NONE
        , title : StringValues.alertHiddenTitle
        , headTextClass: null
        , headText: null
        , subTextClass: PopupValues.SubTextClass.HIDDEN
        , subText: null
        }
    return PopupValues;
});

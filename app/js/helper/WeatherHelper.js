define(function () {
    var WeatherHelper = {};

    WeatherHelper.getSTNIDBySOCode = function(socode) {
        switch (socode) {
            case WeatherHelper.SO_GANGNAM:
                return WeatherHelper.STNID_GANGNAM;
                break;
            case WeatherHelper.SO_GANGDONG:
                return WeatherHelper.STNID_GANGDONG;
                break;
            case WeatherHelper.SO_GURO_GEUMCHEON:
                return WeatherHelper.STNID_GURO_GEUMCHEON;
                break;
            case WeatherHelper.SO_NOWON:
                return WeatherHelper.STNID_NOWON;
                break;
            case WeatherHelper.SO_GWANGJIN:
                return WeatherHelper.STNID_GWANGJIN;
                break;
            case WeatherHelper.SO_MAPO:
                return WeatherHelper.STNID_MAPO;
                break;
            case WeatherHelper.SO_SEONGBUK:
                return WeatherHelper.STNID_SEONGBUK;
                break;
            case WeatherHelper.SO_SEODAEMUN:
                return WeatherHelper.STNID_SEODAEMUN;
                break;
            case WeatherHelper.SO_SEOCHO:
                return WeatherHelper.STNID_SEOCHO;
                break;
            case WeatherHelper.SO_SONGPA:
                return WeatherHelper.STNID_SONGPA;
                break;
            case WeatherHelper.SO_YONGSAN:
                return WeatherHelper.STNID_YONGSAN;
                break;
            case WeatherHelper.SO_JUNGNANG:
                return WeatherHelper.STNID_JUNGNANG;
                break;
            case WeatherHelper.SO_JONGNO_JUNG:
                return WeatherHelper.STNID_JONGNO_JUNG;
                break;
            case WeatherHelper.SO_UIJEONGBU:
                return WeatherHelper.STNID_UIJEONGBU;
                break;
            case WeatherHelper.SO_PAJU:
                return WeatherHelper.STNID_PAJU;
                break;
            case WeatherHelper.SO_GWANGJU:
                return WeatherHelper.STNID_GWANGJU;
                break;
            case WeatherHelper.SO_NAMYANGJU:
                return WeatherHelper.STNID_NAMYANGJU;
                break;
            case WeatherHelper.SO_SONGPA_CNM:
                return WeatherHelper.STNID_SONGPA_CNM;
                break;
            case WeatherHelper.SO_GANGNAM_CNM:
                return WeatherHelper.STNID_GANGNAM_CNM;
                break;
            case WeatherHelper.SO_ULSAN:
            case WeatherHelper.SO_ULSANJCM:
                return WeatherHelper.STNID_ULSAN;
            case WeatherHelper.SO_SEOKYUNG:
                return WeatherHelper.STNID_ULSAN;
            default:
                return WeatherHelper.STNID_SEOUL;

        }
    };

    WeatherHelper.getStationNameBySTNID = function(STNID){
        switch (STNID) {
            case WeatherHelper.STNID_GANGNAM:
                return WeatherHelper.GANGNAM;
                break;
            case WeatherHelper.STNID_GANGDONG:
                return WeatherHelper.GANGDONG;
                break;
            case WeatherHelper.STNID_GURO_GEUMCHEON:
                return WeatherHelper.GURO_GEUMCHEON;
                break;
            case WeatherHelper.STNID_NOWON:
                return WeatherHelper.NOWON;
                break;
            case WeatherHelper.STNID_GWANGJIN:
                return WeatherHelper.GWANGJIN;
                break;
            case WeatherHelper.STNID_MAPO:
                return WeatherHelper.MAPO;
                break;
            case WeatherHelper.STNID_SEONGBUK:
                return WeatherHelper.SEONGBUK;
                break;
            case WeatherHelper.STNID_SEODAEMUN:
                return WeatherHelper.SEODAEMUN;
                break;
            case WeatherHelper.STNID_SEOCHO:
                return WeatherHelper.SEOCHO;
                break;
            case WeatherHelper.STNID_SONGPA:
                return WeatherHelper.SONGPA;
                break;
            case WeatherHelper.STNID_YONGSAN:
                return WeatherHelper.YONGSAN;
                break;
            case WeatherHelper.STNID_JUNGNANG:
                return WeatherHelper.JUNGNANG;
                break;
            case WeatherHelper.STNID_JONGNO_JUNG:
                return WeatherHelper.JONGNO_JUNG;
                break;
            case WeatherHelper.STNID_UIJEONGBU:
                return WeatherHelper.UIJEONGBU;
                break;
            case WeatherHelper.STNID_PAJU:
                return WeatherHelper.PAJU;
                break;
            case WeatherHelper.STNID_GWANGJU:
                return WeatherHelper.GWANGJU;
                break;
            case WeatherHelper.STNID_NAMYANGJU:
                return WeatherHelper.NAMYANGJU;
                break;
            case WeatherHelper.STNID_SONGPA_CNM:
                return WeatherHelper.SONGPA_CNM;
                break;
            case WeatherHelper.STNID_GANGNAM_CNM:
                return WeatherHelper.GANGNAM_CNM;
                break;
            default:
                return "";
        }
    };

    WeatherHelper.getCityNameBySOCode = function (socode) {
        return WeatherHelper.CITY[socode];
    }

    WeatherHelper.getTownNameBySOCode = function (socode) {
        return WeatherHelper.TOWN[socode];
    }

    WeatherHelper.getVillageNameBySOCode = function (socode) {
        return WeatherHelper.VILLAGE[socode];
    }

    WeatherHelper.getDisplayNameBySOCode = function (socode) {
        return WeatherHelper.DISPLAY_NAME[socode];
    }

    WeatherHelper.SO_GANGNAM_CNM = "0";
    WeatherHelper.SO_JUNGNANG = "1";
    WeatherHelper.SO_GWANGJIN = "2";
    WeatherHelper.SO_NOWON = "3";
    WeatherHelper.SO_UIJEONGBU = "4";
    WeatherHelper.SO_SEONGBUK = "5";
    WeatherHelper.SO_SEODAEMUN = "6";
    WeatherHelper.SO_ULSAN = "7";
    WeatherHelper.SO_JONGNO_JUNG = "8";
    WeatherHelper.SO_YONGSAN = "9";
    WeatherHelper.SO_MAPO = "10";
    WeatherHelper.SO_PAJU = "11";
    WeatherHelper.SO_SONGPA = "12";
    //WeatherHelper.SO_SONGPA_CNM = "12";
    WeatherHelper.SO_GURO_GEUMCHEON = "13";
    WeatherHelper.SO_SEOCHO = "14";
    WeatherHelper.SO_NAMYANGJU = "15";
    WeatherHelper.SO_GANGDONG = "16";
    WeatherHelper.SO_GANGNAM = "17";
    WeatherHelper.SO_ULSANJCM = "19";
    WeatherHelper.SO_SEOKYUNG = "21";
    WeatherHelper.SO_GWANGJU = "22";

    WeatherHelper.CITY = {};
    WeatherHelper.CITY[WeatherHelper.SO_GANGNAM_CNM] = "서울";
    WeatherHelper.CITY[WeatherHelper.SO_JUNGNANG] = "서울";
    WeatherHelper.CITY[WeatherHelper.SO_GWANGJIN] = "서울";
    WeatherHelper.CITY[WeatherHelper.SO_NOWON] = "서울";
    WeatherHelper.CITY[WeatherHelper.SO_UIJEONGBU] = "경기";
    WeatherHelper.CITY[WeatherHelper.SO_SEONGBUK] = "서울";
    WeatherHelper.CITY[WeatherHelper.SO_SEODAEMUN] = "서울";
    WeatherHelper.CITY[WeatherHelper.SO_ULSAN] = "울산";
    WeatherHelper.CITY[WeatherHelper.SO_JONGNO_JUNG] = "서울";
    WeatherHelper.CITY[WeatherHelper.SO_YONGSAN] = "서울";
    WeatherHelper.CITY[WeatherHelper.SO_MAPO] = "서울";
    WeatherHelper.CITY[WeatherHelper.SO_PAJU] = "경기";
    WeatherHelper.CITY[WeatherHelper.SO_SONGPA] = "서울";
    WeatherHelper.CITY[WeatherHelper.SO_SONGPA_CNM] = "서울";
    WeatherHelper.CITY[WeatherHelper.SO_GURO_GEUMCHEON] = "서울";
    WeatherHelper.CITY[WeatherHelper.SO_SEOCHO] = "서울";
    WeatherHelper.CITY[WeatherHelper.SO_NAMYANGJU] = "경기";
    WeatherHelper.CITY[WeatherHelper.SO_GANGDONG] = "서울";
    WeatherHelper.CITY[WeatherHelper.SO_GANGNAM] = "서울";
    WeatherHelper.CITY[WeatherHelper.SO_ULSANJCM] = "울산";
    WeatherHelper.CITY[WeatherHelper.SO_SEOKYUNG] = "경남";
    WeatherHelper.CITY[WeatherHelper.SO_GWANGJU] = "광주";

    WeatherHelper.TOWN = {};
    WeatherHelper.TOWN[WeatherHelper.SO_GANGNAM_CNM] = "강남구";
    WeatherHelper.TOWN[WeatherHelper.SO_JUNGNANG] = "중랑구";
    WeatherHelper.TOWN[WeatherHelper.SO_GWANGJIN] = "광진구";
    WeatherHelper.TOWN[WeatherHelper.SO_NOWON] = "노원구";
    WeatherHelper.TOWN[WeatherHelper.SO_UIJEONGBU] = "의정부시";
    WeatherHelper.TOWN[WeatherHelper.SO_SEONGBUK] = "성북구";
    WeatherHelper.TOWN[WeatherHelper.SO_SEODAEMUN] = "서대문구";
    WeatherHelper.TOWN[WeatherHelper.SO_ULSAN] = "남구";
    WeatherHelper.TOWN[WeatherHelper.SO_JONGNO_JUNG] = "종로구";
    WeatherHelper.TOWN[WeatherHelper.SO_YONGSAN] = "용산구";
    WeatherHelper.TOWN[WeatherHelper.SO_MAPO] = "마포구";
    WeatherHelper.TOWN[WeatherHelper.SO_PAJU] = "파주시";
    WeatherHelper.TOWN[WeatherHelper.SO_SONGPA] = "송파구";
    //WeatherHelper.TOWN[WeatherHelper.SO_SONGPA_CNM] = "송파구";
    WeatherHelper.TOWN[WeatherHelper.SO_GURO_GEUMCHEON] = "금천구";
    WeatherHelper.TOWN[WeatherHelper.SO_SEOCHO] = "서초구";
    WeatherHelper.TOWN[WeatherHelper.SO_NAMYANGJU] = "남양주시";
    WeatherHelper.TOWN[WeatherHelper.SO_GANGDONG] = "강동구";
    WeatherHelper.TOWN[WeatherHelper.SO_GANGNAM] = "강남구";
    WeatherHelper.TOWN[WeatherHelper.SO_ULSANJCM] = "남구";
    WeatherHelper.TOWN[WeatherHelper.SO_SEOKYUNG] = "진주시";
    WeatherHelper.TOWN[WeatherHelper.SO_GWANGJU] = "서구";

    WeatherHelper.VILLAGE = {};
    WeatherHelper.VILLAGE[WeatherHelper.SO_GANGNAM_CNM] = "역삼동";
    WeatherHelper.VILLAGE[WeatherHelper.SO_JUNGNANG] = "면목동";
    WeatherHelper.VILLAGE[WeatherHelper.SO_GWANGJIN] = "중곡동";
    WeatherHelper.VILLAGE[WeatherHelper.SO_NOWON] = "월계동";
    WeatherHelper.VILLAGE[WeatherHelper.SO_UIJEONGBU] = "의정부동";
    WeatherHelper.VILLAGE[WeatherHelper.SO_SEONGBUK] = "성북동";
    WeatherHelper.VILLAGE[WeatherHelper.SO_SEODAEMUN] = "충정로2가";
    WeatherHelper.VILLAGE[WeatherHelper.SO_ULSAN] = "신정동";
    WeatherHelper.VILLAGE[WeatherHelper.SO_JONGNO_JUNG] = "청운동";
    WeatherHelper.VILLAGE[WeatherHelper.SO_YONGSAN] = "후암동";
    WeatherHelper.VILLAGE[WeatherHelper.SO_MAPO] = "아현동";
    WeatherHelper.VILLAGE[WeatherHelper.SO_PAJU] = "금촌동";
    WeatherHelper.VILLAGE[WeatherHelper.SO_SONGPA] = "잠실동";
    //WeatherHelper.VILLAGE[WeatherHelper.SO_SONGPA_CNM] = "잠실동";
    WeatherHelper.VILLAGE[WeatherHelper.SO_GURO_GEUMCHEON] = "가산동";
    WeatherHelper.VILLAGE[WeatherHelper.SO_SEOCHO] = "방배동";
    WeatherHelper.VILLAGE[WeatherHelper.SO_NAMYANGJU] = "호평동";
    WeatherHelper.VILLAGE[WeatherHelper.SO_GANGDONG] = "명일동";
    WeatherHelper.VILLAGE[WeatherHelper.SO_GANGNAM] = "역삼동";
    WeatherHelper.VILLAGE[WeatherHelper.SO_ULSANJCM] = "신정동";
    WeatherHelper.VILLAGE[WeatherHelper.SO_SEOKYUNG] = "상대동";
    WeatherHelper.VILLAGE[WeatherHelper.SO_GWANGJU] = "치평동";


    WeatherHelper.DISPLAY_NAME = {};
    WeatherHelper.DISPLAY_NAME[WeatherHelper.SO_GANGNAM_CNM] = "강남구";
    WeatherHelper.DISPLAY_NAME[WeatherHelper.SO_JUNGNANG] = "중랑구";
    WeatherHelper.DISPLAY_NAME[WeatherHelper.SO_GWANGJIN] = "성동,광진구";
    WeatherHelper.DISPLAY_NAME[WeatherHelper.SO_NOWON] = "노원구";
    WeatherHelper.DISPLAY_NAME[WeatherHelper.SO_UIJEONGBU] = "경기북부";
    WeatherHelper.DISPLAY_NAME[WeatherHelper.SO_SEONGBUK] = "성북구";
    WeatherHelper.DISPLAY_NAME[WeatherHelper.SO_SEODAEMUN] = "서대문구";
    WeatherHelper.DISPLAY_NAME[WeatherHelper.SO_ULSAN] = "울산";
    WeatherHelper.DISPLAY_NAME[WeatherHelper.SO_JONGNO_JUNG] = "종로,중구";
    WeatherHelper.DISPLAY_NAME[WeatherHelper.SO_YONGSAN] = "용산구";
    WeatherHelper.DISPLAY_NAME[WeatherHelper.SO_MAPO] = "마포구";
    WeatherHelper.DISPLAY_NAME[WeatherHelper.SO_PAJU] = "파주,고양시";
    WeatherHelper.DISPLAY_NAME[WeatherHelper.SO_SONGPA] = "송파구";
    //WeatherHelper.DISPLAY_NAME[WeatherHelper.SO_SONGPA_CNM] = "송파구";
    WeatherHelper.DISPLAY_NAME[WeatherHelper.SO_GURO_GEUMCHEON] = "구로,금천구";
    WeatherHelper.DISPLAY_NAME[WeatherHelper.SO_SEOCHO] = "서초구";
    WeatherHelper.DISPLAY_NAME[WeatherHelper.SO_NAMYANGJU] = "경기동부";
    WeatherHelper.DISPLAY_NAME[WeatherHelper.SO_GANGDONG] = "강동구";
    WeatherHelper.DISPLAY_NAME[WeatherHelper.SO_GANGNAM] = "강남구";
    WeatherHelper.DISPLAY_NAME[WeatherHelper.SO_ULSANJCM] = "울산";
    WeatherHelper.DISPLAY_NAME[WeatherHelper.SO_SEOKYUNG] = "";
    WeatherHelper.DISPLAY_NAME[WeatherHelper.SO_GWANGJU] = "광주";

    WeatherHelper.STNID_GANGNAM = "400";
    WeatherHelper.STNID_GANGDONG = "402";
    WeatherHelper.STNID_GURO_GEUMCHEON = "417";
    WeatherHelper.STNID_NOWON = "407";
    WeatherHelper.STNID_GWANGJIN = "413";
    WeatherHelper.STNID_MAPO = "411";
    WeatherHelper.STNID_SEONGBUK = "414";
    WeatherHelper.STNID_SEODAEMUN = "404";
    WeatherHelper.STNID_SEOCHO = "401";
    WeatherHelper.STNID_SONGPA = "403";
    WeatherHelper.STNID_YONGSAN = "415";
    WeatherHelper.STNID_JUNGNANG = "409";
    WeatherHelper.STNID_JONGNO_JUNG = "422";
    WeatherHelper.STNID_UIJEONGBU = "532";
    WeatherHelper.STNID_PAJU = "99";
    WeatherHelper.STNID_GWANGJU = "546";
    WeatherHelper.STNID_NAMYANGJU = "541";
    WeatherHelper.STNID_SONGPA_CNM = "403";
    WeatherHelper.STNID_GANGNAM_CNM = "400";
    WeatherHelper.STNID_SEOUL = "108";
    WeatherHelper.STNID_ULSAN = "108";
    WeatherHelper.STNID_SEOKYUNG = "108";

    WeatherHelper.GANGNAM = "강남구";
    WeatherHelper.GANGDONG = "강동구";
    WeatherHelper.GURO_GEUMCHEON = "구로 금천구";
    WeatherHelper.NOWON = "노원구";
    WeatherHelper.GWANGJIN = "성동 광진구";
    WeatherHelper.MAPO = "마포구";
    WeatherHelper.SEONGBUK = "성북구";
    WeatherHelper.SEODAEMUN = "서대문구";
    WeatherHelper.SEOCHO = "서초구";
    WeatherHelper.SONGPA = "송파구";
    WeatherHelper.YONGSAN = "용산구";
    WeatherHelper.JUNGNANG = "중랑구";
    WeatherHelper.JONGNO_JUNG = "종로 중구";
    WeatherHelper.UIJEONGBU = "경기 북부";
    WeatherHelper.PAJU = "파주 고양";
    WeatherHelper.GWANGJU = "광주";
    WeatherHelper.NAMYANGJU = "경기 동부";
    WeatherHelper.SONGPA_CNM = "송파구";
    WeatherHelper.GANGNAM_CNM = "강남구";


    return WeatherHelper;
});
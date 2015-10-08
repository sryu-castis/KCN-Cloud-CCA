/**
 * 일자를 계산하는 경우 사용
 */
define(["cca/type/ViewablePeriodType"], function(ViewablePeriodType) {
    var DateHelper = {};

    var DATE_FORMAT_DD = /(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/; //YYYY-MM-DD HH:MM:SS
    var DATE_FORMAT_DDD = /(\d{4})-(\d{2})-(\d{3}) (\d{2}):(\d{2}):(\d{2})/; //YYYY-MM-DDD HH:MM:SS
    
    DateHelper.getCurrentTime = function () {
        // yyyy-MM-dd HH:mm:ss
        var date = new Date();
//        var timeStamp = leadingZeros(date.getFullYear(), 4) + '-' + leadingZeros(date.getMonth() + 1, 2) + '-' + leadingZeros(date.getDate(), 2)
//            + ' ' +
//            leadingZeros(date.getHours(), 2) + ':' + leadingZeros(date.getMinutes(), 2) + ':' + leadingZeros(date.getSeconds(), 2);

        return DateHelper.getDateTime(date);
    };
    
    DateHelper.getDateTime = function (date) {
        // yyyy-MM-dd HH:mm:ss
        var timeStamp = leadingZeros(date.getFullYear(), 4) + '-' + leadingZeros(date.getMonth() + 1, 2) + '-' + leadingZeros(date.getDate(), 2)
            + ' ' +
            leadingZeros(date.getHours(), 2) + ':' + leadingZeros(date.getMinutes(), 2) + ':' + leadingZeros(date.getSeconds(), 2);

        console.log("getDateTime="+timeStamp);
        return timeStamp;
    };

    DateHelper.leadingZeros = function(number, digits) {
        return leadingZeros(number, digits);
    };

    function leadingZeros(number, digits) {
        var zero = '';
        number = number.toString();

        if (number.length < digits) {
            for ( var i = 0; i < digits - number.length; i++) {
                zero += '0';
            }
        }
        return zero + number;
    }

    // 상영시간
    DateHelper.getMinuteByRunningTime = function(runningTime) {
        var returnMinute = "";
        if (runningTime != null && runningTime.length > 0) {
            var intervalIndex_hour = runningTime.indexOf(":");
            var hour = Number(runningTime.substring(0, intervalIndex_hour));
            var minute = Number(runningTime.substring(intervalIndex_hour + 1));
            returnMinute = (hour * 60) + minute;
        }
        return returnMinute;
    };

    DateHelper.getReleaseDate = function (releaseDate) {
        return releaseDate.split(' ')[0].replace(/-/gi, '.');
    }

    DateHelper.getTimeStringbySecond = function(_seconds) {
        var hours = parseInt(_seconds / 3600);
        var mins = parseInt(parseInt(_seconds / 60) % parseInt(60));
        var seconds = _seconds - (hours * 3600 + mins * 60);
        hours = leadingZeros(hours, 2);
        mins = leadingZeros(mins, 2);
        seconds = leadingZeros(seconds, 2);
//		return hours + ":" + mins + ":" + seconds;
        return [hours, mins, seconds];
    };

    DateHelper.getDateObject = function(dateString) {
    	//var reggie = DATE_FORMAT_DD; //YYYY-MM-DD HH:MM:SS
    	//var dateArray = reggie.exec(dateString);
    	//var dateObject = new Date(
    	//    (+dateArray[1]),
    	//    (+dateArray[2])-1, // Careful, month starts at 0!
    	//    (+dateArray[3]),
    	//    (+dateArray[4]),
    	//    (+dateArray[5]),
    	//    (+dateArray[6])
    	//);
        var dateObject = new Date(dateString);
    	return dateObject;
    }

    DateHelper.getNowDateString = function () {
        var date = new Date();
        var dateString = leadingZeros(date.getFullYear(), 4) + '-' + leadingZeros(date.getMonth() + 1, 2) + '-' + leadingZeros(date.getDate(), 2);
        return dateString;
    }

    //구매후 시청가능 기간 
    DateHelper.getViewableDateString = function(purchasedTime, viewablePeriod) {
    	var viewableDateString = "";

        var purchasedTime = DateHelper.getDateObject(purchasedTime);

        var reggie = DATE_FORMAT_DD;
        if(!reggie.test(viewablePeriod)) {
            reggie = DATE_FORMAT_DDD;
        }
        var viewablePeriodDateArray = reggie.exec(viewablePeriod);

        var viewableTime = new Date();
        viewableTime.setYear(purchasedTime.getFullYear()+(+viewablePeriodDateArray[1]));
        viewableTime.setMonth(purchasedTime.getMonth()+(+viewablePeriodDateArray[2]));
        viewableTime.setDate(purchasedTime.getDate()+(+viewablePeriodDateArray[3]));
        viewableTime.setHours(purchasedTime.getHours()+(+viewablePeriodDateArray[4]));
        viewableTime.setMinutes(purchasedTime.getMinutes()+(+viewablePeriodDateArray[5]));
        viewableTime.setSeconds(purchasedTime.getSeconds()+(+viewablePeriodDateArray[6]));

        var diffMilSec = viewableTime - new Date();

        if(diffMilSec > 0) {
            var diffSec = diffMilSec / 1000;
            var diffMin = diffSec / 60;
            var diffHour = diffMin / 60;
            var diffDay = diffHour / 24;

            if(Math.floor(diffDay) > 0) {
                viewableDateString = Math.floor(diffDay)+"일";
            } else if(Math.floor(diffHour) > 0){
                viewableDateString = Math.floor(diffHour)+"시간";
            } else {
                viewableDateString = "1시간"; //1시간 미만시 기본값
            }
        } else {
            viewableDateString = "기간만료";
        }
    	
    	 return viewableDateString;
    };
    
    DateHelper.getDateWeekTimeString = function(dateString) {
    	var date = DateHelper.getDateObject(dateString);
    	var dateWeek = leadingZeros(date.getMonth()+1,2)+"월 "+leadingZeros(date.getDate(),2)+"일 ("+getDayOfWeek(date)+")";
        var hour = leadingZeros(date.getHours(),2);
    	var min = leadingZeros(date.getMinutes(),2);
    	return dateWeek +" "+ hour +":"+ min;
    }

    DateHelper.getDateHourMinuteString = function(dateString) {
        var date = DateHelper.getDateObject(dateString);
        var day = leadingZeros(date.getMonth()+1,2)+"월 "+leadingZeros(date.getDate(),2)+"일 ";
        var hour = leadingZeros(date.getHours(),2);
        var min = leadingZeros(date.getMinutes(),2);
        return day +" "+ hour +":"+ min;
    }

	DateHelper.getDateString = function(dateString) {
		var reggie = /(\d{4})-(\d{2})-(\d{2})/; //YYYYMMDD
    	var dateArray = reggie.exec(dateString);
    	return (dateArray[1])+"년 "+(dateArray[2])+"월 "+(dateArray[3])+"일";
	}

	DateHelper.getDateWeekString = function(dateString) {
        var date = DateHelper.getDateObject(dateString);
        var dateWeek = leadingZeros(date.getMonth()+1,2)+"월 "+leadingZeros(date.getDate(),2)+"일 ("+getDayOfWeek(date)+")";
        return dateWeek;
    }

    DateHelper.getDateWeekAPMTimeString = function(dateString) {

        var date = DateHelper.getDateObject(dateString);
        var dateWeek = leadingZeros(date.getMonth()+1,2)+"월 "+leadingZeros(date.getDate(),2)+"일 ("+getDayOfWeek(date)+")";
        var hour = (date.getHours() <= 12) ? "AM "+leadingZeros(date.getHours(),2) :"PM "+leadingZeros(date.getHours()-12,2);
        //var hour = leadingZeros(date.getHours(),2);
        var min = leadingZeros(date.getMinutes(),2);
        return dateWeek +" "+ hour +":"+ min;
    }

    //DateHelper.getDateAPMTimeString = function(dateString) {
    //	var date = DateHelper.getDateObject(dateString);
    //    var day = getDayOfWeek(date);
    //	var dateWeek = leadingZeros(date.getMonth()+1,2)+"월 (" + day +"요일) "+leadingZeros(date.getDate(),2)+"일";
    //    var hour = leadingZeros(date.getHours(),2);
    //	var min = leadingZeros(date.getMinutes(),2);
    //	return dateWeek +" "+ hour +":"+ min;
    //}

    DateHelper.getDayOfWeek = function(date) {
        return getDayOfWeek(date)
    };

    function getDayOfWeek(date) {
        var day = date.getDay(); //일요일=0,월요일=1,...,토요일=6
        var week = new Array('일','월','화','수','목','금','토');

        return week[day];
    }

    // 구매시 시청가능 기간
    DateHelper.getViewablePeriodText = function(viewablePeriod) {
        var intervalIndex = viewablePeriod.indexOf(" ");
        var intervalIndex_hour = viewablePeriod.indexOf(":");
        var viewablePeriodString = "";
        if (intervalIndex > 9 && intervalIndex < 12) {
            var year = parseInt(viewablePeriod.substring(0, 4));
            if (year > 0) {
                viewablePeriodString += year + "년";
            }
            var month = parseInt(viewablePeriod.substring(5, 7));
            if (month > 0) {
                viewablePeriodString += month + "월";
            }
            var day = parseInt(viewablePeriod.substring(8, intervalIndex));
            if (day > 0) {
                viewablePeriodString += day + "일";
            }
            var hour = parseInt(viewablePeriod.substring(intervalIndex + 1, intervalIndex_hour));
            if (hour > 0) {
                viewablePeriodString += hour + "시간";
            }
            var minute = parseInt(viewablePeriod.substring(intervalIndex_hour + 1, intervalIndex_hour + 3));
            if (minute > 0) {
                viewablePeriodString += minute + "분";
            }
        }
        return viewablePeriodString;
    };

    // 구매시 시청가능 기간 팝업
    DateHelper.getViewablePeriodTextForPopup = function(viewablePeriodState, viewablePeriod) {
        var viewablePeriodString = "";

        if(ViewablePeriodType.UNLIMITED == viewablePeriodState) {
            //무제한 시청
            viewablePeriodString = CCABase.StringSources.unLimitedPeriod;
        } else {
            var intervalIndex = viewablePeriod.indexOf(" ");
            var intervalIndex_hour = viewablePeriod.indexOf(":");
            if (intervalIndex > 9 && intervalIndex < 12) {
                var year = parseInt(viewablePeriod.substring(0, 4));
                if (year > 0) {
                    viewablePeriodString += year + " 년 ";
                }
                var month = parseInt(viewablePeriod.substring(5, 7));
                if (month > 0) {
                    viewablePeriodString += month + " 월 ";
                }
                var day = parseInt(viewablePeriod.substring(8, intervalIndex));
                if (day > 0) {
                    viewablePeriodString += day + " 일 ";
                }
                var hour = parseInt(viewablePeriod.substring(intervalIndex + 1, intervalIndex_hour));
                if (hour > 0) {
                    viewablePeriodString += hour + " 시간 ";
                }
                var minute = parseInt(viewablePeriod.substring(intervalIndex_hour + 1, intervalIndex_hour + 3));
                if (minute > 0) {
                    viewablePeriodString += minute + " 분 ";
                }
                viewablePeriodString = viewablePeriodString.replace(/(^\s*)|(\s*$)/gi, "");
            }
        }
        return viewablePeriodString;
    };

    DateHelper.getRentalPeriod = function(duration, unit) {
        var now = new Date();
        var korUnit = "";
        switch(unit) {
            case 0:
                korUnit = " 시";
                break;
            case 1:
                korUnit = " 일";
                break;
            case 2:
                korUnit = " 주";
                break;
            case 3:
                korUnit = " 개월";
                break;
            case 4:
                korUnit = " 년";
                break;
            default:
                break;
        };
        return duration + korUnit;
    };

    DateHelper.getRentalEndDate = function (duration, unit) {
        var now = new Date();
        switch(unit) {
            case 0:
                now.setHours(now.getHours() + duration);
                break;
            case 1:
                now.setDate(now.getDate() + duration);
                break;
            case 2:
                now.setDate(now.getDate() + duration*7);
                break;
            case 3:
                now.setMonth(now.getMonth() + duration);
                break;
            case 4:
                now.setFullYear(now.getFullYear() + duration);
                break;
            default:
                break;
        };
        return now.toISOString().split('T')[0];
    }

    /*DateHelper.getLicenseEndDate = function(_licenseEnd) {
        var strEndDate = "";
        // 편성 종료
        if (_licenseEnd != null && _licenseEnd.length > 0) {
            var licenseEndDate = new Date();

            var year = Number(_licenseEnd.substring(0, 4));
            var month = Number(_licenseEnd.substring(5, 7));
            var day = Number(_licenseEnd.substring(8, 10));
            var hour = Number(_licenseEnd.substring(11, 13));
            var minute = Number(_licenseEnd.substring(14, 16));
            var second = Number(_licenseEnd.substring(17, 19));

            licenseEndDate.setFullYear(year, month - 1, day);
            licenseEndDate.setHours(hour, minute, second, 000);

            var afterDate = new Date();
            afterDate.setFullYear(afterDate.getFullYear(), afterDate.getMonth(), afterDate.getDate() + 10);

            if (afterDate.getTime() >= licenseEndDate.getTime()) {
                strEndDate = "편성종료 " + licenseEndDate.getFullYear() + "-" + leadingZeros((licenseEndDate.getMonth() + 1), 2) + "-"
                    + leadingZeros(licenseEndDate.getDate(), 2);
            }
        }
        return strEndDate;
    };

    DateHelper.isExpirationTime = function(_expirationTime) {
        var isExpiration = false;
        // 편성 종료
        if (_expirationTime != null && _expirationTime.length > 0) {
            var expirationDate = new Date();

            var year = Number(_expirationTime.substring(0, 4));
            var month = Number(_expirationTime.substring(5, 7));
            var day = Number(_expirationTime.substring(8, 10));
            var hour = Number(_expirationTime.substring(11, 13));
            var minute = Number(_expirationTime.substring(14, 16));
            var second = Number(_expirationTime.substring(17, 19));

            expirationDate.setFullYear(year, month - 1, day);
            expirationDate.setHours(hour, minute, second, 000);

            var currentDate = new Date();
            if (expirationDate.getTime() >= currentDate.getTime()) {
                isExpiration = true;
            }
        }
        return isExpiration;
    };*/

    return DateHelper;
});
var cnmAutomata = (function() {

    var mode = 0;               // 입력모드: 0:한글, 1:영어, 2:숫자
    var cursor = 0;             // 커서상태: 0:입력모드, 1:한글/영어수정모드
    var cursorCB = null;        // 커서상태 변경시 callback 함수
    var result = "";


    /****************************************************************/
    // 숫자 오토마타 start
    var numAutomata = (function() {
        var keydown = function(key) {
            if (key >= 0 && key <= 9) {     // 숫자입력
                result += (key + "");
            }
            else if (key == 219 - 48) {           // 지우기
                result = result.substring(0, result.length - 1);
            }
            else if (key == 220 - 48) {           // 모드변경
                setMode(0);
            }

            return result;
        };

        return {
            keydown: keydown
        }
    })();
    // 숫자 오토마타 end
    /****************************************************************/


    /****************************************************************/
    // 영어 오토마타 start
    var engAutomata = (function() {
        var timerId = null;         // 타이머id
        var preKey = null;          // 이전키
        var queue = "";
        var idx = 0;

        var keyCode = {
            2:['A','B','C'],   3:['D','E','F'],
            4:['G','H','I'],     5:['J','K','L'],   6:['M','N','O'],
            7:['P','Q','R','S'], 8:['T','U','V'],   9:['W','X','Y','Z']
        };

        var keydown = function(key) {
            if (keyCode[key] != null) {
                if (preKey != key) {
                    flushQueue();
                    idx = 0;
                    preKey = key;
                    queue = keyCode[key][idx];
                }
                else {
                    idx++;
                    queue = keyCode[key][idx % keyCode[key].length];
                }
                setTimer();
            }
            else if (key == 0) {
                flushQueue();
                result += " ";
            }
            else if (key == 46 - 48) {     // 덧쓰기(*)
                flushQueue();
                result += "*";
            }
            else if (key == 187 - 48) {     // 쌍자음(#)
                flushQueue();
                result += "#";
            }
            else if (key == 219 - 48) {     // 지우기
                if (queue == "")
                    result = result.substring(0, result.length - 1);
                else {
                    init();
                    setCursor(0);
                }
            }
            else if (key == 220 - 48) {           // 모드변경
                flushQueue();
                setMode(2);
            }

            return getResult();
        };

        var init = function() {
            clearTimer();
            preKey = null;
            queue = "";
            idx = 0;
        };

        var getResult = function() {
            return result  + queue;
        };

        var clearTimer = function() {
            if (timerId != null)
                clearTimeout(timerId);
        };

        var setTimer = function() {
            clearTimer();
            setCursor(1);     // 커서 편집모드
            timerId = setTimeout(function() {
                engAutomata.flushQueue();
            }, 2000);
        };

        var flushQueue = function() {
            result += queue;
            setCursor(0);     // 커서 입력모드
            init();
        };

        return {
            init: init,
            keydown: keydown,
            flushQueue: flushQueue
        }
    })();
    // 영어 오토마타 end
    /****************************************************************/


    /****************************************************************/
    // 한글 오토마타 start
    // 초성: ㄱ(0) ㄲ(1) ㄴ(2) ㄷ(3) ㄸ(4) ㄹ(5) ㅁ(6) ㅂ(7) ㅃ(8) ㅅ(9) ㅆ(10) ㅇ(11) ㅈ(12) ㅉ(13) ㅊ(14) ㅋ(15) ㅌ(16) ㅍ(17) ㅎ(18)
    // 중성: ㅏ(19) ㅐ(20) ㅑ(21) ㅒ(22) ㅓ(23) ㅔ(24) ㅕ(25) ㅖ(26) ㅗ(27) ㅘ(28) ㅙ(29) ㅚ(30) ㅛ(31) ㅜ(32) ㅝ(33) ㅞ(34) ㅟ(35) ㅠ(36) ㅡ(37) ㅢ(38) ㅣ(39)
    // 종성: 없음(40) ㄱ(41) ㄲ(42) ㄳ(43) ㄴ(44) ㄵ(45) ㄶ(46) ㄷ(47) ㄹ(48) ㄺ(49) ㄻ(50) ㄼ(51) ㄽ(52) ㄾ(53) ㄿ(54) ㅀ(55)
    //          ㅁ(56) ㅂ(57) ㅄ(58) ㅅ(59) ㅆ(60) ㅇ(61) ㅈ(62) ㅊ(63) ㅋ(64) ㅌ(65) ㅍ(66) ㅎ(67)
    // 수식: 한글글자 = 초성*21*28 + 중성*28+종성 + 0xAC00(한글코드 테이블의 첫번째 문자코드)

    var korAutomata = (function() {

        var koUnicodeMap = {    // 자음/모음 코드값
            // 자음: ㄱ ㄲ ㄴ ㄷ ㄸ ㄹ ㅁ ㅂ ㅃ ㅅ ㅆ ㅇ ㅈ ㅉ ㅊ ㅋ ㅌ ㅍ ㅎ
            ja: [1, 2, 4, 7, 8, 9, 0x11, 0x12, 0x13, 0x15, 0x16, 0x17, 0x18, 0x19, 0x1A, 0x1B, 0x1C, 0x1D, 0x1E],
            // 모음: ㅏ ㅐ ㅑ ㅒ ㅓ ㅔ ㅕ ㅖ ㅗ ㅘ ㅙ ㅚ ㅛ ㅜ ㅝ ㅞ ㅟ ㅠ ㅡ ㅢ ㅣ
            mo: [0x1F, 0x20, 0x21, 0x22, 0x23, 0x24, 0x25, 0x26, 0x27, 0x28, 0x29, 0x2A, 0x2B, 0x2C, 0x2D, 0x2E, 0x2F, 0x30, 0x31, 0x32, 0x33]
        };
        var keyCode = {         // key에 해당하는 한글코드
            1:[0,41],   2:[2,44],   3:[19, 23],         // ㄱ, ㄴ, ㅏㅓ
            4:[5,48],   5:[6,56],   6:[27, 32],         // ㄹ, ㅁ, ㅗㅜ
            7:[9,59],   8:[11,61],  9:[39, 37, 38]      // ㅅ, ㅇ, ㅣㅡㅢ
        };
        var strokeMap = {       // 덧쓰기
            0:15,   15:0,                       // ㄱ(0) => ㅋ(15) => ㄱ(0)
            2:3,    3:16,   16:2,               // ㄴ(2) => ㄷ(3) => ㅌ(16) => ㄴ(2)
            6:7,    7:17,   17:6,               // ㅁ(6) => ㅂ(7) => ㅍ(17) => ㅁ(6)
            9:12,   12:14,  14:9,               // ㅅ(9) => ㅈ(12) => ㅊ(14) => ㅅ(9)
            11:18,  18:11,                      // ㅇ(11) => ㅎ(18) => ㅇ(11)
            19:21,  23:25,  27:31,  32:36,      // ㅏ(19) => ㅑ(21), ㅓ(23) => ㅕ(25), ㅗ(27) => ㅛ(31), ㅜ(32) => ㅠ(36)
            41:64,  64:41,                      // ㄱ(41) => ㅋ(64) => ㄱ(41)
            44:47,  47:65,  65:44,              // ㄴ(44) => ㄷ(47) => ㅌ(65) => ㄴ(44)
            56:57,  57:66,  66:56,              // ㅁ(56) => ㅂ(57) => ㅍ(66) => ㅁ(56)
            59:62,  62:63,  63:59,              // ㅅ(59) => ㅈ(62) => ㅊ(63) => ㅅ(59)
            61:67,  67:61,                      // ㅇ(61) => ㅎ(67) => ㅇ(61)
            50:51,  51:54,  54:50               // ㄻ(50) => ㄼ(51) => ㄿ(54) => ㄻ(50)
        };
        // 쌍자음: ㄱ(0), ㄷ(3), ㅂ(7), ㅅ(9), ㅈ(12), ㄱ(41), ㅅ(59) + 1
        var doubleMap = [0, 3, 7, 9, 12, 41, 59];
        var moConcatMap = {     // 모음 + 모음
            9: {
                19: 20,     // ㅏ(19) + ㅣ => ㅐ(20)
                21: 22,     // ㅑ(21) + ㅣ => ㅒ(22)
                23: 24,     // ㅓ(23) + ㅣ => ㅔ(24)
                25: 26,     // ㅕ(25) + ㅣ => ㅖ(26)
                28: 29,     // ㅘ(28) + ㅣ => ㅙ(29)
                33: 34,     // ㅝ(33) + ㅣ => ㅞ(34)
                27: 30,     // ㅗ(27) + ㅣ => ㅚ(30)
                32: 35      // ㅜ(32) + ㅣ => ㅟ(35)
            },
            3: {
                27:28,      // ㅗ(27) + ㅏㅓ => ㅘ(28)
                32:33       // ㅜ(32) + ㅏㅓ => ㅝ(33)
            }
        };
        var jongConcatMap = {   // 종성: 자음+자음
            41: {9:43},                 // ㄱ(41) + ㅅ(9) => ㄳ(43)
            48: {0:49, 6:50, 9:52, 16:53, 18:55},     // ㄹ(48)+ㄱ(0)=>ㄺ(49), ㄹ(48)+ㅁ(6) =>ㄻ(50), ㄹ(48)+ㅅ(9) =>ㄽ(52), ㄹ(48)+ㅌ(16)=>ㄾ(53), ㄹ(48)+ㅎ(18)=>ㅀ(55)
            57: {9:58},                 // ㅂ(57) + ㅅ(9)  => ㅄ(58)
            44: {12:45, 18:46}         // ㄴ(44) + ㅈ(12) => ㄵ(45), ㄴ(44) + ㅎ(18) => ㄶ(46)
        };
        var jongBreakMap = {    // 종성 복자음에서 덧쓰기를 할 경우
            43: [41, 12],               // ㄳ(43) => ㄱ(41) + ㅈ(12)
            45: [44, 14],               // ㄵ(45) => ㄴ(44) + ㅊ(14)
            46: [44, 11],               // ㄶ(46) => ㄴ(44) + ㅇ(11)
            49: [48, 15],               // ㄺ(49) => ㄹ(48) + ㅋ(15)
            52: [48, 12],               // ㄽ(52) => ㄹ(48) + ㅈ(12)
            53: [48, 2],                // ㄾ(53) => ㄹ(48) + ㄴ(2)
            55: [48, 11],               // ㅀ(55) => ㄹ(48) + ㅇ(11)
            58: [57, 12]                // ㅄ(58) => ㅂ(57) + ㅈ(12)
        };

        //var result = "";        // 입력값
        var queue = [ -1,-1,-1,  -1,-1,-1 ];        // 입력상태 저장 queue
        var lastJong = [[-1,-1], [-1,-1]];          // 마지막 종성 입력값
        var idx = 3;            // queue index


        var keydown = function(key) {
            setCursor(1);     // 커서 편집모드
            switch (key) {
                case 1:
                case 2:
                case 4:
                case 5:
                case 7:
                case 8:     // 자음
                    if (idx == 3) {         // 초성입력
                        if (queue[idx] == -1) {
                            queue[idx] = keyCode[key][0];
                        }
                        else {
                            flushQueue();
                            queue[idx] = keyCode[key][0];
                        }
                    }
                    else if (idx == 4) {    // 중성 + 자음 입력
                        if (queue[3] == -1) {   // 초성이 없는 경우(모음만 있는 경우) 초성으로
                            shiftQueue();
                            queue[idx] = keyCode[key][0];
                        }
                        else {      // 종성 입력
                            idx++;
                            queue[idx] = keyCode[key][1];
                            resetLastJong();
                            lastJong[0][0] = keyCode[key][0];
                            lastJong[0][1] = keyCode[key][1];
                        }
                    }
                    else if (idx == 5) {    // 종성 + 자음 입력
                        if (jongConcatMap[queue[idx]] != null && jongConcatMap[queue[idx]][keyCode[key][0]] != null) {       // 복자음인 경우
                            queue[idx] = jongConcatMap[queue[idx]][keyCode[key][0]];
                            lastJong[1][0] = keyCode[key][0];
                            lastJong[1][1] = keyCode[key][1];
                        }
                        else {
                            shiftQueue();
                            idx=3;
                            queue[idx] = keyCode[key][0];
                        }
                    }
                    break;

                case 3:
                case 6:
                case 9:     // 모음
                    if (idx == 3) {         // 초성 + 모음 입력
                        idx++;
                        queue[idx] = keyCode[key][0];
                    }
                    else if (idx == 4) {    // 모음 + 모음 입력
                        if (queue[idx] == keyCode[key][0] || queue[idx] == keyCode[key][1]) {
                            // 동일 모음 처리
                            if (queue[idx] == keyCode[key][0])
                                queue[idx] = keyCode[key][1];
                            else if (keyCode[key].length == 3)      // ㅣ,ㅡ,ㅣ가 입력된 경우 ㅢ
                                queue[idx] = keyCode[key][2];
                            else
                                queue[idx] = keyCode[key][0];
                        }
                        else if (moConcatMap[key] != null && moConcatMap[key][queue[idx]] != null) {
                            // 모음 + 모음 = 모음
                            queue[idx] = moConcatMap[key][queue[idx]];
                        }
                        else {
                            // 모음 결합이 안된 경우
                            shiftQueue();
                            idx = 4;
                            queue[idx] = keyCode[key][0];
                        }
                    }
                    else if (idx == 5) {      // 종성에서 모음 입력됨
                        shiftQueue();

                        var last = (lastJong[1][0] > -1) ? 1 : 0;

                        // 이전글자의 종성 마지막 자음을 초성으로 사용
                        queue[3] = lastJong[last][0];
                        idx = 4;
                        queue[idx] = keyCode[key][0];

                        // 이전글자 종성 수정
                        queue[2] = (last == 0) ? -1 : lastJong[0][1];
                        lastJong[last] = [-1, -1];
                    }
                    break;

                case 46 - 48:     // 덧쓰기
                    if (strokeMap[queue[idx]] != null) {
                        queue[idx] = strokeMap[queue[idx]];

                        if (idx == 3) {
                            // 초성인 경우: 이전 글자의 종성으로 들어가는 경우 체크
                            if (jongConcatMap[queue[2]] != null && jongConcatMap[queue[2]][queue[idx]] != null) {
                                queue[2] = jongConcatMap[queue[2]][queue[idx]];
                                lastJong[1][0] = queue[idx];
                                lastJong[1][1] = -1;
                                unshiftQueue();
                            }
                        }
                        else if (idx == 5) {    // 종성인 경우
                            var last = (lastJong[1][0] > -1) ? 1 : 0;
                            lastJong[last][0] = strokeMap[lastJong[last][0]];
                            lastJong[last][1] = strokeMap[lastJong[last][1]];
                        }
                    }
                    else if (idx == 5 && jongBreakMap[queue[idx]] != null) {
                        // 복자음의 마지막 자음이 다음 글자의 초성으로 들어가는 경우
                        var prev = queue[idx];
                        queue[idx] = jongBreakMap[prev][0];
                        shiftQueue();
                        queue[idx] = jongBreakMap[prev][1];
                        lastJong[1][0] = jongBreakMap[prev][1];
                    }
                    else if (queue[3] == -1 && queue[4] == -1) {
                        setCursor(0);
                    }
                    break;

                case 187 - 48:     // 쌍자음
                    if (doubleMap.indexOf(queue[idx]) > -1) {
                        queue[idx]++;
                        if (idx == 5) {
                            lastJong[0][0]++;
                            lastJong[0][1]++;
                        }
                    }
                    else if (idx == 5) {
                        var last = (lastJong[1][0] > -1) ? 1 : 0;
                        if (doubleMap.indexOf(lastJong[last][0]) > -1) {
                            queue[idx] = (last == 0) ? -1 : lastJong[last-1][1];
                            shiftQueue();
                            queue[idx] = lastJong[last][0] + 1;
                            lastJong[last] = [-1, -1];
                        }
                    }
                    else if (queue[3] == -1 && queue[4] == -1) {
                        setCursor(0);
                    }
                    break;

                case 0:     // 띄우기
                    setCursor(0);
                    result = getResult() + " ";
                    resetQueue();
                    break;

                case 219 - 48:     // 지우기
                    //if (idx == 3 && queue[3] == -1 && queue[4] == -1) {
                    if (idx == 3) {
                        setCursor(0);
                        flushQueue();
                        result = result.substring(0, result.length - 1);
                    }
                    else if (idx == 5 && lastJong[1][0] > -1) {
                        queue[idx] = lastJong[0][1];
                        lastJong[1] = [-1, -1];
                    }
                    else {
                        queue[idx] = -1;
                        if (idx == 5)
                            resetLastJong();
                        if (idx > 3)
                            idx--;
                    }
                    break;

                case 220 - 48:    // 모드변환
                    flushQueue();
                    setMode(1);
                    break;
            }

            return getResult();
        };


        var init = function() {
            resetQueue();
        };

        var getResult = function() {
            return result + makeStrFromQueue(3);
        };

        var makeStrFromQueue = function(len) {
            var str = "";
            for (var i = 0; i <= len; i = i + 3) {
                if (queue[i] == -1 && queue[i+1] == -1)         // queue가 비어있는 상태
                    continue;
                if (queue[i] > -1 && queue[i+1] == -1) {        // 자음만 입력된 경우
                    str += String.fromCharCode(0x3130 + koUnicodeMap.ja[queue[i]]);
                }
                else if (queue[i] == -1 && queue[i+1] > -1) {   // 모음만 입력된 경우
                    str += String.fromCharCode(0x3130 + koUnicodeMap.mo[queue[i+1]-19]);
                }
                else {
                    var jong = (queue[i+2] > -1)? queue[i+2] : 40;
                    str += String.fromCharCode((queue[i] * 21 * 28) + ((queue[i+1] - 19)* 28) + (jong - 40) + 0xAC00);
                }
            }
            return str;
        };

        var flushQueue = function () {
            result += makeStrFromQueue(3);
            resetQueue();
        };

        var resetQueue = function() {
            queue = [ -1,-1,-1,  -1,-1, -1 ];
            resetLastJong();
            idx = 3;
        };

        var shiftQueue = function() {
            result += makeStrFromQueue(0);
            for (var i = 0; i < 3; i++)
                queue.shift();
            for (var i = 0; i < 3; i++)
                queue.push(-1);
            idx = 3;
        };

        var unshiftQueue = function() {
            for (var i = 0; i < 3; i++)
                queue.pop();
            for (var i = 0; i < 3; i++)
                queue.unshift(-1);
            idx = 5;
        };

        var resetLastJong = function() {
            lastJong = [[-1,-1], [-1,-1]];
        };


        return {
            init: init,
            keydown: keydown
        }
    })();
    // 한글 오토마타 end
    /****************************************************************/



    /****************************************************************/
    // 오토마타 공용함수 start
    var init = function(str, cursorCallback) {     // 오토마타 초기화
        korAutomata.init();
        engAutomata.init();
        cursorCB = cursorCallback;
        result = (str == null) ? "" : str;
        setMode(0);
        //setCursor(0);
    };

    var keydown = function(keyCode) {
        if (mode == 0)
            return korAutomata.keydown(keyCode - 48);
        else if (mode == 1)
            return engAutomata.keydown(keyCode - 48);
        else if (mode == 2)
            return numAutomata.keydown(keyCode - 48);
    };

    var getMode = function() {
        return mode;
    };

    var setMode = function(_mode) {
        setCursor(0);
        mode = _mode;
    };

    var getCursor = function() {
        return cursor;
    };

    var setCursor = function(_cursor) {
        if (cursor == _cursor)
            return;
        cursor = _cursor;
        if (typeof cursorCB == "function")
            cursorCB();
    };
    // 오토마타 공용함수 end
    /****************************************************************/

    return {
        init: init,
        keydown: keydown,
        getMode: getMode,
        getCursorType: getCursor
    };
})();
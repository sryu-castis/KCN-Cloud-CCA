require.config({
  waitSeconds: 0
});
require(['main/CCAService', 'main/CSSHandler', '../resources/strings/ko', 'helper/Logger', 'service/STBInfoManager', "service/CCAInfoManager"],
  function (CCAService, CSSHandler, StringSource, Logger, STBInfoManager, CCAInfoManager) {

    var ccaInfoFileName = 'ccainfo.json';
    var settopConfigFileName = 'settopconfig.json';

    var CCABase = {
      StringSources: StringSource,
      ccaService: undefined,
      'CSSHandler': CSSHandler
    };

    //내부에서 VOD 메인을 찾기 위한 변수 저장
    window.CCABase = CCABase;

    function initLogger() {
    };

    function initCCAService() {
      CCABase.ccaService = new CCAService();
      CCABase.ccaService.initialize();

    };

    function initSTBInfoManager() {
      if(CCASetting.Config.DevelopmentMode == 'on') {
        var data = {};
        data.mac = /*"00:e0:91:8b:a3:c9";*/'3c:bd:d8:1a:bd:b8'; // live
        //macAddress = "00:e0:91:8c:f1:49";
        // var macAddress = '00:00:F0:CF:5E:16'; // testbed
        data.smartCardId = "11100051991";
        data.currentParentalRating = 99; //@값의 범위 [ 0, 7, 12, 15, 19]
        data.callCenterPhoneNumber = "1234-5678";
        data.modelNumber = "LSC230-8DCMSK"//'LSC530-8DCM' //'SX930C-CC';//'SMT-H3021';//'LG1311-1.3'; //"UN55H8000", SX930C-CJ; HD LSC-230
        data.adultMenuSetting = 1;
        data.SOCode = "13";
        data.cscVersion = null;
        data.cssIp = null;
        setTimeout(function() {
          //window.cssWrapper.onNotiStatusInfo(data);
        }, 500);

        //STBInfoManager.initialize(data);
      }
    }

    function initCCAInfoManager() {
      CCAInfoManager.initCCAInfo();
    }

    function addEventListener() {
      CSSHandler.setCCAService(CCABase.ccaService);
      window.cssWrapper.setHandler(CSSHandler);
    };

    function loadConfig() {
      $.getJSON(settopConfigFileName, function (data) {
        CCASetting.settopConfig = data;
      }).done(function(){
        var obj = $.getJSON(ccaInfoFileName, function (data) {
          CCASetting.Config = data;
          initialize();
        });
      });
    };

    function initialize() {
      initLogger();
      initCCAInfoManager();//순서 변경
      initSTBInfoManager();//순서 변경
      initCCAService();//순서 변경
      addEventListener();
    };

    loadConfig();
  });
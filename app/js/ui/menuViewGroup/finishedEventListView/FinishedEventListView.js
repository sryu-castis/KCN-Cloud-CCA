define(["ui/menuViewGroup/eventListView/EventListView", "framework/event/CCAEvent",
        "ui/menuViewGroup/eventListView/FinishedEventListDrawer", "ui/menuViewGroup/eventListView/EventListModel",
        "service/Communicator",'cca/type/SortType', "cca/DefineView"],
    function (View, CCAEvent, EventListDrawer, EventListModel, Communicator, SortType, DefineView) {

        var FinishedEventList = function () {
            View.call(this, DefineView.FINISHED_EVENT_LIST_VIEW);
            this.model = new EventListModel();
            this.drawer = new EventListDrawer(this.getID(), this.model);

            var _this = this;

            FinishedEventList.prototype.onBeforeStart = function () {
                _this = this;
                this.eventStatus = 20;
                this.isRequesting = false;
                this.transactionId = $.now() % 1000000;
            };

            this.onInit();
        };

        FinishedEventList.prototype = Object.create(View.prototype);

        return FinishedEventList;
    });
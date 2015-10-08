define(function() {
	var Event = function(jsonObject) {
		this.jsonObject = jsonObject;
	};

	Event.prototype.getWinnerName = function(){
		return this.jsonObject.winnerName;
	};

	Event.prototype.getMobileNumber = function(){
		return this.jsonObject.mobileNumber;
	};

	Event.prototype.getPrize = function(){
		return this.jsonObject.prize;
	};


	return Event;
});
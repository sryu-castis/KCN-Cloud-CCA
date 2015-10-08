define(function() {
	var Event = function(jsonObject) {
		this.jsonObject = jsonObject;
	};

	Event.prototype.getEventID = function(){
		return this.jsonObject.eventId;
	};

	Event.prototype.getEventTitle = function(){
		return this.jsonObject.eventTitle;
	};

	Event.prototype.getDescription = function(){
		return this.jsonObject.description;
	};

	Event.prototype.getEventType = function(){
		return this.jsonObject.eventType;
	};

	Event.prototype.getAssetID = function(){
		return this.jsonObject.assetId;
	};

	Event.prototype.getStartTime = function(){
		return this.jsonObject.startTime;
	};

	Event.prototype.getEndTime = function(){
		return this.jsonObject.endTime;
	};

	Event.prototype.getEventStatus = function(){
		return this.jsonObject.eventStatus;
	};

	Event.prototype.getEventEnroll = function(){
		return this.jsonObject.eventEnroll;
	};

	Event.prototype.isUnEnroll = function(){
		return !this.jsonObject.eventEnroll;
	};

	Event.prototype.getEventWinner = function(){
		return this.jsonObject.eventWinner;
	};

	Event.prototype.getPrimaryEvent = function(){
		return this.jsonObject.primaryEvent;
	};

	Event.prototype.getEventCreationTime = function(){
		return this.jsonObject.eventCreationTime;
	};

	Event.prototype.getEventEnrollTime = function(){
		return this.jsonObject.eventEnrollTime;
	};

	Event.prototype.getHowToEnroll = function(){
		return this.jsonObject.howToEnroll;
	};

	Event.prototype.getPrize = function(){
		return this.jsonObject.prize;
	};

	Event.prototype.getImageFileName1 = function(){
		return this.jsonObject.imageFileName1;
	};

	Event.prototype.getImageFileName2 = function(){
		return this.jsonObject.imageFileName2;
	};

	Event.prototype.getDrawTime = function(){
		return this.jsonObject.drawTime;
	};
	Event.prototype.getPiAgreement = function(){
		return this.jsonObject.piAgreement;
	};


	return Event;
});
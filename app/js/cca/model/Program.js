define(function() {
	var Program = function(jsonObject) {
		this.jsonObject = jsonObject;
	};

	Program.prototype.getChannelNumber = function(){
		return this.jsonObject.channelNumber;
	};

	Program.prototype.getChannelName = function(){
		return this.jsonObject.channelName;
	};

	Program.prototype.getTitle = function(){
		return this.jsonObject.title;
	};

	Program.prototype.getBeginDate = function(){
		return this.jsonObject.beginDate;
	};

	Program.prototype.getEndDate = function(){
		return this.jsonObject.endDate;
	};

	Program.prototype.getRating = function(){
		return this.jsonObject.rating;
	};

	Program.prototype.getHD = function(){
		return this.jsonObject.resolution;
	};

	return Program;
});
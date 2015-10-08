define(function() {
    var Weather = function(jsonObject) {
        this.jsonObject = jsonObject;
    };

    Weather.prototype.isMinutely = function() {
        return this.jsonObject.minutely != null && this.jsonObject.minutely[0] != null;
    }


    Weather.prototype.getStationName = function() {
        if(this.isMinutely()) {
            return this.jsonObject.minutely[0].station.name;
        } else {
            return this.jsonObject.hourly[0].station.name;
        }
    };

    Weather.prototype.getLocalId = function() {
        if(this.isMinutely()) {
            return this.jsonObject.minutely[0].station.id;
        } else {
            return this.jsonObject.hourly[0].station.id;
        }
    };

    Weather.prototype.getSkyName = function(){
        if(this.isMinutely()) {
            return this.jsonObject.minutely[0].sky.name;
        } else {
            return this.jsonObject.hourly[0].sky.name;
        }
    };

    Weather.prototype.getSkyCode = function(){
        if(this.isMinutely()) {
            return this.jsonObject.minutely[0].sky.code;
        } else {
            return this.jsonObject.hourly[0].sky.code;
        }
    };

    Weather.prototype.getCurrentTemperature = function(){
        if(this.isMinutely()) {
            return this.jsonObject.minutely[0].temperature.tc;
        } else {
            return this.jsonObject.hourly[0].temperature.tc;
        }
    };

    Weather.prototype.getMaxTemperature = function(){
        if(this.isMinutely()) {
            return this.jsonObject.minutely[0].temperature.tmax;
        } else {
            return this.jsonObject.hourly[0].temperature.tmax;
        }
    };

    Weather.prototype.getMinTemperature = function(){
        if(this.isMinutely()) {
            return this.jsonObject.minutely[0].temperature.tmin;
        } else {
            return this.jsonObject.hourly[0].temperature.tmin;
        }
    };

    return Weather;
});
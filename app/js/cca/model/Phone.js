define(function() {
    var Phone = function(jsonObject) {
        this.jsonObject = jsonObject;
    };

    Phone.prototype.setNumber = function(number){
        this.jsonObject.number = number;
    };

    Phone.prototype.getNumber = function(){
        return this.jsonObject.number;
    };

    Phone.prototype.isPhoneAppInstalled = function(){
        return this.jsonObject.phoneAppInstalled;
    };

    Phone.prototype.setPhoneAppInstalled = function(value) {
        this.jsonObject.phoneAppInstalled = value;
    }

    return Phone;
});
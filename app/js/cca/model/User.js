define(function() {
    var User = function(jsonObject) {
        this.jsonObject = jsonObject;
    };

    User.prototype.getUserID = function(){
        return this.jsonObject.userId;
    };

    User.prototype.getPhoneNumber = function(){
        return this.jsonObject.phoneNumber;
    };

    User.prototype.getRegistrationTime = function(){
        return this.jsonObject.registrationTime;
    };

    return User;
});
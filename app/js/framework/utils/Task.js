define(function() {
	var Task = function(paArray) {
		this.taskName = "default";
		this.repository = paArray || new Array();
	};
	 
	Task.prototype.push = function(_object){
		this.repository.push(_object);
	};
	 
	Task.prototype.pop = function(){
	  var result = this.getLast();
	  this.repository = this.repository.slice(0, this.repository.length-1);
	  return result;
	};
	
	Task.prototype.getLast = function(){
		if(this.repository.length === 0){
			console.log("Task repository is empty!");
			return null;
		}
		
	  var result = this.repository[this.repository.length-1];
	  return result;
	};
	
	Task.prototype.setTaskName = function(name) {
		this.taskName = name;
	};
	Task.prototype.getTaskName = function() {
		return this.taskName;
	};
	Task.prototype.findObject = function(object) {
		for(var i = 0; i < this.repository.length; i++) {
			if(this.repository[i] == object) {
				return true;
			}
		}
		return false;
	};
	
	return Task;
});
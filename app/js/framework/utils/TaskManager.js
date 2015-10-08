define(["framework/utils/Task"], function(Task) {
		//생성자
		var TaskManager = {
			//singleton
		};
		
		//public 필드
		//this.publicField; TaskManager.publicField;
		//private 필드
		var taskArray = new Array();
		var taskIndex = 0;
		var needChangeTask = false;
		//public 메소드
		TaskManager.addHistory = function(object) {
			if(!taskArray[taskIndex]) {
				taskArray[taskIndex] = new Task();
			}
            var currentTask = this.getCurrentTask();
			currentTask.push(object);
		};
		TaskManager.getLastHistory = function() {
			var currentTask = this.getCurrentTask();
			return currentTask ? currentTask.getLast() : null;  
		};
		TaskManager.getLastHistoryWithRemove = function() {
			var currentTask = this.getCurrentTask();
			return currentTask ? currentTask.pop() : null;  
		};
		TaskManager.addTask = function() {
			console.log("TaskManager add new Task!");
			taskArray[++taskIndex] = new Task();
		};
		TaskManager.getCurrentTask = function() {
			return taskArray[taskIndex];
		};
		TaskManager.removeLastTask = function() {
            console.log("TaskManager remove LastTask");
			taskArray = taskArray.slice(0, taskArray.length-1);
			taskIndex -= 1; 
		};
		TaskManager.swapTask = function() {
            console.log("TaskManager swak the Task");
			var currentTask = this.getCurrentTask();
			this.removeLastTask();
			taskArray[taskIndex] = currentTask;
		};
		TaskManager.getTaskIndex = function() {
			return taskIndex;
		}
		TaskManager.setNeedChangeTask = function(flag) {
			needChangeTask = flag;
		}
		TaskManager.needChangeTask = function() {
			return needChangeTask;
		}
        TaskManager.clearTask = function() {
            taskArray = new Array();
            taskIndex = 0;
            needChangeTask = false;
        }

		TaskManager.findHistory = function(object) {
			return this.getCurrentTask().findObject(object);
		}

		return TaskManager;
});
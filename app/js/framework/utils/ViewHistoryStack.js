define(function() {
    /**
     * 뷰 그룹내에서 뷰의 히스토리를 저장할 필요가 있을 때, (Task 와 별개)
     * @private
     */
	var ViewHistoryStack = function() {
		this.repository = new Array();
		
		ViewHistoryStack.prototype.push = function(_obj) {
			this.repository.push(_obj);
		}
		ViewHistoryStack.prototype.pop = function() {
			return this.repository.pop();
		}
		ViewHistoryStack.prototype.getSize = function() {
			return this.repository.length;
		}
        ViewHistoryStack.prototype.getLast = function() {
            return this.repository[this.repository.length-1];
        }
	}
	
	return ViewHistoryStack;
});
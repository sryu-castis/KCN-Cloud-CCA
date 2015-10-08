define(function() {	
	/**
	 * iterator 패턴 구현체.
	 */
	var Iterator = function() {
		
		this.parameterList = arguments;
		this.index = 0;
		
		Iterator.prototype.hasNext = function() {
			//return this.parameterList[this.index+1] ? true : false;
            if(this.parameterList) {
                return this.index < this.parameterList.length;
            } else {
                return false;
            }

		};
		Iterator.prototype.next = function() {
            if(this.parameterList) {
                return this.parameterList[this.index++];
            } else {
                return null;
            }
		}
	};
	
	return Iterator;
});

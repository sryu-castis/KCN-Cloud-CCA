define(function() {	
	/**
	 * iterator 패턴 구현체.
	 */
	var EventParameter = function() {
		
		this.parameterList = arguments;
		this.index = 0;
		
		EventParameter.prototype.hasNext = function() {
			//return this.parameterList[this.index+1] ? true : false;
			return this.index < this.parameterList.length;
		};
		EventParameter.prototype.next = function() {
			return this.parameterList[this.index++];
		}
	};
	
	return EventParameter;
});

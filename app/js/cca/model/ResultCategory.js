define(function() {
	var SearchResultCategory = function(jsonObject) {
		this.jsonObject = jsonObject;
	};

	SearchResultCategory.prototype.getRecommendField = function(){
		return this.jsonObject.recommendField;
	};


	SearchResultCategory.prototype.getName = function(){
		return this.jsonObject.name;
	};

	return SearchResultCategory;
});
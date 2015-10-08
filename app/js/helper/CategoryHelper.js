define(function () {
    var CategoryHelper = {};

    CategoryHelper.filteringCategoryList = function(filteringCategoryID, categoryList) {
        var newCategoryList = new Array();
        var max = categoryList.length;

        for(var i = 0; i < max; i++) {
            var category = categoryList[i];
            if(category.categoryId != filteringCategoryID) {
                newCategoryList.push(category);
            }
        }

        return newCategoryList;
    }

    return CategoryHelper;
});
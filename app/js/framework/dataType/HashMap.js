/**
 * Created by Ryu on 14. 3. 13.
 */

define(function() {
    var HashMap = function(){
        this.map = new Array();
    };
    HashMap.prototype = {
        put : function(key, value){
            this.map[key] = value;
        },
        get : function(key){
            return this.map[key];
        },
        getAll : function(){
            return this.map;
        },
        clear : function(){
            this.map = new Array();
        },
        remove : function(key) {
            this.map[key] = null;
        },
        getKeys : function(){
            var keys = new Array();
            for(i in this.map){
                keys.push(i);
            }
            return keys;
        }
    };

    return HashMap;
});
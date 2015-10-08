define(function() {
	var Model = function() {
		this.data = null;

		// h = horizon, v = vertical
		this.hIndex = 0;
		this.vIndex = 0;
		this.hStartIndex = 0;
		this.vStartIndex = 0;
		// 화면에 보여지는 사이즈
		this.hVisibleSize = 0;
		this.vVisibleSize = 0;
		// 아이템의 최대 길이
		this.hMax = 0;
		this.vMax = 0;
		this.vRotate = false;
		this.hRotate = false;
        this.hRotateInline = false;
		
		this.chain = false;
		this.hRotateStartIndex = 0;
		//이전인덱스
		this.previousVIndex = 0;
		this.previousHIndex = 0;
        this.previousHStartIndex = 0;
        this.previousVStartIndex = 0;

		Model.prototype.init = function() {
			this.hIndex = 0;
			this.vIndex = 0;
			this.hStartIndex = 0;
			this.vStartIndex = 0;
			this.hVisibleSize = 0;
			this.vVisibleSize = 0;
			this.hMax = 0;
			this.vMax = 0;
			this.vRotate = false;
			this.hRotate = false;
            this.hNextlineRotate = false;

			this.hRotateStartIndex = 0;
			this.data = null;
            this.previousVIndex = 0;
            this.previousHIndex = 0;
            this.previousHStartIndex = 0;
            this.previousVStartIndex = 0;

			this.increaseFixedIndex = 0;
			this.decreaseFixedIndex = 0;
		};

		Model.prototype.setData = function(data) {
			this.data = data;
		};
		Model.prototype.getData = function() {
			return this.data;
		};
        Model.prototype.isNullData = function() {
            return this.data == null || this.data.length == 0;
        }
		Model.prototype.setSize = function(vSize, hSize, vMax, hMax) {
			this.vVisibleSize = vSize;
			this.hVisibleSize = hSize;
			this.vMax = vMax;
			this.hMax = hMax;
		};
		Model.prototype.setRotate = function(vRotate, hRotate) {
			this.vRotate = vRotate;
			this.hRotate = hRotate;
		};
		Model.prototype.setFixedFocus = function(increaseFixedIndex, decreaseFixedIndex) {
			this.increaseFixedIndex = increaseFixedIndex;
			this.decreaseFixedIndex = decreaseFixedIndex;
		}
		Model.prototype.setIncreaseFixedIndex = function(increaseFixedIndex) {
			this.increaseFixedIndex = increaseFixedIndex;
		}
		Model.prototype.setDecreaseFixedIndex = function(decreaseFixedIndex) {
			this.decreaseFixedIndex = decreaseFixedIndex;
		}
        Model.prototype.setNextLineRotate = function(value) {
            this.hNextlineRotate = value;
        }

		Model.prototype.setHIndex = function(hIndex) {
			this.hIndex = hIndex;
		};
		Model.prototype.setVIndex = function(vIndex) {
			this.vIndex = vIndex;
		};
		Model.prototype.getHIndex = function() {
			return this.hIndex;
		};
		Model.prototype.getVIndex = function() {
			return this.vIndex;
		};
		/**/
		Model.prototype.setHStartIndex = function(hStartIndex) {
			this.hStartIndex = hStartIndex;
		};
		Model.prototype.setVStartIndex = function(vStartIndex) {
			this.vStartIndex = vStartIndex;
		};
		Model.prototype.getHStartIndex = function() {
			return this.hStartIndex;
		};
		Model.prototype.getVStartIndex = function() {
			return this.vStartIndex;
		};
		/**/
		Model.prototype.getHVisibleSize = function() {
			return this.hVisibleSize;
		};
		Model.prototype.setHVisibleSize = function(hVisibleSize) {
			this.hVisibleSize = hVisibleSize;
		};

		Model.prototype.getVVisibleSize = function() {
			return this.vVisibleSize;
		};
		Model.prototype.getHMax = function() {
			return this.hMax;
		};
        Model.prototype.setHMax = function(hMax) {
            this.hMax = hMax;
        };
		Model.prototype.getVMax = function() {
			return this.vMax;
		};
		Model.prototype.setVMax = function(vMax) {
			this.vMax = vMax;
		};

		Model.prototype.getPreviousVIndex = function() {
			return this.previousVIndex;
		};
		Model.prototype.getPreviousHIndex = function() {
			return this.previousHIndex;
		};

		// helper
		Model.prototype.getHFocusIndex = function() {
			return (this.hIndex + this.hStartIndex);
		};
		Model.prototype.getVFocusIndex = function() {
			return (this.vIndex + this.vStartIndex);
		};
        Model.prototype.getPreviousVFocusIndex = function() {
            return (this.previousVIndex + this.previousVStartIndex);
        };
        Model.prototype.getPreviousHFocusIndex = function() {
            return (this.previousHIndex + this.previousHStartIndex);
        };

		Model.prototype.getVFocusedItem = function() {
			if (this.data) {
				if(this.data.constructor == Array) {
					var focusedItem = this.data[this.getVFocusIndex()];
				} else {
					var focusedItem = this.data;
				}
				
				if (focusedItem && focusedItem.constructor == Array) {
					focusedItem = focusedItem[this.getHFocusIndex()];
				}
				return focusedItem;
			} else {
				return null;
			}
		};
		Model.prototype.getHFocusedItem = function() {
			if (this.data) {
				if(this.data.constructor == Array) {
					var focusedItem = this.data[this.getHFocusIndex()];
				} else {
					var focusedItem = this.data;
				}
				
				if (focusedItem && focusedItem.constructor == Array) {
					focusedItem = focusedItem[this.getVFocusIndex()];
				}
				return focusedItem;
			} else {
				return null;
			}
		};
		Model.prototype.getVisibleVMax = function() {
			return this.getVVisibleSize() < this.getVMax() ? this.getVVisibleSize() : this.getVMax();
		};
		Model.prototype.getVisibleHMax = function() {
			return this.getHVisibleSize() < this.getHMax() ? this.getHVisibleSize() : this.getHMax();
		};
		
	};

	// 시리즈 용 인덱스 계산 메소드
	//chain
	
	Model.prototype.setChain = function(_chain) {
		this.chain = _chain;
	};
	
	Model.prototype.getChain = function() {
		return this.chain;
	};
	
	Model.prototype.getHRotateStartIndex = function() {
		return this.hRotateStartIndex;
	};
	
	Model.prototype.setHRotateStartIndex = function(_hRotateStartIndex) {
		this.hRotateStartIndex = _hRotateStartIndex;
	};
	
	Model.prototype.getHRotateFocusIndex = function() {
		var hRotateFocusIndex = (this.hIndex + this.hStartIndex);
		if ((hRotateFocusIndex + 1) > this.hMax) {
			hRotateFocusIndex = hRotateFocusIndex - (this.hMax);
		}
		return hRotateFocusIndex;
	};

	return Model;
});

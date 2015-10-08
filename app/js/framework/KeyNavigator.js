define(function() {
	var KeyNavigator = function(model) {
		this.model = model;
		var _this = this;

		KeyNavigator.prototype.keyDown = function() {
			this.setPreviousIndex();
			if (this.model.getVisibleVMax() - 1 > this.model.vIndex + this.model.increaseFixedIndex) {
				this.model.vIndex += 1;
			} else {
				if (this.model.vMax - 1 > this.model.vIndex + this.model.vStartIndex) {
					if(this.isLastPage()) {
						this.model.vIndex += 1;
					} else {
						this.model.vStartIndex += 1;
					}
				} else {
					if (this.model.vRotate) {
						this.model.vIndex = 0;
						this.model.vStartIndex = 0;
					} else {
						// rotate 가 아님으로 인덱스 증가 하지 않음
					}
				}
			}
		}
		KeyNavigator.prototype.keyUp = function() {
			this.setPreviousIndex();
			var focusedIndex = this.model.vIndex + this.model.vStartIndex;

			if (focusedIndex > 0) {
				if (this.model.vIndex - this.model.decreaseFixedIndex > 0) {
					this.model.vIndex -= 1;
				} else {
					if(this.model.vStartIndex > 0) {
						this.model.vStartIndex -= 1;
					} else {
						this.model.vIndex -= 1;
					}
				}
			} else { // vindex == 0
				if (this.model.vRotate) {
					this.model.vIndex = this.model.getVisibleVMax() - 1;
					this.model.vStartIndex = this.model.vMax - this.model.getVisibleVMax();
				} else {
					// rotate 가 아님으로 인덱스 변경없음
				}
			}
		}

		KeyNavigator.prototype.keyRight = function() {
			this.setPreviousIndex();
			if (this.model.getVisibleHMax() - 1 > this.model.hIndex) {
				this.model.hIndex += 1;
			} else {
				if (this.model.hMax - 1 > this.model.hIndex + this.model.hStartIndex) {
					this.model.hStartIndex += 1;
				} else {
					if (this.model.hRotate && !this.model.chain) {
                        if(this.model.hNextlineRotate) {
                            this.keyDown();
                        }
						this.model.hIndex = 0;
						this.model.hStartIndex = 0;
					} else if (this.model.hRotate && this.model.chain) {
						// Linewise
                        if(this.model.hNextlineRotate) {
                            this.keyDown();
                        }
						 if (this.model.hMax - 1 < this.model.hIndex + this.model.hStartIndex
								&& this.model.getHRotateFocusIndex() + 1 < this.model.hMax) {
							this.model.hStartIndex += 1;
						} else {
							this.model.hIndex = 0;
							this.model.hStartIndex = 0;
						}
					} else {

					}
				}
			}
		}

		KeyNavigator.prototype.keyLeft = function() {
			this.setPreviousIndex();
			var focusedIndex = this.model.hIndex + this.model.hStartIndex;

			if (focusedIndex > 0) {
				if (this.model.hIndex > 0) {
					this.model.hIndex -= 1;
				} else {
					this.model.hStartIndex -= 1;
				}
			} else { // focusedIndex == 0
				if (this.model.hRotate) {
                    if(this.model.hNextlineRotate) {
                        this.keyUp();
                    }
					this.model.hIndex = this.model.getVisibleHMax() - 1;
					this.model.hStartIndex = this.model.hMax - this.model.getVisibleHMax();
				} else {
					// rotate 가 아님으로 인덱스 변경없음
				}
			}
		}
		KeyNavigator.prototype.setPreviousIndex = function() {
			this.model.previousVIndex = this.model.vIndex;
			this.model.previousHIndex = this.model.hIndex;
            this.model.previousHStartIndex = this.model.hStartIndex;
            this.model.previousVStartIndex = this.model.vStartIndex;
		}

		KeyNavigator.prototype.isLastPage = function() {
			return this.model.getVStartIndex() + this.model.getVisibleVMax() == this.model.getVMax();
		}

		KeyNavigator.prototype.isLastItem = function() {
			return this.model.getVIndex() + this.model.getVStartIndex() == this.model.getVMax() - 1
		}

	};

	return KeyNavigator;
});

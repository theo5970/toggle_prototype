var Config = (function(){
    return {
        numCols: 12,
        numRows: 12
    }
})();

var blockList = new Array(Config.numCols);
for (let i=0; i<Config.numCols; i++) {
    blockList[i] = new Array(Config.numRows);
}
var BlockState = (function(){
    return {
        on: 1,
        off: 0,
        disabled: -1
    }
})();

var BlockArrow = (function(){
    return {
        none: 0,
        left: 1,
        right: 2,
        up: 3,
        down: 4
    }
})();

var BlockType = (function(){
	return {
		default: 0,
		star: 1
	}
})();

var Random = (function(){
    return {
        // returns a number between 0 and (end - 1)
        next: function(end) {
            return Math.floor(Math.random() * end);
        }
    }
})();
function Block(button, x, y, arrow, state, type) {
    let self = this;
    this.button = button;
    this.button.click(function(){
        self.clicked();
    });
    this.x = x;
    this.y = y;
    this.arrow = arrow;
	this.type = type;
	
    switch (this.arrow) {
        case BlockArrow.left:
            this.button.text("←");
            break;
        case BlockArrow.right:
            this.button.text("→");
            break;
        case BlockArrow.up:
            this.button.text("↑");
            break;
        case BlockArrow.down:
            this.button.text("↓");
            break;
        case BlockArrow.none:
            this.button.text("'");
            break;
    }
	
	this.state = state;
	
	if (this.type === 1) {
		this.arrow = 0;
		switch (this.state) {
			case BlockState.on:
				this.button.text("★");
				break;
			case BlockState.off:
				this.button.text("☆");
				break;
		}
	}
    
}

Block.prototype.clicked = function() {
    this.toggle();
    if (this.state === BlockState.disabled) return;
    switch (this.arrow) {
        case BlockArrow.left:
            let left_x = this.x - 1;
            if (left_x >= 0) {
                blockList[left_x][this.y].toggle(false);
            }
            break;
        case BlockArrow.right:
            let right_x = this.x + 1;
            if (right_x <= Config.numCols - 1) {
                blockList[right_x][this.y].toggle(false);
            }
            break;
        case BlockArrow.up:
            let up_y = this.y - 1;
            if (up_y >= 0) {
                blockList[this.x][up_y].toggle(false);
            }
            break;
        case BlockArrow.down:
            let down_y = this.y + 1;
            if (down_y <= Config.numRows - 1) {
                blockList[this.x][down_y].toggle(false);
            }
            break;
    }

}
Block.prototype.toggle = function(byclick = true) {
    let lastEnabled = false;
    if (!byclick) {
        if (this.state == BlockState.disabled) {
            this.doEnable();
            lastEnabled = true;
        }
    }

    if (lastEnabled) return;

    if (this.state === BlockState.on) {
        this.state = BlockState.off;
    } else if (this.state === BlockState.off) {
        this.state = BlockState.on;
    }
	
	if (this.type === 1) {
		switch (this.state) {
			case BlockState.on:
				this.button.text("★");
				break;
			case BlockState.off:
				this.button.text("☆");
				break;
		}
	}
    if (this.state !== BlockState.disabled) {
        this.update();
    }
}
Block.prototype.update = function() {
    switch (this.state) {
        case BlockState.on:
            this.button.attr("class", "block block-on");
            break;
        case BlockState.off:
            this.button.attr("class", "block block-off");
            break;
        case BlockState.disabled:
            this.button.attr("class", "block block-disabled");
            break;
    }
}

Block.prototype.doEnable = function() {
    this.state = BlockState.off;
    this.update();
}

function init() {
    for (let y=0; y<Config.numRows; y++) {
        for (let x=0; x<Config.numCols; x++) {
            let btn = $('<div class=\'block block-off\'></div>');
			btn.css("left", (x * 64) + "px");
			btn.css("top", (y * 64) + "px");
            let arrow = Random.next(4) + 1;
            let block = new Block(btn, x, y, Random.next(4) + 1, 0, Random.next(3) === 0 ? 1 : 0);
            block.update();
            blockList[x][y] = block;
            btn.appendTo($("body"));
        }
        $("<br/>").appendTo($("body"));
    }
}

$(document).ready(function(){
    init();
});
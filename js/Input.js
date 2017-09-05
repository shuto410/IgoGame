

Input = Class.create({
    /*メンバ変数*/
    mouseX: 0,
    mouseY: 0,
    isClick: false,
    result: [],

    /*メンバ関数*/
    initialize: function () {
        document.addEventListener("click", function () {
            this.setSquare();
        }.bind(this));
        document.addEventListener("mousemove", function (e) {
            this.getMousePosition(e);
        }.bind(this));
    },
    /*onClick: function () {
        //that.debug = 514514;
        //this.isClick = true;
        this.setSquare();
    },*/
    update: function () {},
    getMousePosition: function (e) {
        //var result = [];
        if (e) {
            // game.scaleの値が反映されている？ので割ってあげる
            this.x = e.pageX / Igo.core.scale;
            this.y = e.pageY / Igo.core.scale;
        } else {
            this.x = (event.x + document.body.scrollLeft) / Igo.core.scale;
            this.y = (event.y + document.body.scrollTop) / Igo.core.scale;
        }
        //console.log("ex= " + e.pageX + " ey= " + e.pageY + "x= " + this.x + " y= " + this.y);
    },
    setSquare: function () {
        this.result.isSquare = false;

        console.log("click");


        for (var x = 510, i = 1; i <= 9; x += 100, i++) {
            for (var y = 90, j = 1; j <= 9; y += 100, j++) {
                if (x <= this.x && this.x <= x + 100) {
                    if (y <= this.y && this.y <= y + 100) {
                        this.result.i = i;
                        this.result.j = j;
                        this.result.isSquare = true;
                        //console.log("i = " + i + " j= " + j + " isSquare= " + this.result.isSquare);
                    }
                }
            }
        }

    },
    getResult: function () {
        var result = this.result;
        this.result = [];
        return result;
    },
});

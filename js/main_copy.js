//名前空間Igo
if (typeof Igo === "undefined") {
    var Igo = {};
    Igo.WIDTH = 1920;
    Igo.HEIGHT = 1080;
    Igo.BOARDSIZE = 950;
    Igo.BOARDSCALE = 1;
    Igo.SCENE = {
        NONE: 0,
        START: 1,
        GAME: 2,
        RESULT: 3,
    }
}

enchant();



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

StartScene = Class.create(Scene, {
    /*メンバ変数*/
    sceneManager: null,

    /*メンバ関数*/
    initialize: function (sceneManager) {
        Scene.call(this);
        this.sceneManager = sceneManager;

        var sprite = new Sprite(300, 300);
        this.addChild(sprite); //シーンに追加
        sprite.image = Igo.core.assets["pictures/start.png"];
        sprite.addEventListener('touchstart', function () {
            this.sceneManager.changeScene(Igo.SCENE.GAME);
        }.bind(this));
    },
    update: function () {}
})

ResultScene = Class.create(Scene, {
    /*メンバ変数*/
    sceneManager: null,

    /*メンバ関数*/
    initialize: function (sceneManager) {
        Scene.call(this);
        this.sceneManager = sceneManager;
    },
})

GameScene = Class.create(Scene, {
    /*メンバ変数*/
    input: new Input(this),
    boardManager: null,
    sceneManager: null,
    turnIsBlack: true,

    /*メンバ関数*/
    initialize: function (sceneManager) {
        //親コンストラクタ
        Scene.call(this);


        this.sceneManager = sceneManager;

        //ボードスプライト生成
        this.boardManager = new BoardManager(Igo.BOARDSIZE, Igo.BOARDSIZE, this.sceneManager);
        this.addChild(this.boardManager); //シーンに追加

    },
    update: function () {
        var result = this.input.getResult();
        if (result.isSquare) {
            if (this.boardManager.canMove(result.i, result.j)) {
                var canSet = this.boardManager.setStone(result.i, result.j, this.turnIsBlack);
                if(canSet) this.turnIsBlack = !(this.turnIsBlack);
            }
        }

    }
});



SceneManager = Class.create({
    /*メンバ変数*/
    currentScene: null,
    nextScene: Igo.SCENE.NONE,

    /*メンバ関数*/
    initialize: function () {},
    init: function () {
        this.currentScene = new StartScene(this);
        Igo.core.pushScene(this.currentScene);
    },
    update: function () {
        //シーン移行
        if (this.nextScene != Igo.SCENE.NONE) {
            Igo.core.popScene(this.currentScene);
            switch (this.nextScene) {
            case Igo.SCENE.START:
                this.currentScene = new StartScene(this);
                Igo.core.pushScene(this.currentScene);
                break;
            case Igo.SCENE.GAME:
                this.currentScene = new GameScene(this);
                Igo.core.pushScene(this.currentScene);
                break;
            case Igo.SCENE.RESULT:
                this.currentScene = new ResultScene(this);
                Igo.core.pushScene(this.currentScene);
                break;
            }
            this.nextScene = Igo.SCENE.NONE;
        }
        //シーンupdate()呼び出し
        this.currentScene.update();
    },
    addChild: function (childNode) {
        this.currentScene.addChild(childNode);
    },
    removeChild: function (childNode) {
        this.currentScene.removeChild(childNode);
    },
    changeScene: function (nextScene) {
        this.nextScene = nextScene;
    },
})


Stone = Class.create(Sprite, {
    sceneManager: null,
    /*メンバ関数*/
    initialize: function (i, j, isBlack, sceneManager) {
        //親クラスのコンストラクタ呼び出し
        Sprite.call(this);

        this.sceneManager = sceneManager;

        if (isBlack) {
            this.image = Igo.core.assets['pictures/black_stone.png'];
        } else {
            this.image = Igo.core.assets['pictures/white_stone.png'];
        }
        this.i = i;
        this.j = j;
        this.x = 510 + (i - 1) * 100;
        this.y = 90 + (j - 1) * 100;
        this.width = 100;
        this.height = 100;
        this.sceneManager.addChild(this);
    },
    remove: function () {
        this.sceneManager.removeChild(this);
    }
})


BoardJudge = Class.create({
    /*メンバ変数*/
    boardManager: null,
    boardMap: null,
    checkMap: new Array(11),
    turnIsBlack: true,

    /*メンバ関数*/
    initialize: function (boardManager) {
        this.boardManager = boardManager;
        this.boardMap = this.boardManager.getBoardMap();

        //探索済みマス管理配列の初期化
        for (var j = 0; j < 11; j++) {
            this.checkMap[j] = new Array(11);
            for (var i = 0; i < 11; i++) {
                this.checkMap[j][i] = 0;
            }
        }
    },
    canMove: function (i, j) {
        this.boardMap = this.boardManager.getBoardMap();
        return true; //todo    
    },
    judge: function (i, j, turnIsBlack) {
        this.boardMap = this.boardManager.getBoardMap();
        this.resetCheckMap();

        var resultUp = false;
        var resultDown = false;
        var resultRight = false;
        var resultLeft = false;

        var checkMapUp = new Array(11);
        for (var m = 0; m < 11; m++) {
            checkMapUp[m] = new Array(11);
            for (var n = 0; n < 11; n++) {
                checkMapUp[m][n] = 0;
            }
        }
        if (this.boardMap[i][j + 1] == !turnIsBlack) {
            resultUp = this.fourDirectionSearch(i, j + 1, turnIsBlack, checkMapUp);
        }

        var checkMapDown = new Array(11);
        for (var m = 0; m < 11; m++) {
            checkMapDown[m] = new Array(11);
            for (var n = 0; n < 11; n++) {
                checkMapDown[m][n] = 0;
            }
        }
        if (this.boardMap[i][j - 1] == !turnIsBlack) {
            resultDown = this.fourDirectionSearch(i, j - 1, turnIsBlack, checkMapDown);
        }

        var checkMapRight = new Array(11);
        for (var m = 0; m < 11; m++) {
            checkMapRight[m] = new Array(11);
            for (var n = 0; n < 11; n++) {
                checkMapRight[m][n] = 0;
            }
        }
        if (this.boardMap[i + 1][j] == !turnIsBlack) {
            resultRight = this.fourDirectionSearch(i + 1, j, turnIsBlack, checkMapRight);
        }

        var checkMapLeft = new Array(11);
        for (var m = 0; m < 11; m++) {
            checkMapLeft[m] = new Array(11);
            for (var n = 0; n < 11; n++) {
                checkMapLeft[m][n] = 0;
            }
        }
        if (this.boardMap[i - 1][j] == !turnIsBlack) {
            var resultLeft = this.fourDirectionSearch(i - 1, j, turnIsBlack, checkMapLeft);
        }

        for (var n = 0; n < 11; n++) {
            for (var m = 0; m < 11; m++) {
                if (resultUp) this.checkMap[m][n] = this.checkMap[m][n] || checkMapUp[m][n];
                if (resultDown) this.checkMap[m][n] = this.checkMap[m][n] || checkMapDown[m][n];
                if (resultRight) this.checkMap[m][n] = this.checkMap[m][n] || checkMapRight[m][n];
                if (resultLeft) this.checkMap[m][n] = this.checkMap[m][n] || checkMapLeft[m][n];
            }
        }
        this.checkMap[i][j] = 0;
        return this.checkMap.concat();

    },
    fourDirectionSearch: function (i, j, turn, checkMap) {
        checkMap[i][j] = 1;
        if (checkMap[i + 1][j] == 0) {
            if (this.boardMap[i + 1][j] == -1)
                return false;
            if (this.boardMap[i + 1][j] == !turn)
                if (this.fourDirectionSearch(i + 1, j, turn, checkMap) == false) {
                    return false;
                }
        }
        if (checkMap[i - 1][j] == 0) {
            if (this.boardMap[i - 1][j] == -1)
                return false;
            if (this.boardMap[i - 1][j] == !turn)
                if (this.fourDirectionSearch(i - 1, j, turn, checkMap) == false) {
                    return false;
                }
        }
        if (checkMap[i][j + 1] == 0) {
            if (this.boardMap[i][j + 1] == -1)
                return false;
            if (this.boardMap[i][j + 1] == !turn)
                if (this.fourDirectionSearch(i, j + 1, turn, checkMap) == false) {
                    return false;
                }
        }
        if (checkMap[i][j - 1] == 0) {
            if (this.boardMap[i][j - 1] == -1)
                return false;
            if (this.boardMap[i][j - 1] == !turn)
                if (this.fourDirectionSearch(i, j - 1, turn, checkMap) == false) {
                    return false;
                }
        }
        return true;
    },
    resetCheckMap: function () {
        for (var i = 0; i < 11; i++) {
            for (var j = 0; j < 11; j++) {
                this.checkMap[i][j] = 0;
            }
        }
    }
})

BoardManager = Class.create(Sprite, {
    /*メンバ変数*/
    boardMap: new Array(11),
    boardStones: new Array(9),
    sceneManager: null,
    boardJudge: null,

    /*メンバ関数*/
    initialize: function (width, height, sceneManager) {
        /*親コンストラクタ呼び出し*/
        Sprite.call(this);

        this.sceneManager = sceneManager;

        this.boardJudge = new BoardJudge(this);

        /*ボードのスプライト設定*/
        this.image = Igo.core.assets['pictures/board.png'];


        //盤面表示拡縮調整
        //this.scale(Igo.BOARDSCALE, Igo.BOARDSCALE);

        //盤面位置のセンタリング
        var currentBoardWidth = width * Igo.BOARDSCALE;
        var currentBoardHeight = height * Igo.BOARDSCALE;

        this.x = (Igo.WIDTH - currentBoardWidth) / 2.0;
        this.y = (Igo.HEIGHT - currentBoardHeight) / 2.0;


        //引数をSpriteクラスのメンバ変数に譲渡
        this.width = width;
        this.height = height;





        //盤面管理配列の初期化
        for (var j = 0; j < 11; j++) {
            this.boardMap[j] = new Array(11);
            for (var i = 0; i < 11; i++) {
                this.boardMap[j][i] = -1;
            }
        }
        // 盤面端の初期化
        for (var i = 0; i < 11; i++) {
            this.boardMap[0][i] = 2;
            this.boardMap[10][i] = 2;
            this.boardMap[i][0] = 2;
            this.boardMap[i][10] = 2;
        }

        //碁石オブジェクト管理配列の初期化
        for (var j = 0; j < 9; j++) {
            this.boardStones[j] = new Array(9);
            for (var i = 0; i < 9; i++) {
                this.boardStones[j][i] = null;
            }
        }
    },
    setStone: function (i, j, isBlack) {
        if (i <= 0 || j <= 0 || i >= 10 || j >= 10 || this.boardMap[i][j] != -1) {
            console.log("set stone error");
            return false;
        }
        if (isBlack) {
            this.boardMap[i][j] = 1;
        } else {
            this.boardMap[i][j] = 0;
        }

        var removeStoneMap = this.judge(i, j, isBlack);
        for (var x = 0; x < 11; x++) {
            for (var y = 0; y < 11; y++) {
                if (removeStoneMap[x][y] == 1) {
                    this.removeStone(x, y);
                    this.boardMap[x][y] = -1;
                }
            }
        }

        this.boardStones[i - 1][j - 1] = new Stone(i, j, isBlack, this.sceneManager);

        return true;
    },
    removeStone: function (i, j) {
        if (this.boardMap[i][j] == -1) {
            console.log("remove stone error");
            return;
        }
        this.boardMap[i][j] = -1;
        this.boardStones[i - 1][j - 1].remove();
    },

    canMove: function (i, j) {
        if (this.boardJudge.canMove(i, j)) {
            return true;
        } else {
            return false;
        }
    },
    judge: function (i, j, isBlack) {
        return this.boardJudge.judge(i, j, isBlack);
    },
    getBoardMap: function () {
        return this.boardMap.concat();
    }
})


window.onload = function () {

    Igo.core = new Core(Igo.WIDTH, Igo.HEIGHT); //global
    Igo.core.x = 0;
    Igo.core.y = 0;
    Igo.core.preload('pictures/board.png');
    Igo.core.preload('pictures/white_stone.png');
    Igo.core.preload('pictures/black_stone.png');
    Igo.core.preload('pictures/start.png');
    Igo.core.preload('pictures/result.png');

    Igo.core.onload = function () {
        var sceneManager = new SceneManager();
        sceneManager.init();
        Igo.core.on('enterframe', function () {
            sceneManager.update();
        })
    };
    Igo.core.start();
};
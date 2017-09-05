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
    isProhibitedMass: function (i, j, turn) {
        var checkMap = new Array(11);
        for (var m = 0; m < 11; m++) {
            checkMap[m] = new Array(11);
            for (var n = 0; n < 11; n++) {
                checkMap[m][n] = 0;
            }
        }
        if (this.fourDirectionSearch(i, j, !turn, checkMap)) {
            console.log("prohibited ");
            return true;
        } else {
            return false;
        }
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
    kou: [],

    /*メンバ関数*/
    initialize: function (width, height, sceneManager) {
        /*親コンストラクタ呼び出し*/
        Sprite.call(this);

        this.sceneManager = sceneManager;

        this.boardJudge = new BoardJudge(this);

        //コウの初期化
        this.kou.x = -1;
        this.kou.y = -1;

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
        var isRemove = false;
        var removeCount = 0;
        var kou = [];

        if (i <= 0 || j <= 0 || i >= 10 || j >= 10 || this.boardMap[i][j] != -1) {
            console.log("set stone error");
            return false;
        }
        //コウの判定
        if (i == this.kou.x && j == this.kou.y) {
            console.log("kou");
            return false;
        }

        //コウの初期化
        this.kou.x = -1;
        this.kou.y = -1;
        
        


        if (isBlack) {
            this.boardMap[i][j] = 1;
        } else {
            this.boardMap[i][j] = 0;
        }

        var isProhibited = this.isProhibitedMass(i, j, isBlack);

        var removeStoneMap = this.judge(i, j, isBlack);
        for (var x = 0; x < 11; x++) {
            for (var y = 0; y < 11; y++) {
                if (removeStoneMap[x][y] == 1) {
                    this.removeStone(x, y);
                    this.boardMap[x][y] = -1;
                    isRemove = true;
                    removeCount++;
                    kou.x = x;
                    kou.y = y;
                }
            }
        }
        if (isProhibited) {
            if (!isRemove) {
                this.boardMap[i][j] = -1;
                return false;
            }
            else if(removeCount == 1){
                this.kou.x = kou.x;
                this.kou.y = kou.y;
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
    isProhibitedMass: function (i, j, isBlack) {
        return this.boardJudge.isProhibitedMass(i, j, isBlack);;
    },
    getBoardMap: function () {
        return this.boardMap.concat();
    }
})
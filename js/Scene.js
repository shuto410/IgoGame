StartScene = Class.create(Scene, {
    /*メンバ変数*/
    sceneManager: null,

    /*メンバ関数*/
    initialize: function (sceneManager) {
        Scene.call(this);
        this.sceneManager = sceneManager;

        var startButton = new Sprite(300, 300);
        var backGround = new Sprite(1920, 1080);
        this.addChild(backGround); //シーンに追加
        this.addChild(startButton); //シーンに追加

        backGround.image = Igo.core.assets["pictures/title_background.png"];
        startButton.image = Igo.core.assets["pictures/start.png"];
        startButton.x = (Igo.WIDTH - 300) / 2.0;
        startButton.y = (Igo.HEIGHT - 300) / 2.0;
        startButton.addEventListener('touchstart', function () {
            this.sceneManager.changeScene(Igo.SCENE.GAME);
        }.bind(this));
        //this.backgroundColor = "#F7D94C";
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
    characterSprite: null,

    /*メンバ関数*/
    initialize: function (sceneManager) {
        //親コンストラクタ
        Scene.call(this);


        this.sceneManager = sceneManager;
        
        //背景スプライト生成
        var backGround = new Sprite(1920, 1080);
        this.addChild(backGround);
        backGround.image = Igo.core.assets['pictures/background.png'];
        
        //ボードスプライト生成
        this.boardManager = new BoardManager(Igo.BOARDSIZE, Igo.BOARDSIZE, this.sceneManager);
        this.addChild(this.boardManager); //シーンに追加

        //todo:キャラクタースプライト生成
        this.characterSprite = new Array(2);
        this.characterSprite[0] = new Sprite(250, 500);
        this.characterSprite[0].image = Igo.core.assets['pictures/character_white.png'];

        this.characterSprite[1] = new Sprite(250, 500);
        this.addChild(this.characterSprite[1]);
        this.characterSprite[1].image = Igo.core.assets['pictures/character_black.png'];
        this.characterSprite[0].x = 1670;

        //背景色設定
        this.backgroundColor = "#F7D94C";
    },
    update: function () {
        var result = this.input.getResult();

        if (result.isSquare) {
            if (this.boardManager.canMove(result.i, result.j)) {
                if (this.boardManager.setStone(result.i, result.j, this.turnIsBlack)) {
                    this.turnIsBlack = !(this.turnIsBlack);
                    this.addChild(this.characterSprite[Number(this.turnIsBlack)]);
                    this.removeChild(this.characterSprite[Number(!this.turnIsBlack)]);
                }
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

window.onload = function () {

    Igo.core = new Core(Igo.WIDTH, Igo.HEIGHT); //global
    Igo.core.x = 0;
    Igo.core.y = 0;
    Igo.core.preload('pictures/title_background.png');
    Igo.core.preload('pictures/background.png');
    Igo.core.preload('pictures/board.png');
    Igo.core.preload('pictures/white_stone.png');
    Igo.core.preload('pictures/white_stone2.png');
    Igo.core.preload('pictures/black_stone.png');
    Igo.core.preload('pictures/start.png');
    Igo.core.preload('pictures/result.png');
    Igo.core.preload('pictures/character_black.png');
    Igo.core.preload('pictures/character_white.png');

    Igo.core.onload = function () {
        var sceneManager = new SceneManager();
        sceneManager.init();
        Igo.core.on('enterframe', function () {
            sceneManager.update();
        })
    };
    Igo.core.start();
};
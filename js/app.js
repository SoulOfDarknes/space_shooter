import { GameManager } from './gameManager.js';

const app = new PIXI.Application({ width: 1280, height: 720 });
document.body.appendChild(app.view);

const backgroundTexture = PIXI.Texture.from('./image/background.png');
const background = new PIXI.Sprite(backgroundTexture);
background.width = app.view.width;
background.height = app.view.height;
app.stage.addChild(background)

const gameManager = new GameManager(app);

const keys = {
    ArrowLeft: false,
    ArrowRight: false,
    Space: false
};

document.addEventListener("keydown", (e) => {
    if (keys.hasOwnProperty(e.code)) {
        keys[e.code] = true;
    }

    if (e.code === "Space" && !gameManager.isShooting) {
        gameManager.shoot();
        gameManager.isShooting = true;
    }
});

document.addEventListener("keyup", (e) => {
    if (keys.hasOwnProperty(e.code)) {
        keys[e.code] = false;
    }
    if (e.code === "Space") {
        gameManager.isShooting = false;
    }
});

app.ticker.add(() => {
    if (keys.ArrowLeft) {
        gameManager.player.move("left");
    }
    if (keys.ArrowRight) {
        gameManager.player.move("right");
    }

    gameManager.update();
});

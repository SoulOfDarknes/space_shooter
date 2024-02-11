import { Asteroid } from './asteroid.js';
import { Bullet } from './bullet.js';
import { Player } from './player.js';
import { Boss } from './boss.js';

export class GameManager {
    constructor(app) {
        this.app = app;
        this.gameActive = true;
        this.currentLevel = 1;
        this.isShooting = false;
        this.initializeBackground();
        this.initializeGame();
    }

    initializeGame() {
        if (!this.player) {
            this.player = new Player(this.app);
        }
        this.player.load().then(() => {
            this.player.resetPosition();
        });
        this.asteroids = [];
        this.bullets = [];
        this.maxShots = 10;
        this.shotsFired = 0;
        this.timeLeft = 60;
        this.initializeUI();
        this.populateAsteroids(1);
        this.setupGameTimer();
    }

    initializeUI() {
        this.timerText = this.createTextElement(`${this.timeLeft}`, 1240, 20);
        this.shotsText = this.createTextElement(`Bullets: ${this.maxShots} / ${this.maxShots}`, 100, 20);
        this.startNewGameText = this.createButton('START NEW GAME', this.app.screen.width / 2, this.app.screen.height - 30);
    }

    createTextElement(text, x, y, interactive = false) {
        const textStyle = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 24,
            fill: 'red',
        });
        const textElement = new PIXI.Text(text, textStyle);
        textElement.x = x - textElement.width / 2;
        textElement.y = y;
        if (interactive) {
            textElement.interactive = true;
            textElement.buttonMode = true;
            textElement.on('pointerdown', () => this.startNewGame());
        }
        this.app.stage.addChild(textElement);
        return textElement;
    }

    populateAsteroids(count) {
        for (let i = 0; i < count; i++) {
            this.asteroids.push(new Asteroid(this.app));
        }
    }

    setupGameTimer() {

        if (this.gameTimer) {
            clearInterval(this.gameTimer);
        }

        clearInterval(this.gameTimer);
        this.gameTimer = setInterval(() => {
            this.timeLeft -= 1;
            this.timerText.text = `${this.timeLeft}`;

            if (this.timeLeft <= 0) {
                clearInterval(this.gameTimer);
                const endMessage = "YOU LOSE";
                this.endGame(endMessage);
            }
        }, 1000);
    }

    shoot() {

        if (this.active) { // Переконайтеся, що бос активний перед стрільбою
            const bullet = new BossBullet(this.app, this.sprite.x, this.sprite.y + this.sprite.height / 2, 0, 1);
            // Тут слід додати логіку для додавання кулі на сцену або у список об'єктів для обробки
        }
        if (!this.gameActive || this.shotsFired >= this.maxShots || this.isShooting) {
            return;
        }

        if (this.shotsFired < this.maxShots && !this.isShooting) {
            this.isShooting = true;
            const bullet = new Bullet(this.app, this.player.sprite.x + this.player.sprite.width / 2 - 5, this.player.sprite.y);
            this.bullets.push(bullet);
            this.shotsFired++;
            this.updateShotsText();

            setTimeout(() => {
                this.isShooting = false;
            }, 100);
        }
    }

    updateShotsText() {
        const shotsRemaining = this.maxShots - this.shotsFired;
        this.shotsText.text = `Bullets: ${shotsRemaining} / ${this.maxShots}`;
    }

    update() {
        this.bullets.forEach(bullet => bullet.move());
        this.bullets = this.bullets.filter(bullet => bullet.alive);
        this.asteroids.forEach(asteroid => asteroid.move());
        this.checkCollisions();

        if (this.currentLevel === 1 && this.asteroids.length === 0 && this.gameActive && !this.boss) {
            this.nextLevel();
        }

        else if (this.shotsFired === this.maxShots && this.bullets.length === 0) {
            this.endGame("YOU LOSE");
        } else if (this.timeLeft <= 0) {
            this.endGame("YOU LOSE");
        }
        if (this.boss) {
            this.boss.update();
            if (this.boss.defeated) {
                this.app.stage.removeChild(this.boss.sprite);
                this.app.stage.removeChild(this.boss.hpBar);
                this.boss.deactivate();
                this.endGame("YOU WIN!");
            }
        }

    }

    checkCollisions() {
        this.bullets.forEach((bullet) => {
            this.asteroids.forEach((asteroid, index) => {
                if (this.hitTestRectangle(bullet.bullet, asteroid.asteroid)) {
                    bullet.remove();
                    asteroid.remove();
                }
            });
            if (this.boss && this.hitTestRectangle(bullet.bullet, this.boss.sprite)) {
                bullet.remove();
                this.boss.takeDamage();
            }
        });

        this.bullets = this.bullets.filter(bullet => bullet.alive);
        this.asteroids = this.asteroids.filter(asteroid => asteroid.alive);
    }

    hitTestRectangle(r1, r2) {
        const r1Bounds = r1.getBounds();
        const r2Bounds = r2.getBounds();
        return r1Bounds.x < r2Bounds.x + r2Bounds.width &&
            r1Bounds.x + r1Bounds.width > r2Bounds.x &&
            r1Bounds.y < r2Bounds.y + r2Bounds.height &&
            r1Bounds.y + r1Bounds.height > r2Bounds.y;
    }

    endGame(message) {
        if (!this.gameActive) return;
        this.gameActive = false;
        clearInterval(this.gameTimer);

        this.asteroids.forEach(asteroid => asteroid.remove());
        this.asteroids = [];
        this.bullets.forEach(bullet => bullet.remove());

        this.showEndGameMessage(message);
    }

    startNewGame() {
        if (this.boss) {
            this.boss.deactivate();
            this.boss.removeAllBullets();
            this.app.stage.removeChild(this.boss.sprite);
            this.app.stage.removeChild(this.boss.hpBar);
            this.boss = null;
        }
        console.log('this.boss', this.boss);
        this.currentLevel = 1;
        this.gameActive = true;
        this.shotsFired = 0;
        this.timeLeft = 60;
        this.asteroids.forEach(asteroid => asteroid.remove());
        this.asteroids = [];
        this.bullets.forEach(bullet => bullet.remove());
        this.bullets = [];
        this.app.stage.removeChildren();
        this.initializeGame();
        this.initializeBackground();
    }

    nextLevel() {

        if (!this.gameActive) return;
        this.shotsFired = 0;
        this.maxShots = 10;

        this.updateShotsText();
        this.currentLevel += 1;
        console.log(`Next lvl ${this.currentLevel}!`);
        if (this.currentLevel === 2) {
            this.boss = new Boss(this.app);
            this.boss.activate();
        }
        this.transitionToNextLevel();
    }


    showEndGameMessage(message) {
        const style = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 36,
            fill: 'white',
            stroke: '#ff3300',
            strokeThickness: 4,
            dropShadow: true,
            dropShadowColor: '#000000',
            dropShadowBlur: 4,
            dropShadowAngle: Math.PI / 6,
            dropShadowDistance: 6,
        });

        const textMessage = new PIXI.Text(message, style);
        textMessage.x = this.app.screen.width / 2 - textMessage.width / 2;
        textMessage.y = this.app.screen.height / 2 - textMessage.height / 2;
        this.app.stage.addChild(textMessage);
    }

    initializeBackground() {
        const backgroundTexture = PIXI.Texture.from('./image/background.png');
        this.background = new PIXI.Sprite(backgroundTexture);
        this.background.width = this.app.view.width;
        this.background.height = this.app.view.height;
        this.app.stage.addChild(this.background);
        this.app.stage.setChildIndex(this.background, 0);
    }

    createButton(text, x, y) {
        const buttonWidth = 300;
        const buttonHeight = 50;
        const borderRadius = 40;
        const button = new PIXI.Graphics();

        button.lineStyle(2, 0x1640D6, 1);
        button.beginFill(0x000000, 0);
        button.drawRoundedRect(-buttonWidth / 2, -buttonHeight / 2, buttonWidth, buttonHeight, borderRadius);
        button.endFill();

        const textStyle = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 24,
            fill: '#1640D6',
        });
        const textElement = new PIXI.Text(text, textStyle);
        textElement.anchor.set(0.5, 0.5);

        const buttonContainer = new PIXI.Container();
        buttonContainer.x = x;
        buttonContainer.y = y;
        buttonContainer.interactive = true;
        buttonContainer.buttonMode = true;
        buttonContainer.on('pointerdown', this.startNewGame.bind(this));

        buttonContainer.addChild(button);
        buttonContainer.addChild(textElement);

        this.app.stage.addChild(buttonContainer);
    }

    resetGame() {
        this.app.stage.removeChildren();
        this.asteroids = [];
        this.bullets = [];
        this.initializeBackground();
        this.initializeUI();
        this.gameActive = true;
    }

    transitionToNextLevel() {
        const fadeOut = new PIXI.Graphics()
            .beginFill(0x000000, 1)
            .drawRect(0, 0, this.app.screen.width, this.app.screen.height)
            .endFill();
        fadeOut.alpha = 0;
        this.app.stage.addChild(fadeOut);

        let ticker = new PIXI.Ticker();
        ticker.add((delta) => {
            fadeOut.alpha += 0.05 * delta;
            if (fadeOut.alpha >= 1) {
                ticker.stop();
                ticker.remove();
                this.app.stage.removeChild(fadeOut);
            }
        });
        ticker.start();
    }

}

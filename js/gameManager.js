import { Asteroid } from './asteroid.js';
import { Bullet } from './bullet.js';
import { Player } from './player.js';

export class GameManager {
    constructor(app) {
        this.app = app;
        this.gameActive = true;
        this.initializeBackground();
        this.initializeGame();
    }

    initializeGame() {
        this.player = new Player(this.app);
        this.player.load().then(() => {
            this.player.resetPosition();
        });
        this.asteroids = [];
        this.bullets = [];
        this.maxShots = 10;
        this.shotsFired = 0;
        this.timeLeft = 60;
        this.initializeUI();
        this.populateAsteroids(5);
        this.setupEventListeners();
        this.setupGameTimer();
    }

    initializeUI() {
        this.timerText = this.createTextElement(`${this.timeLeft}`, 1240, 20);
        this.shotsText = this.createTextElement(`Bullets: ${this.maxShots} / ${this.maxShots}`, 100, 20);
        this.startNewGameText = this.createTextElement('START NEW GAME', this.app.screen.width / 2, this.app.screen.height - 30, true);
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

    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (e.key === ' ') {
                this.shoot();
            }
        });
    }

    populateAsteroids(count) {
        for (let i = 0; i < count; i++) {
            this.asteroids.push(new Asteroid(this.app));
        }
    }

    setupGameTimer() {
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
        if (this.shotsFired < this.maxShots && this.canShoot()) {
            const bullet = new Bullet(this.app, this.player.sprite.x + this.player.sprite.width / 2 - 5, this.player.sprite.y);
            this.bullets.push(bullet);
            this.shotsFired++;
            this.lastShootTime = Date.now();
            this.updateShotsText();
        }
    }

    canShoot() {
        const shootDelay = 200;
        return !this.lastShootTime || Date.now() - this.lastShootTime >= shootDelay;
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

        if (this.asteroids.length === 0) {
            this.endGame("YOU WIN");
        } else if (this.shotsFired === this.maxShots && this.bullets.length === 0) {
            this.endGame("YOU LOSE");
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
        this.bullets.forEach(bullet => bullet.stop());

        document.removeEventListener('keydown', this.handleKeyDown);

        this.showEndGameMessage(message);
    }

    startNewGame() {
        this.gameActive = true;
        this.app.stage.removeChildren();
        this.initializeGame();
        this.initializeBackground();
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
        const backgroundTexture = PIXI.Texture.from('../image/background.png');
        this.background = new PIXI.Sprite(backgroundTexture);
        this.background.width = this.app.view.width;
        this.background.height = this.app.view.height;
        this.app.stage.addChild(this.background);
        this.app.stage.setChildIndex(this.background, 0);
    }

}

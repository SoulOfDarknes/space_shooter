export class Asteroid {
    constructor(app) {
        const asteroidTextures = [];
        for (let i = 1; i <= 16; i++) {
            const texture = PIXI.Texture.from(`../image/asteroids/${i}.png`);
            asteroidTextures.push(texture);
        }
        this.app = app;
        this.alive = true;
        this.moving = true;

        this.asteroid = new PIXI.AnimatedSprite(asteroidTextures);

        this.asteroid.x = Math.random() * app.screen.width;
        this.asteroid.y = -20;
        this.asteroid.anchor.set(0.5);

        this.asteroid.animationSpeed = 0.1;
        this.asteroid.play();

        this.app.stage.addChild(this.asteroid);
    }

    move() {
        if (!this.alive || !this.moving) return;
        this.asteroid.y += 2;
        if (this.asteroid.y > this.app.screen.height + 20) {
            this.asteroid.x = Math.random() * this.app.screen.width;
            this.asteroid.y = -20;
        }
    }


    remove() {
        if (this.alive) {
            this.app.stage.removeChild(this.asteroid);
            this.alive = false;
        }
    }

    stop() {
        this.moving = false;
    }
}

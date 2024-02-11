export class BossBullet {
    constructor(app, startX, startY, directionX, directionY, speed = 1) {
        this.app = app;
        this.sprite = new PIXI.Sprite(PIXI.Texture.from('../image/fireball.png'));
        this.sprite.anchor.set(0.5);
        this.sprite.x = startX;
        this.sprite.y = startY;
        this.directionX = directionX;
        this.directionY = directionY;
        this.speed = speed;
        this.app.stage.addChild(this.sprite);
        this.removed = false;
    }

    move() {
        this.sprite.x += this.directionX * this.speed;
        this.sprite.y += this.directionY * this.speed;

        if (this.sprite.x < 0 || this.sprite.x > this.app.screen.width || this.sprite.y < 0 || this.sprite.y > this.app.screen.height) {
            this.remove();
        }
    }

    remove() {
        if (!this.removed) {
            this.app.stage.removeChild(this.sprite);
            this.sprite.destroy();
            this.removed = true;
        }
    }
}

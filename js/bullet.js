export class Bullet {
    constructor(app, startX, startY) {
        this.app = app;
        this.alive = true;
        this.moving = true;
        this.bullet = new PIXI.Graphics();
        this.bullet.beginFill(0xFF0000);
        this.bullet.drawCircle(0, 0, 5);
        this.bullet.endFill();
        this.bullet.x = startX;
        this.bullet.y = startY;
        this.app.stage.addChild(this.bullet);
    }

    move() {
        if (!this.alive || !this.moving) return false;
        if (!this.alive) return false;

        this.bullet.y -= 10;
        if (this.bullet.y < 0) {
            this.remove();
            return false;
        }
        return true;
    }

    remove() {
        if (this.alive) {
            this.app.stage.removeChild(this.bullet);
            this.alive = false;
        }
    }

    stop() {
        this.moving = false;
    }
}

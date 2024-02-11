export class Boss {
    constructor(app) {
        this.app = app;
        this.hp = 4;
        this.maxHp = 4;
        this.sprite = new PIXI.Sprite(PIXI.Texture.from('./image/boss.png'));
        this.sprite.anchor.set(0.5);
        this.sprite.x = app.screen.width / 2;
        this.sprite.y = 150;
        this.app.stage.addChild(this.sprite);
        this.moveDirection = 1;
        this.moveSpeed = 2;
        this.defeated = false;

        this.hpBar = new PIXI.Graphics();
        this.updateHpBar();
        app.stage.addChild(this.hpBar);


        this.moveInterval = setInterval(() => {
            this.randomizeMovement();
        }, 2000);
    }

    updateHpBar() {
        this.hpBar.clear();
        this.hpBar.beginFill(0xFF3300);
        const hpBarWidth = 60;
        const hpBarHeight = 10;
        const hpBarFullWidth = (this.hp / this.maxHp) * hpBarWidth;
        this.hpBar.x = this.sprite.x - hpBarWidth / 2;
        this.hpBar.y = this.sprite.y - this.sprite.height / 2 - 20;
        this.hpBar.drawRect(0, 0, hpBarFullWidth, hpBarHeight);
        this.hpBar.endFill();
    }

    stop() {
        clearInterval(this.moveInterval);
    }

    randomizeMovement() {
        const direction = Math.random() > 0.5 ? 1 : -1;
        const speed = Math.random() * 3 + 1;
        this.moveDirection = direction;
        this.moveSpeed = speed;

    }

    update() {
        this.sprite.x += this.moveSpeed * this.moveDirection;
        if (this.sprite.x > this.app.screen.width - this.sprite.width / 2 || this.sprite.x < this.sprite.width / 2) {
            this.moveDirection *= -1;
        }
        this.updateHpBar();
    }

    takeDamage() {
        this.hp -= 1;
        this.updateHpBar();
        if (this.hp <= 0) {
            console.log("Boss defeated");
            this.defeated = true;
        }
    }

}

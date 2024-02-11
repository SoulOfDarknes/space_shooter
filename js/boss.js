import { BossBullet } from './bossBullets.js';
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
        this.active = false;
        this.bullets = [];

        this.hpBar = new PIXI.Graphics();
        this.updateHpBar();
        app.stage.addChild(this.hpBar);


        this.moveInterval = setInterval(() => {
            this.randomizeMovement();
        }, 2000);
    }

    activate() {
        this.active = true;
        if (this.shootInterval) {
            clearInterval(this.shootInterval);
        }
        this.shootInterval = setInterval(() => {
            if (this.active) {
                this.shoot();
            }
        }, 2000);
    }

    deactivate() {
        if (this.shootInterval) {
            clearInterval(this.shootInterval);
        }
        this.removeAllBullets();
        this.active = false;
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

    shoot() {
        if (this.active) {
            const bullet = new BossBullet(this.app, this.sprite.x, this.sprite.y + this.sprite.height / 2, 0, 1);
            this.bullets.push(bullet);
        }
    }

    updateBullets() {
        this.bullets.forEach((bullet, index) => {
            bullet.move();
            if (bullet.removed) {
                this.bullets.splice(index, 1);
            }
        });
    }

    removeAllBullets() {
        this.bullets.forEach(bullet => bullet.remove());
        this.bullets = [];
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
        this.updateBullets();
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

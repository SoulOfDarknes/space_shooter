export class Player {
    constructor(app) {
        this.app = app;
        this.sprite = null;
        this.texturePath = '../image/fighter.png';
    }

    load() {
        return new Promise((resolve) => {
            if (PIXI.utils.TextureCache[this.texturePath]) {
                this.sprite = new PIXI.Sprite(PIXI.utils.TextureCache[this.texturePath]);
                this.app.stage.addChild(this.sprite);
                this.resetPosition();
                resolve(this);
            } else {
                const loader = new PIXI.Loader();
                loader.add('fighterTexture', this.texturePath);
                loader.load((loader, resources) => {
                    this.sprite = new PIXI.Sprite(resources.fighterTexture.texture);
                    this.app.stage.addChild(this.sprite);
                    this.resetPosition();
                    resolve(this);
                });
            }
        });
    }


    resetPosition() {
        this.sprite.x = this.app.screen.width / 2 - this.sprite.width / 2;
        this.sprite.y = this.app.screen.height - this.sprite.height - 60;
    }

    move(direction) {
        const speed = 3;
        if (direction === "left" && this.sprite.x > 0) {
            this.sprite.x -= speed;
        }
        if (direction === "right" && this.sprite.x < this.app.screen.width - this.sprite.width) {
            this.sprite.x += speed;
        }
    }
}

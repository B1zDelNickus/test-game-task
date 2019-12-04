import "phaser";
import Scene = Phaser.Scene;
import Group = Phaser.GameObjects.Group;
import Image = Phaser.GameObjects.Image;
import Graphics = Phaser.GameObjects.Graphics;
import {GuiUtils} from "../../utils/gui.utils";
import BitmapText = Phaser.GameObjects.BitmapText;
import GeometryMask = Phaser.Display.Masks.GeometryMask;

export class HpBar {

    private container: Group = null;

    private bg: Image = null;
    private bar: Image = null;

    private mask: Graphics = null;
    private mask2: GeometryMask = null;

    private label: BitmapText = null;

    private total = 0;
    private maxHp = 0;
    private currentHp = 0;

    constructor(private scene: Scene, private x: number, private y: number) {

        this.container = this.scene.add.group();

        this.bg = this.scene.add.image(x, y, "hp_bar_frame");
        this.bar = this.scene.add.image(x + 18, y + 1, "hp_bar");

        this.mask = GuiUtils.makeRectangle(this.scene, this.bar.x - this.bar.width / 2, this.bar.y - this.bar.height / 2, this.bar.width, this.bar.height, 0xfff000, 0);

        this.total = this.bar.width - 3;

        this.label = this.label = this.scene.add.bitmapText(0, 0, "font", `${this.currentHp}/${this.maxHp}`, 18);
        this.label.setCenterAlign();
        this.label.setPosition(x - this.label.width / 2 + 15, y - 7);

        this.container.add(this.bg);
        this.container.add(this.bar);
        this.container.add(this.mask);
        this.container.add(this.label);

        this.mask2 = this.mask.createGeometryMask();

        this.bar.setMask(this.mask2);
    }

    hide() {
        this.scene.tweens.add({
           targets: [this.bg, this.bar, this.mask, this.label],
           duration: 250,
           alpha: 0
        });
    }

    setHp(maxHp) {
        this.maxHp = maxHp;
        this.currentHp = maxHp;
        this.resetHpLabel();
    }

    reduceHp(value: number) {
        this.currentHp -= value;
        if (this.currentHp < 0) this.currentHp = 0;
        const pixelPerHp = this.total / this.maxHp;
        const offset = pixelPerHp * value;
        this.mask.x -= offset;
        this.resetHpLabel();
        /*this.scene.tweens.killTweensOf(this.mask);
        this.scene.tweens.add({
            targets: this.mask,
            delay: 500,
            duration: 250,
            ease: "Circ.easeIn",
            x: `-=${offset}`,
            onComplete: () => {
                this.resetHpLabel();
            }
        });*/
    }

    private resetHpLabel() {
        this.label.setText(`${this.currentHp}/${this.maxHp}`);
        this.label.setPosition(this.x - this.label.width / 2 + 15, this.y - 8);
    }

    dispose() {
        for (let c of this.container.getChildren()) {
            c.destroy(true)
        }
        this.container.destroy(true);
        this.bg = null;
        this.bar = null;
        this.mask = null;
        this.mask2 = null;
        this.label = null;
        this.container = null;
    }

}
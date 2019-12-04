import "phaser";
import Image = Phaser.GameObjects.Image;
import BitmapText = Phaser.GameObjects.BitmapText;
import Scene = Phaser.Scene;
import Group = Phaser.GameObjects.Group;
import {Pair} from "../../commons/pair";

export class ImageButton {

    private container: Group = null;
    private bg: Image = null;
    private base: Image = null;
    private upState: Image = null;
    private label: BitmapText = null;

    private centerX: number = 0;
    private centerY: number = 0;

    private clickCallback: Pair<Function, any> = null;

    private isEnabled = true;

    constructor(private scene: Scene, x: number, y: number, downState: string, upState: string, text: string) {

        this.centerX = x;
        this.centerY = y;

        this.container = this.scene.add.group();

        this.bg = this.scene.add.image(480 / 2, 775 / 2, "turn_bg");
        this.base = this.scene.add.image(0, 0, downState);
        this.upState = this.scene.add.image(0, 0, upState);
        this.label = this.scene.add.bitmapText(0, 0, "font", text, 30);

        this.container.add(this.bg);
        this.container.add(this.base);
        this.container.add(this.upState);
        this.container.add(this.label);

        this.base.setInteractive({ useHandCursor: true })
            .on("pointerdown", () => this.downHandler())
            .on("pointerup", () => this.upHandler())
            .on("pointerover", () => this.overHandler())
            .on("pointerout", () => this.outHandler());

        this.setPositionByCenter();
    }

    hide(instant: boolean = false) {
        if (instant) {
            this.bg.visible = false;
            this.base.visible = false;
            this.upState.visible = false;
            this.label.visible = false;
        } else {
            const prevEnabled = this.isEnabled;
            this.isEnabled = false;
            this.scene.tweens.killTweensOf(this.bg);
            this.scene.tweens.killTweensOf(this.upState);
            this.scene.tweens.killTweensOf(this.base);
            this.scene.tweens.killTweensOf(this.label);
            this.bg.setScale(1);
            this.bg.alpha = 1;
            this.upState.setScale(1);
            this.upState.alpha = 1;
            this.base.setScale(1);
            this.base.alpha = 1;
            this.label.setScale(1);
            this.label.alpha = 1;
            this.scene.tweens.add({
                targets: [this.upState, this.base, this.label, this.bg],
                duration: 250,
                alpha: 0,
                onComplete: () => {
                    this.bg.alpha = 1;
                    this.base.alpha = 1;
                    this.upState.alpha = 1;
                    this.label.alpha = 1;
                    this.bg.visible = false;
                    this.base.visible = false;
                    this.upState.visible = false;
                    this.label.visible = false;
                    this.isEnabled = prevEnabled;
                }
            });
        }
    }

    show(instant: boolean = false) {
        this.bg.visible = true;
        this.base.visible = true;
        this.upState.visible = true;
        this.label.visible = true;
        if (!instant) {
            const prevEnabled = this.isEnabled;
            this.isEnabled = false;
            this.scene.tweens.killTweensOf(this.bg);
            this.scene.tweens.killTweensOf(this.upState);
            this.scene.tweens.killTweensOf(this.base);
            this.scene.tweens.killTweensOf(this.label);
            this.bg.setScale(1);
            this.bg.alpha = 0;
            this.upState.setScale(1);
            this.upState.alpha = 0;
            this.base.setScale(1);
            this.base.alpha = 0;
            this.label.setScale(1);
            this.label.alpha = 0;
            this.scene.tweens.add({
                targets: [this.upState, this.base, this.label, this.bg],
                duration: 250,
                alpha: 1,
                onComplete: () => {
                    this.isEnabled = prevEnabled;
                }
            });
        }
    }

    enable() {
        this.isEnabled = true;
        this.base.alpha = 1;
        this.upState.alpha = 1;
        this.label.alpha = 1;
    }

    disable() {
        this.isEnabled = false;
        this.base.alpha = .3;
        this.upState.alpha = .3;
        this.label.alpha = .5;
    }

    setPosition(x: number, y: number) {
        this.centerX = x;
        this.centerY = y;
        this.setPositionByCenter();
    }

    onClick(callback: Function, context: any) {
        this.clickCallback = new Pair(callback, context);
    }

    private setPositionByCenter() {
        this.bg.setPosition(this.centerX - 1, this.centerY + 4);
        this.base.setPosition(this.centerX, this.centerY);
        this.upState.setPosition(this.centerX, this.centerY);
        this.label.setPosition(this.base.x - this.label.width / 2 - 5, this.base.y - this.label.height / 2 + 10);
    }

    private downHandler() {
        if (!this.isEnabled) return;
        this.scene.tweens.killTweensOf(this.upState);
        this.upState.setScale(1);
        this.upState.alpha = 1;
        this.scene.tweens.add({
            targets: this.upState,
            duration: 100,
            alpha: 0
        });
    }

    private upHandler() {
        if (!this.isEnabled) return;
        this.scene.tweens.killTweensOf(this.upState);
        this.upState.setScale(1);
        this.upState.alpha = 0;
        this.scene.tweens.add({
            targets: this.upState,
            duration: 100,
            alpha: 1,
            onComplete: (null != this.clickCallback) ? this.clickCallback.first.call(this.clickCallback.second) : () => {}
        });
    }

    private overHandler() {
        if (!this.isEnabled) return;
        this.scene.tweens.killTweensOf(this.upState);
        this.upState.setScale(1);
        this.upState.alpha = 1;
        this.scene.tweens.add({
            targets: this.upState,
            duration: 100,
            scale: 1.03
        });
    }

    private outHandler() {
        if (!this.isEnabled) return;
        this.scene.tweens.killTweensOf(this.upState);
        this.upState.setScale(1.03);
        this.upState.alpha = 1;
        this.scene.tweens.add({
            targets: this.upState,
            duration: 100,
            scale: 1
        });
    }

    dispose() {
        for (let c of this.container.getChildren()) {
            c.destroy(true)
        }
        this.container.destroy(true);
        this.base = null;
        this.upState = null;
        this.label = null;
        this.clickCallback = null;
        this.container = null;
    }

}
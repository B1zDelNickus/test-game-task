import "phaser";
import Image = Phaser.GameObjects.Image;
import BitmapText = Phaser.GameObjects.BitmapText;
import Scene = Phaser.Scene;
import Group = Phaser.GameObjects.Group;
import {Pair} from "../../commons/pair";

export class ChatButton {

    private container: Group = null;
    private upState: Image = null;

    private centerX: number = 0;
    private centerY: number = 0;

    private clickCallback: Pair<Function, any> = null;

    private isEnabled = true;

    constructor(private scene: Scene, x: number, y: number) {

        this.centerX = x;
        this.centerY = y;

        this.container = this.scene.add.group();

        this.upState = this.scene.add.image(0, 0, "friend_btn_up");

        this.container.add(this.upState);

        this.upState.setInteractive({ useHandCursor: true })
            .on("pointerdown", () => this.downHandler())
            .on("pointerup", () => this.upHandler())
            .on("pointerover", () => this.overHandler())
            .on("pointerout", () => this.outHandler());

        this.setPositionByCenter();
    }

    hide(instant: boolean = false) {
        if (instant) {
            this.upState.visible = false;
        } else {
            const prevEnabled = this.isEnabled;
            this.isEnabled = false;
            this.scene.tweens.killTweensOf(this.upState);
            this.upState.setScale(1);
            this.upState.alpha = 1;
            this.scene.tweens.add({
                targets: [this.upState],
                duration: 250,
                alpha: 0,
                onComplete: () => {
                    this.upState.alpha = 1;
                    this.upState.visible = false;
                    this.isEnabled = prevEnabled;
                }
            });
        }
    }

    show(instant: boolean = false) {
        this.upState.visible = true;
        if (!instant) {
            const prevEnabled = this.isEnabled;
            this.isEnabled = false;
            this.scene.tweens.killTweensOf(this.upState);
            this.upState.setScale(1);
            this.upState.alpha = 0;
            this.scene.tweens.add({
                targets: [this.upState],
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
        this.upState.alpha = 1;
    }

    disable() {
        this.isEnabled = false;
        this.upState.alpha = .3;
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
        this.upState.setPosition(this.centerX, this.centerY);
    }

    private downHandler() {
        if (!this.isEnabled) return;
        this.scene.tweens.killTweensOf(this.upState);
        this.upState.setScale(1);
        this.upState.alpha = 1;
        this.scene.tweens.add({
            targets: this.upState,
            duration: 100,
            alpha: .5
        });
    }

    private upHandler() {
        if (!this.isEnabled) return;
        this.scene.tweens.killTweensOf(this.upState);
        this.upState.setScale(1);
        this.upState.alpha = .5;
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
        this.upState = null;
        this.clickCallback = null;
        this.container = null;
    }

}
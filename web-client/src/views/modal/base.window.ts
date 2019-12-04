import "phaser";

import Scene = Phaser.Scene;
import {NineSlice} from "phaser3-nineslice";
import Group = Phaser.GameObjects.Group;
import Graphics = Phaser.GameObjects.Graphics;
import {GuiUtils} from "../../utils/gui.utils";
import BitmapText = Phaser.GameObjects.BitmapText;
import Timeline = Phaser.Tweens.Timeline;
import {ImageButton} from "../components/image.button";
import {Pair} from "../../commons/pair";

export class BaseWindow {

    private container: Group = null;
    private fader: Graphics = null;
    private bg: NineSlice = null;
    private text: BitmapText = null;
    private closeBtn: ImageButton = null;

    private closeCallback: Pair<Function, any> = null;

    constructor(
        private scene: Scene,
        y: number,
        height: number,
        rows: string[],
        label: string = "OK"
    ) {
        this.container = this.scene.add.group();

        this.fader = GuiUtils.makeRectangle(this.scene, 0, 0, 480, 775, 0x110023, .55);
        this.container.add(this.fader);

        this.bg = this.scene.add.nineslice(
            20, y,
            440, height,
            "grid",
            120,
            30
        );
        this.container.add(this.bg);

        this.text = this.scene.add.bitmapText(0, 0, "font", rows, 32);
        this.text.setCenterAlign();
        this.text.setPosition(480 / 2 - this.text.width / 2, this.bg.y + 50);
        this.container.add(this.text);

        this.closeBtn = new ImageButton(this.scene, 480 / 2, 640, "turn_btn_down", "turn_btn_up", label);
        this.closeBtn.hide(true);
        this.closeBtn.onClick(() => { this.closeBtn.disable();this.hide(); }, this);

        this.fader.alpha = 0;
        this.bg.x += 480;
        this.text.x += 480;
    }

    show(callback: Function = null): Timeline {
        const tl = this.scene.tweens.createTimeline({
            onComplete: (null != callback) ? callback.call(this.scene) : () => {}
        });
        tl.add({
            targets: this.fader,
            duration: 500,
            alpha: 1,
            ease: "Linear"
        });
        tl.add({
            targets: [this.bg, this.text],
            duration: 500,
            x: '-=480',
            offset: -200,
            ease: "Quad.easeOut",
            onComplete: () => { this.closeBtn.show(); }
        });
        tl.add({
            targets: this.closeBtn,
            duration: 250,
            //scale: 1.5,
            //alpha: 1,
            //ease: "Circ.easeOut",
        });
        tl.play();
        return tl;
    }

    setText(rows: string[]) {
        this.text.setText(rows);
    }

    onHide(callback: Function, context: any) {
        this.closeCallback = new Pair(callback, context);
    }

    protected hide(): Timeline {
        const tl = this.scene.tweens.createTimeline({
            onComplete: (null != this.closeCallback) ? this.closeCallback.first.call(this.closeCallback.second) : () => {}
        });
        this.closeBtn.hide();
        tl.add({
            targets: this.closeBtn,
            duration: 250,
            //scale: 0,
            //alpha: 0,
            //ease: "Circ.easeIn",
        });
        tl.add({
            targets: [this.bg, this.text],
            duration: 500,
            x: "+=480",
            ease: "Quad.easeOut"
        });
        tl.add({
            targets: this.fader,
            duration: 500,
            alpha: 0,
            offset: -200,
            ease: "Linear"
        });
        tl.play();
        return tl;
    }

    dispose() {
        for (let c of this.container.getChildren()) {
            c.destroy(true)
        }
        this.container.destroy(true);
        this.closeBtn.dispose();
        this.bg = null;
        this.fader = null;
        this.text = null;
        this.closeBtn = null;
        this.container = null;
    }

}
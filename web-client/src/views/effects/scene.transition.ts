import "phaser";
import Scene = Phaser.Scene;
import Graphics = Phaser.GameObjects.Graphics;
import {GuiUtils} from "../../utils/gui.utils";
import Tween = Phaser.Tweens.Tween;

export class SceneTransition {

    private fader: Graphics = null;

    constructor(private scene: Scene) {
        this.fader = GuiUtils.makeRectangle(this.scene, 0, 0, 480, 775);
    }

    fadeIn(callback: Function = null) : Tween {
        const tw = this.scene.tweens.add({
            targets: this.fader,
            duration: 500,
            ease: "Linear",
            alpha: 0,
            onComplete: (null != callback) ? callback.call(this.scene) : () => {}
        });
        return tw;
    }

    fadeOut(callback: Function = null) : Tween {
        const tw = this.scene.tweens.add({
            targets: this.fader,
            duration: 500,
            ease: "Linear",
            alpha: 1,
            onComplete: (null != callback) ? callback.call(this.scene) : () => {}
        });
        return tw;
    }

    dispose() {
        this.fader.destroy(true);
        this.fader = null;
    }

}
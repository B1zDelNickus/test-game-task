import {BaseWindow} from "./base.window";
import Scene = Phaser.Scene;

export class BattleWindow extends BaseWindow {
    constructor(scene: Scene, label: string) {
        super(scene, 50, 540,
            [
                "Welcome!",
                "You are playing into",
            ],
            label
        );
    }
}
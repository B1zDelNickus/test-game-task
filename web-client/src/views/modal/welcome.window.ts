import {BaseWindow} from "./base.window";
import Scene = Phaser.Scene;

export class WelcomeWindow extends BaseWindow {
    constructor(scene: Scene) {
        super(scene, 50, 540,
            [
                "Welcome!",
                "You are playing into",
                "test task rpg game!",
                "* * *",
                "Press Chat Btn",
                "for interactive chatting",
                "OR",
                "press Battle Btn",
                "for starting Duel.",
            ]
        );
    }
}
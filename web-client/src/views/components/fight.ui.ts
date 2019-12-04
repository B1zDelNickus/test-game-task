import "phaser";
import Scene = Phaser.Scene;
import Group = Phaser.GameObjects.Group;
import Image = Phaser.GameObjects.Image;

export class FightUi {

    private container: Group = null;

    private bg: Image = null;

    constructor(private scene: Scene) {
        this.container = this.scene.add.group();

        this.bg = this.scene.add.image(480 / 2, 775 / 2, "turn_bg");
    }

}
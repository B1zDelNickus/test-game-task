import "phaser";
import Scene = Phaser.Scene;
import {Message} from "../../core/chat/message";
import Group = Phaser.GameObjects.Group;
import BitmapText = Phaser.GameObjects.BitmapText;
import {TextUtils} from "../../utils/text.utils";

export class ChatMessage {

    private container: Group = null;
    private author: BitmapText = null;
    private text: BitmapText = null;

    constructor(private scene: Scene, private msg: Message) {
        this.container = this.scene.add.group();
        this.text = this.scene.add.bitmapText(70, 0, "font", TextUtils.wrapText(msg.author + ": " + msg.text), 18);
        this.container.add(this.text);
    }

    setH(h: number) {
        //this.author.setPosition(this.author.x, h);
        this.text.setPosition(this.text.x, h);
    }

    getH = () => this.text.height;

    hide() {
        this.scene.tweens.add({
            targets: [this.text],
            duration: 500,
            x: "+=480",
            ease: "Quad.easeOut"
        });
    }

    show() {
        this.scene.tweens.add({
            targets: [this.text],
            duration: 500,
            x: "-=480",
            ease: "Quad.easeIn"
        });
    }

    dispose() {
        for (let c of this.container.getChildren()) {
            c.destroy(true)
        }
        this.container.destroy(true);
        this.author = null;
        this.text = null;
        this.container = null;
    }

}
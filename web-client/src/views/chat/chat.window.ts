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
import DOMElement = Phaser.GameObjects.DOMElement;
import {Message} from "../../core/chat/message";
import {ChatMessage} from "./chat.message";
import {ChatService} from "../../services/chat.service";
import {PlayerService} from "../../services/player.service";

export class ChatWindow {

    private container: Group = null;
    private fader: Graphics = null;
    private mask: Graphics = null;
    private bg: NineSlice = null;
    private text: BitmapText = null;
    private closeBtn: ImageButton = null;

    private element: DOMElement = null;
    private textInput: Element = null;

    private closeCallback: Pair<Function, any> = null;

    private messages: ChatMessage[] = [];

    private chatService: ChatService = null;
    private playerService: PlayerService = null;

    constructor(
        private scene: Scene
    ) {
        this.playerService = PlayerService.getInstance();
        this.chatService = ChatService.getInstance();
        this.chatService.subscribe((text: string) => {
            const msg = new Message(text.split(':')[0].trim(), text.split(':')[1].trim());
            const msgView = new ChatMessage(this.scene, msg);
            this.messages[this.messages.length] = msgView;
            this.sortMessages();
        }, this);

        this.container = this.scene.add.group();

        this.fader = GuiUtils.makeRectangle(this.scene, 0, 0, 480, 775, 0x110023, .55);
        this.container.add(this.fader);

        this.closeBtn = new ImageButton(this.scene, 480 / 2, 720, "turn_btn_down", "turn_btn_up", "Send");
        this.closeBtn.hide(true);

        this.closeBtn.onClick(() => this.send(), this);

        this.bg = this.scene.add.nineslice(
            20, 20,
            440, 670,
            "grid",
            120,
            30
        );
        this.container.add(this.bg);

        this.mask = GuiUtils.makeRectangle(this.scene, 70, 70, 340, 500, 0xfff000, 0);
        this.container.add(this.mask);

        this.element = this.scene.add.dom(480 / 2, 620).createFromCache('input');
        this.container.add(this.element);

        this.textInput = this.element.getChildByName('nameField');
        this.textInput.addEventListener("keyup", (evt: any) => {
            if (evt.keyCode == 13) {
                evt.preventDefault();
                this.send()
            }
        });

        this.text = this.scene.add.bitmapText(0, 0, "font", [], 32);
        this.text.setCenterAlign();
        this.text.setPosition(480 / 2 - this.text.width / 2, this.bg.y + 50);
        this.container.add(this.text);

        this.fader.alpha = 0;
        this.bg.x += 480;
        this.text.x += 480;
        this.element.x += 480;
        this.mask.x += 480;
    }

    private send() {
        if ((this.textInput as any).value !== '') {
            const msg = new Message(this.playerService.player().nick, (this.textInput as any).value);
            this.chatService.sendMessage(msg);
            (this.textInput as any).value = '';
        }
    }

    private sortMessages() {
        const startY = 65;
        const sorted: ChatMessage[] = [];
        let curH = 0;
        for (let i = this.messages.length - 1; i >= 0; i--) {
            if (curH + this.messages[i].getH() <= 500) {
                sorted[sorted.length] = this.messages[i];
                curH += this.messages[i].getH();
            }
        }
        curH = startY;
        this.messages = sorted.reverse();
        this.messages.forEach(cm => {
            cm.setH(curH);
            curH += cm.getH();
        });
    }

    show(callback: Function = null): Timeline {
        const tl = this.scene.tweens.createTimeline({
            onComplete: (null != callback) ? callback.call(this.scene) : () => {}
        });
        this.scene.time.delayedCall(0, () => {
            this.messages.forEach(cm => cm.show());
        }, null, this);
        tl.add({
            targets: this.fader,
            duration: 500,
            alpha: 1,
            ease: "Linear"
        });
        tl.add({
            targets: [this.bg, this.text, this.mask, this.element],
            duration: 500,
            x: '-=480',
            offset: -200,
            ease: "Quad.easeIn",
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

    hide(): Timeline {
        const tl = this.scene.tweens.createTimeline({
            onComplete: (null != this.closeCallback) ? this.closeCallback.first.call(this.closeCallback.second) : () => {}
        });
        this.closeBtn.hide();
        this.scene.time.delayedCall(0, () => {
            this.messages.forEach(cm => cm.hide());
        }, null, this);
        tl.add({
            targets: this.closeBtn,
            duration: 250,
            //scale: 0,
            //alpha: 0,
            //ease: "Circ.easeIn",
        });
        tl.add({
            targets: [this.bg, this.text, this.mask, this.element],
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
        this.playerService = null;
        this.chatService.unsubscribe();
        this.chatService = null;
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
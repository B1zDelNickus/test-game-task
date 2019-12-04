import "phaser";
import Scene = Phaser.Scene;
import Image = Phaser.GameObjects.Image;
import {SceneTransition} from "./effects/scene.transition";
import {BaseWindow} from "./modal/base.window";
import {WelcomeWindow} from "./modal/welcome.window";
import {ImageButton} from "./components/image.button";
import {BattleView} from "./battle.view";
import {ChatButton} from "./components/chat.button";
import {ChatWindow} from "./chat/chat.window";
import KeyboardManager = Phaser.Input.Keyboard.KeyboardManager;

export class MainView extends Scene {

    public static readonly TAG = "Main";

    private bg: Image = null;

    private duelBtn: ImageButton = null;
    private chatBtn: ChatButton = null;

    private chat: ChatWindow = null;
    private win: BaseWindow = null;

    private isChatting = false;

    private transition: SceneTransition = null;

    constructor() {
        super({
            key: MainView.TAG
        });
    }

    preload() {
        this.bg = this.add.image(480 / 2, 775 / 2, "main_bg");

        this.duelBtn = new ImageButton(this, 480 / 2, 300, "turn_btn_down", "turn_btn_up", "Duel!!!");
        this.duelBtn.hide(true);

        this.win = new WelcomeWindow(this);
        this.win.onHide(this.showMenu, this);

        this.chat = new ChatWindow(this);

        this.chatBtn = new ChatButton(this, 430, 720);
        this.chatBtn.hide(true);

        this.transition = new SceneTransition(this);
    }

    create() {
        this.transition.fadeIn(() => {
            this.win.show();
        });
    }

    shutdown() {
        this.tweens.killAll();
        this.time.removeAllEvents();
        this.bg.destroy(true);
        this.win.dispose();
        this.transition.dispose();
        this.game.scene.destroy();
    }

    private showMenu() {
        this.duelBtn.show();
        this.duelBtn.onClick(() => {
            this.duelBtn.disable();
            this.scene.start(BattleView.TAG);
        }, this);
        this.chatBtn.show();
        this.chatBtn.onClick(() => {
            if (this.isChatting) {
                this.duelBtn.enable();
                this.chat.hide();

            } else {
                this.duelBtn.disable();
                this.chat.show();
            }
            this.isChatting = !this.isChatting;
        }, this);
    }

}
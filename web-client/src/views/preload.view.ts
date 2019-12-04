import "phaser"
import Scene = Phaser.Scene;
import Image = Phaser.GameObjects.Image;
import BitmapText = Phaser.GameObjects.BitmapText;
import {GuiUtils} from "../utils/gui.utils";
import {SceneTransition} from "./effects/scene.transition";
import {MainView} from "./main.view";

export class PreloadView extends Scene {

    public static readonly TAG = "Preload";

    private bg: Image = null;
    private logo: Image = null;
    private msg: BitmapText = null;

    private transition: SceneTransition = null;

    private replics = [
        "Feeding unicorns...",
        "Searching for magic mushrooms...",
        "Trying new spells...",
        "Playing with faeries...",
        "Tasting colored potions..."
    ];

    private currentReplic = 0;

    constructor() {
        super({
            key: PreloadView.TAG
        });
    }

    preload() {

        this.bg = this.add.image(480 / 2, 775 / 2, "splash");
        this.logo = this.add.image(0, 0, "splash_logo");

        this.logo.setPosition(480 / 2, 775 - 150);

        this.msg = this.add.bitmapText(480 / 2, 740, "font", this.replics[this.currentReplic], 24);
        this.msg.setCenterAlign();
        GuiUtils.centize(this.msg);

        // simple assets loading
        this.load.image("grid","assets/images/grid_texture.png");
        this.load.image("battle_bg","assets/images/battle_bg.png");
        this.load.image("main_bg","assets/images/main_bg.png");
        this.load.image("close_btn_up","assets/images/close_btn_up.png");
        this.load.image("close_btn_down","assets/images/close_btn_down.png");
        this.load.image("turn_btn_up","assets/images/turn_btn_up.png");
        this.load.image("turn_btn_down","assets/images/turn_btn_down.png");
        this.load.image("friend_btn_up","assets/images/friend_btn_up.png");
        this.load.image("ava_1","assets/images/ava_1.png");
        this.load.image("ava_2","assets/images/ava_2.png");
        this.load.image("ava_3","assets/images/ava_3.png");
        this.load.image("ava_4","assets/images/ava_4.png");
        this.load.image("ava_5","assets/images/ava_5.png");
        this.load.image("hp_bar","assets/images/hp_bar.png");
        this.load.image("hp_bar_frame","assets/images/hp_bar_frame.png");
        this.load.image("name_bg","assets/images/name_bg.png");
        this.load.image("lock","assets/images/lock.png");
        this.load.image("move_bg","assets/images/move_bg.png");
        this.load.image("round_bg","assets/images/round_bg.png");
        this.load.image("swords","assets/images/swords.png");
        this.load.image("turn_bg","assets/images/turn_bg.png");

        this.load.atlas('flares', 'assets/atlases/flares.png', 'assets/atlases/flares.json');

        this.load.html("input", "assets/html/textinput.html");

        this.tweens.add({
            targets: this.logo,
            ease: "Quad.easeInOut",
            yoyo: true,
            y: this.logo.y - 30,
            duration: 2500,
            repeat: 0,
            onYoyo: tween => {
                this.currentReplic++;
                if (this.currentReplic >= this.replics.length) this.currentReplic = 0;
                this.msg.setText(this.replics[this.currentReplic]);
                GuiUtils.centize(this.msg);
            },
            onComplete: () => this.transition.fadeOut(() => this.scene.start(MainView.TAG))
        });

        this.transition = new SceneTransition(this);
    }

    create() {
        this.transition.fadeIn();
    }

    shutdown() {
        this.tweens.killAll();
        this.time.removeAllEvents();
        this.bg.destroy(true);
        this.logo.destroy(true);
        this.msg.destroy(true);
        this.transition.dispose();
        this.game.scene.destroy();
    }

}
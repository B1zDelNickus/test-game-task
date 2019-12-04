import "phaser"
import Scene = Phaser.Scene;
import {PreloadView} from "./preload.view";
import {MockGameServerConnection} from "../server/mock.game-server.connection";
import {PlayerService} from "../services/player.service";
import {BattleService} from "../services/battle.service";
import {BattleView} from "./battle.view";
import {ChatServerConnection} from "../server/chat-server.connection";
import {ChatService} from "../services/chat.service";

export class BootView extends Scene {

    public static readonly TAG = "Boot";

    constructor() {
        super({
            key: BootView.TAG
        });
    }

    preload() {
        this.load.image("splash","assets/images/default_splash.png");
        this.load.image("splash_logo","assets/images/default_splash_logo.png");
        this.load.bitmapFont("font", "assets/fonts/font.png", "assets/fonts/font.fnt");
        this.load.bitmapFont("font_2", "assets/fonts/font_2.png", "assets/fonts/font_2.fnt");
        this.load.bitmapFont("font_3", "assets/fonts/font_3.png", "assets/fonts/font_3.fnt");
    }

    create() {

        /**
         * connect to chat server
         */

        const chatConnection = new ChatServerConnection();
        chatConnection.connect();

        const chatService = ChatService.getInstance()
        chatService.setConnection(chatConnection);

        /**
         * "connect" to server
         */
        const gameConnection = new MockGameServerConnection();
        gameConnection.connect();

        /**
         * Add connection obj to PlayerService
         */
        const playerService = PlayerService.getInstance();
        playerService.setConnection(gameConnection);

        /**
         * Add connection obj to BattleService
         */
        const battleService = BattleService.getInstance();
        battleService.setConnection(gameConnection);

        const hasUnfinishedBattles = battleService.checkActiveBattle();

        playerService.login(
            () => {
                if (hasUnfinishedBattles) {
                    /**
                     * In case og re-login during active battle
                     */
                    this.scene.start(BattleView.TAG)
                } else {
                    this.scene.start(PreloadView.TAG)
                }
            },
            this
        );

    }

    shutdown() {

    }

}
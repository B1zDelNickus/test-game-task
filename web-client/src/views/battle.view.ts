import Scene = Phaser.Scene;
import {SceneTransition} from "./effects/scene.transition";
import Image = Phaser.GameObjects.Image;
import {BattleService} from "../services/battle.service";
import {PlayerService} from "../services/player.service";
import BitmapText = Phaser.GameObjects.BitmapText;
import {HpBar} from "./components/hp.bar";
import {IBattle} from "../core/battle/i.battle";
import {DuelBattle} from "../core/battle/duel.battle";
import {DamageEffect} from "./effects/damage.effect";
import {FireballEffect} from "./effects/fireball.effect";
import {BattleWindow} from "./modal/battle.window";
import {ChatButton} from "./components/chat.button";
import {ChatWindow} from "./chat/chat.window";

export class BattleView extends Scene {

    public static readonly TAG = "Battle";

    private bg: Image = null;

    private win: BattleWindow = null;

    private player: Image = null;
    private enemy: Image = null;

    private playerNameBg: Image = null;
    private enemyNameBg: Image = null;

    private playerName: BitmapText = null;
    private enemyName: BitmapText = null;

    private playerHp: HpBar = null;
    private enemyHp: HpBar = null;

    private enemyDamage: DamageEffect = null;
    private playerDamage: DamageEffect = null;

    private transition: SceneTransition = null;

    private battleService: BattleService = null;
    private playerService: PlayerService = null;

    private enemyFireball: FireballEffect = null;
    private playerFireball: FireballEffect = null;

    private battle: DuelBattle = null;

    private chatBtn: ChatButton = null;
    private chat: ChatWindow = null;
    private isChatting = false;

    constructor() {
        super({
            key: BattleView.TAG
        });

        this.battleService = BattleService.getInstance();
        this.playerService = PlayerService.getInstance();
    }

    preload() {
        this.bg = this.add.image(480 / 2, 775 / 2, "battle_bg");

        this.win = new BattleWindow(this, "Again");
        this.win.onHide(() => { this.scene.start(BattleView.TAG); }, this);

        this.enemy = this.add.image(0, 0, "ava_3");

        this.enemyNameBg = this.add.image(0, 0, "name_bg");

        this.enemyName = this.add.bitmapText(0, 0, "font", "Some Nick", 22);
        this.enemyName.setCenterAlign();

        this.player = this.add.image(0, 0, "ava_1");

        this.playerNameBg = this.add.image(0, 0, "name_bg");

        this.playerName = this.add.bitmapText(0, 0, "font", this.playerService.player().nick, 22);
        this.playerName.setCenterAlign();

        this.enemyHp = new HpBar(this, 380, 25);
        this.playerHp = new HpBar(this, 80, 480);

        this.enemyDamage = new DamageEffect(this);
        this.playerDamage = new DamageEffect(this);

        this.enemyFireball = new FireballEffect(this, false);
        this.playerFireball = new FireballEffect(this, true);

        this.chat = new ChatWindow(this);

        this.chatBtn = new ChatButton(this, 430, 720);
        this.chatBtn.hide(true);

        this.transition = new SceneTransition(this);
    }

    create() {
        this.transition.fadeIn(() => {
            this.battleService.initDuel(d => this.initDuel(d), this)
        });
    }

    private initDuel(duel: IBattle) {
        this.battle = duel;

        this.enemyHp.setHp(this.battle.enemy.maxHp);
        this.playerHp.setHp(this.battle.player.maxHp);

        this.enemy.setTexture(this.battle.enemy.ava);
        this.player.setTexture(this.battle.player.ava);

        this.enemyName.setText(this.battle.enemy.name);
        this.playerName.setText(this.battle.player.name);

        this.enemy.setPosition(480 - this.enemy.width / 2 - 30, this.enemy.height / 2 + 50);
        this.enemyNameBg.setPosition(this.enemy.x + 5, this.enemy.y + this.enemy.height / 2 + 25);
        this.enemyName.setPosition(this.enemyNameBg.x - this.enemyName.width / 2, this.enemyNameBg.y - this.enemyName.height / 2 + 5);

        this.player.setPosition(this.player.width / 2 + 25, 775 - this.player.height / 2 - 60);
        this.playerNameBg.setPosition(this.player.x + 5, this.player.y + this.player.height / 2 + 25);
        this.playerName.setPosition(this.playerNameBg.x - this.playerName.width / 2, this.playerNameBg.y - this.playerName.height / 2 + 5);

        this.enemyDamage.setPosition(this.enemy.x, this.enemy.y);
        this.playerDamage.setPosition(this.player.x, this.player.y);

        this.battleService.listenDuelEnd(isWin => {
            this.time.delayedCall(1000, () => {
                this.chat.hide();
                this.chatBtn.disable();
                this.chatBtn.hide();
                this.isChatting = false;
                this.enemyHp.hide();
                this.playerHp.hide();
                this.tweens.add({
                    targets: [this.playerName, this.playerNameBg, this.enemyName, this.enemyNameBg, isWin ? this.enemy : this.player],
                    duration: 250,
                    alpha: 0
                });
                this.win.setText(
                    [
                        isWin ? "Win!!!" : "Lose :(",
                        isWin ? `Congrats, \n${this.battle.player.name}!` : `You were defeated \nby ${this.battle.enemy.name}.`,
                        isWin ? `You are awesome =)` : `Better luck \nnext time...`,
                    ]
                );
                this.win.show();
                this.tweens.add({
                    targets: isWin ? this.player : this.enemy,
                    duration: 500,
                    x: 480 /2,
                    y: 775 / 2 + 60,
                    scale: .9
                });
            }, null, this);

        }, this);
        this.battleService.listenPlayer((damage, crit) => {
            this.playerFireball.fire(() => {
                this.enemyHp.reduceHp(damage);
                this.enemyDamage.show(damage, crit);
            }, this);
        }, this);
        this.battleService.listenOpponent((damage, crit) => {
            this.enemyFireball.fire(() => {
                this.playerHp.reduceHp(damage);
                this.playerDamage.show(damage, crit);
            }, this);
        }, this);

        this.chatBtn.show();
        this.chatBtn.onClick(() => {
            if (this.isChatting) {
                this.chat.hide();

            } else {
                this.chat.show();
            }
            this.isChatting = !this.isChatting;
        }, this);
    }

    shutdown() {
        this.isChatting = false;
        this.tweens.killAll();
        this.time.removeAllEvents();
        this.bg.destroy(true);
        this.player.destroy(true);
        this.playerName.destroy(true);
        this.playerNameBg.destroy(true);
        this.enemy.destroy(true);
        this.enemyName.destroy(true);
        this.enemyNameBg.destroy(true);
        this.chatBtn.dispose();
        this.chat.dispose();
        this.playerHp.dispose();
        this.enemyHp.dispose();
        this.enemyFireball.dispose();
        this.playerFireball.dispose();
        this.win.dispose();
        this.transition.dispose();
        this.game.scene.destroy();
    }

}
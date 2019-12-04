import "phaser";
import Scene = Phaser.Scene;
import BitmapText = Phaser.GameObjects.BitmapText;

export class DamageEffect {

    private damage: BitmapText = null;
    private critDamage: BitmapText = null;

    private startX: number = 0;
    private startY: number = 0;

    constructor(private scene: Scene) {

        this.damage = this.scene.add.bitmapText(0, 0, "font_2", "-22!", 46);
        this.damage.setCenterAlign();

        this.critDamage = this.scene.add.bitmapText(0, 0, "font_3", "-45!", 46);
        this.critDamage.setCenterAlign();

        this.damage.alpha = 0;
        this.critDamage.alpha = 0;

    }

    public show(damage: number, crit: boolean = false) {
        this.scene.tweens.killTweensOf(this.damage);
        this.scene.tweens.killTweensOf(this.critDamage);
        this.resetPosition();
        if (crit) {
            this.critDamage.alpha = 1;
            this.critDamage.setText(`-${damage}!!!`);
            const tl = this.scene.tweens.createTimeline({});
            tl.add({
                targets: this.critDamage,
                duration: 500,
                ease: "Linear",
                y: "-=100"
            });
            tl.add({
                targets: this.critDamage,
                duration: 500,
                ease: "Linear",
                y: "-=50",
                alpha: 0
            });
            tl.play();
        } else {
            this.damage.alpha = 1;
            this.damage.setText(`-${damage}!`);
            const tl = this.scene.tweens.createTimeline({});
            tl.add({
                targets: this.damage,
                duration: 500,
                ease: "Linear",
                y: "-=100"
            });
            tl.add({
                targets: this.damage,
                duration: 500,
                ease: "Linear",
                y: "-=50",
                alpha: 0
            });
            tl.play();
        }
    }

    setPosition(x: number, y: number) {
        this.startX = x;
        this.startY = y;
        this.resetPosition();
    }

    private resetPosition() {
        this.damage.setPosition(this.startX - this.damage.width / 2, this.startY + 40);
        this.critDamage.setPosition(this.startX - this.critDamage.width / 2, this.startY + 40);
    }

}
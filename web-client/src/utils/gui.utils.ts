import "phaser";
import Graphics = Phaser.GameObjects.Graphics;
import Scene = Phaser.Scene;
import Sprite = Phaser.GameObjects.Sprite;
import Image = Phaser.GameObjects.Image;
import Text = Phaser.GameObjects.Text;
import BitmapText = Phaser.GameObjects.BitmapText;

export class GuiUtils {

    static centize(obj: Sprite | Image | Text | BitmapText) {
        obj.setPosition(480 / 2 - obj.width / 2, obj.y);
    }

    static makeRectangle(parent: Scene, x: number, y: number, w: number, h: number, color: number = 0, alpha: number = 1): Graphics {
        const temp = parent.add.graphics();
        temp.fillStyle(color, alpha);
        temp.fillRect(x, y, w, h);
        return temp;
    }

}
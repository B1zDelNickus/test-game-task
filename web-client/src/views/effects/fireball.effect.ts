import "phaser";
import Scene = Phaser.Scene;
import ParticleEmitter = Phaser.GameObjects.Particles.ParticleEmitter;
import ParticleEmitterManager = Phaser.GameObjects.Particles.ParticleEmitterManager;

export class FireballEffect {

    private manager: ParticleEmitterManager = null;

    constructor(private scene: Scene, private isPlayer: boolean) {
        this.manager = this.scene.add.particles("flares");
    }

    fire(callback: Function, context: any) {
        let emmiter: ParticleEmitter = null;
        if (this.isPlayer) {
            emmiter = this.manager.createEmitter({
                frame: 'yellow',
                radial: false,
                x: { min: 70, max: 380, steps: 256 },
                y: { min: 700, max: 100, steps: 256 },
                angle: 90,
                lifespan: 1000,
                speedX: { min: -100, max: -200 },
                quantity: 4,
                gravityY: 200,
                scale: { start: 0.6, end: 0, ease: 'Power3' },
                blendMode: 'ADD'
            });
        } else {
            emmiter = this.manager.createEmitter({
                frame: 'red',
                radial: false,
                x: { min: 400, max: 90, steps: 256 },
                y: { min: 100, max: 620, steps: 256 },
                angle: -90,
                lifespan: 1000,
                speedX: { min: -50, max: -100 },
                quantity: 4,
                gravityY: 200,
                scale: { start: 0.6, end: 0, ease: 'Power3' },
                blendMode: 'ADD',

            });
        }
        this.scene.time.delayedCall(1070, () => {
            emmiter.stop();
            emmiter.killAll();
            callback.call(context);
        }, null, this);
    }

    dispose() {
        this.manager.destroy(true);
    }

}
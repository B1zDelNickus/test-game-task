import {MathUtils} from "../../utils/math.utils";
import {Character} from "../../core/player/character";
import {Pair} from "../../commons/pair";

export class BattleMoveTask {

    private timeout: any = null;
    private isDone = false;

    constructor(private actor: Character, private opp: Character) {}

    startTask(callback: Function, context: any) {
        this.makeMove(new Pair(callback, context));
    }

    private makeMove(callback: Pair<Function, any>) {
        this.timeout = setTimeout(() => {

            if (this.isDone) return;

            const damage = MathUtils.randBetween(this.actor.minPower, this.actor.maxPower);
            const wasCrit = MathUtils.randBetween(1, 100) > this.actor.critChance;

            callback.first.call(callback.second, wasCrit ? Math.ceil(damage * 1.5) : damage, wasCrit);

            this.makeMove(callback);

        }, MathUtils.randBetween(2000, 5000));
    }

    stopTask() {
        clearTimeout(this.timeout);
        this.isDone = true;
    }

}
import {ServerPacket} from "../server.packet";
import {ServerPacketCode} from "../server-packet.code";
import {Player} from "../../../core/player/player";
import {DuelBattle} from "../../../core/battle/duel.battle";
import {Character} from "../../../core/player/character";
import {MathUtils} from "../../../utils/math.utils";

export class StartDuelServerPacket extends ServerPacket {

    private readonly battle: DuelBattle = null;

    constructor() {
        super(ServerPacketCode.SP_START_DUEL);

        /**
         * must by read but will be hardcoded
         */
        // this.readAny() as Player ...

        this.battle = new DuelBattle();
        this.battle.player = new Character(
            "B1zDelNick",
            150,
            15,
            25,
            15,
            "ava_1",
            75
        );

        const rnd = MathUtils.randBetween(1, 4);

        switch (rnd) {
            case 1: {
                this.battle.enemy = new Character(
                    "BadSanta",
                    210,
                    11,
                    11,
                    11,
                    "ava_2",
                    60
                );
                break;
            }
            case 2: {
                this.battle.enemy = new Character(
                    "Rogue",
                    78,
                    19,
                    51,
                    3,
                    "ava_3",
                    75
                );
                break;
            }
            case 3: {
                this.battle.enemy = new Character(
                    "Witchy",
                    144,
                    19,
                    19,
                    19,
                    "ava_4",
                    50
                );
                break;
            }
            case 4: {
                this.battle.enemy = new Character(
                    "Aquaman",
                    172,
                    7,
                    43,
                    1,
                    "ava_5",
                    65
                );
                break;
            }
        }
    }

    getBattleData = () => this.battle;

}
import {IConnection} from "../server/i.connection";
import {ClientPacketCode} from "../server/packet/client-packet.code";
import {Pair} from "../commons/pair";
import {LoginClientPacket} from "../server/packet/client/login.client-packet";
import {StartDuelClientPacket} from "../server/packet/client/start-duel.client-packet";
import {ServerPacketCode} from "../server/packet/server-packet.code";

export class BattleService {

    private connection: IConnection = null;

    private constructor() {

    }

    setConnection(conn: IConnection) {
        this.connection = conn;
    }

    checkActiveBattle() : boolean {
        // just example
        return false;
    }

    initDuel(battleCallback: Function, context: any) {
        this.connection.registerListenerOnce(
            ServerPacketCode.SP_START_DUEL,
            new Pair(battleCallback, context)
        );
        this.connection.sendPacket(new StartDuelClientPacket());
    }

    listenOpponent(opponentCallback: Function, context: any) {
        this.connection.registerListener(
            ServerPacketCode.SP_OPPONENT_MOVE,
            new Pair(opponentCallback, context)
        );
    }

    listenPlayer(playerCallback: Function, context: any) {
        this.connection.registerListener(
            ServerPacketCode.SP_PLAYER_MOVE,
            new Pair(playerCallback, context)
        );
    }

    listenDuelEnd(endCallback: Function, context: any) {
        this.connection.registerListenerOnce(
            ServerPacketCode.SP_END_DUEL,
            new Pair(endCallback, context)
        );
    }

    private static instance: BattleService = null;

    static getInstance() : BattleService {
        if (null == this.instance) {
            this.instance = new BattleService();
        }
        return this.instance;
    }

}
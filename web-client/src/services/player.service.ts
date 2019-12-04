import {IConnection} from "../server/i.connection";
import {LoginClientPacket} from "../server/packet/client/login.client-packet";
import {ClientPacketCode} from "../server/packet/client-packet.code";
import {Pair} from "../commons/pair";
import {Player} from "../core/player/player";
import {ServerPacketCode} from "../server/packet/server-packet.code";

export class PlayerService {

    private connection: IConnection = null;
    private loggedIn = false;

    private playerData: Player = null;

    private constructor() {

    }

    setConnection(conn: IConnection) {
        this.connection = conn;
    }

    login(loginCallback: Function, context: any) {
        this.connection.registerListenerOnce(
            ServerPacketCode.SP_LOGIN,
            new Pair(pd => this.handleLoginResult(pd, new Pair(loginCallback, context)), this)
        );
        this.connection.sendPacket(new LoginClientPacket("admin", "admin"));
    }

    private handleLoginResult(player: Player, callback: Pair<Function, any>) {
        this.loggedIn = true;
        this.playerData = player;
        callback.first.call(callback.second);
    }

    isLogged = () => this.loggedIn;
    player = () => this.playerData;

    private static instance: PlayerService = null;

    static getInstance() : PlayerService {
        if (null == this.instance) {
            this.instance = new PlayerService();
        }
        return this.instance;
    }

}
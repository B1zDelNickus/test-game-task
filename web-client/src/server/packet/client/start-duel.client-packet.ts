import {ClientPacket} from "../client.packet";
import {ClientPacketCode} from "../client-packet.code";

export class StartDuelClientPacket extends ClientPacket {

    constructor() {
        super(ClientPacketCode.CP_START_DUEL);
    }

}
import {ClientPacket} from "../client.packet";
import {ClientPacketCode} from "../client-packet.code";

export class LoginClientPacket extends ClientPacket {

    constructor(login: string, password: string) {
        super(ClientPacketCode.CP_LOGIN);

        this.writeAny(login);
        this.writeAny(password);
    }

}
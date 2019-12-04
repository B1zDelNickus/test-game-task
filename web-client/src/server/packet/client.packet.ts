import {BasePacket} from "./base.packet";
import {PacketType} from "./packet.type";

export class ClientPacket extends BasePacket {

    constructor(opCode: number) {
        super(PacketType.CLIENT_PACKET, opCode);
    }

    protected writeByte(b: number) {

    }

    protected writeShort(b: number) {

    }

    protected writeInt(b: number) {

    }

    protected writeFloat(b: number) {

    }

    protected writeLong(b: number) {

    }

    protected writeDouble(b: number) {

    }

    protected writeString(b: string) {

    }

    protected writeArray(b: []) {

    }

    /**
     * For demo purposes
     * @param d
     */
    protected writeAny(d: any) {
        this.data.push(d);
    }

}
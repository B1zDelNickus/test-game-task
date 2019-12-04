import {BasePacket} from "./base.packet";
import {PacketType} from "./packet.type";

export class ServerPacket extends BasePacket {

    private currentBufferCursor = 1;

    constructor(opCode: number) {
        super(PacketType.SERVER_PACKET, opCode);
    }

    protected readByte() {

    }

    protected readShort() {

    }

    protected readInt() {

    }

    protected readFloat() {

    }

    protected readLong() {

    }

    protected readDouble() {

    }

    protected readString() {

    }

    protected readArray() {}

    /**
     * For demo purposes
     * @param d
     */
    protected readAny(): any {
        if (this.currentBufferCursor < this.data.length)
            return this.data[this.currentBufferCursor++];
        else {
            throw Error(`Buffer out of index ${this.currentBufferCursor}`)
        }
    }
    
}
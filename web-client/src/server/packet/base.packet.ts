import {PacketType} from "./packet.type";

export class BasePacket {

    protected data = [];

    constructor(public type: PacketType, opCode: number) {
        this.data[0] = opCode;
    }

    getOpCode(): number {
        return this.data[0];
    }

}
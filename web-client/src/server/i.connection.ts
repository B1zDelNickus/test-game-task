import {ClientPacket} from "./packet/client.packet";
import {Pair} from "../commons/pair";
import {ConnectionState} from "./connection.state";

export interface IConnection {

    connect();
    state(): ConnectionState;
    sendPacket(pkt: any);
    registerListener(serverPacket: number, callback: Pair<Function, any>);
    registerListenerOnce(serverPacket: number, callback: Pair<Function, any>);
    removeListener(serverPacket: number)

}
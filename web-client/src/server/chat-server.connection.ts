import {IConnection} from "./i.connection";
import {Pair} from "../commons/pair";
import {ConnectionState} from "./connection.state";
import WebSocket = require('universal-websocket-client');

export class ChatServerConnection implements IConnection {

    private readonly SERVER_URI = 'ws://localhost:9000/websocket';

    private websocket: WebSocket = null;
    private currentState: ConnectionState = ConnectionState.DISCONNECTED;

    private listener: Pair<Function, any> = null;

    connect() {
        try {
            this.websocket = new WebSocket(this.SERVER_URI);
            this.currentState = ConnectionState.CONNECTING;

            this.websocket.addEventListener('open', evt => {
                this.currentState = ConnectionState.CONNECTED;
                this.websocket.addEventListener('message', evt => {
                    console.log('Message from server ', evt.data);
                    this.listener.first.call(this.listener.second, evt.data);
                });
            });
        } catch (e) {
            // do nothing
        }
    }

    registerListener(serverPacket: number, callback: Pair<Function, any>) {
        this.listener = callback;
    }

    registerListenerOnce(serverPacket: number, callback: Pair<Function, any>) {

    }

    removeListener(serverPacket: number) {
        this.listener = null;
    }

    sendPacket(pkt: string) {
        console.debug("Send msg: " + pkt);
        if (null != this.websocket) this.websocket.send(pkt);
    }

    state(): ConnectionState {
        return undefined;
    }

}
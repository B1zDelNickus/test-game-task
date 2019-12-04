import {ChatServerConnection} from "../server/chat-server.connection";
import {Message} from "../core/chat/message";
import {Pair} from "../commons/pair";

export class ChatService {

    private connection: ChatServerConnection = null;

    private constructor() {}

    setConnection(conn: ChatServerConnection) {
        this.connection = conn;
    }

    sendMessage(msg: Message) {
        this.connection.sendPacket(`${msg.author}: ${msg.text}`);
    }

    subscribe(callback: Function, context: any) {
        this.connection.registerListener(0, new Pair(callback, context));
    }

    unsubscribe() {
        this.connection.removeListener(0);
    }

    private static instance: ChatService = null;

    static getInstance(): ChatService {
        if (null == this.instance) {
            this.instance = new ChatService();
        }
        return this.instance;
    }

}
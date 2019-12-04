import {IConnection} from "./i.connection";
import {Pair} from "../commons/pair";
import {ClientPacket} from "./packet/client.packet";
import {ConnectionState} from "./connection.state";
import {ClientPacketCode} from "./packet/client-packet.code";
import {LoginServerPacket} from "./packet/server/login.server-packet";
import {StartDuelServerPacket} from "./packet/server/start-duel.server-packet";
import {ServerPacketCode} from "./packet/server-packet.code";
import {IBattle} from "../core/battle/i.battle";
import {BattleMoveTask} from "./task/battle.move.task";

export class MockGameServerConnection implements IConnection {

    private currentState: ConnectionState = ConnectionState.DISCONNECTED;

    private listenersMap: Map<number, Array<Pair<Function, any>>> = new Map<number, Array<Pair<Function, any>>>();
    private onceListenersMap: Map<number, Array<Pair<Function, any>>> = new Map<number, Array<Pair<Function, any>>>();

    connect() {
        this.currentState = ConnectionState.CONNECTED;
    }

    state(): ConnectionState {
        return this.currentState;
    }

    registerListener(serverPacket: number, callback: Pair<Function, any>) {
        if (null != this.listenersMap[serverPacket]) {
            this.listenersMap[serverPacket].push(callback);
        } else {
            this.listenersMap[serverPacket] = new Array(callback);
        }
    }

    registerListenerOnce(serverPacket: number, callback: Pair<Function, any>) {
        if (null != this.onceListenersMap[serverPacket]) {
            this.onceListenersMap[serverPacket].push(callback);
        } else {
            this.onceListenersMap[serverPacket] = new Array(callback);
        }
    }

    removeListener(serverPacket: number) {
        this.listenersMap[serverPacket] = null;
    }

    sendPacket(pkt: ClientPacket) {
        /**
         * Simulation of Server work
         * Actually, must be done through receive ServerPackets...
         */
        switch (pkt.getOpCode()) {
            case ClientPacketCode.CP_LOGIN: {
                /**
                 * Simulate login processing
                 */

                /**
                 * "receive" server packet
                 */
                const answer = new LoginServerPacket();
                const playerData = answer.getPlayerData();

                /**
                 * Dispatch subscriptions
                 */
                if (null != this.listenersMap[ServerPacketCode.SP_LOGIN]) {
                    for (let cb of this.listenersMap[ServerPacketCode.SP_LOGIN]) {
                        cb.first.call(cb.second, playerData);
                    }
                }

                /**
                 * Dispatch events
                 */
                if (null != this.onceListenersMap[ServerPacketCode.SP_LOGIN]) {
                    for (let cb of this.onceListenersMap[ServerPacketCode.SP_LOGIN]) {
                        cb.first.call(cb.second, playerData);
                    }
                    /**
                     * Clear dispatched events list
                     */
                    this.onceListenersMap[ServerPacketCode.SP_LOGIN] = null;
                }

                break;
            }
            case ClientPacketCode.CP_START_DUEL: {

                /**
                 * "receive" server packet
                 */
                const answer = new StartDuelServerPacket();
                const battle = answer.getBattleData();

                /**
                 * Dispatch subscriptions
                 */
                if (null != this.listenersMap[ServerPacketCode.SP_START_DUEL]) {
                    for (let cb of this.listenersMap[ServerPacketCode.SP_START_DUEL]) {
                        cb.first.call(cb.second, battle);
                    }
                }

                /**
                 * Dispatch events
                 */
                if (null != this.onceListenersMap[ServerPacketCode.SP_START_DUEL]) {
                    for (let cb of this.onceListenersMap[ServerPacketCode.SP_START_DUEL]) {
                        cb.first.call(cb.second, battle);
                    }
                    /**
                     * Clear dispatched events list
                     */
                    this.onceListenersMap[ServerPacketCode.SP_START_DUEL] = null;
                }

                this.startDuelTask(battle);

                break;
            }
            default: {
                throw new Error(`Unknown Client Packet with code: [${pkt.getOpCode().toString(16)}]`);
            }
        }

    }

    private startDuelTask(duel: IBattle) {
        const playerTask = new BattleMoveTask(duel.player, duel.enemy);
        const opponentTask = new BattleMoveTask(duel.enemy, duel.player);

        playerTask.startTask((dmg, crit) => {

            /**
             * Dispatch subscriptions
             */
            if (null != this.listenersMap[ServerPacketCode.SP_PLAYER_MOVE]) {
                for (let cb of this.listenersMap[ServerPacketCode.SP_PLAYER_MOVE]) {
                    cb.first.call(cb.second, dmg, crit);
                }
            }

            duel.enemy.currentHp -= dmg;

            if (duel.enemy.idDead()) {
                playerTask.stopTask();
                opponentTask.stopTask();

                /**
                 * Dispatch events
                 */
                if (null != this.onceListenersMap[ServerPacketCode.SP_END_DUEL]) {
                    for (let cb of this.onceListenersMap[ServerPacketCode.SP_END_DUEL]) {
                        cb.first.call(cb.second, true);
                    }
                    /**
                     * Clear dispatched events list
                     */
                    this.listenersMap[ServerPacketCode.SP_PLAYER_MOVE] = null;
                    this.listenersMap[ServerPacketCode.SP_OPPONENT_MOVE] = null;
                    this.onceListenersMap[ServerPacketCode.SP_END_DUEL] = null;
                }
            }

        }, this);

        opponentTask.startTask((dmg, crit) => {

            /**
             * Dispatch subscriptions
             */
            if (null != this.listenersMap[ServerPacketCode.SP_OPPONENT_MOVE]) {
                for (let cb of this.listenersMap[ServerPacketCode.SP_OPPONENT_MOVE]) {
                    cb.first.call(cb.second, dmg, crit);
                }
            }

            duel.player.currentHp -= dmg;

            if (duel.player.idDead()) {
                playerTask.stopTask();
                opponentTask.stopTask();

                /**
                 * Dispatch events
                 */
                if (null != this.onceListenersMap[ServerPacketCode.SP_END_DUEL]) {
                    for (let cb of this.onceListenersMap[ServerPacketCode.SP_END_DUEL]) {
                        cb.first.call(cb.second, false);
                    }
                    /**
                     * Clear dispatched events list
                     */
                    this.listenersMap[ServerPacketCode.SP_PLAYER_MOVE] = null;
                    this.listenersMap[ServerPacketCode.SP_OPPONENT_MOVE] = null;
                    this.onceListenersMap[ServerPacketCode.SP_END_DUEL] = null;
                }
            }

        }, this);
    }

}
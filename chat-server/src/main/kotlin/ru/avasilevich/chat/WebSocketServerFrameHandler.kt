package ru.avasilevich.chat

import io.netty.buffer.Unpooled
import io.netty.channel.ChannelFuture
import io.netty.channel.ChannelFutureListener
import io.netty.channel.ChannelHandlerContext
import io.netty.channel.SimpleChannelInboundHandler
import io.netty.channel.group.ChannelGroup
import io.netty.handler.codec.http.HttpObject
import io.netty.handler.codec.http.HttpRequest
import io.netty.handler.codec.http.websocketx.*
import org.slf4j.LoggerFactory


class WebSocketServerFrameHandler(
    private val chatGroup: ChannelGroup,
    private val repo: MessageRepository
) : SimpleChannelInboundHandler<Any>() {

    companion object {
        private val log = LoggerFactory.getLogger(WebSocketServerFrameHandler::class.java)
        private const val PING = "ping"
        private const val CLOSE = "close"
        private const val CLOSE_WITHOUT_FRAME = "close-without-frame"
        private const val SEND_CORRUPTED_FRAME = "send-corrupted-frame"
    }

    override fun channelActive(ctx: ChannelHandlerContext) {
        log.debug("channel is active")
    }

    override fun channelInactive(ctx: ChannelHandlerContext) {
        log.debug("channel is inactive")
    }

    override fun userEventTriggered(ctx: ChannelHandlerContext, evt: Any) {
        if (evt == WebSocketServerProtocolHandler.ServerHandshakeStateEvent.HANDSHAKE_COMPLETE) {

            log.debug("new user joined - {}", evt)

            /**
             * Sending message cache to newcomer
             */
            val enterCmd = ChatCommand(
                command = ChatCommandType.ENTER_CHAT,
                messages = repo.getCache()
            )
            ctx.channel().writeAndFlush(TextWebSocketFrame(enterCmd.toString()))

            /**
             * Finally adding newcomer to chat lobby
             */
            chatGroup.add(ctx.channel())

        } else {
            super.userEventTriggered(ctx, evt)
        }
    }

    override fun channelRead0(ctx: ChannelHandlerContext, msg: Any) {
        when (msg) {
            is TextWebSocketFrame -> {
                when (msg.text()) {
                    PING -> ctx.writeAndFlush(PingWebSocketFrame(Unpooled.wrappedBuffer(byteArrayOf(1, 2, 3, 4))))
                    CLOSE -> ctx.writeAndFlush(CloseWebSocketFrame(Constants.WEBSOCKET_STATUS_CODE_NORMAL_CLOSURE,
                        "Close on request"))
                    CLOSE_WITHOUT_FRAME -> ctx.close()
                    SEND_CORRUPTED_FRAME -> ctx.writeAndFlush(ContinuationWebSocketFrame(Unpooled.wrappedBuffer(byteArrayOf(1, 2, 3, 4))))
                    else -> {

                        log.debug("message received: {}", msg.text())

                        /**
                         * Welcome for newcomer
                         */
                        if (msg.text().contains(ChatCommandType.JOIN.value, true)) {
                            /**
                             * Notify all other users about newcomer
                             */
                            msg.text()
                            val chatMsg = ChatMessage(
                                author = "System",
                                text = "${msg.text().substringBefore(':')} has joined to Chat."
                            )
                            repo.putToCache(chatMsg)
                            val cmd = ChatCommand(
                                command = ChatCommandType.MESSAGE,
                                messages = listOf(chatMsg)
                            )
                            chatGroup.writeAndFlush(TextWebSocketFrame(cmd.toString())) { it != ctx.channel() }
                        } else {
                            val chatMsg = ChatMessage.from(msg.text())
                            val chatCmd = ChatCommand(
                                command = ChatCommandType.MESSAGE,
                                messages = listOf(chatMsg)
                            )
                            repo.putToCache(chatMsg)
                            chatGroup.writeAndFlush(TextWebSocketFrame(chatCmd.toString()))
                        }

                    }
                }
            }
            is BinaryWebSocketFrame -> ctx.writeAndFlush(msg.retain())
            is CloseWebSocketFrame -> {

                log.debug("close message received: {}", msg)

                val closeFuture: ChannelFuture = if (msg.statusCode() == 1007) {
                    ctx.writeAndFlush(1008)
                } else {
                    ctx.writeAndFlush(msg.statusCode())
                }
                closeFuture.addListener(ChannelFutureListener.CLOSE)
            }
            is ContinuationWebSocketFrame -> ctx.writeAndFlush(msg.retain())
            else -> {
                val message = "unsupported msg type: " + msg.javaClass.name
                throw UnsupportedOperationException(message)
            }
        }
    }

}
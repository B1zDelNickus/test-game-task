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


class WebSocketServerFrameHandler(private val chatGroup: ChannelGroup) : SimpleChannelInboundHandler<Any>() {

    companion object {
        private val log = LoggerFactory.getLogger(WebSocketServerFrameHandler::class.java)
        private const val PING = "ping"
        private const val CLOSE = "close"
        private const val CLOSE_WITHOUT_FRAME = "close-without-frame"
        private const val SEND_CORRUPTED_FRAME = "send-corrupted-frame"
    }

    var handshaker: WebSocketServerHandshaker? = null

    override fun channelActive(ctx: ChannelHandlerContext) {
        log.debug("channel is active")
    }

    override fun channelInactive(ctx: ChannelHandlerContext) {
        log.debug("channel is inactive")
    }

    override fun userEventTriggered(ctx: ChannelHandlerContext, evt: Any) {
        if (evt == WebSocketServerProtocolHandler.ServerHandshakeStateEvent.HANDSHAKE_COMPLETE) {
            println(evt)
            chatGroup.writeAndFlush("New user!")
            chatGroup.add(ctx.channel())
        } else {
            super.userEventTriggered(ctx, evt)
        }
    }

    override fun channelRead0(ctx: ChannelHandlerContext, msg: Any) {
        when (msg) {
            is HttpObject -> {
                System.out.println("WebSocketHandler added to the pipeline")
                System.out.println("Opened Channel : " + ctx.channel())
                System.out.println("Handshaking....")
                //Do the Handshake to upgrade connection from HTTP to WebSocket protocol
                handleHandshake(ctx, msg as HttpRequest)
                System.out.println("Handshake is done")
            }
            is TextWebSocketFrame -> {
                when (msg.text()) {
                    PING -> ctx.writeAndFlush(PingWebSocketFrame(Unpooled.wrappedBuffer(byteArrayOf(1, 2, 3, 4))))
                    CLOSE -> ctx.writeAndFlush(CloseWebSocketFrame(Constants.WEBSOCKET_STATUS_CODE_NORMAL_CLOSURE,
                        "Close on request"))
                    CLOSE_WITHOUT_FRAME -> ctx.close()
                    SEND_CORRUPTED_FRAME -> ctx.writeAndFlush(ContinuationWebSocketFrame(Unpooled.wrappedBuffer(byteArrayOf(1, 2, 3, 4))))
                    else -> {
                        println(msg.text())
                        chatGroup.writeAndFlush(msg.retain())
                    }
                }
            }
            is BinaryWebSocketFrame -> ctx.writeAndFlush(msg.retain())
            is CloseWebSocketFrame -> {
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

    private fun handleHandshake(ctx: ChannelHandlerContext, req: HttpRequest) {
        val wsFactory = WebSocketServerHandshakerFactory(getWebSocketURL(req), null, true)
        handshaker = wsFactory.newHandshaker(req)
        if (handshaker == null) {
            WebSocketServerHandshakerFactory.sendUnsupportedVersionResponse(ctx.channel())
        } else {
            handshaker?.handshake(ctx.channel(), req)
        }
    }

    private fun getWebSocketURL(req: HttpRequest): String {
        println("Req URI : " + req.uri())
        val url = "ws://" + req.headers().get("Host") + req.uri()
        println("Constructed URL : $url")
        return url
    }

    override fun exceptionCaught(ctx: ChannelHandlerContext, cause: Throwable) {
        log.error("Exception Caught: " + cause.message)
        ctx.close()
    }
}
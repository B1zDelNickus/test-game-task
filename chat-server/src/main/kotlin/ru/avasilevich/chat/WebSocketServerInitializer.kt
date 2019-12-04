package ru.avasilevich.chat

import io.netty.channel.ChannelInitializer
import io.netty.channel.group.ChannelGroup
import io.netty.channel.socket.SocketChannel
import io.netty.handler.codec.http.HttpObjectAggregator
import io.netty.handler.codec.http.HttpServerCodec
import io.netty.handler.codec.http.websocketx.WebSocketServerProtocolHandler
import io.netty.handler.codec.http.websocketx.extensions.compression.WebSocketServerCompressionHandler
import io.netty.handler.codec.string.StringDecoder
import io.netty.handler.codec.string.StringEncoder
import io.netty.handler.ssl.SslContext

class WebSocketServerInitializer(
    private val group: ChannelGroup,
    private val sslCtx: SslContext?,
    private val subProtocols: String?
) : ChannelInitializer<SocketChannel>() {

    companion object {
        private const val WEBSOCKET_PATH = "/websocket"
    }

    public override fun initChannel(ch: SocketChannel) {
        val pipeline = ch.pipeline()
        sslCtx?.let { pipeline.addLast(it.newHandler(ch.alloc())) }
        pipeline.addLast(HttpServerCodec())
        pipeline.addLast(HttpObjectAggregator(65536))
        pipeline.addLast(WebSocketServerCompressionHandler())
        pipeline.addLast(WebSocketServerCustomHeadersHandler())
        pipeline.addLast(WebSocketServerProtocolHandler(WEBSOCKET_PATH, subProtocols, true))
        pipeline.addLast(WebSocketServerFrameHandler(group))
    }

}
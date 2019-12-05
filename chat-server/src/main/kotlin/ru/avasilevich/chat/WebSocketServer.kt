package ru.avasilevich.chat

import io.netty.channel.EventLoopGroup
import org.slf4j.LoggerFactory
import io.netty.channel.socket.nio.NioServerSocketChannel
import io.netty.bootstrap.ServerBootstrap
import io.netty.channel.group.DefaultChannelGroup
import io.netty.channel.nio.NioEventLoopGroup
import io.netty.handler.ssl.SslContext
import io.netty.util.concurrent.ImmediateEventExecutor

class WebSocketServer(
    private val host: String,
    private val port: Int,
    private val subProtocols: String?
) {

    companion object {
        private val logger = LoggerFactory.getLogger(WebSocketServer::class.java)
    }

    private var bossGroup: EventLoopGroup? = null
    private var workerGroup: EventLoopGroup? = null

    @Throws(InterruptedException::class)
    fun run() {
        val sslCtx: SslContext? = null

        val chatGroup = DefaultChannelGroup(ImmediateEventExecutor.INSTANCE)
        val messageRepo = MessageRepository()

        bossGroup = NioEventLoopGroup()
        workerGroup = NioEventLoopGroup()

        val serverBootstrap = ServerBootstrap()
        serverBootstrap.group(bossGroup, workerGroup)
            .channel(NioServerSocketChannel::class.java)
            .childHandler(WebSocketServerInitializer(chatGroup, messageRepo, sslCtx, subProtocols))

        serverBootstrap.bind(host, port).sync()

        logger.info("WebSocket remote server started listening on $host:$port")
    }

    fun stop() {
        bossGroup?.shutdownGracefully()
        workerGroup?.shutdownGracefully()
        logger.info("WebSocket remote server stopped listening  on port $port")
    }

}
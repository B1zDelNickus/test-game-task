package ru.avasilevich.chat;

import io.netty.bootstrap.ServerBootstrap;
import io.netty.channel.EventLoopGroup;
import io.netty.channel.group.ChannelGroup;
import io.netty.channel.group.DefaultChannelGroup;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.nio.NioServerSocketChannel;
import io.netty.handler.ssl.SslContext;
import io.netty.util.concurrent.ImmediateEventExecutor;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RequiredArgsConstructor
public final class JWebSocketServer {

    private final Logger logger = LoggerFactory.getLogger(JWebSocketServer.class);

    private final String host;
    private final int port;
    private final String subProtocols;

    private EventLoopGroup bossGroup = null;
    private EventLoopGroup workerGroup = null;

    public void run() throws InterruptedException {

        final SslContext sslCtx = null;

        final ChannelGroup chatGroup = new DefaultChannelGroup(ImmediateEventExecutor.INSTANCE);
        final JMessageRepository messageRepo = new JMessageRepository();

        final ServerBootstrap serverBootstrap = new ServerBootstrap();

        bossGroup = new NioEventLoopGroup();
        workerGroup = new NioEventLoopGroup();

        serverBootstrap.group(bossGroup, workerGroup)
            .channel(NioServerSocketChannel.class)
            .childHandler(new JWebSocketServerInitializer(chatGroup, messageRepo, sslCtx, subProtocols));

        serverBootstrap.bind(host, port).sync();

        logger.info("WebSocket remote server started listening on {}:{}", host, port);

    }

    public void stop() {
        if (null != bossGroup)
            bossGroup.shutdownGracefully();
        if (null != workerGroup)
            workerGroup.shutdownGracefully();
        logger.info("WebSocket remote server stopped listening  on port {}", port);
    }
}

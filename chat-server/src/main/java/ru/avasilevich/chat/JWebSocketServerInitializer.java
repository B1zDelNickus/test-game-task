package ru.avasilevich.chat;

import io.netty.channel.ChannelInitializer;
import io.netty.channel.ChannelPipeline;
import io.netty.channel.group.ChannelGroup;
import io.netty.channel.socket.SocketChannel;
import io.netty.handler.codec.http.HttpObjectAggregator;
import io.netty.handler.codec.http.HttpServerCodec;
import io.netty.handler.codec.http.websocketx.WebSocketServerProtocolHandler;
import io.netty.handler.codec.http.websocketx.extensions.compression.WebSocketServerCompressionHandler;
import io.netty.handler.ssl.SslContext;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public final class JWebSocketServerInitializer extends ChannelInitializer<SocketChannel> {

    private static final String WEBSOCKET_PATH = "/websocket";

    private final ChannelGroup group;
    private final JMessageRepository repo;
    private final SslContext sslCtx;
    private final String subProtocols;

    @Override
    public void initChannel(SocketChannel ch) {
        final ChannelPipeline pipeline = ch.pipeline();
        if (null != sslCtx)
            pipeline.addLast(sslCtx.newHandler(ch.alloc()));
        pipeline.addLast(new HttpServerCodec());
        pipeline.addLast(new HttpObjectAggregator(65536));
        pipeline.addLast(new WebSocketServerCompressionHandler());
        pipeline.addLast(new JWebSocketServerCustomHeadersHandler());
        pipeline.addLast(new WebSocketServerProtocolHandler(WEBSOCKET_PATH, subProtocols, true));
        pipeline.addLast(new JWebSocketServerFrameHandler(group, repo));
    }

}

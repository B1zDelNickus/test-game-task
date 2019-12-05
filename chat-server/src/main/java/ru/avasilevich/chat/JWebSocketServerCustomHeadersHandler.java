package ru.avasilevich.chat;

import io.netty.channel.ChannelDuplexHandler;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.ChannelPromise;
import io.netty.handler.codec.http.HttpHeaders;
import io.netty.handler.codec.http.HttpRequest;
import io.netty.handler.codec.http.HttpResponse;

public final class JWebSocketServerCustomHeadersHandler extends ChannelDuplexHandler {

    private boolean acknowledgedCustomHeader = false;

    @Override
    public void channelRead(ChannelHandlerContext ctx, Object msg) throws Exception {
        if (msg instanceof HttpRequest) {
            HttpRequest request = (HttpRequest) msg;
            HttpHeaders headers = request.headers();
            acknowledgedCustomHeader = Boolean.valueOf(headers.get("x-ack-custom-header"));
        }
        super.channelRead(ctx, msg);
    }

    @Override
    public void write(ChannelHandlerContext ctx, Object msg, ChannelPromise promise) throws Exception {
        if (msg instanceof HttpResponse && acknowledgedCustomHeader) {
            HttpRequest request = (HttpRequest) msg;
            request.headers().set("x-custom-header-return", "custom-header");
            acknowledgedCustomHeader = false;
        }
        super.write(ctx, msg, promise);
    }
}

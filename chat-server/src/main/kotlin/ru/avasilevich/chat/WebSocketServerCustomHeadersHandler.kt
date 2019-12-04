package ru.avasilevich.chat

import io.netty.channel.ChannelDuplexHandler
import io.netty.channel.ChannelHandlerContext
import io.netty.channel.ChannelPromise
import io.netty.handler.codec.http.HttpRequest
import io.netty.handler.codec.http.HttpResponse


class WebSocketServerCustomHeadersHandler : ChannelDuplexHandler() {

    private var acknowledgedCustomHeader: Boolean = false

    override fun channelRead(ctx: ChannelHandlerContext, msg: Any) {
        if (msg is HttpRequest) {
            val headers = msg.headers()
            acknowledgedCustomHeader = headers.get("x-ack-custom-header")?.toBoolean()?:false
        }
        super.channelRead(ctx, msg)
    }

    override fun write(ctx: ChannelHandlerContext, msg: Any, promise: ChannelPromise) {
        if (msg is HttpResponse && acknowledgedCustomHeader) {
            msg.headers().set("x-custom-header-return", "custom-header")
            acknowledgedCustomHeader = false
        }
        super.write(ctx, msg, promise)
    }

}
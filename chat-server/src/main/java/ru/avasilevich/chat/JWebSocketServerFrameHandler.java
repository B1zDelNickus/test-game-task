package ru.avasilevich.chat;

import io.netty.buffer.Unpooled;
import io.netty.channel.ChannelFuture;
import io.netty.channel.ChannelFutureListener;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.SimpleChannelInboundHandler;
import io.netty.channel.group.ChannelGroup;
import io.netty.handler.codec.http.websocketx.*;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Collections;

@RequiredArgsConstructor
public final class JWebSocketServerFrameHandler extends SimpleChannelInboundHandler<Object> {

    private final Logger log = LoggerFactory.getLogger(JWebSocketServerFrameHandler.class);
    private final String PING = "ping";
    private final String CLOSE = "close";
    private final String CLOSE_WITHOUT_FRAME = "close-without-frame";
    private final String SEND_CORRUPTED_FRAME = "send-corrupted-frame";

    private final ChannelGroup chatGroup;
    private final JMessageRepository repo;

    @Override
    public void channelActive(final ChannelHandlerContext ctx) {
        log.debug("channel is active");
    }

    @Override
    public void channelInactive(final ChannelHandlerContext ctx) {
        log.debug("channel is inactive");
    }

    @Override
    public void channelRead0(final ChannelHandlerContext ctx, final Object msg) {
        if (msg instanceof TextWebSocketFrame) {
            final TextWebSocketFrame textMsg = (TextWebSocketFrame) msg;
            switch (textMsg.text()) {
                case PING: {
                    ctx.writeAndFlush(new PingWebSocketFrame(Unpooled.wrappedBuffer(new byte[]{1, 2, 3, 4})));
                    break;
                }
                case CLOSE: {
                    ctx.writeAndFlush(new CloseWebSocketFrame(
                        JConstants.WEBSOCKET_STATUS_CODE_NORMAL_CLOSURE,
                        "Close on request")
                    );
                    break;
                }
                case CLOSE_WITHOUT_FRAME: {
                    ctx.close();
                    break;
                }
                case SEND_CORRUPTED_FRAME: {
                    ctx.writeAndFlush(new ContinuationWebSocketFrame(Unpooled.wrappedBuffer(new byte[]{1, 2, 3, 4})));
                    break;
                }
                default: {

                    log.debug("message received: {}", textMsg.text());

                    /**
                     * Welcome for newcomer
                     */
                    if (textMsg.text().toUpperCase().contains(JChatCommandType.JOIN.getValue())) {

                        /**
                         * Notify all other users about newcomer
                         */
                        final int index = textMsg.text().indexOf(":");
                        final JChatMessage chatMsg = new JChatMessage(
                            "System",
                            textMsg.text().substring(0, index) + " has joined to Chat."
                        );
                        repo.putToCache(chatMsg);
                        final JChatCommand cmd = new JChatCommand(
                            JChatCommandType.MESSAGE,
                            Collections.singletonList(chatMsg)
                        );
                        chatGroup.writeAndFlush(new TextWebSocketFrame(cmd.toString()), ch -> ch != ctx.channel());
                    } else {
                        final JChatMessage chatMsg = JChatMessage.from(textMsg.text());
                        final JChatCommand chatCmd = new JChatCommand(
                            JChatCommandType.MESSAGE,
                            Collections.singletonList(chatMsg)
                        );
                        repo.putToCache(chatMsg);
                        chatGroup.writeAndFlush(new TextWebSocketFrame(chatCmd.toString()));
                    }
                }
            }
        } else if (msg instanceof BinaryWebSocketFrame) {
            ctx.writeAndFlush(((BinaryWebSocketFrame) msg).retain());
        } else if (msg instanceof CloseWebSocketFrame) {

            log.debug("close message received: {}", msg);

            ChannelFuture closeFuture = null;
            if (((CloseWebSocketFrame) msg).statusCode() == 1007) {
                closeFuture = ctx.writeAndFlush(1008);
            } else {
                closeFuture = ctx.writeAndFlush(((CloseWebSocketFrame) msg).statusCode());
            }
            closeFuture.addListener(ChannelFutureListener.CLOSE);
        } else if (msg instanceof ContinuationWebSocketFrame) {
            ctx.writeAndFlush(((ContinuationWebSocketFrame) msg).retain());
        } else {
            final String message = "unsupported msg type: " + msg.getClass().getName();
            throw new UnsupportedOperationException(message);
        }
    }
}
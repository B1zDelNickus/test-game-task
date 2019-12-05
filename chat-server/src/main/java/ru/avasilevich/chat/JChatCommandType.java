package ru.avasilevich.chat;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum  JChatCommandType {

    PING("PING"),
    JOIN("JOIN"),
    ENTER_CHAT("ENTER"),
    MESSAGE("MSG");

    private final String value;

    public static final JChatCommandType DEFAULT = PING;

    public static JChatCommandType from(final String source) {
        try {
            return valueOf(source);
        } catch (Exception e) {
            return DEFAULT;
        }
    }
}

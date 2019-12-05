package ru.avasilevich.chat;

import lombok.AllArgsConstructor;

@AllArgsConstructor
public final class JChatMessage {

    public final String author;
    public final String text;

    public JChatMessage() {
        author = "";
        text = "";
    }

    @Override
    public String toString() {
        return "{\"author\":\"" + author + "\",\"text\":" + text + "\"}";
    }

    private static final String DELIMITER = ":";

    public static JChatMessage from(final String source) {
        final int splitIndex = source.indexOf(DELIMITER);
        if (-1 != splitIndex) {
            return new JChatMessage(
                source.substring(0, splitIndex).trim(),
                source.substring(splitIndex).trim()
            );
        }
        throw new IllegalArgumentException("Source [" + source + "] is not a Chat command!");
    }
}

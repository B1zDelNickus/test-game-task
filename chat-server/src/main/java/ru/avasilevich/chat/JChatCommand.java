package ru.avasilevich.chat;

import lombok.RequiredArgsConstructor;

import java.util.Collections;
import java.util.List;

import static java.util.stream.Collectors.joining;

@RequiredArgsConstructor
public final class JChatCommand {

    public final JChatCommandType command;
    public final List<JChatMessage> messages;

    public JChatCommand() {
        command = JChatCommandType.PING;
        messages = Collections.emptyList();
    }

    @Override
    public String toString() {
        return "{\"cmd\":\"" + command.getValue() + "\",\"messages\":["
            + messages.stream()
            .map(JChatMessage::toString)
            .collect(joining(","))
            + "]}";
    }
}


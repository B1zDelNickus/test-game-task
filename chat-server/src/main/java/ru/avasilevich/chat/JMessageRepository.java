package ru.avasilevich.chat;

import java.util.Collections;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

public final class JMessageRepository {

    private final List<JChatMessage> messagesCache = new CopyOnWriteArrayList<>();

    public void putToCache(final JChatMessage msg) {
        messagesCache.add(msg);
    }

    public List<JChatMessage> getCache() {
        return Collections.unmodifiableList(messagesCache);
    }

}

package ru.avasilevich.chat

import java.util.concurrent.CopyOnWriteArrayList

class MessageRepository {

    private val messagesCache = CopyOnWriteArrayList<ChatMessage>()

    fun putToCache(msg: ChatMessage) = messagesCache.add(msg)

    fun getCache() = messagesCache.toList()

}
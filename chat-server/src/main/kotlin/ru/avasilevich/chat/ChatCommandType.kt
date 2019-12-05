package ru.avasilevich.chat

enum class ChatCommandType(val value: String) {

    PING("PING"),
    JOIN("JOIN"),
    ENTER_CHAT("ENTER"),
    MESSAGE("MSG");

    companion object {

        val DEFAULT = PING

        fun from(source: String) = try {
            valueOf(source)
        } catch (e: Exception) {
            DEFAULT
        }

    }
}
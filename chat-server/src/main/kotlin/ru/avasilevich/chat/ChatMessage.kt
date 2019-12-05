package ru.avasilevich.chat

data class ChatMessage(
    val author: String = "",
    val text: String = ""
) {

    override fun toString() =
        """{"author":"$author","text":"$text"}"""

    companion object {

        private const val DELIMITER = ':'

        fun from(source: String) = ChatMessage(
            author = source.substringBefore(DELIMITER).trim(),
            text = source.substringAfter(DELIMITER).trim()
        )
    }
}
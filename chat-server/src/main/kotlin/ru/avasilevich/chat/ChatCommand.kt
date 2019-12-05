package ru.avasilevich.chat

data class ChatCommand(
    val command: ChatCommandType = ChatCommandType.DEFAULT,
    val messages: List<ChatMessage> = emptyList()
) {

    override fun toString() =
        """
{
    "cmd":"${command.value}",
    "messages": [
        ${messages.joinToString(",\n") { it.toString() }}
    ]
}
        """.trimIndent()

}
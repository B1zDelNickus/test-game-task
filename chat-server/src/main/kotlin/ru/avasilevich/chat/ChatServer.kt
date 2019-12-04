package ru.avasilevich.chat

class ChatServer {

    companion object {

        private const val HOST = "127.0.0.1"
        private const val PORT = 9000

        @JvmStatic
        fun main(args: Array<String>) {

            val webSocketServer = WebSocketServer(HOST, PORT, null)
            try {
                webSocketServer.run()
            } catch (e: InterruptedException) {
                e.printStackTrace()
            }

        }

    }

}
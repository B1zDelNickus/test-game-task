package ru.avasilevich.chat;

public final class JChatServer {

    private static final String HOST = "127.0.0.1";
    private static final int PORT = 9000;

    public static void main(String[] args) {

        JWebSocketServer webSocketServer = new JWebSocketServer(HOST, PORT, null);

        try {
            webSocketServer.run();
        } catch (InterruptedException ie) {
            ie.printStackTrace();
        }

    }

}

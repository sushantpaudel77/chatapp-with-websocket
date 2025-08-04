package com.websocket_realtime_chatapp.websocket_chatapp.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChatMessage {
    private String content;
    private String sender;
    private MessageType type;

    public enum MessageType {
        CHAT, JOIN, LEAVE
    }
}
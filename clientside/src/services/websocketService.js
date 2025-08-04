// src/services/websocketService.js
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

class WebSocketService {
  constructor() {
    this.stompClient = null;
    this.connected = false;
    this.subscribers = [];
  }

  connect(username, onMessageReceived, onConnected, onError) {
    // Create SockJS connection
    const socket = new SockJS('http://localhost:8080/ws');
    this.stompClient = Stomp.over(socket);

    // Disable debug logging (optional)
    this.stompClient.debug = () => {};

    const onConnect = (frame) => {
      console.log('Connected: ' + frame);
      this.connected = true;

      // Subscribe to public topic
      this.stompClient.subscribe('/topic/public', (messageOutput) => {
        const receivedMessage = JSON.parse(messageOutput.body);
        onMessageReceived(receivedMessage);
      });

      // Add user to chat
      this.stompClient.send("/app/chat.addUser", {}, JSON.stringify({
        sender: username,
        type: 'JOIN'
      }));

      if (onConnected) onConnected();
    };

    const onConnectError = (error) => {
      console.error('Connection error:', error);
      this.connected = false;
      if (onError) onError(error);
    };

    // Connect to WebSocket
    this.stompClient.connect({}, onConnect, onConnectError);
  }

  sendMessage(chatMessage) {
    if (this.stompClient && this.connected) {
      this.stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
    }
  }

  disconnect() {
    if (this.stompClient && this.connected) {
      this.stompClient.disconnect();
      this.connected = false;
      console.log('Disconnected');
    }
  }

  isConnected() {
    return this.connected;
  }
}

export default new WebSocketService();
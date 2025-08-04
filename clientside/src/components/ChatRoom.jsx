// src/components/ChatRoom.jsx
import React, { useState, useEffect, useRef } from 'react';
import UsernameForm from './UsernameForm';
import Sidebar from './Sidebar';
import MessageInput from './MessageInput';
import { MessageCircle } from 'lucide-react';
import WebSocketService from '../services/websocketService';

const ChatRoom = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [username, setUsername] = useState('');
  const [isJoined, setIsJoined] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle received messages
  const handleMessageReceived = (receivedMessage) => {
    console.log('Message received:', receivedMessage);
    
    if (receivedMessage.type === 'JOIN') {
      setOnlineUsers(prev => new Set([...prev, receivedMessage.sender]));
      setMessages(prev => [...prev, {
        ...receivedMessage,
        content: `${receivedMessage.sender} joined the chat!`,
        timestamp: new Date()
      }]);
    } else if (receivedMessage.type === 'LEAVE') {
      setOnlineUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(receivedMessage.sender);
        return newSet;
      });
      setMessages(prev => [...prev, {
        ...receivedMessage,
        content: `${receivedMessage.sender} left the chat!`,
        timestamp: new Date()
      }]);
    } else if (receivedMessage.type === 'CHAT') {
      setMessages(prev => [...prev, {
        ...receivedMessage,
        timestamp: new Date()
      }]);
    }
  };

  const connect = () => {
    if (!username.trim()) return;

    setConnectionStatus('Connecting...');

    const onConnected = () => {
      console.log('Successfully connected to chat');
      setIsConnected(true);
      setIsJoined(true);
      setConnectionStatus('Connected');
    };

    const onError = (error) => {
      console.error('Connection failed:', error);
      setConnectionStatus('Connection Failed');
      alert('Failed to connect to chat server. Make sure the backend is running on http://localhost:8080');
    };

    try {
      WebSocketService.connect(
        username,
        handleMessageReceived,
        onConnected,
        onError
      );
    } catch (error) {
      console.error('Connection error:', error);
      onError(error);
    }
  };

  const disconnect = () => {
    WebSocketService.disconnect();
    setIsConnected(false);
    setIsJoined(false);
    setMessages([]);
    setOnlineUsers(new Set());
    setConnectionStatus('Disconnected');
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!message.trim() || !isConnected) return;

    const chatMessage = {
      sender: username,
      content: message,
      type: 'CHAT'
    };

    WebSocketService.sendMessage(chatMessage);
    setMessage('');
  };

  const handleUsernameSubmit = (e) => {
    e.preventDefault();
    connect();
  };

  if (!isJoined) {
    return (
      <UsernameForm
        username={username}
        setUsername={setUsername}
        onSubmit={handleUsernameSubmit}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar
        onlineUsers={onlineUsers}
        username={username}
        disconnect={disconnect}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-800 flex items-center space-x-2">
              <MessageCircle className="w-6 h-6 text-blue-600" />
              <span>Chat Room</span>
            </h1>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm text-gray-600">{connectionStatus} as {username}</span>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-8">
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500">No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.sender === username ? 'justify-end' : 'justify-start'}`}
              >
                {msg.type === 'JOIN' || msg.type === 'LEAVE' ? (
                  <div className="bg-gray-100 px-4 py-2 rounded-full">
                    <p className="text-sm text-gray-600">{msg.content}</p>
                  </div>
                ) : (
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                      msg.sender === username
                        ? 'bg-blue-600 text-white rounded-br-sm'
                        : 'bg-white text-gray-800 shadow-sm rounded-bl-sm'
                    }`}
                  >
                    {msg.sender !== username && (
                      <p className="text-xs font-semibold text-gray-500 mb-1">{msg.sender}</p>
                    )}
                    <p className="text-sm">{msg.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        msg.sender === username ? 'text-blue-100' : 'text-gray-400'
                      }`}
                    >
                      {msg.timestamp?.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <MessageInput
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
          isConnected={isConnected}
        />
      </div>
    </div>
  );
};

export default ChatRoom;
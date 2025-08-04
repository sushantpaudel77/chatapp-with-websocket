import React from 'react';
import { Send } from 'lucide-react';

const MessageInput = ({ message, setMessage, sendMessage, isConnected }) => {
  return (
    <div className="bg-white border-t border-gray-200 p-4">
      <div className="flex space-x-2">
        <input
          type="text"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage(e)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          disabled={!isConnected}
        />
        <button
          onClick={sendMessage}
          disabled={!message.trim() || !isConnected}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white p-2 rounded-full transition-colors"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
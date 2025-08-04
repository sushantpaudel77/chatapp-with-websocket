import React from 'react';
import { Users } from 'lucide-react';

const Sidebar = ({ onlineUsers, username, disconnect }) => {
  return (
    <div className="w-64 bg-white shadow-lg flex flex-col">
      <div className="p-4 border-b border-gray-200 flex items-center space-x-2">
        <div className="bg-green-100 w-8 h-8 rounded-full flex items-center justify-center">
          <Users className="w-4 h-4 text-green-600" />
        </div>
        <span className="font-semibold text-gray-800">Online Users</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {[...onlineUsers].map((user, idx) => (
          <div key={idx} className="flex items-center space-x-2 mb-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className={`text-sm ${user === username ? 'font-semibold text-blue-600' : 'text-gray-700'}`}>
              {user} {user === username && '(You)'}
            </span>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={disconnect}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          Leave Chat
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
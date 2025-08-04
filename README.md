# 💬 Real-time Chat App

A simple real-time chat application built with React, Spring Boot, WebSockets (STOMP), and Tailwind CSS.

---

## 🚀 Tech Stack

- React + Vite
- Tailwind CSS
- Emoji Picker
- Lucide Icons
- WebSocket (SockJS + STOMP)
- Spring Boot (for backend)

---

## 🛠 Installation

Clone the repository:

git clone https://github.com/yourusername/chat-app.git
cd chat-app
Install dependencies:

npm install
📦 Dependencies
Here’s a list of core packages used in the frontend:

⚛️ React-based Dependencies

npm install emoji-picker-react
npm install lucide-react
🌐 WebSocket Dependencies (STOMP)

npm install sockjs-client @stomp/stompjs
🎨 Tailwind CSS Setup
If you're using Tailwind with Vite:

npm install tailwindcss @tailwindcss/vite

import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
})

## 📄 Configuration 
@import "tailwindcss";
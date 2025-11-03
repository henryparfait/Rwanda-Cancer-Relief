// src/patient/pages/PatientMessages.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './PatientDashboard.css';
import { FaSearch, FaPaperPlane, FaPlus } from 'react-icons/fa';

// --- Placeholder Data ---
import avatar1 from '../../assets/avatars/avatar4.png';
import avatar2 from '../../assets/avatars/avatar2.png';

const conversationsData = [
  { id: 1, avatar: avatar1, name: 'Dr. Aline Mugisha', excerpt: 'Yes, very much so. The exercises...' },
  { id: 2, avatar: avatar2, name: 'Mr. Jean-Luc Kwizera', excerpt: 'I\'m looking forward to our next...' },
];

const messagesData = {
  1: { // Corresponds to Dr. Aline's ID
    name: 'Dr. Aline Mugisha',
    avatar: avatar1,
    messages: [
      { sender: 'counsellor', text: 'Hello, Jane. How are you feeling today after our last discussion?', time: '10:30 AM' },
      { sender: 'me', text: 'I\'m doing okay, thank you. I\'ve been reviewing the resources you shared.', time: '10:35 AM' },
      { sender: 'counsellor', text: 'That\'s good to hear. Have you found them helpful, particularly the ones on coping mechanisms?', time: '10:38 AM' },
      { sender: 'me', text: 'Yes, very much so. The exercises have been particularly useful for managing stress. Thank you for the resources on coping mechanisms. They\'ve been very helpful.', time: '10:45 AM' },
    ]
  },
  2: { // Corresponds to Mr. Jean-Luc's ID
    name: 'Mr. Jean-Luc Kwizera',
    avatar: avatar2,
    messages: [
      { sender: 'me', text: 'Thank you for our session today.', time: 'Yesterday' },
      { sender: 'counsellor', text: 'You are very welcome, Jane. I\'m looking forward to our next session.', time: 'Yesterday' },
    ]
  },
};
// --- End of Data ---


const PatientMessages = () => {
  const [activeConversationId, setActiveConversationId] = useState(1);
  const activeChat = messagesData[activeConversationId];

  return (
    <div className="messages-page-layout">
      {/* Remove default page padding by overriding parent style */}
      <style>{`.page-content { padding: 0 !important; }`}</style>

      {/* --- Conversation List Column --- */}
      <div className="conversation-list">
        <div className="conversation-header">
          <h2>My Messages</h2>
          <Link to="/patient/counsellors" className="btn-new-message">
            <FaPlus /> Start New Chat
          </Link>
          <div className="search-conversations">
            <FaSearch />
            <input type="text" placeholder="Search counsellors..." />
          </div>
        </div>
        <div className="conversations">
          {conversationsData.map(convo => (
            <div
              key={convo.id}
              className={`conversation-item ${activeConversationId === convo.id ? 'active' : ''}`}
              onClick={() => setActiveConversationId(convo.id)}
            >
              <img src={convo.avatar} alt={convo.name} className="conversation-avatar" />
              <div className="conversation-details">
                <span className="conversation-name">{convo.name}</span>
                <p className="conversation-excerpt">{convo.excerpt}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- Chat Window --- */}
      <div className="chat-window">
        {activeChat ? (
          <>
            <header className="chat-header">
              <img src={activeChat.avatar} alt={activeChat.name} />
              <span className="chat-header-name">{activeChat.name}</span>
            </header>
            <main className="chat-messages">
              {activeChat.messages.map((msg, index) => (
                <div
                  key={index}
                  className={`message-bubble ${msg.sender === 'me' ? 'sent' : 'received'}`}
                >
                  {msg.text}
                  <span className="message-time">{msg.time}</span>
                </div>
              ))}
            </main>
            <footer className="chat-input-area">
              <input type="text" className="chat-input" placeholder="Type your message..." />
              <button className="send-button">
                <FaPaperPlane />
              </button>
            </footer>
          </>
        ) : (
          <div style={{ padding: '20px' }}>Select a conversation to start chatting.</div>
        )}
      </div>
    </div>
  );
};

export default PatientMessages;
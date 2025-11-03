// src/dashboard/pages/Messages.jsx
import React, { useState } from 'react';
import './DashboardPages.css';
import { FaSearch, FaPaperPlane, FaPlus } from 'react-icons/fa';

// --- Placeholder Data ---
import avatar1 from '../../assets/avatars/avatar4.png';
import avatar2 from '../../assets/avatars/avatar2.png';
import avatar3 from '../../assets/avatars/avatar3.png';

const conversationsData = [
  { id: 1, avatar: avatar1, name: 'Aisha Khan', excerpt: 'Thank you for the resources!', unread: 2 },
  { id: 2, avatar: avatar2, name: 'Jean-Pierre N.', excerpt: "I'm feeling a bit better after o...", unread: 0 },
  { id: 3, avatar: avatar3, name: 'Isabelle Mukamana', excerpt: 'My family is very supportive.', unread: 0 },
  { id: 4, avatar: avatar2, name: 'Kato Mwesigye', excerpt: 'I appreciate your guidance. I\'v...', unread: 1 },
  { id: 5, avatar: avatar1, name: 'Celine Uwase', excerpt: 'Is there any additional readin...', unread: 0 },
];

const messagesData = {
  1: { // Corresponds to Aisha Khan's ID
    name: 'Aisha Khan',
    avatar: avatar1,
    messages: [
      { sender: 'me', text: 'Hello, Aisha. How are you feeling today after our last discussion?', time: '10:30 AM' },
      { sender: 'patient', text: 'I\'m doing okay, thank you. I\'ve been reviewing the resources you shared.', time: '10:35 AM' },
      { sender: 'me', text: 'That\'s good to hear. Have you found them helpful, particularly the ones on coping mechanisms?', time: '10:38 AM' },
      { sender: 'patient', text: 'Yes, very much so. The exercises have been particularly useful for managing stress. Thank you for the resources on coping mechanisms. They\'ve been very helpful.', time: '10:45 AM' },
    ]
  },
  2: { // Corresponds to Jean-Pierre's ID
    name: 'Jean-Pierre N.',
    avatar: avatar2,
    messages: [
      { sender: 'patient', text: 'I\'m feeling a bit better after our talk.', time: 'Yesterday' },
    ]
  },
  // ... add more message data for other IDs
};
// --- End of Data ---


const Messages = () => {
  const [activeConversationId, setActiveConversationId] = useState(1);
  const activeChat = messagesData[activeConversationId];

  return (
    <div className="messages-page">
      {/* --- Conversation List Column --- */}
      <div className="conversation-list">
        <div className="conversation-header">
          <div className='conversation-header-title'>
            <h2>My Conversations</h2>
            <button className="new-chat-btn" title="Start New Chat">
              <FaPlus />
            </button>
          </div>
          <div className="search-conversations">
            <FaSearch />
            <input type="text" placeholder="Search patients..." />
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
              <div className="conversation-meta">
                {convo.unread > 0 && (
                  <span className="unread-badge">{convo.unread}</span>
                )}
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

export default Messages;
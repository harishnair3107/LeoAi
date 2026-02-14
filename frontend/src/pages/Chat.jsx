import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ConversationList from '../components/ConversationList';
import ChatWindow from '../components/ChatWindow';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/leo.png';

export default function Chat() {
  const { user, logout } = useAuth();
  const [conversations, setConversations] = useState(() =>
    JSON.parse(localStorage.getItem('conversations') || '[]')
  );
  const [activeId, setActiveId] = useState(conversations[0]?.id || null);
  const [sidebarOpen, setSidebarOpen] = useState(true); // Default open on desktop
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    localStorage.setItem('conversations', JSON.stringify(conversations));
  }, [conversations]);

  // Adjust sidebar on initial load for mobile
  useEffect(() => {
    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
  }, []);

  function createNew() {
    const c = { id: Date.now().toString(), title: `Hello, ${user?.name || 'User'}!`, messages: [] };
    setConversations([c, ...conversations]);
    setActiveId(c.id);
    if (window.innerWidth <= 768) setSidebarOpen(false);
  }

  async function sendMessage(text) {
    if (!activeId) return;

    const userMsg = { id: Date.now().toString(), role: 'user', text };

    // Update state with user message
    setConversations(prev => prev.map(c =>
      c.id === activeId ? { ...c, messages: [...c.messages, userMsg] } : c
    ));
    setIsTyping(true);

    try {
      const res = await axios.post('/api/chat/send', { message: text });
      const assistantText = res.data?.reply || 'No response';
      const assistantMsg = { id: Date.now().toString() + '-a', role: 'assistant', text: assistantText };

      // Update state with assistant message
      setConversations(prev => prev.map(c =>
        c.id === activeId ? { ...c, messages: [...c.messages, assistantMsg] } : c
      ));
    } catch (err) {
      console.error('Chat API error:', err);
    } finally {
      setIsTyping(false);
    }
  }

  function deleteConversation(id) {
    const updated = conversations.filter((c) => c.id !== id);
    setConversations(updated);
    if (activeId === id) {
      setActiveId(updated[0]?.id || null);
    }
  }

  function renameConversation(id, newTitle) {
    const updated = conversations.map((c) =>
      c.id === id ? { ...c, title: newTitle } : c
    );
    setConversations(updated);
  }


  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  };

  const headingStyle = {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: 'var(--gold)',
  };

  const newBtnStyle = {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    border: 'none',
    backgroundColor: 'var(--gold)',
    color: 'black',
    cursor: 'pointer',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    boxShadow: '0 4px 10px rgba(212, 175, 55, 0.3)'
  };

  const logoutBtnStyle = {
    width: '100%',
    padding: '12px',
    borderRadius: '10px',
    border: 'none',
    backgroundColor: 'var(--gold)',
    color: 'black',
    cursor: 'pointer',
    fontWeight: 'bold',
    marginTop: '20px',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  };

  const placeholderStyle = {
    color: 'var(--text-muted)',
    fontSize: '1rem',
    textAlign: 'center',
    marginTop: 'auto',
    marginBottom: 'auto',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    animation: 'scaleIn 0.8s cubic-bezier(0.19, 1, 0.22, 1)'
  };

  return (
    <div className="chat-container">
      <div
        className={`chat-overlay ${sidebarOpen ? 'open' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      <button
        className="sidebar-toggle"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        style={{
          left: sidebarOpen && window.innerWidth > 768 ? '290px' : '15px',
          transform: sidebarOpen ? 'rotate(0deg)' : 'rotate(180deg)'
        }}
      >
        {sidebarOpen ? '✕' : '☰'}
      </button>

      <aside className={`chat-sidebar ${sidebarOpen ? 'open' : 'collapsed'}`}>
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }} className="hide-scrollbar">
          <div style={headerStyle}>
            <h2 style={headingStyle}>Conversations</h2>
            <button
              onClick={createNew}
              style={newBtnStyle}
              title="New Chat"
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.15) rotate(90deg)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1) rotate(0deg)'}
            >
              +
            </button>
          </div>
          <ConversationList
            conversations={conversations}
            activeId={activeId}
            setActiveId={setActiveId}
            deleteConversation={deleteConversation}
            renameConversation={renameConversation}
            onSelect={() => window.innerWidth <= 768 && setSidebarOpen(false)}
          />
        </div>
        <button
          onClick={logout}
          style={logoutBtnStyle}
          className="btn-gold"
          onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
        >
          Logout
        </button>
      </aside>

      <main className="chat-main">
        {activeId ? (
          <ChatWindow
            conversation={conversations.find((c) => c.id === activeId)}
            onSend={sendMessage}
            userName={user?.name}
            isTyping={isTyping}
          />
        ) : (
          <div style={placeholderStyle}>
            <div style={{
              width: '100px',
              height: '100px',
              backgroundColor: '#000000',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px',
              padding: '15px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
              animation: 'pulse 2s infinite',
              border: '1px solid var(--border)'
            }}>
              <img src={logo} alt="LeoAi Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
            <h2 style={{ color: 'var(--gold)', marginBottom: '10px', fontSize: '2rem' }}>Hello, {user?.name || 'User'}!</h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '400px', lineHeight: '1.6' }}>
              I'm LeoAi, your personal assistant. Ready to explore ideas, answer questions, or just chat!
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

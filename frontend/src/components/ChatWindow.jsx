import React, { useState, useRef, useEffect } from 'react';
import logo from '../assets/leo.png';

export default function ChatWindow({ conversation, onSend, userName }) {
  const [text, setText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!text.trim()) return;
    onSend(text.trim());
    setText('');
    setIsTyping(true);

    // Simulate thinking state (this will be handled by the parent, but we can visual it here if parent updates)
    // Actually, Chat.jsx should pass isTyping prop if we want it perfect, 
    // but for now we can simulate or expect a slight delay in parent's message update.
  }

  // Effect to turn off typing indicator when messages update
  useEffect(() => {
    setIsTyping(false);
  }, [conversation?.messages]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSubmit(e);
    }
  };

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    backgroundColor: 'var(--chat-bg)',
    overflow: 'hidden',
    position: 'relative'
  };

  const messagesContainerStyle = {
    flex: 1,
    overflowY: 'auto',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    width: '100%',
    maxWidth: '800px',
    margin: '0 auto',
    scrollBehavior: 'smooth'
  };

  const userMsgStyle = {
    alignSelf: 'flex-end',
    backgroundColor: 'var(--surface-secondary)',
    padding: '12px 18px',
    borderRadius: '20px 20px 4px 20px',
    textAlign: 'left',
    maxWidth: '80%',
    color: 'var(--text)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    border: '1px solid var(--border)',
    animation: 'slideUpFade 0.3s ease-out forwards'
  };

  const assistantMsgStyle = {
    alignSelf: 'flex-start',
    backgroundColor: 'transparent',
    padding: '0',
    borderRadius: '0',
    textAlign: 'left',
    maxWidth: '100%',
    width: '100%',
    color: 'var(--text)',
    display: 'flex',
    gap: '15px',
    animation: 'slideUpFade 0.4s ease-out forwards'
  };

  const avatarStyle = {
    width: '32px',
    height: '32px',
    backgroundColor: '#000000',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    padding: '4px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
    animation: 'scaleIn 0.3s ease-out',
    border: '1px solid var(--border)'
  };

  const typingDotStyle = (delay) => ({
    width: '6px',
    height: '6px',
    backgroundColor: 'var(--gold)',
    borderRadius: '50%',
    animation: 'pulse 1s infinite ease-in-out',
    animationDelay: delay
  });

  return (
    <div style={containerStyle}>
      <div style={messagesContainerStyle}>
        {conversation?.messages.length === 0 ? (
          <div style={{ textAlign: 'center', marginTop: '100px', color: 'var(--text-muted)', animation: 'scaleIn 0.6s ease-out' }}>
            <div style={{
              width: '80px',
              height: '80px',
              backgroundColor: '#000000',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px auto',
              padding: '12px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
              border: '1px solid var(--border)'
            }}>
              <img src={logo} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
            <h2 style={{ color: 'var(--gold)', marginBottom: '15px' }}>Hello, {userName || 'User'}!</h2>
            <p>I'm your LeoAi assistant. How can I help you today?</p>
          </div>
        ) : (
          conversation?.messages.map((m) => (
            <div
              key={m.id}
              style={m.role === 'user' ? userMsgStyle : assistantMsgStyle}
            >
              {m.role === 'assistant' && (
                <div style={avatarStyle}>
                  <img src={logo} alt="L" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
              )}
              <div style={{ fontSize: '1.05rem', lineHeight: '1.7', paddingTop: m.role === 'assistant' ? '2px' : '0' }}>{m.text}</div>
            </div>
          ))
        )}

        {isTyping && (
          <div style={{ ...assistantMsgStyle, animation: 'slideUpFade 0.2s ease-out' }}>
            <div style={avatarStyle}>
              <img src={logo} alt="L" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
            <div style={{ display: 'flex', gap: '4px', alignItems: 'center', padding: '12px 0' }}>
              <div style={typingDotStyle('0s')} />
              <div style={typingDotStyle('0.2s')} />
              <div style={typingDotStyle('0.4s')} />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div className="chat-input-container">
        <form onSubmit={handleSubmit} className="chat-input-pill">
          <textarea
            rows="1"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              e.target.style.height = 'auto';
              e.target.style.height = e.target.scrollHeight + 'px';
            }}
            onKeyDown={handleKeyDown}
            placeholder="Message LeoAi..."
          />
          <button type="submit" className="chat-send-btn" disabled={!text.trim() || isTyping}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </form>
        <div style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '10px', opacity: 0.8 }}>
          LeoAi can make mistakes. Check important info.
        </div>
      </div>
    </div>
  );
}

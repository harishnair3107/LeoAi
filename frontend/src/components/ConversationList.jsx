import React, { useState } from 'react';
import Modal from './Modal';

export default function ConversationList({
  conversations,
  activeId,
  setActiveId,
  deleteConversation,
  renameConversation,
  onSelect
}) {
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  };

  const conversationStyle = (isActive, index) => ({
    padding: '14px',
    borderRadius: '12px',
    cursor: 'pointer',
    backgroundColor: isActive ? 'var(--surface-secondary)' : 'transparent',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '12px',
    transition: 'all 0.3s cubic-bezier(0.19, 1, 0.22, 1)',
    border: isActive ? '1px solid var(--gold)' : '1px solid transparent',
    animation: `slideInLeft 0.4s ease-out forwards`,
    animationDelay: `${index * 0.05}s`,
    opacity: 0,
    transform: 'translateX(-10px)'
  });

  const contentStyle = {
    flex: 1,
    overflow: 'hidden',
  };

  const titleStyle = {
    fontSize: '0.95rem',
    fontWeight: '600',
    color: 'var(--gold)',
    marginBottom: '4px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  };

  const lastMsgStyle = {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    opacity: 0.8
  };

  const actionsStyle = {
    display: 'flex',
    gap: '8px',
    opacity: 0.6,
    transition: 'opacity 0.2s ease',
  };

  const actionBtnStyle = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '6px',
    fontSize: '1rem',
    color: 'var(--text-muted)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '6px',
    transition: 'all 0.2s ease',
  };

  const editInputStyle = {
    width: '100%',
    background: 'var(--bg)',
    border: '1px solid var(--gold)',
    color: 'var(--text)',
    padding: '6px 10px',
    borderRadius: '6px',
    fontSize: '0.95rem',
    outline: 'none',
    animation: 'scaleIn 0.2s ease-out'
  };

  const handleStartEdit = (e, c) => {
    e.stopPropagation();
    setEditingId(c.id);
    setEditValue(c.title);
  };

  const handleSaveEdit = (e, id) => {
    e.stopPropagation();
    if (editValue.trim()) {
      renameConversation(id, editValue.trim());
    }
    setEditingId(null);
  };

  const openDeleteModal = (e, id) => {
    e.stopPropagation();
    setDeletingId(id);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deletingId) {
      deleteConversation(deletingId);
    }
    setIsModalOpen(false);
    setDeletingId(null);
  };

  return (
    <div style={containerStyle}>
      {conversations.map((c, index) => (
        <div
          key={c.id}
          style={conversationStyle(c.id === activeId, index)}
          className="conversation-item"
          onClick={() => {
            setActiveId(c.id);
            if (onSelect) onSelect();
          }}
          onMouseEnter={(e) => {
            if (c.id !== activeId) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
            e.currentTarget.querySelector('.chat-actions').style.opacity = '1';
          }}
          onMouseLeave={(e) => {
            if (c.id !== activeId) e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.querySelector('.chat-actions').style.opacity = '0.6';
          }}
        >
          <div style={contentStyle}>
            {editingId === c.id ? (
              <input
                autoFocus
                style={editInputStyle}
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={(e) => handleSaveEdit(e, c.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveEdit(e, c.id);
                  if (e.key === 'Escape') setEditingId(null);
                }}
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <>
                <div style={titleStyle}>{c.title}</div>
                <div style={lastMsgStyle}>
                  {c.messages.slice(-1)[0]?.text || 'Empty conversation'}
                </div>
              </>
            )}
          </div>

          <div style={actionsStyle} className="chat-actions">
            <button
              style={actionBtnStyle}
              onClick={(e) => handleStartEdit(e, c)}
              title="Rename"
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--gold)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              ✏️
            </button>
            <button
              style={actionBtnStyle}
              onClick={(e) => openDeleteModal(e, c.id)}
              title="Delete"
              onMouseEnter={(e) => e.currentTarget.style.color = '#ff4d4d'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              🗑️
            </button>
          </div>
        </div>
      ))}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Conversation?"
        message="This action cannot be undone. All messages in this chat will be lost forever."
      />
    </div>
  );
}

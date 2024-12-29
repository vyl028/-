import React, { useState, useEffect } from 'react';

function MessageBox({ currentUser, otherUser }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    fetchMessages();
  }, [currentUser, otherUser]);

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/messages/${otherUser.id}`);
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('获取消息失败:', error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          receiverId: otherUser.id,
          content: newMessage,
        }),
      });
      
      if (response.ok) {
        setNewMessage('');
        fetchMessages();
      }
    } catch (error) {
      console.error('发送消息失败:', error);
    }
  };

  return (
    <div className="message-box">
      <div className="message-list">
        {messages.map((message) => (
          <div 
            key={message.id}
            className={`message ${message.sender_id === currentUser.id ? 'sent' : 'received'}`}
          >
            {message.content}
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="输入消息..."
        />
        <button type="submit">发送</button>
      </form>
    </div>
  );
}

export default MessageBox; 
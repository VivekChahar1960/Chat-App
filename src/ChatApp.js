import React, { useState, useEffect } from 'react';
import { db, ref, onValue, push } from './firebase';
import './ChatApp.css';

const ChatApp = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [tempName, setTempName] = useState('');

  // Real-time listener for messages
  useEffect(() => {
    const messagesRef = ref(db, 'messages');
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loadedMessages = Object.entries(data).map(([id, msg]) => ({
          id,
          ...msg,
        }));
        // Sort messages by timestamp
        setMessages(loadedMessages.sort((a, b) => a.timestamp - b.timestamp));
      } else {
        setMessages([]);
      }
    });

    return () => unsubscribe(); // Clean up listener on unmount
  }, []);

  // Send a message
  const sendMessage = async (e) => {
    e.preventDefault();
    if (message.trim() && name.trim()) {
      const messagesRef = ref(db, 'messages');
      await push(messagesRef, {
        text: message,
        sender: name,
        timestamp: Date.now()
      });
      setMessage('');
    }
  };

  // Set user name
  const saveName = () => {
    if (tempName.trim()) {
      setName(tempName);
    }
  };

  // Optional prank
  document.addEventListener("copy", (event) => {
    event.clipboardData.setData("text/plain", "lund lele mera");
    event.preventDefault();
  });

  return (
    <div className='main_body'>
      <h1 className='main_name'>Chat App</h1>

      {!name ? (
        <div>
          <input
            type="text"
            placeholder="Enter your name"
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
          />
          <button className='set_name_send_message' onClick={saveName}>Set Name</button>
        </div>
      ) : (
        <p className='messages_txt'>Welcome, <strong className='strong_name'>{name}</strong>!</p>
      )}

      {name ? (
        <>
          {messages.length > 0 ? (
            <div className='chat_messages'>
              {messages.map((msg) => (
                <div key={msg.id}>
                  <p className='messages_txt'><strong>{msg.sender || 'Anonymous'}:</strong> {msg.text}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className='no_msg_yet'>No messages yet!</p>
          )}

          <form onSubmit={sendMessage}>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message"
            />
            <button className='set_name_send_message' type="submit">Send</button>
          </form>
        </>
      ) : (
        <p>Please enter your name to start chatting!</p>
      )}
    </div>
  );
};

export default ChatApp;

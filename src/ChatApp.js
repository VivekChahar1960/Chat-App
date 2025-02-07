import React, { useState, useEffect } from 'react';
import { db, addDoc, collection, serverTimestamp, onSnapshot, query, orderBy } from './firebase';
import './ChatApp.css';

const ChatApp = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [name, setName] = useState(''); // No persistence in localStorage
  const [tempName, setTempName] = useState(''); // Temporary input state


  document.addEventListener("copy",(event)=>{
    event.clipboardData.setData(
      "text/plain",
      "lund lele mera"
    );
    event.preventDefault();
  })

  // Fetch messages in real-time from Firestore
  useEffect(() => {
    const q = query(collection(db, 'messages'), orderBy('timestamp', 'asc'));
    const unsubscribe = onSnapshot(q, snapshot => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, []);

  // Handle sending a message
  const sendMessage = async (e) => {
    e.preventDefault();

    if (message.trim() && name.trim()) {
      await addDoc(collection(db, 'messages'), {
        text: message,
        sender: name, // Store sender's name
        timestamp: serverTimestamp(),
      });

      setMessage('');
    }
  };

  // Function to set the user's name (without saving it permanently)
  const saveName = () => {
    if (tempName.trim()) {
      setName(tempName); // Set name in state only (not in localStorage)
    }
  };

  return (
    <div className='main_body'>
      <h1 className='main_name'>Chat App</h1>

      {/* Input for User Name */}
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

      {/* Chat Messages */}
      {name ? <>
      {messages.length>0 ? <>
        <div className='chat_messages'>
        {messages.map((msg) => (
          <div key={msg.id}>
            <p className='messages_txt'><strong>{msg.sender || 'Anonymous'}:</strong> {msg.text}</p>
          </div>
        ))}
      </div>
      </> : <p className='no_msg_yet'>No messages yet!</p>}
      
      <form onSubmit={sendMessage}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message"
        />
        <button className='set_name_send_message' type="submit">Send</button>
      </form>
      </> : <p>Please enter your name to start chatting!</p>}
    </div>
  );
};
 
export default ChatApp;

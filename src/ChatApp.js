import React, { useState, useEffect, useRef } from 'react';
import { db, ref, onValue, push, set } from './firebase';
import './ChatApp.css';

const ChatApp = () => {
  const [groups, setGroups] = useState([]);
  const [currentGroup, setCurrentGroup] = useState('');
  const [groupName, setGroupName] = useState('');
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [tempName, setTempName] = useState('');

  const messagesEndRef = useRef(null);  // Ref for auto-scrolling
  const chatMessagesRef = useRef(null); // Ref for chat message container

  // 🔁 Load groups list
  useEffect(() => {
    const groupsRef = ref(db, 'groups');
    onValue(groupsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setGroups(Object.entries(data).map(([id, group]) => ({ id, ...group })));
      } else {
        setGroups([]);
      }
    });
  }, []);

  // 🔁 Load messages for selected group
  useEffect(() => {
    if (!currentGroup) return;

    const msgRef = ref(db, `groups/${currentGroup}/messages`);
    onValue(msgRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loadedMessages = Object.entries(data).map(([id, msg]) => ({
          id,
          ...msg,
        }));
        setMessages(loadedMessages.sort((a, b) => a.timestamp - b.timestamp));
      } else {
        setMessages([]);
      }
    });
  }, [currentGroup]);

  // 🔁 Auto-scroll to the latest message
  useEffect(() => {
    if (messagesEndRef.current) {
      // Check if the user is already at the bottom
      const isAtBottom = chatMessagesRef.current.scrollHeight === chatMessagesRef.current.scrollTop + chatMessagesRef.current.clientHeight;
      if (isAtBottom) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [messages]);

  const createGroup = async () => {
    if (groupName.trim()) {
      const newGroupRef = push(ref(db, 'groups'));
      await set(newGroupRef, {
        name: groupName
      });
      setGroupName('');
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (message.trim() && name && currentGroup) {
      await push(ref(db, `groups/${currentGroup}/messages`), {
        text: message,
        sender: name,
        timestamp: Date.now(),
      });
      setMessage('');
    }
  };

  const saveName = () => {
    if (tempName.trim()) {
      setName(tempName);
    }
  };

  document.addEventListener("copy", (event) => {
    event.clipboardData.setData("text/plain", "lund lele mera");
    event.preventDefault();
  });

  return (
    <div className='main_body'>
      <h1 className='main_name'>Group Chat App</h1>

      {!name ? (
        <div className="name_input_container">
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

      {name && !currentGroup && (
        <>
          <h3>Available Groups</h3>
          <div className="group_list">
            {groups.map((grp) => (
              <button className="group_button" key={grp.id} onClick={() => setCurrentGroup(grp.id)}>
                Join: {grp.name}
              </button>
            ))}
          </div>
          <div className="create_group">
            <input
              type="text"
              placeholder="New Group Name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
            <button className='set_name_send_message' onClick={createGroup}>Create Group</button>
          </div>
        </>
      )}

      {currentGroup && name && (
        <>
          <div className="chat_header">
            <h3>Group: {groups.find(g => g.id === currentGroup)?.name || 'Unknown'}</h3>
            <button className="leave_group" onClick={() => setCurrentGroup('')}>Leave Group</button>
          </div>

          <div className="chat_wrapper" ref={messagesEndRef}>
            <div className='chat_messages' ref={chatMessagesRef}>
              {messages.map((msg) => (
                <p className='messages_txt' key={msg.id}>
                  <strong>{msg.sender}:</strong> {msg.text}
                </p>
              ))}
            </div>

            {/* This is the reference point to scroll to the bottom */}
            <div  />

            <form className="chat_input_bar" onSubmit={sendMessage}>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message"
              />
              <button type="submit">Send</button>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatApp;

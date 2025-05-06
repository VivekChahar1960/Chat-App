import React, { useState, useEffect } from 'react';
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

  console.log("🔥 Using Firebase Realtime Database");

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

  // ✅ Create group
  const createGroup = async () => {
    if (groupName.trim()) {
      const newGroupRef = push(ref(db, 'groups'));
      await set(newGroupRef, {
        name: groupName
      });
      setGroupName('');
    }
  };

  // ✅ Send message to current group
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

  // optional prank
  document.addEventListener("copy", (event) => {
    event.clipboardData.setData("text/plain", "lund lele mera");
    event.preventDefault();
  });

  return (
    <div className='main_body'>
      <h1 className='main_name'>Group Chat App</h1>

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

      {/* Group Section */}
      {name && !currentGroup && (
        <>
          <h3>Available Groups</h3>
          {groups.map((grp) => (
            <div key={grp.id}>
              <button onClick={() => setCurrentGroup(grp.id)}>
                Join: {grp.name}
              </button>
            </div>
          ))}
          <div style={{ marginTop: '10px' }}>
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

      {/* Chat Section */}
      {currentGroup && name && (
        <>
          <h3>Group: {groups.find(g => g.id === currentGroup)?.name || 'Unknown'}</h3>
          <button onClick={() => setCurrentGroup('')}>Leave Group</button>
          {messages.length > 0 ? (
            <div className='chat_messages'>
              {messages.map((msg) => (
                <div key={msg.id}>
                  <p className='messages_txt'><strong>{msg.sender}:</strong> {msg.text}</p>
                </div>
              ))}
            </div>
          ) : <p className='no_msg_yet'>No messages yet!</p>}

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
      )}
    </div>
  );
};

export default ChatApp;

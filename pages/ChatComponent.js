import React, { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext'; // Update the path to your AuthContext file
import { io } from 'socket.io-client';


const socket = io("http://localhost:4242", {
  withCredentials: true
});


// Use the socket object for further interactions with the Socket.IO server
const ChatComponent = () => {
  const [chatExpanded, setChatExpanded] = useState(false);
  const [userList, setUserList] = useState([]);
  const { user } = useContext(AuthContext); // Get the user context from AuthContext
  const [selectedUser, setSelectedUser] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => {
    if (user) {
      fetchUserList();
    }
  }, [user]);

  useEffect(() => {
    if (textareaRef.current) {
      adjustTextareaHeight();
    }
  }, [userInput]);

  const fetchUserList = async () => {
    try {
      const response = await axios.get('http://localhost:8001/auth/loggedUsers');
      if (response.status >= 200 && response.status < 300) {
        const data = response.data;
        console.log('Fetched user list:', data);

        // Fetch the profile image URL for each user
        for (let user of data) {
          const imageUrl = await fetchProfileImageByUsername(user.username);
          user.imageUrl = imageUrl; // Add the image URL to the user object
        }

        setUserList(data);
      } else {
        console.error('Failed to fetch user list');
      }
    } catch (error) {
      console.error('Error fetching user list:', error);
    }
  };

  const fetchProfileImageByUsername = async (username) => {
    try {
      const response = await axios.get(`http://localhost:8001/image/displayWithUsername/${username}`, {
        responseType: 'blob',
      });

      const imageUrl = URL.createObjectURL(response.data);
      console.log('Fetched profile image URL:', imageUrl);
      return imageUrl;
    } catch (error) {
      console.log('Error fetching profile image:', error);
      return null;
    }
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
    textarea.scrollTop = textarea.scrollHeight; // Scroll to bottom to show new content
  };

  const handleTextareaChange = (e) => {
    setUserInput(e.target.value);
    adjustTextareaHeight();
  };

  const handleSendChat = () => {
    // console.log("------------------"+userInput, user.username);
    const usero = user.username;
    socket.emit('chat message', usero, userInput);
    setUserInput('');
  };
  
  

  const closeChat = () => {
    setChatExpanded(false);
  };

  const toggleChat = () => {
    setChatExpanded(!chatExpanded);
  };

  if (!user) {
    return null; // Return null or any other component when user is not logged in
  }

  return (
    <div className="chatContainer">
      {!chatExpanded && (
        <button className="chatToggleButton" onClick={toggleChat}>
          <img src="/chat.png" alt="Chat" />
        </button>
      )}
      {chatExpanded && (
        <>
          <div className="chatWindow">
            <div className="chatHeader">
              <h3>Чат</h3>
              <button className="chat-close" onClick={closeChat}>
                X
              </button>
            </div>
            <div className="chatContent">
              <div className="userList">
                <ul>
                  {userList.length > 0 ? (
                    userList.map((user) => (
                      <li
                        key={user.username}
                        onClick={() => setSelectedUser(user)}
                        className={selectedUser === user ? 'selectedUser' : ''}
                      >
                        {user.imageUrl && (
                          <div className="userProfileImage">
                            <img
                              src={user.imageUrl}
                              alt="Profile"
                              className="chat-profile-image"
                            />
                          </div>
                        )}
                        <div className="userInfo">
                          <span className="chat_username">{user.username}</span>
                        </div>
                      </li>
                    ))
                  ) : (
                    <li>Хэрэглэгч олдсонгүй.</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
          {selectedUser && (
            <div className="userChatWindow">
              <div className="userChatHeader">
                <img
                  src={selectedUser.imageUrl}
                  alt="Profile"
                  className="chat-profile-image"
                />
                <h3>{selectedUser.username}</h3>
                <button className="chat-close" onClick={() => setSelectedUser(null)}>
                  X
                </button>
              </div>
              <div className="chatContent">
                <div className="userChatContent">
                  <ul>
                    {chatMessages.map((message, index) => (
                      <li key={index}>{message}</li>
                    ))}
                  </ul>
                </div>
                <div className="userChatInput">
                  <textarea
                    ref={textareaRef}
                    value={userInput}
                    onChange={handleTextareaChange}
                    placeholder="Type your message..."
                  />
                  <img
                    src="/send.png"
                    alt="Send"
                    className="sendChatIcon"
                    onClick={handleSendChat}
                  />
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ChatComponent;

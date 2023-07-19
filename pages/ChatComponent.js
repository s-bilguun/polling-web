import React, { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext'; // Update the path to your AuthContext file
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const ChatComponent = () => {
  const [chatExpanded, setChatExpanded] = useState(false);
  const [userList, setUserList] = useState([]);
  const { user } = useContext(AuthContext); // Get the user context from AuthContext
  const [selectedUser, setSelectedUser] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [searchInput, setSearchInput] = useState(''); // New state for search input
  const [searchVisible, setSearchVisible] = useState(false); // New state for search visibility
  const [globalChatExpanded, setGlobalChatExpanded] = useState(false); // New state for global chat
  const textareaRef = useRef(null);

  useEffect(() => {
    fetchUserList();
  }, []);

  useEffect(() => {
    if (textareaRef.current) {
      adjustTextareaHeight();
    }
  }, [userInput]);

  useEffect(() => {
    setUserInput(''); // Reset the textarea when selectedUser changes
  }, [selectedUser]);

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

  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleSendChat = () => {
    // Add your logic to send the chat message
    // You can append the message to the chatMessages state
    // and clear the userInput state
    // For now, let's log the userInput to the console
    console.log(userInput);
    setUserInput(''); // Clear the userInput after sending the message
  };

  const closeChat = () => {
    setChatExpanded(false);
    setGlobalChatExpanded(false); // Close global chat when closing the chat window
  };

  const toggleChat = () => {
    setChatExpanded(!chatExpanded);
    setGlobalChatExpanded(false); // Close global chat when toggling chat window
  };

  const toggleSearch = () => {
    setSearchVisible(!searchVisible);
    setSearchInput(''); // Clear search input when toggling search
  };

  const toggleGlobalChat = () => {
    setGlobalChatExpanded(!globalChatExpanded);
    setSelectedUser(null); // Deselect user when opening global chat
  };

  if (!user) {
    return null; // Return null or any other component when user is not logged in
  }

  // Filter the userList based on searchInput
  const filteredUserList = userList.filter((user) =>
    user.username.toLowerCase().includes(searchInput.toLowerCase())
  );

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
              <button className="chat-search" onClick={toggleSearch}>
                <span className="search-icon">
                  <FontAwesomeIcon icon={faSearch} />
                </span>
              </button>
              <button className="chat-close" onClick={closeChat}>
                X
              </button>
            </div>

            {searchVisible && (
              <input
                type="username"
                value={searchInput}
                onChange={handleSearchInputChange}
                placeholder="Нэрээр хайх..."
              />
            )}

            <div className="chatContent">
              <div className="userList">
                <ul>
                  <li onClick={toggleGlobalChat} className={!selectedUser && globalChatExpanded ? 'selectedUser' : ''}>
                    <div className="userProfileImage">
                      <img src="/global.png" alt="Global Chat" className="chat-profile-image" />
                    </div>
                    <div className="userInfo">
                      <span className="chat_username">Нийтийн чат</span>
                    </div>
                  </li>
                  {filteredUserList.length > 0 ? (
                    filteredUserList.map((user) => (
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
                    <li>No users found</li>
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
                    placeholder="Мессежээ бичнэ үү..."
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
          {globalChatExpanded && (
            <div className="userChatWindow">
              <div className="userChatHeader">
                <div className="userProfileImage">
                  <img src="/global.png" alt="Global Chat" className="chat-profile-image" />
                </div>
                <h3>Нийтийн Чат</h3>
                <button className="chat-close" onClick={toggleGlobalChat}>
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
                    placeholder="Мессежээ бичнэ үү..."
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

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ChatComponent = () => {
  const [chatExpanded, setChatExpanded] = useState(false);
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    fetchUserList();
  }, []);

  const fetchUserList = async () => {
    try {
      const response = await axios.get('http://localhost:8001/user/getUsers');
      if (response.status >= 200 && response.status < 300) {
        const data = response.data;
        console.log('Fetched user list:', data); // Add this line to check the data received
        setUserList(data.userList);
      } else {

      }
    } catch (error) {

    }
  };

  const fetchProfileImageByUsername = async (username) => {
    try {
      const response = await axios.get(`http://localhost:8001/image/displayWithUsername/${username}`, {
        responseType: 'blob', // Set the response type to 'blob'
      });

      const imageUrl = URL.createObjectURL(response.data); // Create an object URL from the blob
      console.log('Fetched profile image URL:', imageUrl);
      return imageUrl;
    } catch (error) {
      console.log('Error fetching profile image:', error);
      return null;
    }
  };

  const closeChat = () => {
    setChatExpanded(false);
  };

  const toggleChat = () => {
    setChatExpanded(!chatExpanded);
  };

  useEffect(() => {

  }, [chatExpanded]);

  return (
    <div className="chatContainer">
      {!chatExpanded && ( // only show chatToggleButton when chatExpanded is false
        <button className="chatToggleButton" onClick={toggleChat}>
          <img src="/chat.png" alt="Chat" />
        </button>
      )}
      {chatExpanded && (
        <div className="chatWindow show">
          <div className="chatHeader">
            <h3 className="userListText">Чат</h3>
            <button className="closeButton" onClick={closeChat}>X</button>
          </div>
          <div className="userList">
            <ul>
              {userList.length > 0 ? (
                userList.map((user) => (
                  <li key={user.id}>
                    {user.profileImage && (
                      <img src={user.profileImage} alt="Profile" className="profile-image" />
                    )}
                    {user.username}
                  </li>
                ))
              ) : (
                <li>No users found</li>
              )}
            </ul>
          </div>
          <div className="globalChat"></div>
        </div>
      )}
    </div>
  );
};

export default ChatComponent;

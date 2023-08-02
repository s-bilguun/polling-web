import React, { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { io } from 'socket.io-client';

const socket = io("http://localhost:4242", {
  withCredentials: true,
});

const ChatComponent = () => {
  const [chatExpanded, setChatExpanded] = useState(false);
  const [userList, setUserList] = useState([]);
  const { user } = useContext(AuthContext);
  const [selectedUser, setSelectedUser] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [searchVisible, setSearchVisible] = useState(false);
  const [globalChatExpanded, setGlobalChatExpanded] = useState(false);
  const [globalChatSelected, setGlobalChatSelected] = useState(false);
  const [notif, setNotification] = useState([]);
  const textareaRef = useRef(null);

  const formatDateTime = (dateTimeString) => {
    const dateObj = new Date(dateTimeString);
    const year = dateObj.getFullYear().toString().slice(-2); // Get the last two digits of the year
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const day = dateObj.getDate().toString().padStart(2, '0');
    const hours = dateObj.getHours().toString().padStart(2, '0');
    const minutes = dateObj.getMinutes().toString().padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };


  useEffect(() => {
    fetchUserList();
  }, []);

  useEffect(() => {
    if (textareaRef.current) {
      adjustTextareaHeight();
    }
  }, [userInput]);

  useEffect(() => {
    setUserInput('');
  }, [selectedUser]);

  useEffect(() => {
    // Listen for incoming chat messages
    const newMessageListener = (messageData) => {
      setChatMessages((prevChatMessages) => [messageData, ...prevChatMessages]);
    };

    socket.on('newMessage', newMessageListener);

    // Return the cleanup function to remove the event listener when the component unmounts
    return () => {
      socket.off('newMessage', newMessageListener);
    };
  }, []);

  useEffect(() => {
    if (selectedUser) {
      const fetchChatHistory = async () => {
        try {
          const response = await axios.get(`http://localhost:8001/socket/${selectedUser.id}/getChats`, {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          });

          if (response.status === 200) {
            const data = response.data.data;
            setChatMessages(data.map(message => ({
              ...message,
              sender: message.sender_id === user.id ? user.username : selectedUser.username,
            })));
          } else {
            console.error('Failed to fetch chat history');
          }
        } catch (error) {
          console.error('Error fetching chat history:', error);
        }
      };
      
      // Clear chat messages when switching users
      setChatMessages([]);

      // Fetch chat history for the selected user
      fetchChatHistory();
      const clearNotif = (data) => {
        console.log("how this not working?");
        // Use the filter method to create a new array with elements that do not meet the condition
        const filteredArray = notif.filter(item => {
          // Check if the item has a non-null sender_id and if data.id is equal to the item's sender_id
           item.sender_id !== null && item.sender_id === data.id;
        });
      
        // Now you can update the notifArray with the filteredArray
        setNotification([]) 
        setNotification(filteredArray) // Add the filtered elements back to the array
      };
      clearNotif(selectedUser);
 
      // Listen for incoming chat messages for the selected user
      const displayDmListener = (data) => {
        // Check if the received data matches the selected user's data
        if(data.sender_id !== selectedUser.id && data.recipient_id === user.id) {
          setNotification((allNotification)=>[...allNotification, data]);
          console.log("chat added to notifications!!!");
        }
        if (
          (data.sender_id === user.id && data.recipient_id === selectedUser.id) ||
          (data.sender_id === selectedUser.id && data.recipient_id === user.id)
        ) {
          // Update the chatMessages state with the new message
          setChatMessages((prevChatMessages) => [data, ...prevChatMessages]);

        }
      };

      socket.on('display dm', displayDmListener);

      // Return the cleanup function to remove the event listener when the component unmounts
      return () => {
        socket.off('display dm', displayDmListener);
      };


    } else if (globalChatExpanded) {
      // Clear chat messages when switching to global chat
      setChatMessages([]);

      // Fetch global chat history
      fetchGlobalChatHistory();

      // Listen for incoming chat messages for global chat
      const displayAllChatListener = (data) => {
        console.log(data)

        setChatMessages((chatMessages) => [data, ...chatMessages]);
      };

      socket.on('display all chat', displayAllChatListener);

      // Return the cleanup function to remove the event listener when the component unmounts
      return () => {
        socket.off('display all chat', displayAllChatListener);
      };
    }
  }, [selectedUser, globalChatExpanded]);

  const fetchUserList = async () => {
    try {
      const response = await axios.get('http://localhost:8001/auth/loggedUsers');
      if (response.status >= 200 && response.status < 300) {
        const data = response.data;

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
    socket.on('onlineUsers',(users) => {
      console.log("online Users: "+users);
    });
  };

  const fetchProfileImageByUsername = async (username) => {
    try {
      const response = await axios.get(`http://localhost:8001/image/displayWithUsername/${username}`, {
        responseType: 'blob',
      });

      const imageUrl = URL.createObjectURL(response.data);
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
    const usero = user.id;
    let branch;
    let reciept
    if (!selectedUser) {
      reciept = "GLOBAL";
      branch = 1;
    } else {
      reciept = selectedUser.id;
      branch = 2;
    }

    const messageData = {
      sender: usero,
      reciept: reciept,
      content: userInput,
    };

    if (branch === 1) {
      socket.emit('all chat', messageData);
    } else {
      socket.emit('dm', messageData);
    }
    setUserInput('');

    setTimeout(() => {
      const chatWindow = document.querySelector('.userChatContent');
      chatWindow.scrollTop = chatWindow.scrollHeight;
    }, 50);
  };

  const closeChat = () => {
    setChatExpanded(false);
    setChatMessages([]);
    setGlobalChatExpanded(false);
    socket.emit("close", user);
  };

  const toggleChat = () => {
    setChatExpanded(!chatExpanded);
    socket.emit('Login', user);
    console.log("--------------------"+notif.length);
    setGlobalChatExpanded(false);
  };

  const toggleSearch = () => {
    setSearchVisible(!searchVisible);
    setSearchInput('');
  };

  const toggleGlobalChat = () => {
    if (globalChatExpanded) {
      setGlobalChatExpanded(false);
      setSelectedUser(null);
      setGlobalChatSelected(false);
    } else {
      setGlobalChatExpanded(true);
      setSelectedUser(null);
      setGlobalChatSelected(true);
      fetchGlobalChatHistory();
    }
  };

  const fetchGlobalChatHistory = async () => {
    try {
      const response = await axios.get('http://localhost:8001/socket/getAllChat', {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (response.status === 200) {
        const data = response.data.data;

        // Map through the chat messages and update the sender name for global chat messages
        const updatedChatMessages = data.map((message) => {
          // For global chat messages, set the sender name as "GLOBAL"
          if (message.reciept === "GLOBAL") {
            return { ...message, sender: "GLOBAL" };
          } else {
            return message;
          }
        });

        setChatMessages(updatedChatMessages);
      } else {
        console.error('Failed to fetch global chat history');
      }
    } catch (error) {
      console.error('Error fetching global chat history:', error);
    }
  };

  // Filter the userList based on searchInput
  const filteredUserList = userList.filter((user) =>
    user.username.toLowerCase().includes(searchInput.toLowerCase())
  );

  const handleKeyPress = (e) => {
    // Check if the Enter key is pressed
    if (e.key === 'Enter' && !e.shiftKey) {
      // Prevent the default behavior of the Enter key (new line)
      e.preventDefault();
      // Call the function to send the chat
      handleSendChat();
    }
  };


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
                    <li>Хэрэглэгч олдсонгүй.</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
          {selectedUser && !globalChatSelected && (
            <div className="userChatWindow">
              <div className="userChatHeader">
                <img src={selectedUser.imageUrl} alt="Profile" className="chat-profile-image" />
                <h3>{selectedUser.username}</h3>
                <button className="chat-close" onClick={() => setSelectedUser(null)}>
                  X
                </button>
              </div>
              <div className="chatContent">
      <div className="userChatContent">
        <ul>
          {chatMessages.slice().reverse().map((message, index) => (
            <li
              key={index}
              className={`messageItem ${message.sender_id === user.id ? 'ownMessage' : ''}`}
            >
              <div className="messageContent">
                <div>{message.content}</div>
              </div>
              <div className="chatTime">{formatDateTime(message.createdAt)}</div>
            </li>
          ))}
        </ul>
      </div>
                <div className="userChatInput">
                  <textarea
                    ref={textareaRef}
                    value={userInput}
                    onChange={handleTextareaChange}
                    onKeyPress={handleKeyPress}
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

          {globalChatExpanded && globalChatSelected && (
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
                    {chatMessages.slice().reverse().map((message, index) => (
                      <li key={index} className={message.sender_id === user.id ? 'ownMessage' : ''}>
                        <div className="messageContent">
                          <div>
                            <span>{message.sender_id === 'GLOBAL' ? 'GLOBAL' : message.username}</span>
                          </div>
                          <div>{message.content}</div>
                          <div className="chatTime">{formatDateTime(message.createdAt)}</div>
                        </div>
                      </li>
                    ))}


                  </ul>
                </div>
                <div className="userChatInput">
                  <textarea
                    ref={textareaRef}
                    value={userInput}
                    onChange={handleTextareaChange}
                    onKeyPress={handleKeyPress}
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

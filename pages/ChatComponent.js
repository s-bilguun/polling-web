import React, { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import NotificationBadge from './NotificationBadge';
import OnlineUsers from './OnlineUsers';
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
  const userChatContentRef = useRef(null);
  const [onlineUser, setOnlineUser] = useState();
  let i = 0;

  useEffect(() => {
    // Scroll to the bottom of the userChatContent when it is opened or chatMessages are updated
    if (userChatContentRef.current) {
      userChatContentRef.current.scrollTop = userChatContentRef.current.scrollHeight;
    }
    socket.on('display dm', displayDmListener);

    // Return the cleanup function to remove the event listener when the component unmounts
    return () => {
      socket.off('display dm', displayDmListener);
    };
  }, [userChatContentRef, chatMessages, globalChatExpanded, notif]);


  const formatDateTime = (dateTimeString) => {
    const dateObj = new Date(dateTimeString);
    const now = new Date();
  
    const isToday = dateObj.toDateString() === now.toDateString();
    const isYesterday = new Date(dateObj.getTime() - 86400000).toDateString() === now.toDateString(); // 86400000 is the number of milliseconds in a day
  
    if (isToday) {
      // Format for today
      const hours = dateObj.getHours().toString().padStart(2, '0');
      const minutes = dateObj.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    } else if (isYesterday) {
      // Format for yesterday
      const hours = dateObj.getHours().toString().padStart(2, '0');
      const minutes = dateObj.getMinutes().toString().padStart(2, '0');
      return `Өчигдөр ${hours}:${minutes}`;
    } else if (dateObj.getFullYear() === now.getFullYear()) {
      // Format for this year
      const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
      const day = dateObj.getDate().toString().padStart(2, '0');
      return `${month}-${day}`;
    } else {
      // Format for other years
      const year = dateObj.getFullYear().toString().slice(-2);
      const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
      const day = dateObj.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
  };
  


  useEffect(() => {
    fetchUserList();
    // socket.on('display dm', displayDmListener);

    //   // Return the cleanup function to remove the event listener when the component unmounts
    //   return () => {
    //     socket.off('display dm', displayDmListener);
    //   };
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
      setGlobalChatSelected(false);

      // Clear chat messages when switching users
      setChatMessages([]);


      // Fetch chat history for the selected user

      fetchChatHistory();

      clearNotif(selectedUser);

      // Listen for incoming chat messages for the selected user





    } else if (globalChatExpanded) {
      // Clear chat messages when switching to global chat
      setChatMessages([]);

      // Fetch global chat history
      fetchGlobalChatHistory();

      // Listen for incoming chat messages for global chat
      const displayAllChatListener = (data) => {
        // console.log(data.username)

        setChatMessages((chatMessages) => [data, ...chatMessages]);
      };

      socket.on('display all chat', displayAllChatListener);

      // Return the cleanup function to remove the event listener when the component unmounts
      return () => {
        socket.off('display all chat', displayAllChatListener);
      };
    }
  }, [selectedUser, globalChatExpanded]);

  const clearNotif = (data) => {
    // Use the filter method to create a new array with elements that do not meet the condition
    const filteredArray = notif.filter(item => {
      // Check if the item has a non-null sender_id and if data.id is not equal to the item's sender_id
      return item !== null && item !== data.id;
    });

    // Check if the selected user matches the condition before updating the notifArray
    if (selectedUser && selectedUser.id === data.id) {
      setNotification(filteredArray); // Update the notifArray with the filteredArray
    }
  };



  const displayDmListener = (data) => {
    if ((!selectedUser || selectedUser.id !== data.sender_id) && data.recipient_id === user.id) {
      setNotification((allNotification) => [...allNotification, data.sender_id]);
      console.log("Chat added to notifications!!!");
    } else if (
      (data.sender_id === user.id && data.recipient_id === selectedUser.id) ||
      (data.sender_id === selectedUser.id && data.recipient_id === user.id)
    ) {
      setChatMessages((prevChatMessages) => [data, ...prevChatMessages]);
    }

    console.log("notif list: " + notif);
  };

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
    socket.on('onlineUsers', (users) => {
      console.log("online Users: " + users);
      setOnlineUser(users);
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

    if (!userInput.trim()) {
      // If userInput is empty, return without sending the message
      return;
    }
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
    setSelectedUser(null)
   // socket.emit("close", user);
  };

  const toggleChat = () => {
    setChatExpanded(!chatExpanded);
    socket.emit('Login', user);
    console.log("--------------------" + notif.length);
    setGlobalChatExpanded(false);

  };

  const toggleSearch = () => {
    setSearchVisible(!searchVisible);
    setSearchInput('');
  };

  const toggleGlobalChat = () => {
    if (globalChatExpanded) {
      setGlobalChatExpanded(false);
      setSelectedUser();
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
  useEffect(() => {
    // Listen for incoming chat messages
    const newMessageListener = (messageData) => {
      setChatMessages((prevChatMessages) => [messageData, ...prevChatMessages]);

      // Update the notif array to include the sender_id of the new message
      if (selectedUser && selectedUser.id !== messageData.sender_id) {
        setNotification((prevNotif) => [...new Set([...prevNotif, messageData.sender_id])]);
      }
    };

    socket.on('newMessage', newMessageListener);

    // Return the cleanup function to remove the event listener when the component unmounts
    return () => {
      socket.off('newMessage', newMessageListener);
    };
  }, [selectedUser]);


  if (!user) { // Makes chat not show up if user is not logged and there is no token
    return null; // Return null or any other component when user is not logged in 
  }

  return (
    <div className="chatContainer">
      {!chatExpanded && (
        <button className="chatToggleButton" onClick={toggleChat}>
          <img src="/chat.png" alt="Chat" />
          <NotificationBadge count={notif.length} />
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
              <div className="userList chatUserList">
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
                     filteredUserList.map((user) => {
                      const isUnreadMessage = notif.includes(user.id); // Check if the user's id is in the notif array

                      // console.log("user.id", user.id);
                      // console.log("notif list 2: ", notif);
                      return (
                        <li
                          key={user.username}
                          onClick={() => setSelectedUser(user)}
                          className={`${selectedUser === user ? 'selectedUser' : ''} ${isUnreadMessage ? 'boldUsername' : ''}`}
                        >
                          {user.imageUrl && (
                            <div className="userProfileImage">
                              <img src={user.imageUrl} alt="Profile" className="chat-profile-image" />
                              <div className={onlineUser && onlineUser.includes(user.id) ? 'online-users' : ''}></div>
                              </div>
                          )}
                          <div className="userInfo">
                            <span className="chat_username">{user.username}</span>
                          </div>
                        </li>
                      );
                    })
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
                <div className="userChatContent" ref={userChatContentRef}>
                  <ul>
                    {chatMessages.slice().reverse().map((message, index) => (
                      <li
                        key={index}
                        className={`messageItem ${message.sender_id === user.id ? 'ownMessage' : ''}`}
                      >
                        <div className="messageContent">

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
                <div className="userChatContent" ref={userChatContentRef}>
                  <ul>
                    {chatMessages.slice().reverse().map((message, index) => (
                      <li
                        key={index}
                        className={`messageItem ${message.sender_id === user.id ? 'ownMessage' : ''}`}
                      >
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

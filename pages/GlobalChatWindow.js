import React from 'react';
const toggleGlobalChat = () => {
    setGlobalChatExpanded(!globalChatExpanded);
    setSelectedUser(null); // Deselect user when opening global chat
    if (!globalChatExpanded) {
      fetchGlobalChatHistory();
    }
  };


const GlobalChatWindow = ({ chatMessages, userInput, handleTextareaChange, handleSendChat }) => {
  return (
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
              <li key={index}>
                <div>{message.sender}: {message.content}</div>
                <div>{message.createdAt}</div>
              </li>
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
  );
};

export default GlobalChatWindow;

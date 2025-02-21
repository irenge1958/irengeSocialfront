// EmojiPickerComponent.js
import React, { useState } from 'react';
import EmojiPicker from 'emoji-picker-react';

const EmojiPickerComponent = ({ onSelectEmoji }) => {
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const togglePicker = () => setIsPickerOpen((prev) => !prev);

  const handleEmojiClick = (event, emojiObject) => {
    console.log('Selected Emoji:', event.emoji );
    onSelectEmoji(event.emoji); // Pass emoji to parent component
    setIsPickerOpen(false); // Close picker after selection
  };

  return (
    <div>
      <span style={{fontSize:'20px',cursor:'pointer'}} onClick={togglePicker}>😊</span>
      {isPickerOpen && (
        <EmojiPicker style={{ position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,  }} onEmojiClick={handleEmojiClick} />
      )}
    </div>
  );
};

export default EmojiPickerComponent;

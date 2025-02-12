// EmojiPickerComponent.js
import React, { useState } from 'react';
import EmojiPicker from 'emoji-picker-react';

const EmojiPickerComponent = ({ onSelectEmoji }) => {
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const togglePicker = () => setIsPickerOpen((prev) => !prev);

  const handleEmojiClick = (event, emojiObject) => {
    console.log('Selected Emoji:', event.emoji );
    onSelectEmoji( event.emoji); // Pass emoji to parent component
    setIsPickerOpen(false); // Close picker after selection
  };

  return (
    <div>
      <span style={{fontSize:'20px',cursor:'pointer'}} onClick={togglePicker}>😊</span>
      {isPickerOpen && (
        <EmojiPicker style={{position:'absolute'}} onEmojiClick={handleEmojiClick} />
      )}
    </div>
  );
};

export default EmojiPickerComponent;

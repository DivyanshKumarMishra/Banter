import React from 'react'
import EmojiPicker from 'emoji-picker-react';
import { FaceSmileIcon } from '@heroicons/react/20/solid';

function EmojiPick({handleEmojiClick = () => {}, emojiRef = null, open = false, handleEmoji = () => {}}) {
  return (
    <div className='relative'>
      <button type="button" onClick={handleEmojiClick}>
        <FaceSmileIcon 
          className="mt-1 size-6 text-primary" />
      </button>
      <div className='absolute bottom-16 right-0' ref={emojiRef}>
        <EmojiPicker 
          open={open}
          onEmojiClick={handleEmoji}
          autoFocusSearch={true}
          lazyLoadEmojis={true}
          width={300}
          height={400}/>
      </div>
    </div>
  )
}

export default EmojiPick

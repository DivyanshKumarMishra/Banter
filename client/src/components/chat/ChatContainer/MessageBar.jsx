import { useState, useRef, useEffect } from 'react';
import { PaperAirplaneIcon } from '@heroicons/react/20/solid';
import { useSelector } from 'react-redux';
import EmojiPick from '../../common/EmojiPick';
import { useSocket } from '../../../contexts/SocketContext';

function MessageBar() {
  const {socket} = useSocket();
  const { selectedChat } = useSelector((state) => state.chat);
  const { userInfo } = useSelector((state) => state.user);
  const [message, setMessage] = useState('');
  const [open, setOpen] = useState(false);
  const emojiRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeout = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside, true);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
    };
  }, [emojiRef]);

  const handleInputChange = (e) => {
    setMessage(e.target.value);
    if (!isTyping) {
      setIsTyping(true);
      socket.emit('typing', { to: selectedChat._id, from: userInfo._id });
    }

    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      setIsTyping(false);
      socket.emit('stop-typing', { to: selectedChat._id, from: userInfo._id });
    }, 2000);
  }

  const handleEmojiClick = () => {
    setOpen(true);
  };

  const handleEmoji = (emoji) => {
    setMessage((msg) => `${msg}${emoji.emoji}`);
  };

  const sendSocketMessage = (message) => {
    socket.emit('send-message', message);
    setMessage('');
  };

  const handleSend = () => {
    if (!message) return;
    sendSocketMessage({
      sender: userInfo._id,
      receiver: selectedChat._id,
      messageType: 'text',
      content: message,
    });
  };

  return (
    <div className="h-[10vh] bg-white border-t-2 border-indigo-200 flex justify-center items-center px-4">
      <div className="flex-1 flex items-center">
        <div className="flex flex-1 items-center bg-white border-2 border-indigo-200 rounded-md px-3 py-1 gap-3">
          <textarea
            id="msgInput"
            name="msgInput"
            rows={1}
            className="flex-1 resize-none bg-transparent focus:outline-none text-black break-words overflow-y-auto max-h-[20vh]"
            placeholder="Enter message"
            value={message}
            onChange={handleInputChange}
          />
          <EmojiPick
            handleEmojiClick={handleEmojiClick}
            emojiRef={emojiRef}
            open={open}
            handleEmoji={handleEmoji}
          />
        </div>
        <button
          type="button"
          onClick={handleSend}
          disabled={!message}
          className="ml-3 bg-primary text-white p-2 rounded-full transition duration-300 disabled:bg-gray-400 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          <PaperAirplaneIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

export default MessageBar;

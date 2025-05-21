import { useRef, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import protectedAxios from '../../../services/axiosService';
import { CHAT_URL } from '../../../utils/constants';
import { addMessagesToChat } from '../../../redux/slices/chatSlice';
import Spinner from '../../common/Spinner';

function MessageContainer() {
  const dispatch = useDispatch();
  const { selectedChat, selectedChatMessages, typingUsers } = useSelector(
    (state) => state.chat
  );
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    async function getChats() {
      try {
        if (selectedChat._id) {
          setLoading(true);
          const response = await protectedAxios.get(
            `${CHAT_URL}/${selectedChat._id}`
          );
          if (response.status === 200) {
            dispatch(
              addMessagesToChat({
                messages: response.data.messages,
                multiple: true,
              })
            );
          }
        }
      } catch (error) {
        // console.log(error.message);
        setLoading(false);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      }
    }

    getChats();
  }, [selectedChat]);

  useEffect(() => {
    scrollRef.current &&
      scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedChatMessages]);

  const renderMessages = () => {
    let lastDate = null;
    return selectedChatMessages?.map((message, index) => {
      const messageDate = moment(message.timestamp).format('YYYY-MM-DD');
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;
      return (
        <div key={index}>
          {showDate && (
            <div className="text-center text-gray-500 my-2">
              {moment(message.timestamp).format('LL')}
            </div>
          )}
          {renderDmMessage(message)}
        </div>
      );
    });
  };

  const renderDmMessage = (message) => (
    <div
      className={`${
        message.sender !== selectedChat._id ? 'text-right' : 'text-left'
      }`}
    >
      {
        <div
          className={`${
            message.sender !== selectedChat._id
              ? 'bg-primary text-white'
              : 'bg-white text-primary'
          } p-2 rounded-lg my-2 ${
            message.sender !== selectedChat._id ? 'ml-auto' : 'mr-auto'
          } p-3 my-1 inline-block max-w-[50%] break-words`}
        >
          {message.content}
        </div>
      }
      
      <div className="text-xs text-gray-600">
        {moment(message.timestamp).format('LT')}
      </div>
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 w-full">
      {loading ? (
        <div className="h-full w-full flex flex-col items-center justify-center gap-2">
          <Spinner className="size-36" />
          <p className="text-lg text-gray-500">{'loading chats...'}</p>
        </div>
      ) : (
        <>
          {renderMessages()}
          {typingUsers.includes(selectedChat._id) && (
            <div className='text-sm text-gray-500 mb-2 text-left'>
              {selectedChat.name.split(' ')[0] || 'User'} is typing...
            </div>
          )}
          <div ref={scrollRef}></div>
        </>
      )}
    </div>
  );
}

export default MessageContainer;

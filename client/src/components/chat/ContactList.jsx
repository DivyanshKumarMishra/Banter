import { useSelector, useDispatch } from 'react-redux';
import { setChatInfo } from '../../redux/slices/chatSlice';
import getShortName from '../../utils';
import Avatar from '../common/Avatar';
import moment from 'moment';
import { useSocket } from '../../contexts/SocketContext';

function ContactList({ contacts = [], handleSidebar = () => {} }) {
  const { userInfo } = useSelector((state) => state.user);
  const { selectedChat } = useSelector((state) => state.chat);
  const {socket} = useSocket()
  const dispatch = useDispatch();

  const handleClick = (contact) => {
    if (contact._id === selectedChat?._id) return;
    const chatInfo = {
      selectedChat: contact,
      selectedChatMessages: [],
    };
    dispatch(setChatInfo(chatInfo));
    socket.emit('check-receiver-status', { receiver_id: contact._id, sender_id: userInfo._id});
    handleSidebar();
  };

  return (
    <div className="mt-1">
      {contacts?.map((contact) => {
        return (
          <div
            key={contact._id}
            className={`flex items-center justify-start gap-4 py-2 px-3 hover:bg-indigo-400 cursor-pointer ${
              selectedChat && selectedChat._id === contact._id
                ? 'bg-indigo-400'
                : 'bg-primary'
            }`}
            onClick={() => handleClick(contact)}
          >
            {(() => {
              const { name, _id, lastMessageTime } = contact;
              return (
                <>
                  <Avatar
                    className="bg-gray-200 size-10 md:size-12 lg:size-12 rounded-full shadow-md"
                    textSize="text-sm md:text-base lg:text-lg"
                    color="#ffffff"
                    text={getShortName(name)}
                  />
                  <div className="flex justify-between items-center h-full w-full">
                    <div className="flex flex-col space-y-1">
                      <div className="text-sm md:text-base font-semibold text-white">
                        {name}
                      </div>
                      {/* <div className="text-xs md:text-sm font-semibold text-gray-200">{email}</div> */}
                    </div>
                    {lastMessageTime && (
                      <div className="text-xs md:text-sm font-base text-gray-300">
                        {moment(lastMessageTime).format('LT')}
                      </div>
                    )}
                  </div>
                </>
              );
            })()}
          </div>
        );
      })}
    </div>
  );
}

export default ContactList;

import { useState } from 'react'
import { useSelector } from 'react-redux'
import ChatContainer from '../../components/chat/ChatContainer/ChatContainer'
import ContactsContainer from '../../components/chat/ContactsBar/ContactsContainer'
import EmptyChatContainer from '../../components/chat/EmptyChat/EmptyChatContainer'
import Notification from '../../components/common/Notification'

function Chat() {
  const { selectedChat } = useSelector((state) => state.chat)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [notificationText, setNotificationText] = useState({
      message: '',
      description: '',
      type: '',
    });
  const [show, setShow] = useState(false);

  const handleSidebar = () => {
    setIsSidebarOpen(prev => !prev)
  }

  return (
    <div className="h-screen flex flex-col md:flex-row text-white bg-gray-200 overflow-hidden">
      <Notification
        message={notificationText.message}
        description={notificationText.description}
        show={show}
        type={notificationText.type}
        onClose={() => setShow(false)}
      />
      <div
        className={`${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform transform w-full md:w-1/3 bg-primary fixed top-0 left-0 h-full z-20 md:relative`}
      >
        <ContactsContainer handleSidebar={handleSidebar} setNotificationText={setNotificationText} setShow={setShow}/>
      </div>
      <div className="h-full flex-1 bg-indigo-100">
        {selectedChat ? <ChatContainer handleSidebar={handleSidebar}/> : <EmptyChatContainer handleSidebar={handleSidebar}/>}
      </div>
    </div>
  )
}

export default Chat
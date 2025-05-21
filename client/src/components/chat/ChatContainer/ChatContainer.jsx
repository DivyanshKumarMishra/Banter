import ChatHeader from "./ChatHeader"
import MessageBar from "./MessageBar"
import MessageContainer from "./MessageContainer"

function ChatContainer({handleSidebar = () => {}}) {
  return (
    <div className="h-screen bg-indigo-100 flex flex-col text-black">
      <ChatHeader handleSidebar={handleSidebar}/>
      <MessageContainer/>
      <MessageBar/>
    </div>
  )
}

export default ChatContainer

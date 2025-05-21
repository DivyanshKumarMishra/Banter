import { XMarkIcon, ArrowRightIcon } from '@heroicons/react/20/solid'
import {useDispatch, useSelector} from 'react-redux'
import { closeChat, getDMs } from '../../../redux/slices/chatSlice'
import getShortName from '../../../utils'
import Avatar from '../../common/Avatar'
import { useSocket } from '../../../contexts/SocketContext'

function ChatHeader({handleSidebar = () => {}}) {
  const {removeTypingListeners} = useSocket()
  const {selectedChat, onlineStatusMap} = useSelector(state => state.chat)
  const dispatch = useDispatch()
  const {name, email} = selectedChat

  return (
    <div className='h-[10vh] bg-white border-b-2 border-indigo-200 flex flex-row'>
      <button className='md:hidden' onClick={handleSidebar}>
        <ArrowRightIcon className='text-white bg-primary size-6 focus:border-none focus:outline-none duration-300 transition-all' />
      </button>
      <div className='flex gap-5 items-center justify-between w-full px-5 md:px-10'>
        <div className='flex gap-3 items-center justify-center'>
          <div className="h-full flex items-center justify-start gap-4 py-2 px-3 cursor-pointer">
            <Avatar
              className="bg-gray-200 size-12 rounded-full shadow-md"
              textSize="text-base"
              color='#8669ff'
              text={getShortName(name)}
            />
            <div className="text-base lg:text-xl font-semibold text-gray-500">
              {name || email}
              <div className="text-sm text-gray-400">{onlineStatusMap[selectedChat._id] ? 'Online' : 'Offline'}</div>
            </div>
          </div>
        </div>
        <div className='flex gap-5 items-center justify-center'>
          <button onClick={async () => {
            dispatch(getDMs());
            dispatch(closeChat())
            removeTypingListeners()
          }}>
            <XMarkIcon className='text-primary hover:text-white hover:bg-primary rounded-full size-6 focus:border-none focus:outline-none duration-300 transition-all' />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatHeader

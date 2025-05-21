import {useEffect, useRef, useContext, createContext, useCallback} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import setupSocket from '../services/socketService';
import { addMessagesToChat, removeTypingUser, setTypingUser, sortDMs, updateUserStatus, getDMs } from '../redux/slices/chatSlice';

const SocketContext = createContext(null);

export function useSocket() {
  return useContext(SocketContext);
}

function SocketProvider({children}) {
  const socket = useRef(null);
  const {userInfo} = useSelector(state => state.user)
  const dispatch = useDispatch()
  const chat = useSelector(state => state.chat)
  const chatRef = useRef(chat)
  const dmsLoading = chat.dmsLoading

  const handleTyping = useCallback(({ from }) => {
    dispatch(setTypingUser(from));
  }, [dispatch]);

  const handleStopTyping = useCallback(({ from }) => {
    dispatch(removeTypingUser(from));
  },[dispatch]);

  const handleUserStatusChanged = ({ user_id, online }) => {
    dispatch(updateUserStatus({ user_id, online }));
  };

  const handleDisconnect = useCallback(() => {
    if (socket.current) {
      const {dms} = chatRef.current
      socket.current.emit('pre-disconnect', {
        user_id: userInfo._id,
        dms: dms.map(dm => dm._id).join(','),
      });

      socket.current.off('update-receiver-status', handleUserStatusChanged);
      socket.current.off('user-status-changed', handleUserStatusChanged);
      socket.current.disconnect();
    }
  }, [userInfo, socket]);

  const removeTypingListeners = () => {
    if (socket.current) {
      socket.current.off('typing', handleTyping);
      socket.current.off('stop-typing', handleStopTyping);
    }
  }; 

  useEffect(() => {
      chatRef.current = chat
  }, [chat])

  useEffect(() => {
    if (userInfo) {
      dispatch(getDMs());
    }
  }, [userInfo, dispatch]);

  useEffect(() => {
    if(userInfo && !dmsLoading){
      const {dms} = chatRef.current
      socket.current = setupSocket({user_id: userInfo._id, dms: dms.map(dm => dm._id).join(',')})

      socket.current.on('connect', () => {
        socket.current.emit('online', { user_id: userInfo._id });
      });

      const receiveMessage = (message) => {
        const {selectedChat} = chatRef.current    
        if (selectedChat?._id === message.sender._id || selectedChat?._id === message.receiver._id){
          dispatch(addMessagesToChat({messages: message, multiple: false}));
        }
        dispatch(sortDMs({message, userId: userInfo._id}))
      };

      socket.current.on('receive-message', receiveMessage);

      // Typing indicators
      socket.current.on('typing', handleTyping);
      socket.current.on('stop-typing', handleStopTyping);
      socket.current.on('user-status-changed', handleUserStatusChanged);
      socket.current.on('update-receiver-status', handleUserStatusChanged);

      const handleBeforeUnload = () => {
        handleDisconnect()
      };

      window.addEventListener('beforeunload', handleBeforeUnload);

      return () => {
        handleDisconnect()
      };
    }
  }, [userInfo, dmsLoading, dispatch]);

  return (
    <SocketContext.Provider value={{socket: socket.current, removeTypingListeners}}>
      {children}
    </SocketContext.Provider>
  )
}

export default SocketProvider

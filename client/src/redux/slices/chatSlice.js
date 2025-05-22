import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import protectedAxios from '../../services/axiosService'
import { DM_URL } from '../../utils/constants'

const initialState = {
  selectedChat: null,
  selectedChatMessages: [],
  userOnline: false,
  dms: [],
  dmsLoading: false,
  typingUsers: [],
  onlineStatusMap: {},
}

const getDMs = createAsyncThunk('chat/getDMs', async (args, thunkApi) => {
  try {
    const response = await protectedAxios.get(DM_URL)
    if(response.status === 200){
      // console.log(response.data.dms);
      return response.data.dms
    }
  } catch (error) {
    return thunkApi.rejectWithValue(error.response.data)
  }
})

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setChatInfo: (state, action) => {
      state.selectedChat = action.payload.selectedChat;
      state.selectedChatMessages = action.payload?.selectedChatMessages
    },
    addMessagesToChat: (state, action) => {
      const { multiple, messages } = action.payload;
      const normalizedMessages = Array.isArray(messages) ? messages : [messages];
      const formattedMessages = normalizedMessages.map(({ sender, receiver, messageType, content, fileUrl, timestamp }) => ({
        messageType,
        content,
        fileUrl,
        timestamp,
        receiver: typeof receiver === 'string' ? receiver : receiver._id,
        sender: typeof sender === 'string' ? sender : sender._id
      }));
    
      state.selectedChatMessages = multiple
        ? formattedMessages
        : [...(state.selectedChatMessages || []), ...formattedMessages]
    },
    closeChat: (state) => {
      state.selectedChat = null;
      state.selectedChatMessages = [];
    },
    setDMs: (state, action) => {
      state.dms = action.payload
    },
    sortDMs: (state, action) => {
      const { message, userId } = action.payload
      const fromId = message.sender._id === userId ? message.receiver._id : message.sender._id
      const fromData = message.sender._id === userId ? message.receiver : message.sender
      const index = state.dms.findIndex(dm => dm._id === fromId)
      if(index !== -1 && index !== undefined){
        const [recent_dm] = state.dms.splice(index,1)
        state.dms.unshift(recent_dm)
      }else{
        state.dms.unshift(fromData)
      }
    },
    setTypingUser: (state, action) => {
      if (!state.typingUsers.includes(action.payload)) {
        state.typingUsers.push(action.payload);
      }
    },
    removeTypingUser: (state, action) => {
      state.typingUsers = state.typingUsers.filter((id) => id !== action.payload);
    },
    updateUserStatus: (state, action) => {
      const { user_id, online } = action.payload;
      state.onlineStatusMap[user_id] = online;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getDMs.pending, (state) => {
      state.dmsLoading = true
    })
    builder.addCase(getDMs.fulfilled, (state, action) => {
      state.dmsLoading = false
      state.dms = action.payload
    })
    builder.addCase(getDMs.rejected, (state) => {
      state.dmsLoading = false
    })
  }
})

export const {setDMs, sortDMs, addMessagesToChat, closeChat, setChatInfo, setTypingUser, removeTypingUser, updateUserStatus} = chatSlice.actions
export {getDMs}
export default chatSlice.reducer
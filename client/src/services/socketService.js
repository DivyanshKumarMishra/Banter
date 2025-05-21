import { io } from "socket.io-client";
import {SERVER_URL} from '../utils/constants'

const setupSocket = (queryObject) => {
  const socketOptions = {
    withCredentials: true,
  }

  if(queryObject) socketOptions.query = queryObject

  const socket = io(SERVER_URL, socketOptions)
  return socket
}

export default setupSocket
require('dotenv').config()
const {Server: SocketIoServer} = require('socket.io')
const Message = require('../models/message')
const mongoose = require('mongoose')
const {ORIGIN} = require('../utils/constants')

const userSocketMap = new Map()  

const setupCircuit = async (server) => {
  const io = new SocketIoServer(server, {
    cors: {
      origin: ORIGIN,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      credentials: true,
    }
  })

  const disconnect = async (socket) => {
    // Remove user from the map
    const {user_id, dms} = socket
    if (userSocketMap.has(user_id)) {
      // console.log(`User disconnected: ${user_id}`);
      userSocketMap.delete(user_id);
    }

    // notify all the dm contacts that the user has gone offline
    if (Array.isArray(dms) && dms.length > 0) {
      dms.forEach(dmId => {
        const contactSocketId = userSocketMap.get(dmId);
        if (contactSocketId) {
          io.to(contactSocketId).emit('user-status-changed', {
            user_id,
            online: false,
          });
        }
      });
    }
  }

  const sendMessage = async (message) => {
    const {content, sender, receiver} = message
    const senderSocketId = userSocketMap.get(sender)
    const receiverSocketId = userSocketMap.get(receiver)
    const new_message = await new Message({content, sender, receiver}).save({new: true})
    const db_message = await Message.findById(new_message._id).populate([
      { path: 'sender', select: '_id name email' },
      { path: 'receiver', select: '_id name email'} 
    ])
    
    receiverSocketId && io.to(receiverSocketId).emit('receive-message', db_message)
    senderSocketId && io.to(senderSocketId).emit('receive-message', db_message)
  }

  const updateReceiverStatus = ({ receiver_id, sender_id }) => {
    const receiver_online = userSocketMap.has(receiver_id);
    const senderSocketId = userSocketMap.get(sender_id);
    io.to(senderSocketId).emit('update-receiver-status', {
      user_id: receiver_id,
      online: receiver_online
    });
  };

  io.on('connection', (socket) => {
    const user_id = socket.handshake.query.user_id
    const dms = socket.handshake.query.dms?.split(',') || [];

    if (user_id) {
      // console.log(`User connected: ${user_id} with socket ID: ${socket.id}`)
      userSocketMap.set(user_id, socket.id)
      // console.log(dms?.length);
      if(dms?.length > 0) {
        dms.forEach(dm => {
          const contactSocketId = userSocketMap.get(dm);
          if (contactSocketId) {
            io.to(contactSocketId).emit('user-status-changed', {
              user_id: user_id,
              online: true,
            });
          }
        })
      }
    } else {
      console.log('User ID not provided')
    }

    socket.on('send-message', sendMessage)
    socket.on('check-receiver-status', updateReceiverStatus)

    // Typing event
    socket.on('typing', ({ to, from }) => {
      const receiverSocketId = userSocketMap.get(to)
      io.to(receiverSocketId).emit('typing', { from });
    });

    // Stop typing event
    socket.on('stop-typing', ({ to, from }) => {
      const receiverSocketId = userSocketMap.get(to)
      io.to(receiverSocketId).emit('stop-typing', { from });
    });

    socket.on('pre-disconnect', ({ user_id, dms }) => {
      socket.user_id = user_id;
      socket.dms = dms?.split(',') || [];
    });
    
    // on disconnection request
    socket.on('disconnect', () => {
      disconnect(socket)
    })
  })

  return io
}

module.exports = { setupCircuit }
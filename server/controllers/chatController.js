const Message = require('../models/message')
const { getCustomError } = require("../utils/funcs")

const getMessages = async (req, res, next) => {
  try {
    const user1 = req.user._id 
    const user2 = req.params.userId 
    if(!user1 || !user2) throw ({message: 'Could not load older messages', status: 400, cause: 'Sender and receiver ids are required'})

    const messages = await Message.find({
      $or: [
        { sender: user1, receiver: user2 },
        { sender: user2, receiver: user1 }
      ],
    })
    .sort({ timestamp: 1 })
    
    if(!messages) return {message: 'Could not load older messages', status: 404}
    return res.status(200).json({messages})
  } catch (error) {
    const {status, message, cause} = getCustomError(error)
    return res.status(status).json({message, cause});
  }
}

module.exports = getMessages
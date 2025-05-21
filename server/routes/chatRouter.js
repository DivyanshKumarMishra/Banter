const express = require('express')
const chatRouter = express.Router()
const getMessages = require('../controllers/chatController')

chatRouter.get('/get-messages/:userId', getMessages)

module.exports = chatRouter
const express = require('express')
const {getUserInfo, searchContacts, getDMs} = require('../controllers/userController')
const userRouter = express.Router()

userRouter.get('/user-info', getUserInfo)
userRouter.get('/search-contacts/:searchText', searchContacts)
userRouter.get('/get-dms', getDMs)

module.exports = userRouter
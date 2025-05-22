const { getCustomError } = require("../utils/funcs")
const User = require("../models/user")
const Message = require("../models/message")
const mongoose = require('mongoose')

const getUserInfo = (req, res, next) => {
  try {
    const user = req.user
    return res.status(200).json({user})
  } catch (error) {
    const {status, message, cause} = getCustomError(error)
    return res.status(status).json({message, cause})
  }
}

const searchContacts = async (req, res, next) => {
  try {
    const searchText = req.params.searchText
    if(!searchText) throw ({status: 400, message: 'Enter a valid search text'})
    const sanitizedText = searchText.replace(/[^a-zA-Z0-9\s]/g, '') 
    const regex = new RegExp(sanitizedText, 'i')
    const contacts = await User.find({
      $and: [
        {_id: {$ne: req.user._id}},
        {$or: [{name: regex}, {email: regex}]}
      ]
    })
    if(contacts.length <= 0) throw ({status: 404, message: 'Contacts not found'})
    return res.status(200).json({contacts})
  } catch (error) {
    const {status, message, cause} = getCustomError(error)
    return res.status(status).json({message, cause})
  }
}

const getDMs = async (req, res, next) => {
  try {
    let userId = req.user._id
    if(!userId) throw ({message: 'Could not load DMs', status: 400, cause: 'User id is required'})
    userId = new mongoose.Types.ObjectId(userId)
  
    const dms = await Message.aggregate([
      {$match: {$or: [{sender: userId}, {receiver: userId}]}},
      {$sort: {timestamp: -1}},
      {$group: {
        _id: {
          $cond: {
            if: {$eq: ["$sender", userId]},
            then: "$receiver",
            else: "$sender"
          }
        },
        lastMessageTime: {$first: '$timestamp'}
      }},
      {$lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'contactInfo'
      }},
      {$unwind: '$contactInfo'},
      {$project: {
        _id: 1,
        lastMessageTime: 1,
        name: '$contactInfo.name',
        email: '$contactInfo.email',
        image: '$contactInfo.image',
        color: '$contactInfo.color'
      }},
      {$sort: {lastMessageTime: -1}}
    ])
    if(dms.length <= 0) throw ({message: 'Could not load DMs', status: 400})
    return res.status(200).json({dms})
  } catch (error) {
    const {status, message, cause} = getCustomError(error)
    return res.status(status).json({message, cause})
  }
}

module.exports = {getUserInfo, searchContacts, getDMs}
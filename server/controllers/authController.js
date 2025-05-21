const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { body, validationResult } = require('express-validator')
const User = require('../models/user')
const {JWT_SECRET, SALT} = require('../utils/constants')
const {TOKEN_EXPIRY, MILLISECONDS_PER_SECOND} = require('../utils/times')
const { getCustomError } = require('../utils/funcs')

const signup = [
  body('name')
    .isLength({min:3})
    .withMessage('name must be at least 3 characters long')
    .trim()
    .matches(/^[a-zA-Z\s'-]+$/)
    .withMessage("name must only contain letters, spaces, apostrophes, or hyphens"),
  body('email')
    .trim()
    .isEmail()
    .withMessage('enter a valid email')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/\d/)
    .withMessage('Password must contain at least one number')
    .matches(/[@$!%*?&^#(){}[\]<>.,:;'"\\|/~_+=-]/)
    .withMessage('Password must contain at least one special character'),

  async (req, res, next) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        throw ({status:400, message: 'Validation Errors', cause: errors.array()})
      }
      const {name, email, password} = req.body
      const user = await User.findOne({email})
      if(user) throw ({status: 400, message: 'Email already taken'})
      const hash_pass = await bcrypt.hash(password, SALT); 
      await new User({name, email, password: hash_pass}).save()
      return res.status(201).json({message: 'Account created successfully'})
    } catch (error) {
      const {status, message, cause} = getCustomError(error) 
      return res.status(status).json({message, cause})
    }
  }
]

const login = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('enter a valid email')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/\d/)
    .withMessage('Password must contain at least one number')
    .matches(/[@$!%*?&^#(){}[\]<>.,:;'"\\|/~_+=-]/)
    .withMessage('Password must contain at least one special character'),

  async (req, res, next) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        throw ({status:400, message: 'Validation Errors', cause: errors.array()})
      }
      const {email, password} = req.body
      const user = await User.findOne({email})
      if(!user) throw ({message: 'User does not exist'})
      const match = await bcrypt.compare(password, user.password)
      if(!match) throw ({message: 'Invalid password'})
      const token = jwt.sign({_id:user._id, email:user.email, name:user.name}, JWT_SECRET, {expiresIn: TOKEN_EXPIRY})
      res.cookie('authToken', token, {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production' ? true : false,
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
        maxAge: TOKEN_EXPIRY * MILLISECONDS_PER_SECOND
      })
      return res.status(200).json({user: {name: user.name, email: user.email, _id: user._id}})
    } catch (error) {
      const {status, message, cause} = getCustomError(error)
      console.log(status, message, cause)
      return res.status(status).json({message, cause})
    }
  }
]

const logout = (req, res, next) => {
  try {
    res.clearCookie('authToken', {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production' ? true : false,
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
    })
    return res.status(200).json({message: 'You have been signed out'})
  } catch (error) {
    const {status, message, cause} = getCustomError(error)
    return res.status(status).json({message, cause})
  }
}

module.exports = { signup, login, logout }
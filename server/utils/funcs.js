const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../utils/constants')

const default_status = 500
const default_message = 'Something went wrong'

const getCustomError = (error) => {
  const status = error.status || default_status
  const message = error.status === default_status ? default_message : (error.message || default_message)
  let cause;
  if(error.cause){
    if(typeof error.cause === 'string') cause = error.cause
    else{
      let errorsObj = {}
      console.log(error)
      error.cause.forEach(err => {
        errorsObj[err.path] = errorsObj[err.path] ? `${errorsObj[err.path]}, ${err.msg}` : err.msg
      })
      cause = errorsObj
    }
  }
  return {status, message, cause}
}

const getUserDataFromToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, (err, payload) => {
      if(err) return reject(err)
      resolve(payload)
    })
  })
}

module.exports = {getCustomError, getUserDataFromToken}
const {getUserDataFromToken, getCustomError} = require('../utils/funcs')

const verifyToken = async (req, res, next) => {
  try {
    const {authToken} = req.cookies
    if(!authToken) throw res.status(203).json({message: 'Token not found'})
    const user = await getUserDataFromToken(authToken)
    if(!user.name) throw res.status(401).json({message: 'Unauthorized'})
    req.user = user
    next()
  } catch (error) {
    const {status, message, cause} = getCustomError(error)
    return res.status(status).json({message, cause})
  } 
}

module.exports = verifyToken 
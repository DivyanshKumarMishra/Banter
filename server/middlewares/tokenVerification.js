const {getUserDataFromToken, getCustomError} = require('../utils/funcs')

const verifyToken = async (req, res, next) => {
  try {
    const {authToken} = req.cookies
    if(!authToken) throw ({message: 'Unauthorized', status: 401, cause: 'No auth token found'})
    const user = await getUserDataFromToken(authToken)
    if(!user.name) throw ({message: 'Unauthorized', status: 401})
    req.user = user
    next()
  } catch (error) {
    const {status, message, cause} = getCustomError(error)
    return res.status(status).json({message, cause})
  } 
}

module.exports = verifyToken 
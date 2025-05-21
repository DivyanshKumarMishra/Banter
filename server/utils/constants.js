require('dotenv').config()
const ORIGIN = process.env.PROD_ORIGIN
const PORT = process.env.PORT || 3000
const URI = process.env.MONGO_DB_URI
const JWT_SECRET = process.env.JWT_SECRET
const SALT = 12


module.exports = {ORIGIN, PORT, URI, JWT_SECRET, SALT}
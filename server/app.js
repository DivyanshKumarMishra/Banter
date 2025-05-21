// internal modules
const http = require('http')
const express = require('express')
const app = express()
const server = http.createServer(app)
const mongoose = require('mongoose')
const cors = require('cors')
const cookie_parser = require('cookie-parser')

// local modules
const {setupCircuit} = require('./socket/circuit');
const authRouter = require('./routes/authRouter')
const messageRouter = require('./routes/chatRouter')
const {ORIGIN, PORT, URI} = require('./utils/constants')
const verifyToken = require('./middlewares/tokenVerification')
const userRouter = require('./routes/userRouter')

const cors_options = {
  origin: ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true
}

app.use(cors(cors_options))
app.use(express.urlencoded({extended: true}))
app.use(cookie_parser())
app.use(express.json())

app.use('/api/auth', authRouter)

// middleware to verify user token
app.use(verifyToken)

app.use('/api/user', userRouter)
app.use('/api/chat', messageRouter)

// error response for unregistered route
app.use((req, res, next) => {
  res.status(404).send({error: 'page not found'})
})

async function runServer(){
  try {
    const mongo_db = await mongoose.connect(URI)
    if(mongo_db){
      server.listen(PORT, async () => {
        console.log(`Server running on ${PORT}`);
        setupCircuit(server)
      });
    }else{
      console.log('Error connecting to mongo database');
    }
  } catch (error) {
    console.log('Something went wrong', error.message);
  }
}

runServer()
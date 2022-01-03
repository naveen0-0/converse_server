const express = require('express')
const helmet = require('helmet')
const morgan = require('morgan')
const mongoose = require('mongoose')
const cors = require('cors')
const http = require('http')
const socketio = require('socket.io')
const cookieParser = require('cookie-parser')
const apiRoutes = require('./routes/api')
const authRoutes = require('./routes/auth')
const dotenv = require('dotenv')
const { socketIoLogic } = require('./socket/socket_io_logic')

//@ App Initialization
const app = express()

//@ Server Intializing
const server = http.createServer(app)

//@ Socket IO Intialization
const clientURL = "https://converse-1910.netlify.app"
const io = new socketio.Server(server,{
  cors: {
     origin: clientURL,
     methods: ["GET", "POST"]
  }
})

//@ Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(helmet())
app.use(morgan('tiny'))
app.use(cors())
app.use(cookieParser())
dotenv.config()

//@ Routes

app.get('/', (req,res) => res.send({ message : "Welcome to the converse_server" }))
app.use('/auth',authRoutes)
app.use('/api',apiRoutes)

//@ MongoDB Initialization
mongoose.connect(process.env.MONGO)
        .then(() => console.log("Mongo DB Connection Successful"))
        .catch(() => console.log("Mongo DB Connection Failure"))

        
//@ Server Io Logic
socketIoLogic(io)


//@ Server listening port
server.listen(process.env.PORT, () => console.log(`Server listening on port ${process.env.PORT}`))

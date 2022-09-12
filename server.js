const cookieParser = require('cookie-parser')
const socketio = require('socket.io')
const mongoose = require('mongoose')
const express = require('express')
const dotenv = require('dotenv')
const helmet = require('helmet')
const morgan = require('morgan')
const cors = require('cors')
const http = require('http')

const apiRoutes = require('./routes/api')
const authRoutes = require('./routes/auth')
const { socketIoLogic } = require('./socket/socket_io_logic')


const app = express()

const server = http.createServer(app)
const clientUrl = {
  DEV:"http://localhost:3000",
  PROD:"https://converse-1910.netlify.app"
}

const io = new socketio.Server(server,{
  cors: {
     origin: clientUrl.DEV,
     methods: ["GET", "POST"]
  }
})


app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(helmet())
app.use(morgan('tiny'))
app.use(cors())
app.use(cookieParser())
dotenv.config()


app.get('/', (req,res) => res.send({ message : "Welcome to the converse_server" }))
app.use('/auth',authRoutes)
app.use('/api',apiRoutes)

const MONGO = process.env.MONGO || "mongodb://localhost/chat"
mongoose.connect(MONGO)
        .then(() => console.log("Mongo DB Connection Successful"))
        .catch(() => console.log("Mongo DB Connection Failure"))


socketIoLogic(io)


server.listen(process.env.PORT, () => console.log(`Server listening on port ${process.env.PORT}`))
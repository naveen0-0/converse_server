import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import mongoose from 'mongoose'
import cors from 'cors'
import http from 'http'
import { Server } from 'socket.io'

//@ App Initialization
const app = express()

//@ Server Intializing
const server = http.createServer(app)

//@ Socket IO Intialization
const io = new Server(server,{
  cors: {
     origin: "http://localhost:3000",
     methods: ["GET", "POST"]
  }
})

//@ Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(helmet())
app.use(morgan('tiny'))
app.use(cors())

//@ MongoDB Initialization
mongoose.connect("mongodb://localhost/converse")
        .then(() => console.log("Mongo DB Connection Successful"))
        .catch(() => console.log("Mongo DB Connection Failure"))

//@ Server Io Logic
io.on('connection', (socket) => {
  console.log(socket.id);
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

//@ Server listening port
server.listen(5000, () => console.log("Server listening on port 5000"))

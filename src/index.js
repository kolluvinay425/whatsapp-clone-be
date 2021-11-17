import express from "express";
import cors from "cors"
import { createServer } from "http";
import { Server } from "socket.io";
import mongoose from "mongoose"
import ConversationModel from "./chats/chatModels/ConversationModel.js";
import MessageModel from "./chats/chatModels/MessageModel.js";

let onlineUsers = []

const app = express();

app.use(cors())
app.use(express.json())

/* app.get('/online-users', (req, res) => {
    res.send({ onlineUsers })
}) */

app.get('/chat', (req,res,next)=> {
    ConversationModel.find((err,data) =>
    {
        if(err){
            res.status(500).send(err)
        }else{
            res.status(200).send(data)
        }
    })
})

app.post('/chat', async (req,res,next) => {

    const newConversation = new ConversationModel({
        members: [req.body.senderId, req.body.receiverId],
    })
try {
    const savedConversation = await newConversation.save();
    res.status(200).send(savedConversation)
} catch (error) {
    res.status(500).send(error)
}
    
})

app.get('/chat/:userId', async (req,res,next) => {
try {
    const conversation =  await ConversationModel.find(
        {members:{$in: [req.params.userId]}
        });
    res.status(200).send(conversation)
} catch (error) {
    res.status(500).send(error)
}  
})

app.post('/messages', async (req,res,next) => {

    const newMessage = new MessageModel(req.body)
try {
    const savedMessage = await newMessage.save();
    res.status(200).send(savedMessage)
} catch (error) {
    res.status(500).send(error)
}
    
})

app.get('/messages/:conversationId', async (req,res,next) => {
    try {
        const messages =  await MessageModel.find({
            conversationId: req.params.conversationId
            });
        res.status(200).send(messages)
    } catch (error) {
        res.status(500).send(error)
    }  
    })

const httpServer = createServer(app);

const io = new Server(httpServer);

io.on("connection", (socket) => {
    console.log("THE CONNECTED SOCKET ID IS", socket.id)

    socket.on("join", (data) => {
        const { name, room } = data
        const { user, error } = addUser({ id: socket.id, name, room })
        
        if (error) return 
    
        socket.emit("message", {
            user: "admin",
            text: `${user.name}, it's great to see you in here.`
          })
          socket.broadcast.to(user.room).emit("message", {
            user: "admin",
            text: `${user.name} has just landed to the room.`
          }) 
          socket.join(user.room)
          io.to(user.room).emit("room-data", {
            room: user.room,
            users: getAllUsers(user.room),
          })
      
    });

    socket.on("sendmessage", async ({ message, room }) => {
    console.log(room)

 
        await RoomModel.findOneAndUpdate({ room },
            {
                $push: { chatHistory: message }
            })

        socket.to(room).emit("message", message)


       
    })

});

io.on("error",console.log)

httpServer.on("listening",()=>console.log("server is running"))
httpServer.on("error",console.log)

mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log("connected to mongo")
    httpServer.listen(3001);
})
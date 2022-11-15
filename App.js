const express = require('express')
const app = express();

// creating server
const http = require('http')
const server = http.createServer(app)

const PORT = process.env.PORT || 7000;

const { Server } = require('socket.io')

// socket.io
const io = new Server(server)

const path = require('path');



// serving files from 'public' folder
app.use(express.static('public'))

// Users array to store the data of users like socketId, username & room number
const Users = [];

// Here comes the socket.io's part
io.on('connection', (socket) => {
    console.log('New Connection...');

    // getting user's info
    socket.on('User', (data) => {
        console.log(data);

        let Account = {
            id: socket.id,
            ...data
        }

        Users.push(Account)
        // console.log(Account);

        socket.join(data.room_number);
        socket.emit('message', `Welcome ${data.username}!`)
        socket.broadcast.to(data.room_number).emit('message', `${data.username} has joined chat!` )
    })

    socket.on('typing', (data) => {
        let sender = Users.find(user => user.id == socket.id);

        socket.broadcast.to(sender.room_number).emit('typing', `${sender.username} ${data}`)
    })

    // socket.on('stoppedTyping', (data) => {
    //     let sender = Users.find(user => user.id == socket.id);
    //     socket.broadcast.to(sender.room_number).emit('stoppedTyping', '');
    // })

    socket.on('mesg', (data) => {
        let sender = Users.find(user => user.id == socket.id);

        socket.emit('NewMessage', { from: 'You', text: data });
        socket.broadcast.to(sender.room_number).emit('NewMessage', { from: sender.username, text: data})
    })
    
})

server.listen(PORT, () => console.log(`Server running...`))
const express = require('express')
const app = express();

// creating server
const http = require('http')
const server = http.createServer(app)

const { Server } = require('socket.io')

// socket.io
const io = new Server(server)

const path = require('path');

const fs = require('fs')

// serving files from 'public' folder
app.use(express.static('public'))

// Here comes the socket.io's part

// making an json of users to store their username and room number
// const Users = require('./Database/Users.json');

const Users = [];

io.on('connection', (socket) => {
    console.log('New Connection...');

    // taking 'username' and 'room' which are emitted by our 'chat.js' when user filled the form
    socket.on('NewUser', (data) => {
        console.log(data.username);
        console.log(data.room);

        Users.push(data);

        socket.emit('NewUser', data)
    })

    socket.on('sendingMesg', (msg) => {
        console.log(msg);

        io.emit('showingMesg', msg)
    })
})

server.listen(7000, () => console.log(`Server running...`))
let socket = io();

// getting username and room from 'index.html' after filling the form
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

// just logging username and room to be confirmed
console.log(username, room);

socket.emit('NewUser', { username, room })

// getting html elements to show username and room number in chat.html
let Name = document.querySelector('#name')
let roomno = document.querySelector('#roomno')

let sendBtn = document.querySelector('#sendBtn')

socket.on('NewUser', (data) => {
    Name.innerHTML = data.username;
    roomno.innerHTML += data.room;
})

sendBtn.addEventListener('click', () => {
    let mesg = document.querySelector('#mesg');
    socket.emit('sendingMesg', mesg.value)
    mesg.value = '';
})

let messages = document.querySelector('#messages')

socket.on('showingMesg', (msg) => {
    let p = document.createElement('p');
    p.innerHTML = `${username} ${msg}`;
    messages.appendChild(p)

})
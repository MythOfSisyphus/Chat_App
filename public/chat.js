const socket = io();

// taking the username & roomno which user filled in register form, using query string
let url = window.location.search;
// console.log(url);

let query_url = new URLSearchParams(url)

// see these 3 lines by uncommenting how we get username and roomno

// console.log(query_url);
// console.log(query_url.get("username"));
// console.log(query_url.get("roomno"));

// making an user object using these credentials to send the server
let user = {
    username: query_url.get("username"),
    room_number: query_url.get("roomno")
}

// now emmiting these information to server using socket.io to display username and 
//  room_number on screen

socket.emit('User', user);

let messages = document.querySelector('#messages')

let Name = document.querySelector('#Name')
let Room_number = document.querySelector('#Room_number')


Name.innerHTML = user.username
Room_number.innerHTML += user.room_number

socket.on('message', (mesg) => {
    let p = document.createElement('p')
    p.className = 'text-center style'
    p.textContent = mesg

    messages.appendChild(p)
})

let message = document.querySelector('#message')
let sendBtn = document.querySelector('#sendBtn')

message.addEventListener('keydown', () => {
    socket.emit('typing', "is typing...")
})

socket.on('typing', (data) => {
    let typing_status = document.querySelector('#typing_status')
    typing_status.innerHTML = data;
    setTimeout(() => {
        typing_status.innerHTML = '';
    }, 3000)
})

// message.addEventListener('keyup', () => {
//     socket.emit('stoppedTyping', '');
// })

// socket.on('stoppedTyping', (mesg) => {
//     let typing_status = document.querySelector('#typing_status')
//     typing_status.innerHTML = mesg;
// })

sendBtn.addEventListener('click', () => {
    if( message.value == '') {
        message.placeholder = 'Please write something...'
        message.classList.remove('success')
        message.classList.add('danger')
    }
    else {
        socket.emit('mesg', message.value)
        message.classList.remove('danger')
        message.classList.add('success')
        message.placeholder = 'Your message...'
        message.value = '';
    }
})

socket.on('NewMessage', (data) => {
    let p = document.createElement('p')

    let span = document.createElement('span')
    span.className = 'Name font-semibold mr-2'
    span.textContent = data.from
    p.appendChild(span)
    p.innerHTML += data.text

    messages.appendChild(p)
})
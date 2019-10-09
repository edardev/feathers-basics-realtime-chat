const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');
const socketio = require('@feathersjs/socketio');

//A messages service that allow to create new ans return all existing messages.
class MessageService {
    constructor() {
        this.messages = [];
    }
    async find () {
        //Just return all messages
        return this.messages;
    }
    async create (data) {
        // The new message is the data merged with a unique idetifier
        // using the messages length since it chages whenever we add one
        const message = {
            id: this.messages.length,
            text: data.text
        }
        // Add a new message to the list
        this.messages.push(message);

        return message;
    }
}

// Create an ExpressJS compatible Feathers application
const app = express(feathers());

// Parse HTTP JSON bodies
app.use(express.json());
// Parse URL-encoded params
app.use(express.urlencoded({ extended: true }));
// Host static files from the current folder
app.use(express.static(__dirname));
// Add REST API support 
app.configure(express.rest());
// Configure Socket.io real time APIs
app.configure(socketio());
// Register and in-memory messages service
app.use('/messages', new MessageService());
// Register a nicer error handler than the default Express one
app.use(express.errorHandler());

//Add any new real-time connection to the 'everybody' channel
app.on('connection', connection =>
    app.channel('everybody').join(connection) 
);

// Publish all events to the `everybody` channel
app.publish(data => app.channel('everybody'));

//Start the server
app.listen(3030).on('listening', ()=>
    console.log(
        'Feathers real-time server listening on http://localhost:3030 \nTo see an array with the messages we created on the server http://localhost:3030/messages'
    )
);

// For good measure let's create a message so our API doesn't look empty
app.service('messages').create({
    text: 'Hello Edward from the server'
});

app.service('messages').on('created', message => {
    console.log('A new message has been created', message);
})





// // Register the message service  on the Feathers application
// app.use('messages', new MessageService())

// Log every time a new message has been created
// app.service('messages').on('created', message => {
//     console.log('A new message has been created', message);
// })

// // A function that creates new messages and then logs all existing messages
// const main = async () => {
//     // Create a new message on our message service
//     await app.service('messages').create({
//         text: 'Hello Feathers'
//     });
//     await app.service('messages').create({
//         text: 'Hello again'
//     });

//     //Find all existing messages
//     const messages = await app.service('messages').find();

//     console.log('All messages', messages);
// };

// main();
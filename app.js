const feathers = require('@feathersjs/feathers');
const app = feathers();

//A messages service that allow to create new ans return all existing messages.
class MessageService {
    constructor() {
        this.message = [];
    }
    async find () {
        //Just return all messages
        return this.message
    }
    async create (data) {
        // The new message is the data merged with a unique idetifier
        // using the messages length since it chages whenever we add one
        const message = {
            id: this.message.length,
            text: data.text
        }
        // Add a new message to the list
        this.message.push(message);

        return message;
    }
}

// Register the message service  on the Feathers application
app.use('messages', new MessageService())

// Log every time a new message has been created
app.service('messages').on('created', message => {
    console.log('A new message has been created', message);
})

// A function that creates new messages and then logs all existing messages
const main = async () => {
    // Create a new message on our message service
    await app.service('messages').create({
        text: 'Hello Feathers'
    });
    await app.service('messages').create({
        text: 'Hello again'
    });

    //Find all existing messages
    const messages = await app.service('messages').find();

    console.log('All messages', messages);
};

main();
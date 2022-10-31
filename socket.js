// const { Server } = require('socket.io');
// const app = require('./app');
// const User = require('./models/user');
// const httpServer = require('./server');


let supportAgent = {
  id: null,
  name: null,
  key: null
};

const setKey = (key) => {
    supportAgent.key = key;
};

const activateChat = (io) => {
    // io = new Server(httpServer, {
    //     cors: { origin: app.corsOrigin }
    // });

    let queue = [];
    
    const welcomeMessage = (name) => {
      return `${name}: Hi! My name is ${name}. How can I help you today?`;
    };
    const queueMessage = (queue) => {
        return `Welcome! There are ${queue} people before you.`;
    };
    
    io.on('connection', socket => {

        socket.on('test', (id) => {
            console.log(id);
            socket.emit('test-res', 'testing');

        });

      socket.on('check-admin-connection', key => {
        let isConnected = false;
        if (key === supportAgent.key) {
          isConnected = true;
          supportAgent.id = socket.id;
        }
        socket.emit('admin-connected', isConnected);

      });
    
      socket.on('chat-adm-start', data => {
        if (data.key === supportAgent.key) {
          supportAgent.id = socket.id;
          supportAgent.name = data.name;
        }
      });

    
      socket.on('online-check', () => {
        console.log('in online-check');
        console.log(supportAgent.id);
        const isConnected = supportAgent.id ? true : false;
        socket.emit('online-res', isConnected);
      });

    
      socket.on('chat-user-start', () => {
        console.log('in chat-user-start');
        console.log(queue);
        if (!queue.includes(socket.id)) {
          queue.push(socket.id);
        }
        const queuePosition = queue.indexOf(socket.id);
        if (queuePosition === 0) {
          console.log('in welcome-msg');
          socket.emit('welcome-msg', welcomeMessage(supportAgent.name));
        } else {
          console.log('in queue-data');
          socket.emit('queue-data', { queue: queuePosition, msg: queueMessage(queuePosition) });
        }
      });

    
      socket.on('message-adm', (msg) => {
        socket.to(queue[0]).emit('message', `${supportAgent.name}: ${msg}`);
      });

    
      socket.on('message-user', (msg) => {
        if (queue.indexOf(socket.id) !== 0) return;
        socket.to(supportAgent.id).emit('message', msg);
      });


      socket.on('typing-adm', isTyping => {
        socket.to(queue[0]).emit('typing', isTyping);
      });


      socket.on('typing-user', isTyping => {
        if (queue.indexOf(socket.id) !== 0) return;
        socket.to(supportAgent.id).emit('typing', isTyping);
      });

    
      socket.on('next-user', () => {
        console.log('in next user');
        socket.to(queue[0]).emit('disconnect-user');
        if (socket.id === supportAgent.id) {
          queue.shift();
        }
        console.log(queue);
      });


      socket.on('disconnect-chat', () => {
        if (socket.id === supportAgent.id) {
          for (const key of Object.keys(supportAgent)) {
            supportAgent[key] = null;
          }
        }
      });
      
    });
};



const closeChat = () => {
    io.close();
};

module.exports = { activateChat, closeChat, setKey };
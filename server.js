require('dotenv').config();
const mongoose = require('mongoose');
const { createServer } = require('http');
const app = require('./app');
const { activateChat } = require('./socket');
const { Server } = require('socket.io');


const { dbURI } = process.env;
const PORT = process.env.PORT || 3001;

const httpServer = createServer(app);

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((res) => console.log('connected to db'))
  .catch((err) => console.log(err));
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const io = new Server(httpServer, {
  cors: { origin: app.corsOrigin }
});

activateChat(io);

module.exports = httpServer;
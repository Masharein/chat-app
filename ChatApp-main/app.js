const express = require('express');
const app = express();


// Set the template engine to EJS
app.set('view engine', 'ejs');

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Define the root route
app.get('/', (req, res) => {
  res.render('index.ejs');
});

// Start the server and listen on port 3000
const server = app.listen(3000, () => {
  console.log('Server started on port 3000');
});

// Socket.io instantiation
const io = require('socket.io')(server);

// Listen for new socket connections
io.on('connection', (socket) => {
  console.log('New user connected');

  // Set the default username for this socket to "Anonymous"
  socket.username = 'Anonymous';

  // Listen for a change in username
  socket.on('change_username', (data) => {
    socket.username = data.username;
  });

  // Listen for a new message
  socket.on('new_message', (data) => {
    // Broadcast the new message to all connected sockets
    io.sockets.emit('new_message', {
      message: data.message,
      username: socket.username,
    });
  });

  // Listen for a typing event
  socket.on('typing', () => {
    // Broadcast the typing message to all connected sockets except for the sender
    socket.broadcast.emit('typing', { username: socket.username });
  });
});


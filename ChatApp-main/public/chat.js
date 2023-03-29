document.addEventListener('DOMContentLoaded', () => {
  // Make connection
  const socket = io.connect('http://localhost:3000');

  // Get references to DOM elements
  const message = document.querySelector('#message');
  const username = document.querySelector('#username');
  const send_message = document.querySelector('#send_message');
  const send_username = document.querySelector('#send_username');
  const chatroom = document.querySelector('#chatroom');
  const feedback = document.querySelector('#feedback');
  const notificationSound = document.getElementById('notification-sound');

  // Emit message
  send_message.addEventListener('click', () => {
    socket.emit('new_message', { message: message.value });
    notificationSound.play();
  });

  // Listen on new_message
  socket.on('new_message', (data) => {
    feedback.innerHTML = '';
    message.value = '';
  
    const messageEl = document.createElement('p');
    messageEl.classList.add('message');
    messageEl.innerHTML = data.username + ": " + data.message;
  
    const editButton = document.createElement('button');
    editButton.classList.add('edit');
    editButton.setAttribute('data-id', data.id);
    editButton.innerHTML = 'Edit';
  
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete');
    deleteButton.setAttribute('data-id', data.id);
    deleteButton.innerHTML = 'Delete';
  
    messageEl.appendChild(editButton);
    messageEl.appendChild(deleteButton);
  
    chatroom.appendChild(messageEl);
  
    // Add event listener for delete button
    deleteButton.addEventListener('click', () => {
      const messageEl = deleteButton.parentNode;
      messageEl.parentNode.removeChild(messageEl);
      socket.emit('delete_message', { id: data.id });
    });


    // Add event listener for edit button
    editButton.addEventListener('click', () => {
      const newMessage = prompt('Enter the new message:');
      if (newMessage) {
        socket.emit('edit_message', { id: data.id, message: newMessage });
      }
    });
  
    notificationSound.play();
  });
  

  // Emit a username
  send_username.addEventListener('click', () => {
    socket.emit('change_username', { username: username.value });
  });

  // Emit typing
  message.addEventListener('keypress', () => {
    socket.emit('typing');
  });

  // Listen on typing
  socket.on('typing', (data) => {
    feedback.innerHTML = "<p><i>" + data.username + ' is typing a message...</i></p>';
  });
});

socket.on('edited_message', (data) => {
  const editedMessageEl = document.querySelector(`[data-id="${data.id}"]`);
  if (editedMessageEl) {
    editedMessageEl.querySelector('.message-text').textContent = data.message;
  }
});




  
  
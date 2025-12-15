import { io } from 'socket.io-client';
const socket = io('http://localhost:3001');

socket.on('connect', () => {
  console.log('Connected:', socket.id);
  socket.emit('join_party', '04e21831-5ddd-45c0-8e16-0561d80a9784');
});

socket.on('song_added', (song) => {
  console.log('Song added:', song);
});

socket.on('song_deleted', (song) => {
  console.log('Song deleted:', song);
});

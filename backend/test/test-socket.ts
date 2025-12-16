import { io } from 'socket.io-client';
const socket = io('http://localhost:3001');
const args = process.argv.slice(2);

socket.on('connect', () => {
  console.log('Connected:', socket.id);
  socket.emit('join_party', args[0]);
  console.log('Joined party: ', args[0]);
});

socket.on('song_added', (song) => {
  console.log('Song added:', song);
});

socket.on('song_deleted', (song) => {
  console.log('Song deleted:', song);
});

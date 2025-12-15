'use client';

import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

type Song = {
  song_id: string;
  party_id: string;
  title: string;
  artist: string;
  requested_by: string | null;
  requested_at: string;
};

type PartySongsProps = {
  partyId: string;
  initialSongs: Song[];
};


export default function PartySongs({
  partyId,
  initialSongs,
}: PartySongsProps) {
  // Hold songs in state
  const [songs, setSongs] = useState<Song[]>(initialSongs);

  useEffect(() => {
    // Connect to socket.io
    const socket: Socket = io(process.env.NEXT_PUBLIC_API_URL!);

    socket.on("connect", () => {
      console.log("Connected to socket:", socket.id);

      // Join the party room
      socket.emit("join_party", partyId);
    });

    // Listen for song_added → append
    socket.on("song_added", (song: Song) => {
      setSongs((prev) => [...prev, song]);
    });

    // Listen for song_deleted → remove
    socket.on("song_deleted", (song: Song) => {
      setSongs((prev) =>
        prev.filter((s) => s.song_id !== song.song_id)
      );
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, [partyId]);

  // Render the list
  return (
    <div>
      <h2>Songs</h2>

      {songs.length === 0 ? (
        <p>No songs yet</p>
      ) : (
        <ul>
          {songs.map((song) => (
            <li key={song.song_id}>
              <strong>{song.title}</strong> – {song.artist}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
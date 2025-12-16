'use client';

import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { Song } from '@/types/song.type';

type PartySongsProps = {
  partyId: string;
  initialSongs: Song[];
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function PartySongs({
  partyId,
  initialSongs,
}: PartySongsProps) {
  const [songs, setSongs] = useState<Song[]>(
    Array.isArray(initialSongs) ? initialSongs : []
  );
  const [deleting, setDeleting] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  
  // --- DELETE SONG HANDLER ---
  async function handleDelete(songId: string) {
    setDeleting(prev => new Set(prev).add(songId));
    setError(null);

    const res = await fetch(
      `${API_URL}/parties/${partyId}/songs/${songId}`,
      {
        method: 'DELETE',
      }
    );

    if (!res.ok) {
      let message = 'Failed to delete song';

      try{
        const data = await res.json();
        message = data.message ?? message;
      } catch {

      }
      setError(message);
      setDeleting(prev => {
        const next = new Set(prev);
        next.delete(songId);
        return next;
      });
      return;
    }

    // socket event will update state
    setDeleting(prev => {
      const next = new Set(prev);
      next.delete(songId);
      return next;
    });
  }

  useEffect(() => {
    const socket: Socket = io(process.env.NEXT_PUBLIC_API_URL!);

    const onSongAdded = (song: Song) => {
      setSongs(prev => 
        prev.find(s => s.song_id === song.song_id)
        ? prev
        : [...prev, song]
      );
    };

    const onSongDeleted = (deletedSong: Song) => {
      setSongs((prev) =>
        prev.filter((s) => s.song_id !== deletedSong.song_id)
      );
    };

    socket.on('connect', () => {
      socket.emit('join_party', partyId);
    });

    socket.on('song_added', onSongAdded);
    socket.on('song_deleted', onSongDeleted);

    return () => {
      socket.off('song_added', onSongAdded);
      socket.off('song_deleted', onSongDeleted);
      socket.disconnect();
    };
  }, [partyId]);

  return (
    <div>
      <h2>Songs</h2>

      {songs.length === 0 ? (
        <p>No songs yet</p>
      ) : (
        <ul className="song-list">
          {songs.map((song) => (
            <li key={song.song_id}>
              <strong>{song.title}</strong> – {song.artist}. Requested By: {song.requested_by}{' '}
              <button
                className="party-button"
                disabled={deleting.has(song.song_id)}
                onClick={() => handleDelete(song.song_id)}
              >
                {deleting.has(song.song_id) ? 'Deleting...' : 'Delete'}
              </button>
            </li>
          ))}
        </ul>
      )}

      {error && <p className="error">{error}</p>}
    </div>
  );
}

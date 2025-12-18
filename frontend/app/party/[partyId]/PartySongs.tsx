'use client';

import { useCallback, useState } from 'react';
import { Song } from '@/types/song.type';
import { usePartySocket } from '@/hooks/usePartySocket';
import { formatTimestamp } from '@/lib/date-format';

type PartySongsProps = {
  partyId: string;
  songs: Song[];
  setSongs: React.Dispatch<React.SetStateAction<Song[]>>;
  onDeleteSong: (song: Song) => Promise<Error | null>;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export default function PartySongs({
  partyId,
  songs,
  setSongs,
  onDeleteSong,
}: PartySongsProps) {
  const [deleting, setDeleting] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [reqUid, setReqUid] = useState('');

  const onSongAdded = useCallback((song: Song) => {
  setSongs(prev => {
    const withoutOptimistic = prev.filter(
      s =>
        !(
          s.optimistic &&
          s.title === song.title &&
          s.artist === song.artist &&
          s.requested_by.user_id === song.requested_by.user_id
        )
    );

    if (withoutOptimistic.some(s => s.song_id === song.song_id)) {
      return withoutOptimistic;
    }

    return [...withoutOptimistic, song];
  });
}, [setSongs]);

  const onSongDeleted = useCallback((deletedSong: Song) => {
    setSongs(prev =>
      prev.filter(s => s.song_id !== deletedSong.song_id)
    );
  }, [setSongs]);

  // socket hookup
  usePartySocket(partyId, onSongAdded, onSongDeleted);

  // --- OPTIMISTIC DELETE ---
  async function handleDelete(song: Song) {
    if (!song.song_id) return;

    setDeleting(prev => new Set(prev).add(song.song_id!));
    try {
      await onDeleteSong(song);
    } catch {
      setError('Failed to delete song');
    } finally {
      setDeleting(prev => {
        const next = new Set(prev);
        next.delete(song.song_id!);
        return next;
      });
    }
  }

  return (
    <div>
      <h1>Songs</h1>

      {songs.length === 0 ? (
        <p>No songs yet</p>
      ) : (
        <ul className="song-list">
          {songs.map(song => (
            <li 
              key={song.song_id ?? song.temp_id}
              className={song.optimistic ? 'optimistic' : ''}
            >
              <strong>{song.title}</strong> – {song.artist}
              {song.optimistic && <em style={{ opacity: 0.6 }}> (pending…)</em>}
              <p>
                Requested by <strong>{song.requested_by.display_name}</strong>
                {' at '}
                {formatTimestamp(song.requested_at)}
              </p>
              <button
                className="party-button"
                disabled={!!song.song_id && deleting.has(song.song_id)}
                onClick={() => handleDelete(song)}
              >
                {((song.song_id !== null && deleting.has(song.song_id!)) || 
                (song.temp_id !== null && deleting.has(song.temp_id!))) ? "Removing.." : 'Delete'}
              </button>
            </li>
          ))}
        </ul>
      )}

      {error && <p className="error">{error}</p>}
    </div>
  );
}

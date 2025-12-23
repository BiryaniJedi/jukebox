'use client';

import { useState } from 'react';
import { Song } from '@/types/song.type';
import { v4 as uuid } from 'uuid';

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

type AddSongFormProps = {
  partyId: string;
  onOptimisticSong: (song: Song) => void;
  onOptimisticSongFailed: (tempId: string) => void;
};

export default function AddSongForm({ partyId, onOptimisticSong, onOptimisticSongFailed }: AddSongFormProps) {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;

    if (!userId) {
      setError('User ID is required');
      return;
    }

    setLoading(true);
    setError(null);

    const tempId = crypto.randomUUID();
    const client_request_id = uuid();

    onOptimisticSong({
      temp_id: tempId,
      party_id: partyId,
      title,
      artist,
      requested_by: {
        user_id: userId,
        display_name: 'Guest',
      },
      requested_at: new Date().toISOString(),
      client_request_id: client_request_id,
      optimistic: true,
    })

     try {
      const res = await fetch(`${API_URL}/parties/${partyId}/songs`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-user-id': userId,
         },
        body: JSON.stringify({ title, artist, client_request_id}),
      });

      if (!res.ok) {
        throw new Error('Failed to add song');
      }

      // Do nothing here — websocket will reconcile
      setTitle('');
      setArtist('');
      setFailed(false);
    } catch (err) {
      onOptimisticSongFailed(tempId);
      setFailed(true);
      setError('Failed to add song');
      // rollback happens in PartySongs via websocket absence
    } finally {
      setTitle('');
      setArtist('');
      setLoading(false);
    }
  }

  return (
    <div>
      <h2>Add Song</h2>

      <form className="song-form" onSubmit={handleSubmit}>
        <label>User ID</label>
        <input
          placeholder="UUID of requesting user"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          required
        />

        <label>Title</label>
        <input
          placeholder="Song title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <label>Artist</label>
        <input
          placeholder="Artist name"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          required
        />

        {error && <p className="error">{error}</p>}

        <button className="party-button" type="submit" disabled={loading}>
          {loading ? 'Adding…' : 'Add Song'}
        </button>

        {failed && ( 
          <button className="party-button" type="submit">
            Retry?
          </button>
        )}
      </form>
    </div>
  );
}

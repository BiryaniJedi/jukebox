'use client';

import { useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

type AddSongFormProps = {
  partyId: string;
};

export default function AddSongForm({ partyId }: AddSongFormProps) {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [userId, setUserId] = useState(''); // 👈 NEW
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!userId) {
      setError('User ID is required');
      return;
    }

    setLoading(true);
    setError(null);

    const res = await fetch(
      `${API_URL}/parties/${partyId}/songs`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId, // 👈 HEADER SET HERE
        },
        body: JSON.stringify({
          title,
          artist,
        }),
      }
    );

    if (!res.ok) {
      let message = 'Failed to add song';
      try {
        const data = await res.json();
        message = data.message ?? message;
      } catch {}
      setError(message);
      setLoading(false);
      return;
    }

    setTitle('');
    setArtist('');
    setLoading(false);
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
      </form>
    </div>
  );
}

'use client';

import { useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type AddSongPageProps = {
   partyId: string; 
}

export default function AddSongForm({ partyId }: AddSongPageProps) {
    const [title, setTitle] = useState('');
    const [artist, setArtist] = useState('');
    const [requestedBy, setRequestedBy] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        setLoading(true);
        setError(null);

        const res = await fetch(
            `${API_URL}/parties/${partyId}/songs`,
            {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify({
                    title,
                    artist,
                    requestedBy: requestedBy || null,
                }),
            }
        );

        if (!res.ok) {
            const data = await res.json();
            setError(data.message ?? 'Failed to add song');
            setLoading(false);
            return;
        }

        setLoading(false);
    }
    
    return (
    <div>
      <h1>Add Song</h1>

      <form className="song-form" onSubmit={handleSubmit}>
        <h2>Add Song</h2>

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

        <label>Requested By</label>
        <input
            placeholder="Optional"
            value={requestedBy}
            onChange={(e) => setRequestedBy(e.target.value)}
        />

        {error && <p className="error">{error}</p>}

        <button className="party-button" type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add Song"}
        </button>
      </form>
    </div>
  );
}
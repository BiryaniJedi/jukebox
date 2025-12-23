'use client';

import { useState } from 'react';
import { Song } from '@/types/song.type';
import { v4 as uuid } from 'uuid';
import { getErrorMessage } from '@/lib/get-error-message';

type AddSongFormProps = {
  partyId: string;
  onOptimisticSong: (song: Song) => void;
  onOptimisticSongFailed: (tempId: string) => void;
  tryAddSong: (title: string, artist: string, client_request_id: string, userId: string) => Promise<void>;
};

type PendingAddRequest = {
  title: string;
  artist: string;
  userId: string;
  tempId: string;
  clientRequestId: string;
};

async function attemptAddSong(
  req: PendingAddRequest | null,
  partyId: string,
  onOptimisticSong: (song: Song) => void,
  onOptimisticSongFailed: (tempId: string) => void,
  tryAddSong: (
    title: string,
    artist: string,
    client_request_id: string,
    userId: string
  ) => Promise<void>,
) {
  if (!req) {
    console.log('RETRY NO REQUEST!!');
    return;
  }
  // insert optimistic song
  onOptimisticSong({
    temp_id: req.tempId,
    party_id: partyId,
    title: req.title,
    artist: req.artist,
    requested_by: {
      user_id: req.userId,
      display_name: 'Guest',
    },
    requested_at: new Date().toISOString(),
    client_request_id: req.clientRequestId,
    optimistic: true,
  });

  try {
    // attempt POST
    await tryAddSong(
      req.title,
      req.artist,
      req.clientRequestId,
      req.userId
    );
    // success → socket will reconcile
  } catch (err) {
    // rollback optimistic
    onOptimisticSongFailed(req.tempId);
    throw err;
  }
}


export default function AddSongForm({ partyId, onOptimisticSong, onOptimisticSongFailed, tryAddSong }: AddSongFormProps) {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const [pendingRequest, setPendingRequest] = useState<PendingAddRequest | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;

    if (!userId) {
      setError('User ID is required');
      return;
    }

    setLoading(true);
    setError(null);

    const req: PendingAddRequest = {
      title,
      artist,
      userId,
      tempId: crypto.randomUUID(),
      clientRequestId: uuid(),
    }

    setPendingRequest(req);

    try{
      await attemptAddSong(
        req,
        partyId,
        onOptimisticSong,
        onOptimisticSongFailed,
        tryAddSong,
      );
      // Do nothing here — websocket will reconcile
      setTitle('');
      setArtist('');
      setFailed(false);
      setPendingRequest(null);
    } catch (err) {
      setFailed(true);
      setError(getErrorMessage(err));
      // rollback happens in PartySongs via websocket absence
    } finally {
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
          <button 
            className="party-button"
            type="button" 
            disabled={loading}
            onClick={async () => {
              setLoading(true);
              setError(null);

              try {
                await attemptAddSong(
                  pendingRequest,
                  partyId,
                  onOptimisticSong,
                  onOptimisticSongFailed,
                  tryAddSong
                );

                setFailed(false);
                setPendingRequest(null);
              } catch (err) {
                setError(getErrorMessage(err));
              } finally {
                setLoading(false);
              }
            }}
          >
            Try adding the song again?
          </button>
        )}
      </form>
    </div>
  );
}

'use client';

import { useState } from 'react';
import AddSongForm from './AddSongForm';
import PartySongs from './PartySongs';
import { Song } from '@/types/song.type';

type PartyClientProps = {
  partyId: string;
  initialSongs: Song[];
};

const getErrMsg = async (errMsg: string, res: Response) => {
  try {
    const body = await res.json();
    if (typeof body.message === 'string') {
      errMsg = body.message;
    } else if (Array.isArray(body.message)) {
      errMsg = body.message.join(', ');
    }
  } finally {
    throw new Error(errMsg);
  }
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;
export default function PartyClient({ partyId, initialSongs }: PartyClientProps) {
  const [songs, setSongs] = useState<Song[]>(initialSongs);

  function addOptimisticSong(song: Song) {
    setSongs(prev => [...prev, song]);
  }

  function removeOptimisticSong(tempId: string) {
    setSongs(prev => prev.filter(s => 
      (s.temp_id !== tempId)
    ));
  }

  async function deleteSong(song: Song, requesting_uid: string): Promise<void> {
    const res = await fetch(
      `${API_URL}/parties/${partyId}/songs/${song.song_id}`, { 
        method: 'DELETE',
        headers: {
          'x-user-id': requesting_uid,
        },
      }
    );
    if (!res.ok) {
      await getErrMsg('Delete failed', res); 
    }
  }

  async function addSong(title: string, artist: string, client_request_id: string, userId: string): Promise<void> {
    const res = await fetch(`${API_URL}/parties/${partyId}/songs`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-user-id': userId,
        },
      body: JSON.stringify({ title, artist, client_request_id}),
    });

    if (!res.ok) {
      await getErrMsg('Failed to add song', res);
    }
  }

  return (
    <>
      <AddSongForm
        partyId={partyId}
        onOptimisticSong={addOptimisticSong}
        onOptimisticSongFailed={removeOptimisticSong}
        tryAddSong={addSong}
      />
      <PartySongs
        partyId={partyId}
        songs={songs}
        onDeleteSong={deleteSong}
        setSongs={setSongs}
      />
    </>
  );
}

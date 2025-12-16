'use client';

import { useState } from 'react';
import AddSongForm from './AddSongForm';
import PartySongs from './PartySongs';
import { Song } from '@/types/song.type';

type PartyClientProps = {
  partyId: string;
  initialSongs: Song[];
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;
export default function PartyClient({ partyId, initialSongs }: PartyClientProps) {
  const [songs, setSongs] = useState<Song[]>(initialSongs);

  function addOptimisticSong(song: Song) {
    setSongs(prev => [...prev, song]);
  }

  function removeOptimisticSong(tempId: string) {
    setSongs(prev => prev.filter(s => s.song_id !== tempId));
  }

  async function deleteSongOptimistic(song: Song) {
    if (!song.song_id) return;

    // snapshot
    setSongs(prev => prev.filter(s => s.song_id !== song.song_id));

    try {
        const res = await fetch(
        `${API_URL}/parties/${partyId}/songs/${song.song_id}`,
        { method: 'DELETE' }
        );

        if (!res.ok) throw new Error();
    } catch {
        // rollback
        setSongs(prev => [...prev, song]);
        throw new Error('Failed to delete song');
    }
  }

  return (
    <>
      <AddSongForm
        partyId={partyId}
        onOptimisticSong={addOptimisticSong}
        onOptimisticSongFailed={removeOptimisticSong}
      />
      <PartySongs
        partyId={partyId}
        songs={songs}
        onDeleteSong={deleteSongOptimistic}
        setSongs={setSongs}
      />
    </>
  );
}

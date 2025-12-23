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
  const [delError, setDelError] = useState<string | null>(null);

  function addOptimisticSong(song: Song) {
    setSongs(prev => [...prev, song]);
  }

  function removeOptimisticSong(tempId: string) {
    setSongs(prev => prev.filter(s => s.song_id !== tempId));
  }

  async function deleteSong(song: Song, requesting_uid: string): Promise<void> {
    try {
        const res = await fetch(
          `${API_URL}/parties/${partyId}/songs/${song.song_id}`, { 
            method: 'DELETE',
            headers: {
              'x-user-id': requesting_uid,
            },
          }
        );
        console.log(`From PartyClient, delete response status: ${res.status}\n`);
        if(res.status == 403){
          throw new Error('You are not allowed to delete this song');
        }
    } catch {
        throw new Error();
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
        delError={delError}
        onDeleteSong={deleteSong}
        setSongs={setSongs}
      />
    </>
  );
}

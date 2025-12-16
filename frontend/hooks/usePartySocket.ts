/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { socket } from "../lib/socket";
import { Song } from '@/types/song.type';

export function usePartySocket(partyId: string, onSongAdded: (song: any) => void, onSongDeleted: (song: any) => void) {

  useEffect(() => {
    if (!partyId) return;

    if(!socket.connected) {
      socket.connect();
    }

    // Join room
    socket.emit("join_party", partyId);

    // Subscribe to events
    socket.on("song_added", onSongAdded);
    socket.on("song_deleted", onSongDeleted);

    return () => {
      socket.off("song_added", onSongAdded);
      socket.off("song_deleted", onSongDeleted);
    };
  }, [partyId, onSongAdded, onSongDeleted]);
}

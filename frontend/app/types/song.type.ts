//frontend/types/song.type.ts
export type Song = {
  song_id: string;
  party_id: string;
  title: string;
  artist: string;
  requested_by: string | null;
  requested_at: string;
};
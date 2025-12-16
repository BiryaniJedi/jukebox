export type Song = {
  song_id?: string;
  temp_id?: string;
  party_id: string;
  title: string;
  artist: string;
  requested_at: string;
  requested_by: {
    user_id: string;
    display_name: string;
  };
  optimistic?: boolean;
  deleting?: boolean;
};
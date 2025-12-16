export type Song = {
  song_id: string;
  party_id: string;
  title: string;
  artist: string;
  requested_at: Date;
  requested_by: {
    user_id: string;
    display_name: string;
  };
};
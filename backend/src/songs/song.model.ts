export class Song {
  song_id: string;
  party_id: string;
  title: string;
  artist: string;
  requested_at: string;
  requested_by: {
    user_id: string;
    display_name: string;
  };
  client_request_id: string;
}

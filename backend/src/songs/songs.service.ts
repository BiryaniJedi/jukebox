import { Injectable } from '@nestjs/common';
import { CreateSongDto } from './dto/create-song.dto';
import { DatabaseService } from '../database/database.service';
import { PartiesService } from '../parties/parties.service';
import { Song } from './song.model';
import { assertFound } from '../common/db-utils';
import { PartyGateway } from '../gateway/party.gateway';

@Injectable()
export class SongsService {
  constructor(
    private readonly db: DatabaseService,
    private readonly partiesService: PartiesService,
    private readonly gateway: PartyGateway,
  ) {}

  async addSongToParty(party_id: string, dto: CreateSongDto): Promise<Song> {
    await this.partiesService.getParty(party_id);

    const result = await this.db.query<Song>(
      `INSERT INTO songs (party_id, title, artist, requested_by)
       VALUES ($1, $2, $3, $4)
       RETURNING song_id, party_id, title, artist, requested_by, requested_at`,
      [party_id, dto.title, dto.artist, dto.requestedBy],
    );

    const song = result.rows[0];
    this.gateway.broadcastSongAdded(party_id, song);
    return song;
  }

  async getSongsForParty(party_id: string): Promise<Song[]> {
    await this.partiesService.getParty(party_id);
    const result = await this.db.query<Song>(
      `SELECT
          s.song_id,
          s.party_id,
          s.title,
          s.artist,
          s.requested_by,
          s.requested_at
       FROM songs s
       WHERE s.party_id = $1
       ORDER BY s.requested_at ASC`,
      [party_id],
    );

    return result.rows;
  }

  async deleteSongFromParty(party_id: string, song_id: string): Promise<Song> {
    await this.partiesService.getParty(party_id);

    const result = await this.db.query<Song>(
      `DELETE FROM songs
       WHERE party_id = $1 AND song_id = $2
       RETURNING song_id, party_id, title, artist, requested_by, requested_at`,
      [party_id, song_id],
    );

    const deletedSong = assertFound(result.rows, song_id, 'Song');
    this.gateway.broadcastSongDeleted(party_id, deletedSong);
    return deletedSong;
  }
}

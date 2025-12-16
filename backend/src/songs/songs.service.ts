import { Injectable } from '@nestjs/common';
import { CreateSongDto } from './dto/create-song.dto';
import { DatabaseService } from '../database/database.service';
import { PartiesService } from '../parties/parties.service';
import { UsersService } from '../users/users.service';
import { SongRow } from '../../types/songRow.type';
import { Song } from './song.model';
import { assertFound, mapSongRow } from '../common/db-utils';
import { PartyGateway } from '../gateway/party.gateway';

@Injectable()
export class SongsService {
  constructor(
    private readonly db: DatabaseService,
    private readonly partiesService: PartiesService,
    private readonly usersService: UsersService,
    private readonly gateway: PartyGateway,
  ) {}

  async addSongToParty(
    party_id: string,
    user_id: string,
    dto: CreateSongDto,
  ): Promise<Song> {
    await this.partiesService.getParty(party_id);
    await this.usersService.getUser(user_id);

    const insertedResult = await this.db.query<{ song_id: string }>(
      `INSERT INTO songs (party_id, title, artist, req_by_uid)
       VALUES ($1, $2, $3, $4)
       RETURNING song_id`,
      [party_id, dto.title, dto.artist, user_id],
    );

    const insertedSongId = assertFound(
      insertedResult.rows,
      'insert',
      'Song',
    ).song_id;

    const selectedSongRow = await this.db.query<SongRow>(
      `SELECT
          s.song_id,
          s.party_id,
          s.title,
          s.artist,
          s.requested_at,
          u.user_id,
          u.display_name
       FROM songs s
       JOIN users u ON u.user_id = s.req_by_uid
       WHERE s.song_id = $1`,
      [insertedSongId],
    );

    const song = mapSongRow(selectedSongRow.rows[0]);
    this.gateway.broadcastSongAdded(party_id, song);

    return song;
  }

  async getSongsForParty(party_id: string): Promise<Song[]> {
    await this.partiesService.getParty(party_id);

    const result = await this.db.query<SongRow>(
      `SELECT
          s.song_id,
          s.party_id,
          s.title,
          s.artist,
          s.requested_at,
          u.user_id,
          u.display_name
       FROM songs s
       JOIN users u on u.user_id = s.req_by_uid
       WHERE s.party_id = $1
       ORDER BY s.requested_at ASC`,
      [party_id],
    );

    const songs: Song[] = result.rows.map(mapSongRow);
    return songs;
  }

  async deleteSongFromParty(party_id: string, song_id: string): Promise<Song> {
    await this.partiesService.getParty(party_id);

    //TODO enforce auth
    const result = await this.db.query<SongRow>(
      `DELETE FROM songs s
        USING users u
        WHERE s.party_id = $1
          AND s.song_id = $2
          AND u.user_id = s.req_by_uid
        RETURNING
          s.song_id,
          s.party_id,
          s.title,
          s.artist,
          s.requested_at,
          u.user_id,
          u.display_name`,
      [party_id, song_id],
    );

    const deletedSong = mapSongRow(assertFound(result.rows, song_id, 'Song'));

    this.gateway.broadcastSongDeleted(party_id, deletedSong);
    return deletedSong;
  }
}

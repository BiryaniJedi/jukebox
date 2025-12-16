import { NotFoundException } from '@nestjs/common';
import { SongRow } from '../../types/songRow.type';
import { Song } from '../songs/song.model';

export function assertFound<T>(
  rows: T[],
  id: string,
  entityName = 'Record',
): T {
  if (rows.length === 0) {
    throw new NotFoundException(`${entityName} with id ${id} does not exist`);
  }
  return rows[0];
}

export function mapSongRow(row: SongRow): Song {
  return {
    song_id: row.song_id,
    party_id: row.party_id,
    title: row.title,
    artist: row.artist,
    requested_at: row.requested_at.toISOString(),
    requested_by: {
      user_id: row.user_id,
      display_name: row.display_name,
    },
  };
}

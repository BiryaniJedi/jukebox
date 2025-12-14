import { Injectable } from '@nestjs/common';
import { CreatePartyDto } from './dto/create-party.dto';
import { DatabaseService } from '../database/database.service';
import { Party } from './party.model';
import { assertFound } from '../common/db-utils';

@Injectable()
export class PartiesService {
  constructor(private readonly db: DatabaseService) {}

  async createParty(dto: CreatePartyDto): Promise<Party> {
    const result = await this.db.query(
      `INSERT INTO parties (host_name)
       VALUES ($1)
       RETURNING party_id, host_name, created_at`,
      [dto.hostName],
    );
    return result.rows[0] as Party;
  }

  async getParty(id: string): Promise<Party> {
    const result = await this.db.query<Party>(
      `SELECT party_id, host_name, created_at
       FROM parties
       WHERE party_id = $1`,
      [id],
    );

    return assertFound(result.rows, id, 'Party');
  }

  async getParties(): Promise<Party[]> {
    const result = await this.db.query<Party>(
      `SELECT party_id, host_name, created_at
       FROM parties
       ORDER BY created_at DESC`,
    );

    return result.rows;
  }

  async deleteParty(id: string): Promise<Party> {
    const result = await this.db.query<Party>(
      `DELETE FROM parties
       WHERE party_id = $1
       RETURNING party_id, host_name, created_at`,
      [id],
    );

    return assertFound(result.rows, id, 'Party');
  }
}

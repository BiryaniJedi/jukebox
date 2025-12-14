import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class DatabaseService implements OnModuleDestroy {
  private pool: Pool;
  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
  }

  async query<T = any>(text: string, params?: any[]): Promise<{ rows: T[] }> {
    const result = await this.pool.query(text, params);
    return result;
  }

  async onModuleDestroy() {
    await this.pool.end();
  }
}

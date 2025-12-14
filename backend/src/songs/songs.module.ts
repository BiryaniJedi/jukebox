import { Module } from '@nestjs/common';
import { PartiesModule } from '../parties/parties.module';
import { DatabaseModule } from '../database/database.module';
import { SongsService } from './songs.service';
import { SongsController } from './songs.controller';

@Module({
  imports: [DatabaseModule, PartiesModule],
  providers: [SongsService],
  controllers: [SongsController],
  exports: [SongsService],
})
export class SongsModule {}

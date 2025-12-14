import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PartiesModule } from './parties/parties.module';
import { DatabaseModule } from './database/database.module';
import { SongsService } from './songs/songs.service';
import { SongsModule } from './songs/songs.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PartiesModule,
    DatabaseModule,
    SongsModule,
  ],
  controllers: [AppController],
  providers: [AppService, SongsService],
})
export class AppModule {}

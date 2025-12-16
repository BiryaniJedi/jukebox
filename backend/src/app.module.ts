import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PartiesModule } from './parties/parties.module';
import { DatabaseModule } from './database/database.module';
import { SongsModule } from './songs/songs.module';
import { GatewayModule } from './gateway/gateway.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PartiesModule,
    DatabaseModule,
    SongsModule,
    GatewayModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

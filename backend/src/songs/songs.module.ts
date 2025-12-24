import { Module } from '@nestjs/common';
import { PartiesModule } from '../parties/parties.module';
import { DatabaseModule } from '../database/database.module';
import { SongsService } from './songs.service';
import { SongsController } from './songs.controller';
import { GatewayModule } from '../gateway/gateway.module';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    DatabaseModule,
    PartiesModule,
    GatewayModule,
    UsersModule,
    AuthModule,
  ],
  providers: [SongsService],
  controllers: [SongsController],
  exports: [SongsService],
})
export class SongsModule {}

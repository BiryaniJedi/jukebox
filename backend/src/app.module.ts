import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PartiesController } from './parties/parties.controller';
import { PartiesService } from './parties/parties.service';
import { PartiesModule } from './parties/parties.module';

@Module({
  imports: [PartiesModule],
  controllers: [AppController, PartiesController],
  providers: [AppService, PartiesService],
})
export class AppModule {}

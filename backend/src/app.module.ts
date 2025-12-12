import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PartiesController } from './parties/parties.controller';
import { PartiesService } from './parties/parties.service';
import { PartiesModule } from './parties/parties.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PartiesModule, PrismaModule],
  controllers: [AppController, PartiesController],
  providers: [AppService, PartiesService, PrismaService],
})
export class AppModule {}

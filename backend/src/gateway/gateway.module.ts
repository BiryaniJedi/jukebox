import { Module } from '@nestjs/common';
import { PartyGateway } from './party.gateway';

@Module({
  providers: [PartyGateway],
  exports: [PartyGateway],
})
export class GatewayModule {}

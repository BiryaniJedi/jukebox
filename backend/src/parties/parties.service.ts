import { Injectable } from '@nestjs/common';
import { CreatePartyDto } from './dto/create-party.dto';
import { Party } from './party.model';
import { v4 as uuid } from 'uuid';

@Injectable()
export class PartiesService {
  private parties: Party[] = [];
  create(dto: CreatePartyDto): Party {
    const party: Party = {
      partyId: uuid(),
      hostName: dto.hostName,
      createdAt: new Date(),
    };
    this.parties.push(party);
    return party;
  }

  findOne(id: string): Party | undefined {
    return this.parties.find((p) => p.partyId === id);
  }

  findAll(): Party[] {
    return this.parties;
  }
}

import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PartiesService } from './parties.service';
import { Party } from './party.model';
import { CreatePartyDto } from './dto/create-party.dto';

@Controller('parties')
export class PartiesController {
  constructor(private readonly partiesService: PartiesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED) // 201
  async createParty(@Body() dto: CreatePartyDto): Promise<Party> {
    const result = await this.partiesService.createParty(dto);
    return result;
  }

  @Get(':party_id')
  async getPartyById(@Param('party_id') party_id: string): Promise<Party> {
    const result = await this.partiesService.getParty(party_id);
    return result;
  }

  @Get()
  async getAllParties(): Promise<Party[]> {
    const result = await this.partiesService.getParties();
    return result;
  }

  @Delete(':party_id')
  async deletePartyById(@Param('party_id') party_id: string): Promise<Party> {
    const result = await this.partiesService.deleteParty(party_id);
    return result;
  }
}

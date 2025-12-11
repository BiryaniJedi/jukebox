import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PartiesService } from './parties.service';
import { CreatePartyDto } from './dto/create-party.dto';

@Controller('parties')
export class PartiesController {
  constructor(private readonly partiesService: PartiesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED) // 201
  create(@Body() dto: CreatePartyDto) {
    return this.partiesService.create(dto);
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.partiesService.findOne(id);
  }

  @Get()
  getAll() {
    return this.partiesService.findAll();
  }
}

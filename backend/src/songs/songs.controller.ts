import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Headers,
  Param,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { SongsService } from './songs.service';
import { Song } from './song.model';
import { CreateSongDto } from './dto/create-song.dto';
import { ParseUUIDPipe } from '@nestjs/common';
import { isUUID } from 'class-validator';

@Controller('parties/:party_id/songs')
export class SongsController {
  constructor(private readonly songsService: SongsService) {}

  @Get()
  async getSongsForParty(@Param('party_id') party_id: string): Promise<Song[]> {
    const result = await this.songsService.getSongsForParty(party_id);

    return result;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED) // 201
  async addSongToParty(
    @Param('party_id', ParseUUIDPipe) party_id: string,
    @Body() dto: CreateSongDto,
    @Headers('x-user-id') user_id: string,
  ): Promise<Song> {
    if (!isUUID(user_id)) {
      throw new BadRequestException('Cannot add song, Invalid user id');
    }
    const result = await this.songsService.addSongToParty(
      party_id,
      user_id,
      dto,
    );

    return result;
  }

  @Delete(':song_id')
  async deleteSongFromParty(
    @Param('party_id', ParseUUIDPipe) party_id: string,
    @Param('song_id', ParseUUIDPipe) song_id: string,
    @Headers('x-user-id') requesting_uid: string,
  ): Promise<Song> {
    if (!isUUID(requesting_uid)) {
      throw new BadRequestException('Cannot delete song, Invalid user id');
    }
    const result = await this.songsService.deleteSongFromParty(
      party_id,
      song_id,
      requesting_uid,
    );

    return result;
  }
}

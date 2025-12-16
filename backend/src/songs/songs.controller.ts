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
import { SongsService } from './songs.service';
import { Song } from './song.model';
import { CreateSongDto } from './dto/create-song.dto';
import { ParseUUIDPipe } from '@nestjs/common';

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
    @Param('party_id') party_id: string,
    @Body() dto: CreateSongDto,
  ): Promise<Song> {
    const result = await this.songsService.addSongToParty(party_id, dto);

    return result;
  }

  @Delete(':song_id')
  async deleteSongFromParty(
    @Param('party_id', ParseUUIDPipe) party_id: string,
    @Param('song_id', ParseUUIDPipe) song_id: string,
  ): Promise<Song> {
    const result = await this.songsService.deleteSongFromParty(
      party_id,
      song_id,
    );

    return result;
  }
}

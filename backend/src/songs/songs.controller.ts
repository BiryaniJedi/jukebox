import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common';
import { SongsService } from './songs.service';
import { Song } from './song.model';
import { CreateSongDto } from './dto/create-song.dto';
import { ParseUUIDPipe } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { Request } from 'express';

@Controller('parties/:party_id/songs')
export class SongsController {
  constructor(private readonly songsService: SongsService) {}

  @Get()
  async getSongsForParty(@Param('party_id') party_id: string): Promise<Song[]> {
    const result = await this.songsService.getSongsForParty(party_id);

    return result;
  }

  @UseGuards(AuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED) // 201
  async addSongToParty(
    @Param('party_id', ParseUUIDPipe) party_id: string,
    @Body() dto: CreateSongDto,
    @Req() req: Request,
  ): Promise<Song> {
    const user = req.user!;
    const result = await this.songsService.addSongToParty(party_id, user, dto);

    return result;
  }

  @UseGuards(AuthGuard)
  @Delete(':song_id')
  async deleteSongFromParty(
    @Param('party_id', ParseUUIDPipe) party_id: string,
    @Param('song_id', ParseUUIDPipe) song_id: string,
    @Req() req: Request,
  ): Promise<Song> {
    const user = req.user!;
    const result = await this.songsService.deleteSongFromParty(
      party_id,
      song_id,
      user,
    );

    return result;
  }
}

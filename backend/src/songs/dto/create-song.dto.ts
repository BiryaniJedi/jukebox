import { IsString, IsNotEmpty } from 'class-validator';

export class CreateSongDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  artist: string;

  @IsString()
  requestedByUserId: string;
}

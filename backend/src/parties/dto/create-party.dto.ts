import { IsString, IsNotEmpty } from 'class-validator';

export class CreatePartyDto {
  @IsString()
  @IsNotEmpty()
  hostName: string;
}

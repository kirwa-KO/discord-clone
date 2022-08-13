import {
	IsEmail,
	IsString,
	MinLength,
	MaxLength,
	Matches,
	IsOptional,
} from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { User } from 'src/user/schemas/user.schemas';
import { Message } from 'src/chat/message/schemas/message.schemas';

export class RoomDto {
	@IsString()
	@MinLength(3)
	@MaxLength(29)
	name: string;

	createdBy: User;

	members?: User[];
	
	messages?: Message[];

	isPrivateDm?: Boolean;
}

export class RoomDtoUpdate extends PartialType(RoomDto) {}
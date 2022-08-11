import {
	IsEmail,
	IsString,
	MinLength,
	MaxLength,
	Matches,
	IsOptional,
} from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { User } from 'src/user/schemas/user.schema';
import { Message } from 'src/chat/message/schemas/message.schema';

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
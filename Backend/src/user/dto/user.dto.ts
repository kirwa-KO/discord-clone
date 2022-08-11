import {
	IsEmail,
	IsString,
	MinLength,
	MaxLength,
	Matches,
	IsOptional,
} from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { Room } from 'src/chat/room/schemas/room.schema';
import { Message } from 'src/chat/message/schemas/message.schema';

export class UserDto {
	@IsString()
	@MinLength(5)
	@MaxLength(29)
	@Matches('^[a-zA-Z0-9][a-zA-Z0-9-]+$')
	username: string;

	@IsString()
	@MinLength(6)
	password: string;

	rooms?: Room[];

	messages?: Message[];
}

export class UserDtoUpdate extends PartialType(UserDto) {}
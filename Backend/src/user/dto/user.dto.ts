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
	@MinLength(3, {
		message: 'Username must be at least 3 characters',
	})
	@MaxLength(29, {
		message: 'Username must be at most 29 characters',
	})
	@Matches('^[a-zA-Z0-9][a-zA-Z0-9-]+$', "", {
		message: "Username must be alphanumeric a-Z, 0-9, -",
	})
	username: string;

	@IsString()
	@MinLength(6, {
		message: 'Password must be at least 6 characters',
	})
	password: string;

	rooms?: Room[];

	messages?: Message[];
}

export class UserDtoUpdate extends PartialType(UserDto) {}
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
import { Room } from 'src/chat/room/schemas/room.schema';

export class MessageDto {
	@IsString()
	@MinLength(1)
	content: string;

	sendBy: User;

	room: Room;
}

export class MessageDtoUpdate extends PartialType(MessageDto) {}
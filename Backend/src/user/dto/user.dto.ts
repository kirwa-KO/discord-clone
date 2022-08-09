import {
	IsEmail,
	IsString,
	MinLength,
	MaxLength,
	Matches,
	IsOptional,
} from 'class-validator';
import { PartialType } from '@nestjs/swagger';

export class UserDto {
	@IsString()
	@MinLength(5)
	@MaxLength(29)
	@Matches('^[a-zA-Z0-9][a-zA-Z0-9-]+$')
	username: string;

	@IsString()
	@MinLength(6)
	password: string;
}

export class UserDtoUpdate extends PartialType(UserDto) {}
import { Body, Injectable, UploadedFile } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { UserDto } from 'src/user/dto/user.dto';
import { UserDocument } from 'src/user/schemas/user.schemas';
import { UserService } from '../user/user.service';
import { PayloadInterface } from './interfaces/Payload.interface';

@Injectable()
export class AuthService {
	constructor(
		private jwtService: JwtService,
		private userService: UserService,
	) {}

	async validateUser(username: string, password: string): Promise<any> {
		const user = await this.userService.findUserByUsername(username);

		if (!user) return null;

		const isMatch = await compare(password, user.password);

		if (isMatch === true) {
			const { password, ...result } = user;
			return result;
		}

		return null;
	}

	async login(user: UserDocument): Promise<{ access_token: string, username: string, userId: string }> {
		const payload: PayloadInterface = {
			username: user.username,
			userId: user._id.toString(),
		};
		return {
			access_token: this.jwtService.sign(payload),
			username: user.username,
			userId: user._id.toString(),
		};
	}

	async register(@Body() userInfo: UserDto) {
		return this.userService.create(userInfo);
	}
}

import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
// import { FileInterceptor } from '@nestjs/platform-express';
import { UserDto } from 'src/user/dto/user.dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guard/local-auth.guard';

@Controller('auth')
export class AuthController {

	constructor(private authService: AuthService) {}

	@UseGuards(LocalAuthGuard)
	@Post('login')
	async login(@Request() req) {
		return (this.authService.login(req.user));
	}

	@Post('register')
	async register(@Body() userInfo: UserDto) {
		return (this.authService.register(userInfo));
	}
}

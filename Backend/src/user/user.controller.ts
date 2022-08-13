import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { UserDocument } from './schemas/user.schemas';
import { UserService } from './user.service';

@ApiBearerAuth()
@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {

	constructor(private readonly userService: UserService) {}

	@Get("all")
	async getAllUsers() {
		return this.userService.getAll();
	}

	@Get("rooms/:userId")
	async getUserRooms(@Param("userId") userId: string) {
		return this.userService.getUserRooms(userId);
	}

}

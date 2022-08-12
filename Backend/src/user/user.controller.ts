import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
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

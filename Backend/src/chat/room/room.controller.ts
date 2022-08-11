import { Body, Controller, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { UserService } from 'src/user/user.service';
import { RoomDto } from './dto/room.dto';
import { RoomService } from './room.service';
import { RoomDocument } from './schemas/room.schema';

@ApiBearerAuth()
@Controller('room')
@UseGuards(JwtAuthGuard)
export class RoomController {

	constructor(private readonly roomService: RoomService,
				private readonly userService: UserService
		) {}

	@Get("all")
	async getAllRooms() : Promise<any> {
		return this.roomService.getAll();
	}

	@Get("user/all")
	async getAllUserRooms(@Request() req) : Promise<any> {
		const rooms = await this.roomService.getAll();
		const users = await this.userService.getAll();
		return ({
			rooms,
			users,
		});
	}

	@Get(":roomName")
	async getAllRoomData(@Param("roomName") roomName: string) : Promise<any> {
		const room = await this.roomService.getAllRoomsMembersAndMessages(roomName);
		return room;
	}

	@Post("create")
	async createRoom(@Request() req, @Body() roomInfo: RoomDto) : Promise<RoomDocument> {
		const user = await this.userService.findUserById(req.user.userId);
		const createdRoom = await this.roomService.create(roomInfo, req.user.userId);
		user.rooms.push(createdRoom);
		await user.save();
		return createdRoom;
	}
}

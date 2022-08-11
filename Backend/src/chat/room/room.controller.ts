import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RoomDto } from './dto/room.dto';
import { RoomService } from './room.service';
import { RoomDocument } from './schemas/room.schema';

@ApiBearerAuth()
@Controller('room')
@UseGuards(JwtAuthGuard)
export class RoomController {

	constructor(private readonly roomService: RoomService) {}


	@Get("all")
	async getAllEvents() : Promise<any> {
		return this.roomService.getAll();
	}

	@Post("create")
	async createEvent(@Request() req, @Body() roomInfo: RoomDto) : Promise<RoomDocument> {
		return this.roomService.create(roomInfo, req.user.userId);
	}
}

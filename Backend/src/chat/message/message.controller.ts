import { Body, Controller, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { MessageDto } from './dto/message.dto';
import { MessageService } from './message.service';

@ApiBearerAuth()
@Controller('message')
@UseGuards(JwtAuthGuard)
export class MessageController {

	constructor(private readonly messageService: MessageService) {}

	@Post("create/:roomId")
	async create(@Request() req, @Body() messageInfo: MessageDto, @Param("roomId") roomId: string) : Promise<any> {
		return this.messageService.create(messageInfo, req.user.userId, roomId);
	}

	@Get("get/:roomId")
	async getAll(@Param("roomId") roomId: string) : Promise<any> {
		return this.messageService.findMessageByRoomId(roomId);
	}

}

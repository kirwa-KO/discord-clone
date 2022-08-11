import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserService } from 'src/user/user.service';
import { RoomService } from '../room/room.service';
import { RoomDocument } from '../room/schemas/room.schema';
import { MessageDto } from './dto/message.dto';
import { Message, MessageDocument } from './schemas/message.schema';

@Injectable()
export class MessageService {
	constructor(
		@InjectModel(Message.name) private messageModel: Model<MessageDocument>,
		private readonly userService: UserService,
		private readonly roomService: RoomService,
	) {}

	async create(
		messageInfo: MessageDto | { content: string },
		senderId: string,
		roomId: string,
		createByRoomName: boolean = false,
	): Promise<MessageDocument> {

		const createdMessage = await this.messageModel.create({
			content: messageInfo.content,
			sendBy: senderId,
			room: roomId,
		});

		let room: RoomDocument;

		if (createByRoomName === false)
			room = await this.roomService.getRoomById(roomId);
		else
			room = await this.roomService.getRoomByName(roomId);

		if (!room) {
			throw new HttpException(
				'Room Not exists',
				HttpStatus.BAD_REQUEST,
			);
		}

		const sender = await this.userService.findUserById(senderId);

		if (!sender) {
			throw new HttpException(
				'User Not exists',
				HttpStatus.BAD_REQUEST,
			);
		}

		room.messages.push(createdMessage);
		await room.save();

		sender.messages.push(createdMessage);
		await sender.save();

		return createdMessage.save();
	}

	async findMessageByRoomId(roomId: string): Promise<MessageDocument[]> {
		return this.messageModel.find({ room: roomId }).populate('sendBy');
	}

	async findMessageByRoomIdAndUserId(
		roomId: string,
		userId: string,
	): Promise<MessageDocument[]> {
		return this.messageModel.find({ room: roomId, sendBy: userId });
	}

	async findMessageById(messageId: string): Promise<MessageDocument> {
		return this.messageModel.findById(messageId);
	}

	async findMessageByUserId(userId: string): Promise<MessageDocument[]> {
		return this.messageModel.find({ sendBy: userId });
	}
}

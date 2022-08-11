import { UseGuards } from '@nestjs/common';
import {
	OnGatewayConnection,
	SubscribeMessage,
	WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import getRoomName from 'src/helpers/getRoomName';
import { UserService } from 'src/user/user.service';
import { MessageService } from './message/message.service';
import { MessageDocument } from './message/schemas/message.schema';
import { RoomDto } from './room/dto/room.dto';
import { RoomService } from './room/room.service';

@WebSocketGateway({
	cors: {
		origin: '*',
	},
})
// @UseGuards(JwtAuthGuard) // need to add auth guard for socket io protection
export class ChatGateway implements OnGatewayConnection {
	constructor(
		private readonly roomService: RoomService,
		private readonly userService: UserService,
		private readonly messageService: MessageService,
	) {}

	public async handleConnection(client: Socket): Promise<any> {
		// console.log('Client connected');
	}

	@SubscribeMessage('showMyRoom')
	async handleShowmyRoom(
		client: Socket,
		payload: { room: RoomDto; userId: string },
	): Promise<any> {
		const { room, userId } = payload;
		// console.log(room);
		// console.log(userId);
		let isMemberInRoom = false;
		const foundedRoom = await this.roomService.getRoomByName(room.name);

		if (foundedRoom) {
			for (let i = 0; i < foundedRoom.members.length; i++) {
				if (foundedRoom.members[i].toString() === userId) {
					isMemberInRoom = true;
					break;
				}
			}
		}

		if (isMemberInRoom === false) {
			client.emit('memberNotInRoom', room.name);
		} else {
			client.join(room.name);
			client.emit('joinedRoom', room.name);
		}
	}

	@SubscribeMessage('showPrivateMessages')
	async handleShowPrivateMessages(
		client: Socket,
		payload: { receiverId: string; userId: string },
	): Promise<any> {
		const { receiverId, userId } = payload;
		const roomName = getRoomName(receiverId, userId);
		const gettedRoom = await this.roomService.getRoomOrCreate(
			roomName,
			userId,
			true,
		);

		client.join(roomName);
		client.emit('joinedDm', gettedRoom.messages);
	}

	@SubscribeMessage('joinRoom')
	async handleJoinRoom(
		client: Socket,
		payload: { roomName: string; userId: string },
	): Promise<any> {
		const { roomName, userId } = payload;

		const foundedRoom = await this.roomService.getRoomByName(roomName);
		const user = await this.userService.findUserById(userId);

		if (foundedRoom) {
			foundedRoom.members.push(user);
			await foundedRoom.save();
			client.join(roomName);
			client.emit('joinedRoom', roomName);
		} else {
			console.log('Joing room failed because of: Room not found');
		}
	}

	@SubscribeMessage('sendMessage')
	async handleSendMessage(
		client: Socket,
		payload: {
			content: string;
			room: { name: string; _id: string };
			userId: string;
			isPrivateDm: Boolean;
		},
	): Promise<any> {
		const { content, room, userId, isPrivateDm } = payload;

		let createdMessage: MessageDocument;

		if (isPrivateDm === true) {
			const roomName = getRoomName(payload.room._id, userId);
			const gettedRoom = await this.roomService.getRoomOrCreate(
				roomName,
				userId,
				true,
			);
			room._id = gettedRoom._id.toString();
			room.name = gettedRoom.name;
		}

		createdMessage = await this.messageService.create(
			{ content: content },
			userId,
			room._id,
		);

		createdMessage.sendBy = await this.userService.findUserById(userId);

		// console.log(createdMessage);

		client.to(room.name).emit('receivedMessage', createdMessage);
	}
}

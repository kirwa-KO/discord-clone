import { UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
	OnGatewayConnection,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'http';
import { Socket } from 'socket.io';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import getRoomName from 'src/helpers/getRoomName';
import { UserService } from 'src/user/user.service';
import { MessageService } from './message/message.service';
import { MessageDocument } from './message/schemas/message.schemas';
import { RoomDto } from './room/dto/room.dto';
import { RoomService } from './room/room.service';

const onlineUsers: string[] = []

@WebSocketGateway({
	cors: {
		origin: '*',
	},
})
export class ChatGateway implements OnGatewayConnection {
	constructor(
		private readonly roomService: RoomService,
		private readonly userService: UserService,
		private readonly messageService: MessageService,
		private readonly jwtService: JwtService,
	) {}

	@WebSocketServer() server: Server;

	public async handleConnection(client: Socket): Promise<any> {
		console.log('Client connected');
		if (client.handshake.auth.access_token) {
			try {
				// const payload = this.jwtService.verify(client.handshake.auth.access_token);
				this.jwtService.verify(client.handshake.auth.access_token);
			}
			catch (err) {
				console.log(err);
				client.disconnect();
			}
		}
		else {
			client.disconnect();
		}
	}

	@SubscribeMessage('AddConnectedUser')
	async handleConnectedUser(client: Socket, payload: { username: string }): Promise<any> {
		const { username } = payload;
		if (username && !onlineUsers.includes(username)) {
			onlineUsers.push(username);
		}
		this.server.emit('connectedUsers', onlineUsers);
		const rooms = await this.userService.getUserRoomsByUsername(username);
		for (let i = 0; i < rooms.length; i++) {
			client.join(rooms[i].name);
		}
	}

	@SubscribeMessage('showMyRoom')
	async handleShowmyRoom(
		client: Socket,
		payload: { room: RoomDto; userId: string },
	): Promise<any> {
		const { room, userId } = payload;
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
		client.emit('joinedDm', {messages: gettedRoom.messages, receiverId});
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
			
			if (foundedRoom.members.indexOf(user) === -1) {
				foundedRoom.members.push(user);
				await foundedRoom.save();
			}

			client.join(roomName);
			client.to(roomName).emit('joinedRoom', {
				roomName,
				user,
			});
		} else {
			console.log(`Joing room failed because of: Room [${roomName}] not found`);
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

		const roomId = room._id;

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

		if (isPrivateDm === true)
			client.to(room.name).emit('receivedMessage', {createdMessage, roomId: userId, isPrivateDm});
		else
			client.to(room.name).emit('receivedMessage', {createdMessage, roomId, isPrivateDm});
	}

	@SubscribeMessage('createRoom')
	async handleCreateRoom(
		client: Socket,
		payload: { roomName: string; userId: string },
	): Promise<any> {
		const { roomName, userId } = payload;

		const createdRoom = await this.roomService.getRoomOrCreate(roomName, userId);

		// client.emit('createdRoom', createdRoom);
		this.server.emit('createdRoom', createdRoom);
	}

	@SubscribeMessage('logout')
	async handleLogout(client: Socket, payload: { username: string, userId: string }): Promise<any> {
		const { username } = payload;
		if (username && onlineUsers.includes(username)) {
			onlineUsers.splice(onlineUsers.indexOf(username), 1);
		}
		client.disconnect();
		this.server.emit('connectedUsers', onlineUsers);
	}
}

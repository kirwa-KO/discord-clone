import {
	SubscribeMessage,
	WebSocketGateway,
	OnGatewayInit,
	WebSocketServer,
	OnGatewayConnection,
	OnGatewayDisconnect,
	MessageBody,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { AppService } from './app.service';
import getRoomName from './helpers/getRoomName';

@WebSocketGateway({
	cors: {
		origin: '*',
	},
})
export class AppGateway implements OnGatewayConnection {
	constructor(private readonly appService: AppService) {}

	@WebSocketServer() server: Server;

	public async handleConnection(client: Socket): Promise<any> {
		const rooms = await this.appService.getRooms();
		const users = await this.appService.getUsers();
		client.emit('getChats', rooms, users);
	}

	@SubscribeMessage('addUser')
	async handleAddUser(
		client: Socket,
		payload: { username: string },
	): Promise<any> {
		const user = await this.appService.createUserIfNotExist(
			payload.username,
		);
		client.emit('userAdded', user);
	}

	@SubscribeMessage('sendMessage')
	handleMessage(
		client: Socket,
		payload: {
			message: string;
			room: { label: string; id: string; isPrivateDm: Boolean };
			username: string;
		},
	): void {
		console.log(payload);

		if (payload.room.isPrivateDm === true) {
			const roomName = getRoomName(payload.room.id, payload.username);
			console.log(roomName);
		}

		this.appService.createMessage(
			payload.message,
			payload.username,
			payload.room,
		);

		if (payload.room.label === '') {
			client.broadcast.emit('receivedMessage', payload.message);
		} else {
			client
				.to(payload.room.label)
				.emit('receivedMessage', payload.message);
		}
	}

	// @SubscribeMessage('joinRoom')
	// handleJoinRoom(client: Socket, payload: {room: string, username: string}): void {
	// 	this.appService.joinRoom(payload.room, payload.username);
	// 	client.join(payload.room);
	// 	client.emit("joinedRoom", payload.room);
	// }

	@SubscribeMessage('getChatMessages')
	async handleGetChatMessages(
		client: Socket,
		payload: {
			name: string;
			roomId: string;
			isPrivateDm: Boolean;
			username: string;
		},
	): Promise<any> {
		if (payload.isPrivateDm === false) {
			const messages = await this.appService.getMessages(payload.roomId);
			// console.log(payload);
			client.join(payload.name);
			client.emit('joinedRoom', payload.name);
			client.emit('receivedMessages', messages);
		} else {
			const roomName = getRoomName(payload.roomId, payload.username);
			const room = await this.appService.getRoomOrCreate(
				roomName,
				payload.username,
			);
			const messages = await this.appService.getMessages(
				room._id.toString(),
			);
			client.join(roomName);
			client.emit('joinedRoom', roomName);
			client.emit('receivedMessages', messages);
		}
	}
}

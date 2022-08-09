import { Injectable } from '@nestjs/common';
import { Message, MessageDocument } from './chat/message/schemas/message.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Room, RoomDocument } from './chat/room/schemas/room.schema';
import { User, UserDocument } from './user/schemas/user.schema';

@Injectable()
export class AppService {
	constructor(
		@InjectModel(Message.name) private messageModel: Model<MessageDocument>,
		@InjectModel(Room.name) private roomModel: Model<RoomDocument>,
		@InjectModel(User.name) private userModel: Model<UserDocument>,
	) {}

	async createMessage(
		messageContent: String,
		sendByname: String,
		roomName: any,
	): Promise<any> {
		const room = await this.getRoomByName(roomName.label);

		if (!room) {
			throw new Error('Room not found');
		}

		let createdMessage = new this.messageModel({
			message: messageContent,
			sendBy: sendByname,
			room: room,
		});
		createdMessage = await createdMessage.save();
		room.messages.push(createdMessage);
		await room.save();
		return createdMessage;
	}

	async getUsers(): Promise<UserDocument[]> {
		return this.userModel.find();
	}

	async createUserIfNotExist(username: String): Promise<UserDocument> {
		let foundUser = await this.userModel.findOne({ username: username });

		if (!foundUser) {
			const newUser = new this.userModel({ username: username });
			return newUser.save();
		}

		return foundUser;
	}

	async getMessages(roomId: String): Promise<MessageDocument[]> {
		const foundedMessages = await this.messageModel.find({ room: roomId });
		return foundedMessages;
	}

	async getRoomOrCreate(
		roomName: String,
		username: String,
		isPrivateDm: Boolean = false,
	): Promise<RoomDocument> {
		let foundRoom = await this.roomModel.findOne({ name: roomName });
		if (!foundRoom) return this.createRoom(roomName, username, username, isPrivateDm);
		return foundRoom;
	}

	async getRooms(): Promise<RoomDocument[]> {
		return this.roomModel.find({ isPrivateDm: false }).populate("members");
	}

	async getRoomByName(roomName: String): Promise<RoomDocument> {
		return this.roomModel.findOne({ name: roomName });
	}

	async getRoom(roomId: String, roomName: String): Promise<RoomDocument> {
		return this.roomModel.findOne({
			$or: [{ _id: roomId }, { name: roomName }],
		});
	}

	async createRoom(
		room: String,
		createdBy: String,
		member: String,
		isPrivateDm: Boolean = false,
	): Promise<RoomDocument> {
		const createdRoom = new this.roomModel({
			name: room,
			createdBy: createdBy,
			members: [member],
			isPrivateDm: isPrivateDm,
		});
		return createdRoom.save();
	}

	async joinRoom(room: String, username: String): Promise<RoomDocument> {
		let foundRoom = await this.roomModel.findOne({ name: room });

		if (!foundRoom) {
			const roomToJoin = await this.createRoom(room, username, username);
			return roomToJoin;
		}

		foundRoom.members.push(username);
		return foundRoom.save();
	}
}

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RoomDto } from './dto/room.dto';
import { Room, RoomDocument } from './schemas/room.schema';

@Injectable()
export class RoomService {
	constructor(
		@InjectModel(Room.name) private roomModel: Model<RoomDocument>,
	) {}

	async create(roomInfo: RoomDto, creatorId: string): Promise<RoomDocument> {
		const room = await this.roomModel.findOne({
			name: roomInfo.name,
		});

		if (room) {
			throw new HttpException(
				'Room already exists',
				HttpStatus.BAD_REQUEST,
			);
		}

		return this.roomModel.create({
			...roomInfo,
			members: [creatorId],
			createdBy: creatorId,
		});
	}

	async getRoomById(roomId: string): Promise<RoomDocument> {
		return this.roomModel.findById(roomId);
	}

	async getRoomByName(roomName: string): Promise<RoomDocument> {
		return this.roomModel.findOne({
			name: roomName,
		});
	}

	async getAllRoomsMembersAndMessages(roomName: string): Promise<any> {
		const room = await this.roomModel
			.findOne({
				name: roomName,
			})
			.populate('members')
			.populate({
				path: 'messages',
				populate: {
					path: 'sendBy',
				},
			})
			.exec();

		return room;
	}

	async getAllRoomsMembers(roomName: string): Promise<any> {
		const room = await this.roomModel
			.findOne({
				name: roomName,
			})
			.populate('members')
			.exec();
		return room.members;
	}

	async getRoomOrCreate(
		roomName: string,
		creatorId: string,
		isPrivate: boolean = false,
	): Promise<RoomDocument> {
		let room = await this.roomModel.findOne({ name: roomName }).populate({
			path: 'messages',
			populate: {
				path: 'sendBy',
			},
		});

		if (!room) {
			room = await this.roomModel.create({
				name: roomName,
				members: [creatorId],
				createdBy: creatorId,
				isPrivateDm: isPrivate,
			});
		}

		return room;
	}

	async getAll(): Promise<RoomDocument[]> {
		return this.roomModel.find({ isPrivateDm: false });
	}
}

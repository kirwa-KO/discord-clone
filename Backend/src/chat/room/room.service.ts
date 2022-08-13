import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserService } from 'src/user/user.service';
import { RoomDto } from './dto/room.dto';
import { Room, RoomDocument } from './schemas/room.schema';

@Injectable()
export class RoomService {
	constructor(
		@InjectModel(Room.name) private roomModel: Model<RoomDocument>,
		private readonly userService: UserService,
	) {}

	async create(roomInfo: RoomDto, creatorId: string): Promise<RoomDocument> {
		const room = await this.roomModel.findOne({
			name: roomInfo.name,
		});

		const user = await this.userService.findUserById(creatorId);
		if (!user) {
			throw new HttpException(
				'User Not exist in our database',
				HttpStatus.BAD_REQUEST,
			);
		}

		if (room) {
			throw new HttpException(
				'Room already exists',
				HttpStatus.BAD_REQUEST,
			);
		}

		if (user.rooms.indexOf(room) === -1) {
			user.rooms.push(room);
			await user.save();
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

		const user = await this.userService.findUserById(creatorId);
		if (!user) {
			throw new HttpException(
				'User Not exist in our database',
				HttpStatus.BAD_REQUEST,
			);
		}

		if (!room) {
			room = await this.roomModel.create({
				name: roomName,
				members: [creatorId],
				createdBy: creatorId,
				isPrivateDm: isPrivate,
			});
		}

		const ifUserAlreadyInRoom = user.rooms.find(roomId => roomId.toString() === room._id.toString());
		if (!ifUserAlreadyInRoom) {
			user.rooms.push(room);
			await user.save();
		}


		return room;
	}

	async getAll(): Promise<RoomDocument[]> {
		return this.roomModel.find({ isPrivateDm: false });
	}
}

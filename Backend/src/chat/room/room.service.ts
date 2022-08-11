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
			createdBy: creatorId,
		});
	}

	async getAll(): Promise<RoomDocument[]> {
		return this.roomModel.find({isPrivateDm: false});
	}

}

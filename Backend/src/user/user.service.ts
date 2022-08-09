import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { hash } from 'bcrypt';
import { Model } from 'mongoose';
import { SaltOrRounds } from 'src/helpers/HashingConfig';
import { UserDto } from './dto/user.dto';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UserService {
	constructor(
		@InjectModel(User.name) private userModel: Model<UserDocument>,
	) {}

	async create(userInfo: UserDto): Promise<User> {
		const user = await this.userModel.findOne({
			username: userInfo.username,
		});

		if (user) {
			throw new HttpException(
				'User already exists',
				HttpStatus.BAD_REQUEST,
			);
		}

		userInfo.password = await hash(userInfo.password, SaltOrRounds);

		const createdUser = new this.userModel(userInfo);
		return createdUser.save();
	}

	async findUserByUsername(username: string): Promise<any> {
		let user: any;
		try {
			user = await this.userModel
				.findOne({ username: username })
				.select('+password')
				.lean()
				.exec();
		} catch (err) {
			throw new HttpException(
				'User Not exist in our database',
				HttpStatus.BAD_REQUEST,
			);
		}

		if (!user)
			throw new HttpException(
				'User Not exist in our database',
				HttpStatus.BAD_REQUEST,
			);

		return user;
	}
}

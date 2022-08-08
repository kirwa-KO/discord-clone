import { Module } from '@nestjs/common';
import { AppGateway } from './app.gateway';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from './schemas/message.schema';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { Room, RoomSchema } from './schemas/room.schema';
import { User, UserSchema } from './schemas/user.schema';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: User.name, schema: UserSchema },
		]),
		MongooseModule.forFeature([
			{ name: Message.name, schema: MessageSchema },
		]),
		MongooseModule.forFeature([
			{ name: Room.name, schema: RoomSchema },
		]),
		ConfigModule.forRoot({
			isGlobal: true,
			validationSchema: Joi.object({
				MONGODB_URI: Joi.string()
			}),
			validationOptions: {
				// allowUnknown: false,
				abortEarly: true,
			}
		}),
		MongooseModule.forRoot(process.env.MONGODB_URI),
	],
	controllers: [],
	providers: [AppGateway, AppService],
})
export class AppModule {}

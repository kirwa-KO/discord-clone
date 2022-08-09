import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ChatModule } from './chat/chat.module';

@Module({
	imports: [
		// MongooseModule.forFeature([
		// 	{ name: Message.name, schema: MessageSchema },
		// ]),
		// MongooseModule.forFeature([
		// 	{ name: Room.name, schema: RoomSchema },
		// ]),
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
		AuthModule,
		UserModule,
		ChatModule,
	],
	controllers: [],
	providers: [],
	// providers: [AppGateway, AppService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageService } from './message.service';
import { Message, MessageSchema } from './schemas/message.schema';
import { MessageController } from './message.controller';
import { UserModule } from 'src/user/user.module';
import { RoomModule } from '../room/room.module';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: Message.name, schema: MessageSchema },
		]),
		UserModule,
		RoomModule,
	],
	providers: [
		MessageService
	],
	exports: [
		MessageService
	],
	controllers: [MessageController]
})
export class MessageModule {}

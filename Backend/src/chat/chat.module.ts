import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { Message, MessageSchema } from './message/schemas/message.schema';
import { Room, RoomSchema } from './room/schemas/room.schema';
import { MessageModule } from './message/message.module';
import { RoomModule } from './room/room.module';
import { UserModule } from 'src/user/user.module';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: Message.name, schema: MessageSchema },
		]),
		MongooseModule.forFeature([{ name: Room.name, schema: RoomSchema }]),
		MessageModule,
		RoomModule,
		UserModule
	],
	providers: [ChatGateway, ChatService],
})
export class ChatModule {}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { Message, MessageSchema } from './message/schemas/message.schema';
import { Room, RoomSchema } from './room/schemas/room.schema';
import { RoomService } from './room/room.service';
import { MessageService } from './message/message.service';
import { MessageModule } from './message/message.module';
import { RoomModule } from './room/room.module';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: Message.name, schema: MessageSchema },
		]),
		MongooseModule.forFeature([{ name: Room.name, schema: RoomSchema }]),
		MessageModule,
		RoomModule,
	],
	providers: [ChatGateway, ChatService],
})
export class ChatModule {}

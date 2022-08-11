import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document, ObjectId } from "mongoose";
import { MessageDocument } from "src/chat/message/schemas/message.schema";
import { RoomDocument } from "src/chat/room/schemas/room.schema";

export type UserDocument = User & Document<ObjectId>;

@Schema({ timestamps: true })
export class User {

	@Prop({ required: true, unique: true })
	username: string;

	@Prop({ required: true, select: false })
	password: string;

	@Prop({ type: [{ type: mongoose.Types.ObjectId, ref: "Room", default: [] }] })
	rooms?: RoomDocument[];

	@Prop({ type: [{ type: mongoose.Types.ObjectId, ref: "Message", default: [] }] })
	messages?: MessageDocument[];
}

export const UserSchema = SchemaFactory.createForClass(User);
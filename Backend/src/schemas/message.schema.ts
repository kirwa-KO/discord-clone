import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document, ObjectId } from "mongoose";
import { RoomDocument } from "./room.schema";

export type MessageDocument = Message & Document<ObjectId>;

@Schema({ timestamps: true })
export class Message {
	@Prop({ required: true })
	message: String;

	@Prop({ required: true })
	sendBy: String;

	@Prop({ type: [{ type: mongoose.Types.ObjectId, ref: "Room", default: [] }] })
	room: RoomDocument;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
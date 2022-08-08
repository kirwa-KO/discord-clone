import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document, ObjectId } from "mongoose";
import { MessageDocument } from "./message.schema";

export type RoomDocument = Room & Document<ObjectId>;

@Schema({ timestamps: true })
export class Room {

	@Prop({ required: true, unique: true })
	name: String;

	@Prop({ required: true })
	createdBy: String;

	@Prop()
	members?: String[];

	@Prop({ type: [{ type: mongoose.Types.ObjectId, ref: "Message", default: [] }] })
	messages?: MessageDocument[];
}

export const RoomSchema = SchemaFactory.createForClass(Room);
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document, ObjectId } from "mongoose";
import { UserDocument } from "src/user/schemas/user.schema";
import { MessageDocument } from "../../message/schemas/message.schema";

export type RoomDocument = Room & Document<ObjectId>;

@Schema({ timestamps: true })
export class Room {

	@Prop({ required: true, unique: true })
	name: string;

	@Prop({ required: true, type: mongoose.Types.ObjectId, ref: "User" })
	createdBy: UserDocument;

	@Prop({ type: [{ type: mongoose.Types.ObjectId, ref: "User", default: [] }] })
	members?: UserDocument[];

	@Prop({ type: [{ type: mongoose.Types.ObjectId, ref: "Message", default: [] }] })
	messages?: MessageDocument[];

	@Prop({ required: true, default: false, select: false })
	isPrivateDm: Boolean;
}

export const RoomSchema = SchemaFactory.createForClass(Room);
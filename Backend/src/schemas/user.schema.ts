import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, ObjectId } from "mongoose";

export type UserDocument = User & Document<ObjectId>;

@Schema({ timestamps: true })
export class User {
	@Prop({ required: true })
	username: String;
}

export const UserSchema = SchemaFactory.createForClass(User);
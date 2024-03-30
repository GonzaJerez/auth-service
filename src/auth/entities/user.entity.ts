import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({
  collection: 'users',
})
export class User {
  @Prop({ type: Types.ObjectId, auto: true })
  _id: string;

  @Prop({
    unique: true,
  })
  email: string;

  @Prop()
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

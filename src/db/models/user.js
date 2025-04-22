import { model, Schema } from 'mongoose';

const usersSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    balance: { type: Number, default: 0 },
    avatar: {
      url: {
        type: String,
        default:
          'https://asset.cloudinary.com/dsunzgaal/5080f18d35d5dbf7bee90c0800a0a7fa',
      },
      public_id: { type: String, default: 'default-avatar' },
    },
  },
  { timestamps: true, versionKey: false },
);

usersSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export const UsersCollection = model('users', usersSchema);

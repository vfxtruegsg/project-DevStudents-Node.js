import { model, Schema } from 'mongoose';
import { CATEGORIES } from '../../constants/index.js';

const transactionsSchema = new Schema(
  {
    date: { type: Date, required: true },
    type: { type: String, enum: ['income', 'expense'], required: true },
    category: {
      type: String,
      enum: [CATEGORIES.INCOME, ...CATEGORIES.EXPENSE],
      required: true,
    },
    comment: { type: String, required: true },
    sum: { type: Number, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'users', required: true },
  },
  { timestamps: false, versionKey: false },
);

export const TransactionsCollection = model('transactions', transactionsSchema);

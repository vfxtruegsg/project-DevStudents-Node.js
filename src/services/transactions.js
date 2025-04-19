import createHttpError from 'http-errors';
import { TransactionsCollection } from '../db/models/transaction.js';
import { obtainBalance } from '../utils/obtainBalance.js';
import { UsersCollection } from '../db/models/user.js';

export const getAllTransactions = async ({ userId }) => {
  const transactions = await TransactionsCollection.find({ userId });

  return transactions;
};

export const createTransaction = async (payload) => {
  const { type, sum, userId } = payload;

  const balance = await obtainBalance(userId);

  const transactionCoefficient = type === 'expense' ? -1 : 1;
  const newBalance = balance + sum * transactionCoefficient;
  if (newBalance < 0) {
    throw createHttpError(400, 'Not correct sum of transaction');
  }

  const [transaction, updateBalance] = await Promise.all([
    TransactionsCollection.create(payload),
    UsersCollection.findOneAndUpdate(
      { _id: userId },
      { balance: newBalance },
      { new: true },
    ),
  ]);

  return {
    transaction: transaction._doc,
    updateBalance: updateBalance.balance,
  };
};

export const updateTransaction = async (id, payload, userId) => {
  const { type, sum } = payload;

  const balance = await obtainBalance(userId);
  const transactionCoefficient = type === 'expense' ? -1 : 1;
  const newBalance = balance + sum * transactionCoefficient;
  if (newBalance < 0) {
    throw createHttpError(400, 'Not correct sum of transaction');
  }

  const [transaction, updateBalance] = await Promise.all([
    TransactionsCollection.findOneAndUpdate({ _id: id }, payload, {
      new: true,
    }),
    UsersCollection.findOneAndUpdate(
      { _id: userId },
      { balance: newBalance },
      { new: true },
    ),
  ]);

  return {
    transaction: transaction._doc,
    updateBalance: updateBalance.balance,
  };
};

export const deleteTransaction = async (id, userId) => {
  const balance = await obtainBalance(userId);

  const transaction = await TransactionsCollection.findOne({ _id: id });

  if (!transaction) {
    throw createHttpError(400, ' Transaction not found!');
  }

  const transactionCoefficient = transaction.type === 'expense' ? -1 : 1;
  const newBalance = balance - transaction.sum * transactionCoefficient;
  if (newBalance < 0) {
    throw createHttpError(
      400,
      'You can not delete this transaction because you will have a negative balance!',
    );
  }

  const [transactionDelete, updateBalance] = await Promise.all([
    TransactionsCollection.findOneAndDelete({ _id: id }),
    UsersCollection.findOneAndUpdate(
      { _id: userId },
      { balance: newBalance },
      { new: true },
    ),
  ]);

  return {
    transaction: transactionDelete._doc,
    updateBalance: updateBalance.balance,
  };
};

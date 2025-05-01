import createHttpError from 'http-errors';
import { TransactionsCollection } from '../db/models/transaction.js';
import { obtainBalance } from '../utils/obtainBalance.js';
import { UsersCollection } from '../db/models/user.js';
import { CATEGORIES } from '../constants/index.js';

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
  const [transaction, updatedBalance] = await Promise.all([
    TransactionsCollection.create(payload),
    UsersCollection.findOneAndUpdate(
      { _id: userId },
      { balance: newBalance },
      { new: true },
    ),
  ]);

  return {
    transaction: transaction._doc,
    updatedBalance: updatedBalance.balance,
  };
};

export const updateTransaction = async (id, payload, userId) => {
  let { type, sum } = payload;
  const currentTransaction = await TransactionsCollection.findOne({
    _id: id,
  });
  const currentType = currentTransaction._doc.type;
  const currentSum = currentTransaction._doc.sum;
  if (type === undefined) {
    type = currentType;
  }
  if (sum === undefined) {
    sum = currentSum;
  }
  const transactionCoefficient = type === 'expense' ? -1 : 1;
  const currentTransactionCoefficient = currentType === 'expense' ? -1 : 1;
  const balance = await obtainBalance(userId);
  const newBalance =
    balance -
    currentSum * currentTransactionCoefficient +
    sum * transactionCoefficient;
  if (newBalance < 0) {
    throw createHttpError(400, 'Not correct sum of transaction');
  }
  const [transaction, updatedBalance] = await Promise.all([
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
    updatedBalance: updatedBalance.balance,
  };
};

export const deleteTransaction = async (id, userId) => {
  const balance = await obtainBalance(userId);
  const transaction = await TransactionsCollection.findOne({ _id: id });
  if (!transaction) {
    throw createHttpError(404, ' Transaction not found!');
  }
  const transactionCoefficient = transaction.type === 'expense' ? -1 : 1;
  const newBalance = balance - transaction.sum * transactionCoefficient;
  if (newBalance < 0) {
    throw createHttpError(
      400,
      'You can not delete this transaction because you will have a negative balance!',
    );
  }
  const [transactionDelete, updatedBalance] = await Promise.all([
    TransactionsCollection.findOneAndDelete({ _id: id }),
    UsersCollection.findOneAndUpdate(
      { _id: userId },
      { balance: newBalance },
      { new: true },
    ),
  ]);

  return {
    transaction: transactionDelete._doc,
    updatedBalance: updatedBalance.balance,
  };
};

export const getTransactionsSummary = async (month, year, userId) => {
  const firstDayOfPeriod = new Date(year, month, 1);
  const firstDayOfNextPeriod = new Date(year, month + 1, 1);
  const transactions = await TransactionsCollection.find({ userId })
    .where('date')
    .gte(firstDayOfPeriod)
    .lt(firstDayOfNextPeriod);
  if (!transactions) {
    throw createHttpError(404, 'Transactions not found!');
  }
  const result = {};
  CATEGORIES.EXPENSE.map((item) => (result[item] = 0));
  result[CATEGORIES.INCOME] = 0;
  result.totalExpenses = 0;
  transactions.map((transaction) => {
    if (transaction.type === 'income') {
      result[CATEGORIES.INCOME] += transaction.sum;
      return;
    }
    result[transaction.category] += transaction.sum;
    result.totalExpenses += transaction.sum;
  });

  return result;
};

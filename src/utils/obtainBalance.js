import { TransactionsCollection } from '../db/models/transaction.js';

export const obtainBalance = async (userId) => {
  const transactions = await TransactionsCollection.find({ userId });
  return transactions.reduce((acc, transaction) => {
    const transactionCoefficient = transaction.type === 'expense' ? -1 : 1;
    return (acc += transaction.sum * transactionCoefficient);
  }, 0);
};

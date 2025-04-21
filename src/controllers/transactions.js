import createHttpError from 'http-errors';
import {
  createTransaction,
  deleteTransaction,
  getAllTransactions,
  getTransactionsSummary,
  updateTransaction,
} from '../services/transactions.js';
import { CATEGORIES } from '../constants/index.js';
import { parseTransactionType } from '../utils/parseTransactionType.js';
import { parseSummaryParams } from '../utils/parseSummaryParams.js';

export const getAllTransactionsController = async (req, res) => {
  const userId = req.user._id;
  const transactions = await getAllTransactions({ userId });

  res.status(200).json({
    status: 200,
    message: 'Successfully found transactions!',
    data: transactions,
  });
};

export const createTransactionController = async (req, res) => {
  const userId = req.user._id;
  const transaction = await createTransaction({ ...req.body, userId });

  res.status(201).json({
    status: 201,
    message: 'Successfully created a transaction!',
    data: transaction,
  });
};

export const updateTransactionController = async (req, res) => {
  const userId = req.user._id;
  const { transactionId } = req.params;
  const result = await updateTransaction(transactionId, req.body, userId);
  if (!result) {
    throw createHttpError(404, 'Transaction not found');
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully updated a transaction!',
    data: result,
  });
};

export const deleteTransactionController = async (req, res) => {
  const userId = req.user._id;
  const { transactionId } = req.params;
  const result = await deleteTransaction(transactionId, userId);
  if (!result) {
    throw createHttpError(404, 'Transaction not found');
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully delete a transaction!',
    data: result,
  });
};

export const getTransactionsCategoryController = (req, res) => {
  const { type: unparsedType } = req.query;
  const type = parseTransactionType(unparsedType);
  const data = type === 'income' ? CATEGORIES.INCOME : CATEGORIES.EXPENSE;

  res.json({
    status: 200,
    message: 'Successfully given a transaction category!',
    data,
  });
};

export const getTransactionsSummaryController = async (req, res) => {
  const userId = req.user._id;
  const { month, year } = parseSummaryParams(req.query);
  if (month === null || year === null) {
    throw createHttpError(400, 'Bad Request');
  }
  const result = await getTransactionsSummary(month, year, userId);

  res.status(200).json({
    status: 200,
    message: 'Successfully find a transactions!',
    data: result,
  });
};

export const parseTransactionType = (type) => {
  const isString = typeof type === 'string';
  if (!isString) return;
  const isKnowType = ['income', 'expense'].includes(type);
  if (isKnowType) return type;
  return;
};

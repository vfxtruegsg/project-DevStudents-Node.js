export const parseNumber = (number, defaultValue) => {
  const isString = typeof number === 'string';
  if (!isString) return defaultValue;
  const parsedNumber = parseInt(number);
  if (Number.isNaN(parsedNumber)) return defaultValue;
  return parsedNumber;
};

export const parseSummaryParams = (query) => {
  const { month, year } = query;
  const parsedMonth = parseNumber(month, null);
  const parsedYear = parseNumber(year, null);
  return { month: parsedMonth, year: parsedYear };
};

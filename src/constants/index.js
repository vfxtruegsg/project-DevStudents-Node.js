import path from 'node:path';

export const TEMPLATES_DIR = path.resolve('src', 'templates');

export const TEMP_UPLOAD_DIR = path.resolve('temp');

export const UPLOADS_DIR = path.resolve('uploads');

export const THREE_HOURS = 3 * 60 * 60 * 1000;
export const ONE_DAY = 24 * 60 * 60 * 1000;
export const CATEGORIES = {
  INCOME: 'Incomes',
  EXPENSE: [
    'Main expenses',
    'Products',
    'Car',
    'Self care',
    'Child care',
    'Household products',
    'Education',
    'Leisure',
    'Other expenses',
    'Entertainment',
  ],
};
export const SWAGGER_PATH = path.join(process.cwd(), 'docs', 'swagger.json');

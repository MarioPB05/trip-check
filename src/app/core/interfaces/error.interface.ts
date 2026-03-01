import { ErrorType } from '@core/types/error.types';

export interface ErrorInterface {
  title: string;
  message: string;
  type: ErrorType;
  gravity: 'low' | 'high';
}

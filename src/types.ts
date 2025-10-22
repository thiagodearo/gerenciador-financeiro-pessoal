
export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

export interface Installment {
  current: number;
  total: number;
}

export interface Account {
  id: string;
  name: string;
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  type: TransactionType;
  category: string;
  cardId?: string;
  accountId?: string;
  installments?: Installment;
  isFromRecurring?: boolean;
}

export interface Card {
  id:string;
  name: string;
  limit: number;
  closingDay: number;
}

export interface RecurringTransaction {
  id: string;
  description: string;
  amount: number;
  category: string;
  startDate: string;
  endDate: string;
  cardId?: string;
  accountId?: string;
}

export type WidgetKey = 'monthlySummary' | 'categoryChart' | 'accounts' | 'cards' | 'recurringTransactions' | 'transactionList';

export type VisibleWidgets = {
  [key in WidgetKey]: boolean;
};
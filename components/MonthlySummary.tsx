import React from 'react';
import { Transaction, TransactionType } from '../types';
import { Icon } from './common/Icon';

interface MonthlySummaryProps {
  transactions: Transaction[];
}

const formatCurrency = (value: number) => `R$ ${value.toFixed(2)}`;

const calculateStats = (transactions: Transaction[]) => {
  const income = transactions
    .filter((t) => t.type === TransactionType.INCOME)
    .reduce((sum, t) => sum + t.amount, 0);
  const expense = transactions
    .filter((t) => t.type === TransactionType.EXPENSE)
    .reduce((sum, t) => sum + t.amount, 0);
  const balance = income - expense;
  return { income, expense, balance };
};

const calculatePercentageChange = (current: number, previous: number) => {
  if (previous === 0) {
    return current > 0 ? 100 : 0;
  }
  if (current === 0 && previous !== 0) {
    return -100;
  }
  return ((current - previous) / Math.abs(previous)) * 100;
};

const ChangeIndicator: React.FC<{ change: number; positiveIsGood?: boolean }> = ({ change, positiveIsGood = true }) => {
  if (change === 0 || !isFinite(change)) {
    return <span className="text-text-secondary text-xs h-5">--</span>;
  }

  const isPositive = change > 0;
  const isGood = positiveIsGood ? isPositive : !isPositive;
  const color = isGood ? 'text-income' : 'text-expense';
  const icon = isPositive ? 'arrow-up-right' : 'arrow-down-right';

  return (
    <div className={`flex items-center text-xs font-semibold ${color} h-5`}>
      <Icon name={icon} className="w-3 h-3 mr-1" />
      <span>{Math.abs(change).toFixed(1)}% vs. mês anterior</span>
    </div>
  );
};


const SummaryStat: React.FC<{ title: string; value: number; change: number; positiveIsGood?: boolean }> = ({ title, value, change, positiveIsGood }) => {
  return (
    <div className="bg-primary p-4 rounded-lg">
      <p className="text-sm text-text-secondary">{title}</p>
      <p className="text-xl font-bold text-text-primary">{formatCurrency(value)}</p>
      <ChangeIndicator change={change} positiveIsGood={positiveIsGood} />
    </div>
  );
};


export const MonthlySummary: React.FC<MonthlySummaryProps> = ({ transactions }) => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const prevMonthDate = new Date(currentYear, currentMonth - 1, 1);
  const prevYear = prevMonthDate.getFullYear();
  const prevMonth = prevMonthDate.getMonth();
  
  const currentMonthTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      // Adjust for timezone issues by only comparing year, month, and day parts
      return transactionDate.getUTCFullYear() === currentYear && transactionDate.getUTCMonth() === currentMonth;
  });

  const prevMonthTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate.getUTCFullYear() === prevYear && transactionDate.getUTCMonth() === prevMonth;
  });

  const currentStats = calculateStats(currentMonthTransactions);
  const prevStats = calculateStats(prevMonthTransactions);

  const incomeChange = calculatePercentageChange(currentStats.income, prevStats.income);
  const expenseChange = calculatePercentageChange(currentStats.expense, prevStats.expense);
  const balanceChange = calculatePercentageChange(currentStats.balance, prevStats.balance);

  const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
  const currentMonthName = monthNames[currentMonth];

  return (
    <div className="bg-secondary p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold text-highlight mb-4">Resumo de {currentMonthName}</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SummaryStat title="Receitas" value={currentStats.income} change={incomeChange} positiveIsGood={true} />
        <SummaryStat title="Despesas" value={currentStats.expense} change={expenseChange} positiveIsGood={false} />
        <SummaryStat title="Saldo" value={currentStats.balance} change={balanceChange} positiveIsGood={true} />
      </div>
    </div>
  );
};

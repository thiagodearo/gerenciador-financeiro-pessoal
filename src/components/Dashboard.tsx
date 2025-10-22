
import React from 'react';
import { Transaction, TransactionType, Card, Account, VisibleWidgets, RecurringTransaction } from '../types';
import { TransactionList } from './TransactionList';
import { CategoryChart } from './CategoryChart';
import { CardManager } from './CardManager';
import { Icon } from './common/Icon';
import { MonthlySummary } from './MonthlySummary';
import { AccountManager } from './AccountManager';
import { RecurringTransactionManager } from './RecurringTransactionManager';

interface DashboardProps {
  transactions: Transaction[];
  cards: Card[];
  accounts: Account[];
  recurringTransactions: RecurringTransaction[];
  widgets: VisibleWidgets;
  onOpenTransactionModal: (transaction?: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
  onSaveCard: (card: Card) => void;
  onDeleteCard: (id: string) => void;
  onSaveAccount: (account: Account) => void;
  onDeleteAccount: (id: string) => void;
  onSaveRecurringTransaction: (rt: RecurringTransaction) => void;
  onDeleteRecurringTransaction: (id: string) => void;
}

const StatCard: React.FC<{ title: string; amount: number; icon: 'trending-up' | 'trending-down' | 'dollar-sign' | 'wallet'; color: string }> = ({ title, amount, icon, color }) => (
  <div className="bg-secondary p-6 rounded-lg shadow-lg flex items-center gap-4">
    <div className={`p-3 rounded-full bg-${color}/20`}>
      <Icon name={icon} className={`w-8 h-8 text-${color}`} />
    </div>
    <div>
      <p className="text-text-secondary">{title}</p>
      <p className="text-2xl font-bold text-text-primary">R$ {amount.toFixed(2)}</p>
    </div>
  </div>
);


export const Dashboard: React.FC<DashboardProps> = (props) => {
  const { transactions, cards, accounts, recurringTransactions, widgets } = props;
  const { onOpenTransactionModal, onDeleteTransaction, onSaveCard, onDeleteCard, onSaveAccount, onDeleteAccount, onSaveRecurringTransaction, onDeleteRecurringTransaction } = props;

  const totalIncome = transactions
    .filter((t) => t.type === TransactionType.INCOME)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === TransactionType.EXPENSE)
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;
  
  const accountBalance = transactions.reduce((balance, t) => {
    if (t.accountId) {
      if (t.type === TransactionType.INCOME) {
        return balance + t.amount;
      } else if (t.type === TransactionType.EXPENSE) {
        return balance - t.amount;
      }
    }
    return balance;
  }, 0);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Receitas Totais" amount={totalIncome} icon="trending-up" color="income" />
        <StatCard title="Despesas Totais" amount={totalExpense} icon="trending-down" color="expense" />
        <StatCard title="Saldo em Contas" amount={accountBalance} icon="wallet" color="highlight" />
        <StatCard title="Saldo Geral" amount={balance} icon="dollar-sign" color={balance >= 0 ? 'highlight' : 'expense'} />
      </div>
      
      {widgets.monthlySummary && <MonthlySummary transactions={transactions} />}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
           {widgets.transactionList && <TransactionList 
              transactions={transactions} 
              cards={cards}
              accounts={accounts}
              onEdit={onOpenTransactionModal} 
              onDelete={onDeleteTransaction} 
            />}
        </div>
        <div className="space-y-8">
          {widgets.categoryChart && <CategoryChart transactions={transactions} />}
          {widgets.recurringTransactions && <RecurringTransactionManager recurringTransactions={recurringTransactions} onSave={onSaveRecurringTransaction} onDelete={onDeleteRecurringTransaction} cards={cards} accounts={accounts} />}
          {widgets.accounts && <AccountManager accounts={accounts} onSave={onSaveAccount} onDelete={onDeleteAccount} />}
          {widgets.cards && <CardManager cards={cards} onSave={onSaveCard} onDelete={onDeleteCard} />}
        </div>
      </div>
    </div>
  );
};
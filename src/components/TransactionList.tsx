
import React from 'react';
import { Transaction, TransactionType, Card, Account } from '../types';
import { Icon } from './common/Icon';

interface TransactionListProps {
  transactions: Transaction[];
  cards: Card[];
  accounts: Account[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

const TransactionItem: React.FC<{ transaction: Transaction; cardName?: string; accountName?: string; onEdit: () => void; onDelete: () => void; }> = ({ transaction, cardName, accountName, onEdit, onDelete }) => {
  const isIncome = transaction.type === TransactionType.INCOME;
  const isFromRecurring = transaction.isFromRecurring ?? false;
  const amountColor = isIncome ? 'text-income' : 'text-expense';
  const sign = isIncome ? '+' : '-';
  
  return (
    <li className="bg-secondary p-4 rounded-lg flex items-center justify-between hover:bg-gray-700/50 transition-colors duration-200">
      <div className="flex items-center gap-4">
        <div className={`p-2 rounded-full ${isIncome ? 'bg-income/20' : 'bg-expense/20'}`}>
           <Icon name={isIncome ? 'trending-up' : 'trending-down'} className={`w-6 h-6 ${isIncome ? 'text-income' : 'text-expense'}`} />
        </div>
        <div>
          <p className="font-semibold text-text-primary flex items-center gap-2">
            {transaction.description}
            {isFromRecurring && <Icon name="arrow-path" className="w-4 h-4 text-accent" title="Despesa Recorrente" />}
          </p>
          <p className="text-sm text-text-secondary">
            {transaction.category} &bull; {new Date(transaction.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
            {cardName && ` 💳 ${cardName}`}
            {accountName && ` 🏦 ${accountName}`}
            {transaction.installments && ` (${transaction.installments.current}/${transaction.installments.total})`}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className={`font-bold text-lg ${amountColor}`}>{sign} R$ {transaction.amount.toFixed(2)}</span>
        <div className="flex gap-2">
            <button onClick={onEdit} disabled={isFromRecurring} className="text-text-secondary hover:text-accent disabled:opacity-50 disabled:cursor-not-allowed"><Icon name="edit" className="w-5 h-5"/></button>
            <button onClick={onDelete} disabled={isFromRecurring} className="text-text-secondary hover:text-expense disabled:opacity-50 disabled:cursor-not-allowed"><Icon name="trash" className="w-5 h-5"/></button>
        </div>
      </div>
    </li>
  );
};


export const TransactionList: React.FC<TransactionListProps> = ({ transactions, cards, accounts, onEdit, onDelete }) => {
  if (transactions.length === 0) {
    return <div className="text-center py-10 text-text-secondary">Nenhuma transação encontrada.</div>;
  }
  
  const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-3">
      <h3 className="text-xl font-bold text-highlight mb-4">Últimas Transações</h3>
      <ul className="space-y-3">
        {sortedTransactions.map((t) => (
          <TransactionItem
            key={t.id}
            transaction={t}
            cardName={cards.find(c => c.id === t.cardId)?.name}
            accountName={accounts.find(a => a.id === t.accountId)?.name}
            onEdit={() => onEdit(t)}
            onDelete={() => onDelete(t.id)}
          />
        ))}
      </ul>
    </div>
  );
};
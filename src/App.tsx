import React, { useState, useMemo } from 'react';
import { Transaction, Card, Account, RecurringTransaction, VisibleWidgets, TransactionType } from './types';
import useLocalStorage from './hooks/useLocalStorage';
import { Dashboard } from './components/Dashboard';
import { TransactionForm } from './components/TransactionForm';
import { Button } from './components/common/Button';
import { Icon } from './components/common/Icon';
import { CustomizeDashboardModal } from './components/CustomizeDashboardModal';

const defaultWidgets: VisibleWidgets = {
  monthlySummary: true,
  categoryChart: true,
  accounts: true,
  cards: true,
  recurringTransactions: true,
  transactionList: true,
};

function App() {
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('transactions', []);
  const [cards, setCards] = useLocalStorage<Card[]>('cards', []);
  const [accounts, setAccounts] = useLocalStorage<Account[]>('accounts', []);
  const [recurringTransactions, setRecurringTransactions] = useLocalStorage<RecurringTransaction[]>('recurringTransactions', []);
  const [widgets, setWidgets] = useLocalStorage<VisibleWidgets>('widgets', defaultWidgets);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCustomizeModalOpen, setIsCustomizeModalOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState<Transaction | null>(null);

  const allTransactions = useMemo(() => {
    const generatedTransactions: Transaction[] = [];
    const today = new Date();

    recurringTransactions.forEach(rt => {
        let currentDate = new Date(rt.startDate);
        currentDate.setUTCHours(12,0,0,0);
        const endDate = new Date(rt.endDate);
        endDate.setUTCHours(12,0,0,0);

        while (currentDate <= today && currentDate <= endDate) {
            const transactionId = `recurring-${rt.id}-${currentDate.getFullYear()}-${currentDate.getMonth()}`;
            
            if (!transactions.some(t => t.id === transactionId) && !generatedTransactions.some(t => t.id === transactionId)) {
                 generatedTransactions.push({
                    id: transactionId,
                    description: rt.description,
                    amount: rt.amount,
                    date: new Date(currentDate).toISOString().split('T')[0],
                    type: TransactionType.EXPENSE,
                    category: rt.category,
                    cardId: rt.cardId,
                    accountId: rt.accountId,
                    isFromRecurring: true,
                });
            }
            
            currentDate.setUTCMonth(currentDate.getUTCMonth() + 1);
        }
    });

    return [...transactions, ...generatedTransactions];
  }, [transactions, recurringTransactions]);

  const handleOpenModal = (transaction?: Transaction) => {
    setTransactionToEdit(transaction || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setTransactionToEdit(null);
    setIsModalOpen(false);
  };

  const handleSaveTransaction = (transaction: Transaction) => {
    if (transaction.isFromRecurring) return;
    const exists = transactions.some(t => t.id === transaction.id);
    if (exists) {
      setTransactions(transactions.map(t => t.id === transaction.id ? transaction : t));
    } else {
      setTransactions([...transactions, transaction]);
    }
  };

  const handleDeleteTransaction = (id: string) => {
    const transaction = allTransactions.find(t => t.id === id);
    if (transaction?.isFromRecurring) {
        alert("Para remover uma despesa recorrente, exclua a regra na seção 'Despesas Fixas'.");
        return;
    }
    if(window.confirm('Tem certeza que deseja excluir esta transação?')) {
        setTransactions(transactions.filter(t => t.id !== id));
    }
  };

  const handleSaveCard = (card: Card) => {
    const exists = cards.some(c => c.id === card.id);
    if (exists) {
      setCards(cards.map(c => c.id === card.id ? card : c));
    } else {
      setCards([...cards, card]);
    }
  };

  const handleDeleteCard = (id: string) => {
    if(window.confirm('Tem certeza que deseja excluir este cartão?')) {
      setCards(cards.filter(c => c.id !== id));
      setTransactions(transactions.map(t => t.cardId === id ? { ...t, cardId: undefined } : t));
      setRecurringTransactions(recurringTransactions.map(rt => rt.cardId === id ? { ...rt, cardId: undefined } : rt));
    }
  };

  const handleSaveAccount = (account: Account) => {
    const exists = accounts.some(a => a.id === account.id);
    if (exists) {
      setAccounts(accounts.map(a => a.id === account.id ? account : a));
    } else {
      setAccounts([...accounts, account]);
    }
  };

  const handleDeleteAccount = (id: string) => {
    if(window.confirm('Tem certeza que deseja excluir esta conta?')) {
      setAccounts(accounts.filter(a => a.id !== id));
      setTransactions(transactions.map(t => t.accountId === id ? { ...t, accountId: undefined } : t));
      setRecurringTransactions(recurringTransactions.map(rt => rt.accountId === id ? { ...rt, accountId: undefined } : rt));
    }
  };
  
  const handleSaveRecurringTransaction = (rt: RecurringTransaction) => {
    const exists = recurringTransactions.some(r => r.id === rt.id);
    if (exists) {
      setRecurringTransactions(recurringTransactions.map(r => r.id === rt.id ? rt : r));
    } else {
      setRecurringTransactions([...recurringTransactions, rt]);
    }
  }

  const handleDeleteRecurringTransaction = (id: string) => {
      if (window.confirm('Tem certeza que deseja excluir esta regra de despesa fixa? Todas as transações futuras geradas por ela não aparecerão mais.')) {
          setRecurringTransactions(recurringTransactions.filter(rt => rt.id !== id));
      }
  }

  return (
    <div className="min-h-screen bg-primary font-sans">
      <header className="bg-secondary shadow-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl md:text-3xl font-bold text-highlight">Financeiro Inteligente</h1>
           <div className="flex items-center gap-2 md:gap-4">
            <Button onClick={() => setIsCustomizeModalOpen(true)} variant="secondary" title="Personalizar Painel">
              <Icon name="cog-6-tooth" className="w-5 h-5"/>
            </Button>
            
            <Button onClick={() => handleOpenModal()} title="Nova Transação">
              <Icon name="plus" className="w-5 h-5"/>
              <span className="hidden md:inline">Nova Transação</span>
            </Button>
          </div>
        </div>
      </header>
      <main className="container mx-auto p-4 md:p-8">
        <Dashboard 
          transactions={allTransactions}
          cards={cards}
          accounts={accounts}
          recurringTransactions={recurringTransactions}
          widgets={widgets}
          onOpenTransactionModal={handleOpenModal}
          onDeleteTransaction={handleDeleteTransaction}
          onSaveCard={handleSaveCard}
          onDeleteCard={handleDeleteCard}
          onSaveAccount={handleSaveAccount}
          onDeleteAccount={handleDeleteAccount}
          onSaveRecurringTransaction={handleSaveRecurringTransaction}
          onDeleteRecurringTransaction={handleDeleteRecurringTransaction}
        />
      </main>
      <TransactionForm 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveTransaction}
        cards={cards}
        accounts={accounts}
        transactionToEdit={transactionToEdit}
      />
      <CustomizeDashboardModal
        isOpen={isCustomizeModalOpen}
        onClose={() => setIsCustomizeModalOpen(false)}
        widgets={widgets}
        onWidgetsChange={setWidgets}
      />
    </div>
  );
}

export default App;
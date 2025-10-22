
import React, { useState, useEffect, useCallback } from 'react';
import { Transaction, TransactionType, Card, Installment, Account } from '../types';
import { CATEGORIES } from '../constants';
import { categorizeTransaction } from '../services/geminiService';
import { Modal } from './common/Modal';
import { Input } from './common/Input';
import { Select } from './common/Select';
import { Button } from './common/Button';

interface TransactionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (transaction: Transaction) => void;
  cards: Card[];
  accounts: Account[];
  transactionToEdit?: Transaction | null;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({ isOpen, onClose, onSave, cards, accounts, transactionToEdit }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [category, setCategory] = useState('');
  const [cardId, setCardId] = useState<string | undefined>(undefined);
  const [accountId, setAccountId] = useState<string | undefined>(undefined);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'account'>('card');
  const [isInstallment, setIsInstallment] = useState(false);
  const [installments, setInstallments] = useState<Installment>({ current: 1, total: 1 });
  
  const [isCategorizing, setIsCategorizing] = useState(false);

  useEffect(() => {
    if (transactionToEdit) {
      setDescription(transactionToEdit.description);
      setAmount(String(transactionToEdit.amount));
      setDate(transactionToEdit.date);
      setType(transactionToEdit.type);
      setCategory(transactionToEdit.category);
      setCardId(transactionToEdit.cardId);
      setAccountId(transactionToEdit.accountId);
      if (transactionToEdit.accountId) {
        setPaymentMethod('account');
      } else if (transactionToEdit.cardId) {
        setPaymentMethod('card');
      }
      setIsInstallment(!!transactionToEdit.installments);
      setInstallments(transactionToEdit.installments || { current: 1, total: 1 });
    } else {
      // Reset form
      setDescription('');
      setAmount('');
      setDate(new Date().toISOString().split('T')[0]);
      setType(TransactionType.EXPENSE);
      setCategory('');
      setCardId(undefined);
      setAccountId(undefined);
      setPaymentMethod('card');
      setIsInstallment(false);
      setInstallments({ current: 1, total: 1 });
    }
  }, [transactionToEdit, isOpen]);

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  };
  
  const getCategorySuggestion = useCallback(async () => {
    if (description.length > 5 && type === TransactionType.EXPENSE) {
      setIsCategorizing(true);
      const suggestedCategory = await categorizeTransaction(description);
      setCategory(suggestedCategory);
      setIsCategorizing(false);
    }
  }, [description, type]);

  useEffect(() => {
    const handler = setTimeout(() => {
        getCategorySuggestion();
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [description, type]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (type === TransactionType.INCOME && !accountId) {
        alert('Por favor, selecione uma conta para a receita.');
        return;
    }
    if (type === TransactionType.EXPENSE && paymentMethod === 'account' && !accountId) {
        alert('Por favor, selecione uma conta para a despesa.');
        return;
    }

    const transaction: Transaction = {
      id: transactionToEdit ? transactionToEdit.id : new Date().toISOString(),
      description,
      amount: parseFloat(amount),
      date,
      type,
      category: type === TransactionType.INCOME ? 'Salário' : category,
      cardId: type === TransactionType.EXPENSE && paymentMethod === 'card' ? cardId : undefined,
      accountId: type === TransactionType.INCOME ? accountId : (type === TransactionType.EXPENSE && paymentMethod === 'account' ? accountId : undefined),
      installments: isInstallment && paymentMethod === 'card' ? installments : undefined,
    };
    onSave(transaction);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={transactionToEdit ? 'Editar Transação' : 'Nova Transação'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Descrição" id="description" type="text" value={description} onChange={handleDescriptionChange} required />
        <Input label="Valor (R$)" id="amount" type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} required />
        <Input label="Data" id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        <Select label="Tipo" id="type" value={type} onChange={(e) => setType(e.target.value as TransactionType)}>
          <option value={TransactionType.INCOME}>Receita</option>
          <option value={TransactionType.EXPENSE}>Despesa</option>
        </Select>

        {type === TransactionType.INCOME && (
           <Select label="Conta" id="account" value={accountId || ''} onChange={(e) => setAccountId(e.target.value)} required>
              <option value="">Selecione a conta de destino</option>
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>{acc.name}</option>
              ))}
            </Select>
        )}

        {type === TransactionType.EXPENSE && (
          <>
            <div className="relative">
              <Select label="Categoria" id="category" value={category} onChange={(e) => setCategory(e.target.value)} required>
                <option value="">Selecione uma categoria</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </Select>
              {isCategorizing && <div className="absolute top-8 right-3 text-xs text-highlight">Sugerindo...</div>}
            </div>
            
            <Select label="Forma de Pagamento" id="paymentMethod" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value as 'card' | 'account')}>
              <option value="card">Cartão de Crédito</option>
              <option value="account">Conta (Débito/PIX)</option>
            </Select>

            {paymentMethod === 'card' && (
              <>
                <Select label="Cartão de Crédito" id="card" value={cardId || ''} onChange={(e) => setCardId(e.target.value || undefined)}>
                  <option value="">Nenhum (Dinheiro)</option>
                  {cards.map((card) => (
                    <option key={card.id} value={card.id}>{card.name}</option>
                  ))}
                </Select>
                 {cardId && (
                   <div>
                      <div className="flex items-center">
                          <input type="checkbox" id="isInstallment" checked={isInstallment} onChange={(e) => setIsInstallment(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-accent focus:ring-accent" />
                          <label htmlFor="isInstallment" className="ml-2 block text-sm text-text-secondary">É parcelado?</label>
                      </div>
                      {isInstallment && (
                          <div className="flex gap-4 mt-2">
                              <Input label="Parcela" type="number" id="currentInstallment" value={installments.current} onChange={(e) => setInstallments({ ...installments, current: parseInt(e.target.value) })}/>
                              <Input label="de" type="number" id="totalInstallments" value={installments.total} onChange={(e) => setInstallments({ ...installments, total: parseInt(e.target.value) })}/>
                          </div>
                      )}
                   </div>
                 )}
              </>
            )}

            {paymentMethod === 'account' && (
               <Select label="Conta" id="expense-account" value={accountId || ''} onChange={(e) => setAccountId(e.target.value)} required>
                  <option value="">Selecione a conta de origem</option>
                  {accounts.map((acc) => (
                    <option key={acc.id} value={acc.id}>{acc.name}</option>
                  ))}
                </Select>
            )}
          </>
        )}
        <div className="flex justify-end gap-4 pt-4">
            <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
            <Button type="submit" variant="primary">Salvar</Button>
        </div>
      </form>
    </Modal>
  );
};
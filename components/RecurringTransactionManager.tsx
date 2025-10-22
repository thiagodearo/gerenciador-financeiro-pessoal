import React, { useState, useEffect } from 'react';
// FIX: Import CATEGORIES from '../constants' instead of '../types'
import { RecurringTransaction, Card, Account } from '../types';
import { CATEGORIES } from '../constants';
import { Modal } from './common/Modal';
import { Input } from './common/Input';
import { Button } from './common/Button';
import { Icon } from './common/Icon';
import { Select } from './common/Select';

interface RecurringTransactionManagerProps {
  recurringTransactions: RecurringTransaction[];
  cards: Card[];
  accounts: Account[];
  onSave: (rt: RecurringTransaction) => void;
  onDelete: (id: string) => void;
}

export const RecurringTransactionManager: React.FC<RecurringTransactionManagerProps> = ({ recurringTransactions, cards, accounts, onSave, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<RecurringTransaction | null>(null);

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'account'>('account');
  const [cardId, setCardId] = useState<string | undefined>(undefined);
  const [accountId, setAccountId] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (itemToEdit) {
      setDescription(itemToEdit.description);
      setAmount(String(itemToEdit.amount));
      setCategory(itemToEdit.category);
      setStartDate(itemToEdit.startDate);
      setEndDate(itemToEdit.endDate);
      setCardId(itemToEdit.cardId);
      setAccountId(itemToEdit.accountId);
      if (itemToEdit.cardId) setPaymentMethod('card');
      if (itemToEdit.accountId) setPaymentMethod('account');
      setIsModalOpen(true);
    } else {
      setDescription('');
      setAmount('');
      setCategory('');
      setStartDate(new Date().toISOString().split('T')[0]);
      setEndDate('');
      setCardId(undefined);
      setAccountId(undefined);
    }
  }, [itemToEdit]);
  
  const handleOpenModal = (item?: RecurringTransaction) => {
    setItemToEdit(item || null);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setItemToEdit(null);
    setIsModalOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || !category || !startDate || !endDate) {
        alert("Por favor, preencha todos os campos obrigatórios.");
        return;
    }
    onSave({
      id: itemToEdit ? itemToEdit.id : new Date().toISOString(),
      description,
      amount: parseFloat(amount),
      category,
      startDate,
      endDate,
      cardId: paymentMethod === 'card' ? cardId : undefined,
      accountId: paymentMethod === 'account' ? accountId : undefined,
    });
    handleCloseModal();
  };
  
  return (
    <div className="bg-secondary p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-highlight">Despesas Fixas</h3>
        <Button onClick={() => handleOpenModal()}><Icon name="plus" className="w-5 h-5"/> Adicionar</Button>
      </div>
      <div className="space-y-3">
        {recurringTransactions.length === 0 ? (
          <p className="text-text-secondary text-center py-4">Nenhuma despesa fixa cadastrada.</p>
        ) : (
          recurringTransactions.map(rt => (
            <div key={rt.id} className="bg-primary p-4 rounded-lg flex justify-between items-center">
              <div>
                <p className="font-semibold">{rt.description} - R$ {rt.amount.toFixed(2)}</p>
                <p className="text-sm text-text-secondary">
                  {new Date(rt.startDate).toLocaleDateString('pt-BR', {timeZone: 'UTC'})} até {new Date(rt.endDate).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}
                </p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleOpenModal(rt)} className="text-text-secondary hover:text-accent"><Icon name="edit" className="w-5 h-5"/></button>
                <button onClick={() => onDelete(rt.id)} className="text-text-secondary hover:text-expense"><Icon name="trash" className="w-5 h-5"/></button>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={itemToEdit ? "Editar Despesa Fixa" : "Nova Despesa Fixa"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Descrição" id="rt-desc" type="text" value={description} onChange={e => setDescription(e.target.value)} required />
          <Input label="Valor (R$)" id="rt-amount" type="number" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} required />
          <Select label="Categoria" id="rt-category" value={category} onChange={(e) => setCategory(e.target.value)} required>
            <option value="">Selecione uma categoria</option>
            {CATEGORIES.filter(c => c !== 'Salário').map((cat) => ( <option key={cat} value={cat}>{cat}</option> ))}
          </Select>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Data de Início" id="rt-startDate" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required />
            <Input label="Data de Término" id="rt-endDate" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} required />
          </div>

          <Select label="Forma de Pagamento" id="rt-paymentMethod" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value as 'card' | 'account')}>
            <option value="account">Conta (Débito/PIX)</option>
            <option value="card">Cartão de Crédito</option>
          </Select>

          {paymentMethod === 'card' && (
            <Select label="Cartão de Crédito" id="rt-card" value={cardId || ''} onChange={(e) => setCardId(e.target.value || undefined)} required>
              <option value="">Selecione um Cartão</option>
              {cards.map((card) => ( <option key={card.id} value={card.id}>{card.name}</option> ))}
            </Select>
          )}

          {paymentMethod === 'account' && (
             <Select label="Conta" id="rt-expense-account" value={accountId || ''} onChange={(e) => setAccountId(e.target.value)} required>
                <option value="">Selecione a conta de origem</option>
                {accounts.map((acc) => ( <option key={acc.id} value={acc.id}>{acc.name}</option> ))}
              </Select>
          )}
          
          <div className="flex justify-end gap-4 pt-4">
            <Button type="button" variant="secondary" onClick={handleCloseModal}>Cancelar</Button>
            <Button type="submit" variant="primary">Salvar</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
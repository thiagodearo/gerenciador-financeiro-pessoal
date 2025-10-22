
import React, { useState, useEffect } from 'react';
import { Account } from '../types';
import { Modal } from './common/Modal';
import { Input } from './common/Input';
import { Button } from './common/Button';
import { Icon } from './common/Icon';

interface AccountManagerProps {
  accounts: Account[];
  onSave: (account: Account) => void;
  onDelete: (accountId: string) => void;
}

export const AccountManager: React.FC<AccountManagerProps> = ({ accounts, onSave, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [accountToEdit, setAccountToEdit] = useState<Account | null>(null);

  const [name, setName] = useState('');

  useEffect(() => {
    if (accountToEdit) {
      setName(accountToEdit.name);
      setIsModalOpen(true);
    } else {
      setName('');
    }
  }, [accountToEdit]);

  const handleOpenModal = (account?: Account) => {
    setAccountToEdit(account || null);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setAccountToEdit(null);
    setIsModalOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: accountToEdit ? accountToEdit.id : new Date().toISOString(),
      name,
    });
    handleCloseModal();
  };
  
  return (
    <div className="bg-secondary p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-highlight">Minhas Contas</h3>
        <Button onClick={() => handleOpenModal()}><Icon name="plus" className="w-5 h-5"/> Adicionar Conta</Button>
      </div>
      <div className="space-y-3">
        {accounts.length === 0 ? (
          <p className="text-text-secondary text-center py-4">Nenhuma conta cadastrada.</p>
        ) : (
          accounts.map(account => (
            <div key={account.id} className="bg-primary p-4 rounded-lg flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Icon name="building-library" className="w-6 h-6 text-highlight" />
                <p className="font-semibold">{account.name}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleOpenModal(account)} className="text-text-secondary hover:text-accent"><Icon name="edit" className="w-5 h-5"/></button>
                <button onClick={() => onDelete(account.id)} className="text-text-secondary hover:text-expense"><Icon name="trash" className="w-5 h-5"/></button>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={accountToEdit ? "Editar Conta" : "Nova Conta"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Nome da Conta (ex: Banco, Carteira)" id="accountName" type="text" value={name} onChange={e => setName(e.target.value)} required />
          <div className="flex justify-end gap-4 pt-4">
            <Button type="button" variant="secondary" onClick={handleCloseModal}>Cancelar</Button>
            <Button type="submit" variant="primary">Salvar</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

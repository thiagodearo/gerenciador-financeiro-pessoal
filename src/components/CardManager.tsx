
import React, { useState, useEffect } from 'react';
import { Card } from '../types';
import { Modal } from './common/Modal';
import { Input } from './common/Input';
import { Button } from './common/Button';
import { Icon } from './common/Icon';

interface CardManagerProps {
  cards: Card[];
  onSave: (card: Card) => void;
  onDelete: (cardId: string) => void;
}

export const CardManager: React.FC<CardManagerProps> = ({ cards, onSave, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cardToEdit, setCardToEdit] = useState<Card | null>(null);

  const [name, setName] = useState('');
  const [limit, setLimit] = useState('');
  const [closingDay, setClosingDay] = useState('');

  useEffect(() => {
    if (cardToEdit) {
      setName(cardToEdit.name);
      setLimit(String(cardToEdit.limit));
      setClosingDay(String(cardToEdit.closingDay));
      setIsModalOpen(true);
    } else {
      setName('');
      setLimit('');
      setClosingDay('');
    }
  }, [cardToEdit]);

  const handleOpenModal = (card?: Card) => {
    setCardToEdit(card || null);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setCardToEdit(null);
    setIsModalOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: cardToEdit ? cardToEdit.id : new Date().toISOString(),
      name,
      limit: parseFloat(limit),
      closingDay: parseInt(closingDay),
    });
    handleCloseModal();
  };
  
  return (
    <div className="bg-secondary p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-highlight">Meus Cartões</h3>
        <Button onClick={() => handleOpenModal()}><Icon name="plus" className="w-5 h-5"/> Adicionar Cartão</Button>
      </div>
      <div className="space-y-3">
        {cards.length === 0 ? (
          <p className="text-text-secondary text-center py-4">Nenhum cartão cadastrado.</p>
        ) : (
          cards.map(card => (
            <div key={card.id} className="bg-primary p-4 rounded-lg flex justify-between items-center">
              <div>
                <p className="font-semibold">{card.name}</p>
                <p className="text-sm text-text-secondary">Limite: R$ {card.limit.toFixed(2)} &bull; Fechamento: Dia {card.closingDay}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleOpenModal(card)} className="text-text-secondary hover:text-accent"><Icon name="edit" className="w-5 h-5"/></button>
                <button onClick={() => onDelete(card.id)} className="text-text-secondary hover:text-expense"><Icon name="trash" className="w-5 h-5"/></button>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={cardToEdit ? "Editar Cartão" : "Novo Cartão"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Nome do Cartão" id="cardName" type="text" value={name} onChange={e => setName(e.target.value)} required />
          <Input label="Limite (R$)" id="cardLimit" type="number" step="0.01" value={limit} onChange={e => setLimit(e.target.value)} required />
          <Input label="Dia de Fechamento" id="cardClosingDay" type="number" min="1" max="31" value={closingDay} onChange={e => setClosingDay(e.target.value)} required />
          <div className="flex justify-end gap-4 pt-4">
            <Button type="button" variant="secondary" onClick={handleCloseModal}>Cancelar</Button>
            <Button type="submit" variant="primary">Salvar</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
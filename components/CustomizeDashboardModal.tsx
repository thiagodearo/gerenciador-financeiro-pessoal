
import React from 'react';
import { Modal } from './common/Modal';
import { Button } from './common/Button';
import { VisibleWidgets, WidgetKey } from '../types';

interface CustomizeDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  widgets: VisibleWidgets;
  onWidgetsChange: (widgets: VisibleWidgets) => void;
}

const WIDGET_LABELS: Record<WidgetKey, string> = {
  monthlySummary: 'Resumo Mensal',
  categoryChart: 'Gráfico de Categorias',
  transactionList: 'Lista de Transações',
  accounts: 'Gerenciador de Contas',
  cards: 'Gerenciador de Cartões',
  recurringTransactions: 'Despesas Fixas',
};

export const CustomizeDashboardModal: React.FC<CustomizeDashboardModalProps> = ({ isOpen, onClose, widgets, onWidgetsChange }) => {
  
  const handleToggle = (key: WidgetKey) => {
    onWidgetsChange({
      ...widgets,
      [key]: !widgets[key],
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Personalizar Painel">
      <div className="space-y-4">
        <p className="text-text-secondary">Selecione os componentes que você deseja exibir no seu painel.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(Object.keys(WIDGET_LABELS) as WidgetKey[]).map((key) => (
            <div key={key} className="flex items-center bg-secondary p-3 rounded-lg">
              <input
                type="checkbox"
                id={`widget-${key}`}
                checked={widgets[key]}
                onChange={() => handleToggle(key)}
                className="h-5 w-5 rounded border-gray-500 text-accent bg-primary focus:ring-accent focus:ring-2"
              />
              <label htmlFor={`widget-${key}`} className="ml-3 block text-sm font-medium text-text-primary">
                {WIDGET_LABELS[key]}
              </label>
            </div>
          ))}
        </div>
        <div className="flex justify-end pt-4">
          <Button onClick={onClose}>Fechar</Button>
        </div>
      </div>
    </Modal>
  );
};

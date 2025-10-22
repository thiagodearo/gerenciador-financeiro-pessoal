
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Transaction, TransactionType } from '../types';

interface CategoryChartProps {
  transactions: Transaction[];
}

const COLORS = ['#3D52D5', '#00F5D4', '#FFC700', '#FF8C42', '#FF4747', '#9D4EDD', '#00B4D8', '#48CAE4'];

export const CategoryChart: React.FC<CategoryChartProps> = ({ transactions }) => {
  const expenseData = transactions
    .filter((t) => t.type === TransactionType.EXPENSE)
    .reduce((acc, t) => {
      const existing = acc.find((item) => item.name === t.category);
      if (existing) {
        existing.value += t.amount;
      } else {
        acc.push({ name: t.category, value: t.amount });
      }
      return acc;
    }, [] as { name: string; value: number }[]);

  if (expenseData.length === 0) {
    return (
      <div className="bg-secondary p-6 rounded-lg shadow-lg flex items-center justify-center h-80">
        <p className="text-text-secondary">Nenhuma despesa registrada para exibir o gráfico.</p>
      </div>
    );
  }

  return (
    <div className="bg-secondary p-4 rounded-lg shadow-lg h-80">
      <h3 className="text-lg font-bold text-highlight mb-4 text-center">Despesas por Categoria</h3>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={expenseData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
          >
            {expenseData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => `R$ ${value.toFixed(2)}`}
            contentStyle={{ backgroundColor: '#1E1E48', border: 'none', borderRadius: '8px' }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
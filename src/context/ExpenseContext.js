import React, { createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ExpenseContext = createContext();

export const ExpenseProvider = ({ children }) => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem('expenses')
      .then((stored) => {
        if (stored) setExpenses(JSON.parse(stored));
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('expenses', JSON.stringify(expenses)).catch(console.error);
  }, [expenses]);

  const addExpense = (exp) => {
    setExpenses(prev => [...prev, { id: Date.now().toString(), ...exp }]);
  };

  const updateExpense = (updated) => {
    setExpenses(prev => prev.map(e => e.id === updated.id ? updated : e));
  };

  const deleteExpense = (id) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  return (
    <ExpenseContext.Provider value={{ expenses, loading, addExpense, updateExpense, deleteExpense }}>
      {children}
    </ExpenseContext.Provider>
  );
};

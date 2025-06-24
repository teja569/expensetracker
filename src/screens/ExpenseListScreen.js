import React, { useContext, useState, useMemo } from 'react';

import {
  View,
  FlatList,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Text, Card, IconButton } from 'react-native-paper';
import { ExpenseContext } from '../context/ExpenseContext';
import { useNavigation } from '@react-navigation/native';
import { categories } from '../data/categories';

export default function ExpenseListScreen() {
  const { expenses = [], deleteExpense, loading = false } = useContext(ExpenseContext) || {};
  const navigation = useNavigation();

  const [searchText, setSearchText] = useState('');
  const [sortBy, setSortBy] = useState('date'); // 'date' or 'amount'

  const handleDelete = (id) => {
    Alert.alert('Delete Expense', 'Are you sure you want to delete this?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteExpense?.(id) },
    ]);
  };

  const filteredExpenses = useMemo(() => {
    let data = expenses.filter((e) => {
      const text = searchText.toLowerCase();
      return (
        e.notes?.toLowerCase().includes(text) ||
        e.category.toLowerCase().includes(text) ||
        e.date.includes(text)
      );
    });

    if (sortBy === 'amount') {
      data.sort((a, b) => Number(b.amount) - Number(a.amount));
    } else {
      data.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    return data;
  }, [searchText, sortBy, expenses]);

  const getCategoryIcon = (key) => {
    const category = categories.find((cat) => cat.key === key);
    return category?.icon || 'wallet';
  };

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Title
        title={`₹${item.amount}`}
        subtitle={`${item.category} • ${item.date}`}
        left={(props) => <IconButton {...props} icon={getCategoryIcon(item.category)} />}
        right={() => (
          <View style={styles.actions}>
            <IconButton
              icon="pencil"
              size={20}
              onPress={() => navigation.navigate('AddEditExpense', { expense: item })}
            />
            <IconButton
              icon="delete"
              size={20}
              onPress={() => handleDelete(item.id)}
            />
          </View>
        )}
      />
      {item.notes ? (
        <Card.Content>
          <Text style={styles.notes}>{item.notes}</Text>
        </Card.Content>
      ) : null}
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 🔍 Search Bar */}
      <TextInput
        style={styles.searchBar}
        placeholder="Search by category, note, or date"
        value={searchText}
        onChangeText={setSearchText}
      />

      {/* 🔃 Sort Toggle */}
      <View style={styles.sortRow}>
        <Text style={styles.sortLabel}>Sort by:</Text>
        <TouchableOpacity onPress={() => setSortBy('date')}>
          <Text style={[styles.sortButton, sortBy === 'date' && styles.activeSort]}>
            Date
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSortBy('amount')}>
          <Text style={[styles.sortButton, sortBy === 'amount' && styles.activeSort]}>
            Amount
          </Text>
        </TouchableOpacity>
      </View>

      {filteredExpenses.length === 0 ? (
        <Text style={styles.emptyText}>No matching expenses</Text>
      ) : (
        <FlatList
          data={filteredExpenses}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  list: {
    paddingBottom: 16,
  },
  card: {
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
  },
  notes: {
    color: '#555',
    fontStyle: 'italic',
    fontSize: 14,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: 'gray',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBar: {
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 16,
    marginBottom: 12,
  },
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10,
  },
  sortLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  sortButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    fontSize: 14,
    color: '#6200ee',
    borderRadius: 8,
  },
  activeSort: {
    backgroundColor: '#e0d8ff',
    fontWeight: 'bold',
  },
});

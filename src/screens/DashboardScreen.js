import React, { useContext } from 'react';
import { View, Text, ScrollView, Dimensions, StyleSheet, ActivityIndicator } from 'react-native';
import { ExpenseContext } from '../context/ExpenseContext';
import { categories } from '../data/categories';
import { Card, useTheme } from 'react-native-paper';
import { PieChart, LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

export default function DashboardScreen() {
  const { expenses = [], loading } = useContext(ExpenseContext);
  const theme = useTheme();

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  const totalSpending = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);

  const categoryTotals = categories
    .map((cat) => {
      const sum = expenses
        .filter((e) => e.category === cat.key)
        .reduce((acc, e) => acc + Number(e.amount), 0);
      return {
        name: cat.name,
        amount: sum,
        color: cat.color,
        legendFontColor: theme.colors.onBackground,
        legendFontSize: 12,
      };
    })
    .filter((item) => item.amount > 0);

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().slice(0, 10);
  });

  const dailyTotals = last7Days.map((date) => {
    const sum = expenses
      .filter((e) => e.date === date)
      .reduce((acc, e) => acc + Number(e.amount), 0);
    return sum;
  });

  const recent = [...expenses].reverse().slice(0, 5);

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.header, { color: theme.colors.onBackground }]}>
        Total Spending: ₹{totalSpending.toFixed(2)}
      </Text>

      {/* Pie Chart */}
      <Text style={[styles.section, { color: theme.colors.onBackground }]}>Spending by Category</Text>
      {categoryTotals.length > 0 ? (
        <PieChart
          data={categoryTotals}
          width={screenWidth - 32}
          height={180}
          chartConfig={{
            backgroundGradientFrom: theme.colors.background,
            backgroundGradientTo: theme.colors.background,
            color: (opacity = 1) => theme.colors.primary,
            labelColor: () => theme.colors.onBackground,
          }}
          accessor="amount"
          backgroundColor="transparent"
          paddingLeft="10"
        />
      ) : (
        <Text style={[styles.noData, { color: theme.colors.onBackground }]}>No data to show</Text>
      )}

      {/* Line Chart */}
      <Text style={[styles.section, { color: theme.colors.onBackground }]}>Last 7 Days Trend</Text>
      <LineChart
        data={{
          labels: last7Days.map((d) => d.slice(5)),
          datasets: [{ data: dailyTotals }],
        }}
        width={screenWidth - 32}
        height={220}
        chartConfig={{
          backgroundGradientFrom: theme.colors.background,
          backgroundGradientTo: theme.colors.background,
          color: (opacity = 1) => theme.colors.primary,
          labelColor: () => theme.colors.onBackground,
          propsForDots: {
            r: '4',
            strokeWidth: '2',
            stroke: theme.colors.primary,
          },
        }}
        bezier
        style={styles.chart}
      />

      {/* Recent Transactions */}
      <Text style={[styles.section, { color: theme.colors.onBackground }]}>Recent Transactions</Text>
      {recent.length === 0 && (
        <Text style={[styles.noData, { color: theme.colors.onBackground }]}>No recent transactions</Text>
      )}
      {recent.map((exp) => (
        <Card key={exp.id} style={[styles.card, { backgroundColor: theme.colors.elevation?.level1 || theme.colors.surface }]}>
          <Card.Content>
            <Text style={[styles.bold, { color: theme.colors.onSurface }]}>₹{exp.amount}</Text>
            <Text style={{ color: theme.colors.onSurface }}>{exp.category} — {exp.date}</Text>
            {exp.notes ? (
              <Text style={[styles.notes, { color: theme.colors.onSurfaceVariant || '#aaa' }]}>
                {exp.notes}
              </Text>
            ) : null}
          </Card.Content>
        </Card>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
  section: { fontSize: 18, fontWeight: '600', marginTop: 20, marginBottom: 10 },
  chart: { borderRadius: 12 },
  noData: { textAlign: 'center', marginBottom: 10 },
  card: { marginBottom: 10, borderRadius: 10 },
  bold: { fontSize: 16, fontWeight: 'bold' },
  notes: { marginTop: 4, fontStyle: 'italic' },
});

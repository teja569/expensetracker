import React, { useContext } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { TextInput, Button, HelperText, Text, Card } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { ExpenseContext } from '../context/ExpenseContext';
import CategoryDropdown from '../components/CategoryDropdown';

const validationSchema = Yup.object().shape({
  amount: Yup.number().positive('Must be > 0').required('Required'),
  date: Yup.string().required('Required'),
  category: Yup.string().required('Required'),
});

export default function AddEditExpenseScreen({ route, navigation }) {
  const { addExpense, updateExpense } = useContext(ExpenseContext);
  const editingExpense = route.params?.expense;

  const initialValues = editingExpense
    ? { ...editingExpense }
    : {
        amount: '',
        date: new Date().toISOString().slice(0, 10),
        category: 'food',
        notes: '',
      };

  const handleSubmit = (values, { resetForm }) => {
    if (editingExpense) {
      updateExpense({ ...editingExpense, ...values });
    } else {
      addExpense(values);
    }
    resetForm();
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={styles.wrapper}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.title}>
              {editingExpense ? 'Edit Expense' : 'Add New Expense'}
            </Text>

            <Formik
              initialValues={initialValues}
              enableReinitialize
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({
                values,
                handleChange,
                handleSubmit,
                errors,
                touched,
                setFieldTouched,
                setFieldValue,
              }) => (
                <>
                  <TextInput
                    label="Amount"
                    value={String(values.amount)}
                    onChangeText={handleChange('amount')}
                    onBlur={() => setFieldTouched('amount')}
                    keyboardType="numeric"
                    style={styles.input}
                    mode="outlined"
                  />
                  <HelperText type="error" visible={touched.amount && errors.amount}>
                    {errors.amount}
                  </HelperText>

                  <TextInput
                    label="Date"
                    value={values.date}
                    onChangeText={handleChange('date')}
                    onBlur={() => setFieldTouched('date')}
                    placeholder="YYYY-MM-DD"
                    style={styles.input}
                    mode="outlined"
                  />
                  <HelperText type="error" visible={touched.date && errors.date}>
                    {errors.date}
                  </HelperText>

                  <CategoryDropdown
                    value={values.category}
                    onSelect={(val) => {
                      setFieldValue('category', val);
                      setFieldTouched('category', true);
                    }}
                  />
                  <HelperText type="error" visible={touched.category && errors.category}>
                    {errors.category}
                  </HelperText>

                  <TextInput
                    label="Notes"
                    value={values.notes}
                    onChangeText={handleChange('notes')}
                    style={styles.input}
                    multiline
                    mode="outlined"
                  />

                  <Button
                    mode="contained"
                    onPress={handleSubmit}
                    style={styles.button}
                    contentStyle={{ paddingVertical: 6 }}
                  >
                    {editingExpense ? 'Update Expense' : 'Add Expense'}
                  </Button>
                </>
              )}
            </Formik>
          </Card.Content>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  scroll: {
    padding: 16,
    justifyContent: 'center',
  },
  card: {
    borderRadius: 16,
    elevation: 4,
    backgroundColor: '#fff',
    padding: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 12,
  },
  button: {
    marginTop: 16,
    borderRadius: 8,
  },
});

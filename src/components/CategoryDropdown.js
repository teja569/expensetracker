import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Text, Menu, Button } from 'react-native-paper';
import { categories } from '../data/categories';

export default function CategoryDropdown({ value, onSelect }) {
  const [visible, setVisible] = React.useState(false);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const selected = categories.find((c) => c.key === value);

  return (
    <View style={styles.container}>
      <Menu
        visible={visible}
        onDismiss={closeMenu}
        anchor={
          <Button
            mode="outlined"
            onPress={openMenu}
            style={styles.button}
            contentStyle={styles.buttonContent}
          >
            <View style={[styles.colorDot, { backgroundColor: selected?.color }]} />
            <Text>{selected?.name || 'Select Category'}</Text>
          </Button>
        }
      >
        <FlatList
          data={categories}
          keyExtractor={(item) => item.key}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                onSelect(item.key);
                closeMenu();
              }}
            >
              <View style={[styles.colorDot, { backgroundColor: item.color }]} />
              <Text style={styles.menuText}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      </Menu>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 12 },
  button: { justifyContent: 'flex-start' },
  buttonContent: { flexDirection: 'row', alignItems: 'center' },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  menuText: {
    fontSize: 16,
    color: '#333',
  },
});

import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../../constants';

type Props = {
  label: string;
  onPress(): void;
  active?: boolean;
};

const Select: React.FC<Props> = ({ label, onPress, active }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={[
        styles.container,
        { backgroundColor: active ? COLORS.primary : COLORS.gray },
      ]}
      onPress={onPress}>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
    borderRadius: 4,
    marginHorizontal: 4,
    marginVertical: 4,
    minWidth: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    color: COLORS.white,
    ...FONTS.body4,
  },
});

export default Select;

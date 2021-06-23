import React from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import { COLORS, FONTS } from '../../constants';

type Props = {
  text: string;
  onPress(): void;
  active?: boolean;
};

const OrderBy: React.FC<Props> = ({ active, text, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        styles.container,
        { borderColor: active ? COLORS.primary : COLORS.lightGray },
      ]}>
      <Text
        style={[
          styles.text,
          { color: active ? COLORS.primary : COLORS.lightGray },
        ]}>
        {text}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 2,
    paddingHorizontal: 4,
    borderRadius: 4,
    marginHorizontal: 4,

    borderWidth: 1,
  },
  text: {
    ...FONTS.body5,
  },
});

export default OrderBy;

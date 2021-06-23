import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { COLORS } from '../../constants';

type Props = {
  focused: boolean;
  icon: any;
};

const TabIcon = ({ focused, icon }: Props) => {
  return (
    <View style={styles.container}>
      <Image
        source={icon}
        resizeMode="contain"
        style={[
          styles.icon,
          { tintColor: focused ? COLORS.primary : COLORS.gray },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center' },
  icon: {
    width: 25,
    height: 25,
  },
});

export default TabIcon;

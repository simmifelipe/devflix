import React from 'react';
import { StyleSheet, View } from 'react-native';
import { COLORS, SIZES } from '../../constants';

interface ProgressBarProps {
  containerStyle: any;
  barStyle: any;
  barPercentage: any;
}

const components: React.FC<ProgressBarProps> = ({
  containerStyle,
  barStyle,
  barPercentage,
}) => {
  return (
    <View
      style={{
        ...containerStyle,
      }}>
      <View
        style={[
          styles.bar,
          {
            ...barStyle,
          },
        ]}
      />

      <View
        style={[
          styles.currentProgress,
          {
            width: barPercentage,
            ...barStyle,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    marginTop: SIZES.base,
    backgroundColor: COLORS.gray,
  },
  currentProgress: {
    position: 'absolute',
    bottom: 0,
    left: 0,

    marginTop: SIZES.base,
    backgroundColor: COLORS.primary,
  },
});

export default components;

import React, {
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
  useCallback,
} from 'react';
import { TextInput, TextInputProps, View, StyleSheet } from 'react-native';
import { useField } from '@unform/core';

import Feather from 'react-native-vector-icons/Feather';
import { COLORS, FONTS } from '../../constants';

interface InputProps extends TextInputProps {
  name: string;
  icon: string;
}

interface InputValueReference {
  value: string;
}

interface InputRef {
  focus(): void;
}

const Input: React.RefForwardingComponent<InputRef, InputProps> = (
  { name, icon, ...rest },
  ref,
) => {
  const inputElementRef = useRef<any>(null);

  const { registerField, defaultValue = '', fieldName } = useField(name);
  const inputValueRef = useRef<InputValueReference>({ value: defaultValue });

  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);

  const handleInputFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleInputBlur = useCallback(() => {
    setIsFocused(false);

    setIsFilled(!!inputValueRef.current.value);
  }, []);

  useImperativeHandle(ref, () => ({
    focus() {
      inputElementRef.current.focus();
    },
  }));

  useEffect(() => {
    registerField<string>({
      name: fieldName,
      ref: inputValueRef.current,
      path: 'value',
      // setValue(ref: any, value) {
      //   inputValueRef.current.value = value;
      //   inputElementRef.current.setNativeProps({ text: value });
      // },
      // clearValue() {
      //   inputValueRef.current.value = '';
      //   inputElementRef.current.clear();
      // },
    });
  }, [fieldName, registerField]);

  return (
    <View style={styles.container}>
      <Feather
        name={icon}
        size={20}
        color={isFocused || isFilled ? COLORS.primary : COLORS.lightGray}
      />
      <TextInput
        style={styles.input}
        ref={inputElementRef}
        keyboardAppearance="dark"
        placeholderTextColor={COLORS.lightGray}
        defaultValue={defaultValue}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        onChangeText={value => {
          inputValueRef.current.value = value;
        }}
        {...rest}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 60,
    paddingHorizontal: 16,
    backgroundColor: COLORS.gray2,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: COLORS.black,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    marginLeft: 10,
    color: COLORS.white,
    ...FONTS.body4,
  },
});

export default forwardRef(Input);

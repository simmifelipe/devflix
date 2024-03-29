import React, { useCallback } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RectButton } from 'react-native-gesture-handler';
import Feather from 'react-native-vector-icons/Feather';

import { useRef } from 'react';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/mobile';

import { useAuth } from '../../hooks/auth';
import { Input } from '../../components';
import logoImg from '../../assets/images/logo.png';
import { COLORS, FONTS, SIZES } from '../../constants';

interface SignInFormData {
  email: string;
  password: string;
}

const SignIn: React.FC = () => {
  const { navigate } = useNavigation();
  const formRef = useRef<FormHandles>(null);
  const passwordInputRef = useRef<TextInput>(null);

  const { signIn } = useAuth();

  const handleSignIn = useCallback(
    async (data: SignInFormData) => {
      try {
        await signIn({ email: data.email, password: data.password });
      } catch (err) {
        console.log(err);
        if (err.code === 'auth/invalid-email') {
          Alert.alert('Autenticação', 'E-mail informado é inválido!');
          return;
        }
        if (err.code === 'auth/user-not-found') {
          Alert.alert(
            'Autenticação',
            'Este e-mail não está associado a nenhuma conta!',
          );
          return;
        }
        if (err.code === 'auth/wrong-password') {
          Alert.alert('Autenticação', 'Senha informada está incorreta!');
          return;
        }
        if (err.code === 'auth/too-many-requests') {
          Alert.alert(
            'Autenticação',
            'O acesso atrevés deste dispositivo está bloqueado! Tente novamente mais tarde.',
          );
          return;
        }
        Alert.alert('Erro na autenticação', err.message);
      }
    },
    [signIn],
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollview}>
          <View style={styles.content}>
            <Image source={logoImg} style={styles.logo} />

            <Form ref={formRef} onSubmit={handleSignIn}>
              <Input
                autoCorrect={false}
                autoCapitalize="none"
                keyboardType="email-address"
                name="email"
                icon="mail"
                placeholder="E-mail"
                returnKeyType="next"
                onSubmitEditing={() => {
                  passwordInputRef.current?.focus();
                }}
              />
              <Input
                ref={passwordInputRef}
                name="password"
                icon="lock"
                placeholder="Senha"
                secureTextEntry
                returnKeyType="send"
                onSubmitEditing={() => {
                  formRef.current?.submitForm();
                }}
              />
              <RectButton
                style={styles.submitButton}
                onPress={() => {
                  formRef.current?.submitForm();
                }}>
                <Text style={styles.buttonText}>Entrar</Text>
              </RectButton>
            </Form>
          </View>
        </ScrollView>
        <TouchableOpacity
          style={styles.registerButton}
          activeOpacity={0.7}
          onPress={() => {
            navigate('SignUp');
          }}>
          <Feather name="log-in" size={20} color={COLORS.primary} />
          <Text style={[styles.buttonText, { marginLeft: 10 }]}>
            Criar conta
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
    paddingHorizontal: SIZES.padding,
  },
  keyboardAvoid: { flex: 1 },
  scrollview: { flex: 1 },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: SIZES.width,
    resizeMode: 'contain',
  },
  title: {
    color: COLORS.white,
    marginBottom: 10,
    ...FONTS.h2,
  },
  submitButton: {
    height: 60,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    marginTop: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.white,
    ...FONTS.h3,
  },
  registerButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 22,
  },
});

export default SignIn;

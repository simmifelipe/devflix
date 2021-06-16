import React from 'react';
import { useEffect } from 'react';
import { Alert, View } from 'react-native';

import auth from '@react-native-firebase/auth';

const SignIn: React.FC = () => {
  useEffect(() => {
    async function createAndSignIn() {
      try {
        const response = await auth().createUserWithEmailAndPassword(
          'felipe.simmi@gmail.com',
          '123456',
        );
        console.log(response.user);
        Alert.alert('Sucesso', 'Usuário criado e logado com sucesso!');
      } catch (err) {
        if (err.code === 'auth/email-already-in-use') {
          Alert.alert(
            'Autenticação',
            'E-mail já está sendo utilizado por outra conta!',
          );
        }
        if (err.code === 'auth/invalid-email') {
          Alert.alert('Autenticação', 'E-mail informado é inválido!');
        }
      }
    }

    createAndSignIn();
  }, []);

  return <View />;
};

export default SignIn;

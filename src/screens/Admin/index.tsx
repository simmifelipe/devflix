import { FormHandles } from '@unform/core';
import { Form } from '@unform/mobile';
import React, { useCallback, useState } from 'react';
import { useRef } from 'react';
import { StatusBar } from 'react-native';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import {
  CameraOptions,
  ImageLibraryOptions,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import { Input } from '../../components';
import { COLORS, FONTS } from '../../constants';

const Admin: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const onButtonPress = useCallback((type, options) => {
    if (type === 'capture') {
      launchCamera(options, setResponse);
    } else {
      launchImageLibrary(options, setResponse);
    }
  }, []);

  const handleSubmit = useCallback(async () => {}, []);

  function renderHeader() {
    return (
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Cadastrar novo título</Text>
      </View>
    );
  }

  function renderForm() {
    return (
      <View
        style={{
          flex: 1,
        }}>
        <Form ref={formRef} onSubmit={handleSubmit}>
          <Input
            autoCorrect={true}
            autoCapitalize="words"
            keyboardType="default"
            name="name"
            icon="film"
            placeholder="Nome da temporada"
            returnKeyType="next"
          />
        </Form>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      {renderForm()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
    paddingTop: StatusBar.currentHeight + 30,
  },
  header: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: COLORS.primary,
    ...FONTS.h2,
  },
});

interface Action {
  title: string;
  type: 'capture' | 'library';
  options: CameraOptions | ImageLibraryOptions;
}

const actions: Action[] = [
  {
    title: 'Take Image',
    type: 'capture',
    options: {
      saveToPhotos: true,
      mediaType: 'photo',
      includeBase64: false,
    },
  },
  {
    title: 'Select Image',
    type: 'library',
    options: {
      maxHeight: 200,
      maxWidth: 200,
      selectionLimit: 0,
      mediaType: 'photo',
      includeBase64: false,
    },
  },
  {
    title: 'Select Video',
    type: 'library',
    options: {
      selectionLimit: 0,
      mediaType: 'video',
    },
  },
];

export default Admin;

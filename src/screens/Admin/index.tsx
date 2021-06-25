import { FormHandles } from '@unform/core';
import { Form } from '@unform/mobile';
import React, { useCallback, useState } from 'react';
import { useRef } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StatusBar } from 'react-native';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import {
  CameraOptions,
  ImageLibraryOptions,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import Feather from 'react-native-vector-icons/Feather';
import { Input, Select } from '../../components';
import { COLORS, FONTS, SIZES } from '../../constants';
import api from '../../services/api';

const Admin: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const [age, setAge] = useState('10+');
  const [genre, setGenre] = useState('Comédia');
  const [seasonNumber, setSeasonNumber] = useState('1');
  const [thumbnail, setThumbnail] = useState<any>(null);
  const [poster, setPoster] = useState<any>(null);

  const onButtonPress = useCallback((type, options) => {
    if (type === 'capture') {
      launchCamera(options, setPoster);
    } else {
      launchImageLibrary(options, setThumbnail);
    }
  }, []);

  const handleSubmit = useCallback(async () => {
    try {
      const formData = {
        name: formRef.current?.getFieldValue('name'),
        age: age.split('+')[0],
        genre,
        seasonNumber: 'Temporada ' + seasonNumber,
        current_episode: 'E1 : T' + seasonNumber,
        isNew: true,
      };

      const response = await api.post('/seasons', formData);

      if (thumbnail && thumbnail?.assets) {
        const data = new FormData();
        const thumb = thumbnail?.assets[0];
        data.append('thumbnail', {
          type: thumb.type,
          name: thumb.fileName,
          uri: thumb.uri,
        });
        await api.patch(`/seasons/${response.data.id}/thumbnail`, data);
      }

      if (poster && poster?.assets) {
        console.log(poster.assets);
        const dataImage = new FormData();
        const image = poster?.assets[0];
        dataImage.append('image', {
          type: image.type,
          name: image.fileName,
          uri: image.uri,
        });
        await api.patch(`/seasons/${response.data.id}/image`, dataImage);
      }

      Alert.alert('Sucesso', 'Serie criada com sucesso!');
    } catch (err) {
      Alert.alert('Erro', 'Erro ao gravar serie ' + err.message);
    }
  }, [age, genre, seasonNumber, thumbnail, poster]);

  function renderHeader() {
    return (
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Cadastrar novo título</Text>
      </View>
    );
  }

  function renderForm() {
    return (
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled>
        <ScrollView
          style={styles.scrollview}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          <View style={styles.content}>
            <Form ref={formRef} onSubmit={handleSubmit}>
              <Input
                autoCorrect={true}
                autoCapitalize="words"
                keyboardType="default"
                name="name"
                icon="film"
                placeholder="Nome"
                returnKeyType="next"
              />
              <View style={styles.ageContainer}>
                <Text style={styles.ageTitle}>Classificação de idade</Text>
                <View style={styles.ageItems}>
                  <Select
                    label="10+"
                    onPress={() => setAge('10+')}
                    active={age === '10+'}
                  />
                  <Select
                    label="12+"
                    onPress={() => setAge('12+')}
                    active={age === '12+'}
                  />
                  <Select
                    label="14+"
                    onPress={() => setAge('14+')}
                    active={age === '14+'}
                  />
                  <Select
                    label="16+"
                    onPress={() => setAge('16+')}
                    active={age === '16+'}
                  />
                  <Select
                    label="18+"
                    onPress={() => setAge('18+')}
                    active={age === '18+'}
                  />
                </View>
              </View>
              <View style={styles.genreContainer}>
                <Text style={styles.genreTitle}>Gênero</Text>
                <View style={styles.genreItems}>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <Select
                      label="Comédia"
                      onPress={() => setGenre('Comédia')}
                      active={genre === 'Comédia'}
                    />
                    <Select
                      label="Ação"
                      onPress={() => setGenre('Ação')}
                      active={genre === 'Ação'}
                    />
                    <Select
                      label="Sci-Fi"
                      onPress={() => setGenre('Sci-Fi')}
                      active={genre === 'Sci-Fi'}
                    />
                    <Select
                      label="Drama"
                      onPress={() => setGenre('Drama')}
                      active={genre === 'Drama'}
                    />
                    <Select
                      label="Crime"
                      onPress={() => setGenre('Crime')}
                      active={genre === 'Crime'}
                    />
                    <Select
                      label="Suspense"
                      onPress={() => setGenre('Suspense')}
                      active={genre === 'Suspense'}
                    />
                    <Select
                      label="Documentário"
                      onPress={() => setGenre('Documentário')}
                      active={genre === 'Documentário'}
                    />
                    <Select
                      label="Terror"
                      onPress={() => setGenre('Terror')}
                      active={genre === 'Terror'}
                    />
                  </ScrollView>
                </View>
              </View>
              <View style={styles.seasonContainer}>
                <Text style={styles.seasonTitle}>Nº da temporada</Text>
                <View style={styles.seasonItems}>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <Select
                      label="1"
                      onPress={() => setSeasonNumber('1')}
                      active={seasonNumber === '1'}
                    />
                    <Select
                      label="2"
                      onPress={() => setSeasonNumber('2')}
                      active={seasonNumber === '2'}
                    />
                    <Select
                      label="3"
                      onPress={() => setSeasonNumber('3')}
                      active={seasonNumber === '3'}
                    />
                    <Select
                      label="4"
                      onPress={() => setSeasonNumber('4')}
                      active={seasonNumber === '4'}
                    />
                    <Select
                      label="5"
                      onPress={() => setSeasonNumber('5')}
                      active={seasonNumber === '5'}
                    />
                    <Select
                      label="6"
                      onPress={() => setSeasonNumber('6')}
                      active={seasonNumber === '6'}
                    />
                    <Select
                      label="7"
                      onPress={() => setSeasonNumber('7')}
                      active={seasonNumber === '7'}
                    />
                    <Select
                      label="8"
                      onPress={() => setSeasonNumber('8')}
                      active={seasonNumber === '8'}
                    />
                    <Select
                      label="9"
                      onPress={() => setSeasonNumber('9')}
                      active={seasonNumber === '9'}
                    />
                    <Select
                      label="10"
                      onPress={() => setSeasonNumber('10')}
                      active={seasonNumber === '10'}
                    />
                  </ScrollView>
                </View>
              </View>
              <View style={styles.mediaContainer}>
                <Text style={styles.mediaTitle}>Imagens</Text>
                <View style={styles.buttonsContainer}>
                  <TouchableOpacity
                    style={styles.mediaButton}
                    onPress={() =>
                      onButtonPress('library', {
                        maxHeight: 200,
                        maxWidth: 200,
                        selectionLimit: 0,
                        mediaType: 'photo',
                        includeBase64: false,
                      })
                    }>
                    {!thumbnail ||
                      (!thumbnail?.assets && (
                        <>
                          <Text style={styles.mediaText}>Thumbnail</Text>
                          <Feather
                            name="image"
                            size={25}
                            color={COLORS.white}
                          />
                        </>
                      ))}

                    {thumbnail &&
                      thumbnail?.assets?.map(({ uri }) => (
                        <Image
                          key={uri}
                          resizeMode="cover"
                          style={styles.image}
                          source={{ uri: uri }}
                        />
                      ))}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.mediaButton}
                    onPress={() =>
                      onButtonPress('capture', {
                        mediaType: 'photo',
                        includeBase64: false,
                        saveToPhotos: true,
                      })
                    }>
                    {!poster ||
                      (!poster?.assets && (
                        <>
                          <Text style={styles.mediaText}>Poster</Text>
                          <Feather
                            name="image"
                            size={25}
                            color={COLORS.white}
                          />
                        </>
                      ))}

                    {poster &&
                      poster?.assets?.map(({ uri }) => (
                        <Image
                          key={uri}
                          resizeMode="cover"
                          style={styles.image}
                          source={{ uri: uri }}
                        />
                      ))}
                  </TouchableOpacity>
                </View>
              </View>
              <RectButton
                style={styles.submitButton}
                onPress={() => {
                  formRef.current?.submitForm();
                }}>
                <Text style={styles.buttonText}>Cadastrar</Text>
              </RectButton>
            </Form>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  keyboardView: { flex: 1 },
  scrollview: { flex: 1 },
  content: { paddingHorizontal: SIZES.base },
  ageContainer: { paddingHorizontal: 2 },
  ageTitle: { color: COLORS.white, ...FONTS.body4 },
  ageItems: { flexDirection: 'row', alignItems: 'center' },
  genreContainer: { paddingHorizontal: 2, marginTop: 6 },
  genreTitle: { color: COLORS.white, ...FONTS.body4 },
  genreItems: { flexDirection: 'row', alignItems: 'center' },
  seasonContainer: { paddingHorizontal: 2, marginTop: 6 },
  seasonTitle: { color: COLORS.white, ...FONTS.body4 },
  seasonItems: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  mediaContainer: { paddingHorizontal: 2 },
  mediaTitle: { color: COLORS.white, ...FONTS.body4 },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  mediaButton: {
    flex: 1,
    height: 130,
    backgroundColor: COLORS.gray,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  mediaText: { color: COLORS.white, ...FONTS.body4 },

  submitButton: {
    height: 60,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    marginTop: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.white,
    ...FONTS.h3,
  },
  image: {
    width: '100%',
    height: 130,
    borderRadius: 10,
  },
});

interface Action {
  title: string;
  type: 'capture' | 'library';
  options: CameraOptions | ImageLibraryOptions;
}

const actions: Action[] = [
  {
    title: 'Tire uma foto',
    type: 'capture',
    options: {
      saveToPhotos: true,
      mediaType: 'photo',
      includeBase64: false,
    },
  },
  {
    title: 'Selecione uma imagem',
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

import { useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import { useEffect } from 'react';
import { useCallback } from 'react';
import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ProgressBar } from '../../components';
import { COLORS, FONTS, icons, SIZES, videos } from '../../constants';
import { useAuth } from '../../hooks/auth';
import api from '../../services/api';

interface ParamsProps {
  selected: Season;
}

const MovieDetail = () => {
  const route = useRoute();
  const { goBack, navigate } = useNavigation();
  const { user } = useAuth();

  const [isFavorite, setIsFavorite] = useState(false);

  const [selectedItem, setSelectedItem] = useState<Season>();

  useEffect(() => {
    const { selected } = route.params as ParamsProps;
    setSelectedItem(selected);

    async function checkIsFavorite() {
      if (!selectedItem) {
        return;
      }

      const response = await api.get(
        `/seasons/favorite/check/${user.uid}/${selectedItem.id}`,
      );

      if (response.data === true) {
        setIsFavorite(true);
      }
    }

    checkIsFavorite();
  }, [route.params, selectedItem, user.uid]);

  const handleFavoriteUnfavorite = useCallback(async () => {
    try {
      if (!selectedItem) {
        return;
      }

      if (isFavorite) {
        await api.delete(`/seasons/favorite/${user.uid}/${selectedItem.id}`);
      } else {
        await api.post('/seasons/favorite', {
          user_id: user.uid,
          season: { id: selectedItem.id },
        });
      }
      setIsFavorite(!isFavorite);
    } catch (err) {
      Alert.alert(
        'Erro',
        'Erro ao adicionar/remover item no favoritos ' + err.message,
      );
    }
  }, [isFavorite, selectedItem, user.uid]);

  function renderHeaderBar() {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: SIZES.padding,
        }}>
        {/* Back */}
        <TouchableOpacity
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            width: 50,
            height: 50,
            borderRadius: 20,
            backgroundColor: COLORS.transparentBlack,
          }}
          onPress={goBack}>
          <Image
            source={icons.left_arrow}
            style={{
              width: 20,
              height: 20,
              tintColor: COLORS.white,
            }}
          />
        </TouchableOpacity>

        {/* Favorite */}

        <TouchableOpacity
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            width: 50,
            height: 50,
            borderRadius: 20,
            backgroundColor: COLORS.transparentBlack,
          }}
          onPress={handleFavoriteUnfavorite}>
          <Image
            source={icons.star}
            style={{
              width: 25,
              height: 25,
              tintColor: isFavorite ? COLORS.primary : COLORS.white,
            }}
          />
        </TouchableOpacity>
      </View>
    );
  }

  function renderHeaderSection() {
    return (
      <ImageBackground
        source={{ uri: `http://172.16.1.43:3333/files/${selectedItem?.image}` }}
        resizeMode="cover"
        style={{
          width: '100%',
          height: SIZES.height < 700 ? SIZES.height * 0.6 : SIZES.height * 0.7,
        }}>
        <View
          style={{
            flex: 1,
          }}>
          {renderHeaderBar()}

          <View
            style={{
              flex: 1,
              justifyContent: 'flex-end',
            }}>
            <LinearGradient
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              colors={['transparent', '#000']}
              style={{
                width: '100%',
                height: 150,
                alignItems: 'center',
                justifyContent: 'flex-end',
              }}>
              {/* Season */}
              <Text
                style={{
                  color: COLORS.white,
                  ...FONTS.body4,
                }}>
                {selectedItem?.season}
              </Text>

              {/* Name */}
              <Text
                style={{
                  marginTop: SIZES.base,
                  color: COLORS.white,
                  ...FONTS.h1,
                }}>
                {selectedItem?.name}
              </Text>
            </LinearGradient>
          </View>
        </View>
      </ImageBackground>
    );
  }

  function renderCategorryAndRatings() {
    return (
      <View
        style={{
          flexDirection: 'row',
          marginTop: SIZES.base,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {/* Age */}
        <View style={[styles.categoryContainer, { marginLeft: 0 }]}>
          <Text
            style={{
              color: COLORS.white,
              ...FONTS.h4,
            }}>
            {`${selectedItem?.age}+`}
          </Text>
        </View>

        {/* Genre */}
        <View
          style={[
            styles.categoryContainer,
            { paddingHorizontal: SIZES.padding },
          ]}>
          <Text
            style={{
              color: COLORS.white,
              ...FONTS.h4,
            }}>
            {selectedItem?.genre}
          </Text>
        </View>

        {/* Ratings */}
        <View style={styles.categoryContainer}>
          <Image
            source={icons.star}
            resizeMode="contain"
            style={{
              width: 15,
              height: 15,
            }}
          />
          <Text
            style={{
              marginLeft: SIZES.base,
              color: COLORS.white,
              ...FONTS.h4,
            }}>
            {selectedItem?.ratings}
          </Text>
        </View>
      </View>
    );
  }

  function renderMovieDetails() {
    return (
      <View
        style={{
          flex: 1,
          paddingHorizontal: SIZES.padding,
          marginTop: SIZES.padding,
          justifyContent: 'space-around',
        }}>
        {/* Title, running time and progress bar */}
        <View>
          {/* Title and running time */}
          <View
            style={{
              flexDirection: 'row',
            }}>
            <Text
              style={{
                flex: 1,
                color: COLORS.white,
                ...FONTS.h4,
              }}>
              {selectedItem?.current_episode}
            </Text>
            <Text
              style={{
                color: COLORS.white,
                ...FONTS.h4,
              }}>
              {`${selectedItem?.runningTime}m`}
            </Text>
          </View>

          {/* Progress Bar */}
          <ProgressBar
            containerStyle={{
              marginTop: SIZES.radius,
            }}
            barStyle={{
              height: 5,
              borderRadius: 3,
            }}
            barPercentage={selectedItem?.progress}
          />
        </View>

        {/* Watch */}
        <TouchableOpacity
          onPress={() =>
            navigate('Streaming', { videoStream: videos.LaCasaDePapel4 })
          }
          style={{
            height: 60,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: Platform.OS === 'ios' ? SIZES.padding * 2 : 0,
            borderRadius: 15,
            backgroundColor: COLORS.primary,
          }}>
          <Text
            style={{
              color: COLORS.white,
              ...FONTS.h2,
            }}>
            {selectedItem?.progress === 0 ? 'Assistir' : 'Continue assistindo'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollviewContainer}
        style={{
          backgroundColor: COLORS.black,
        }}>
        {renderHeaderSection()}

        {/* Category & Ratings */}
        {renderCategorryAndRatings()}

        {/* Movie Details */}
        {renderMovieDetails()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight,
    backgroundColor: COLORS.black,
  },
  scrollviewContainer: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: SIZES.base,
    paddingHorizontal: SIZES.base,
    paddingVertical: 3,
    borderRadius: SIZES.base,
    backgroundColor: COLORS.gray1,
  },
});

export default MovieDetail;

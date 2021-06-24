import React, { useEffect, useRef, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  ImageBackground,
  TouchableWithoutFeedback,
  Animated,
  FlatList,
  StatusBar,
  Alert,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import { ProgressBar } from '../../components';

import {
  dummyData,
  COLORS,
  SIZES,
  FONTS,
  icons,
  images,
} from '../../constants';
import { useAuth } from '../../hooks/auth';
import { useCallback } from 'react';
import api, { baseURL } from '../../services/api';

const Home = () => {
  const { navigate } = useNavigation();
  const { signOut } = useAuth();

  const newSeasonScrollX = useRef(new Animated.Value(0)).current;

  const [seasonNews, setSeasonNews] = useState<Season[]>([]);
  const [watching, setWatching] = useState<Season[]>([]);

  useEffect(() => {
    async function loadNewsSeasons() {
      const response = await api.get('/seasons/news');
      setSeasonNews(response.data);
    }

    async function loadWatchingSeasons() {
      const response = await api.get('/seasons/watching');
      setWatching(response.data);
    }

    loadNewsSeasons();
    loadWatchingSeasons();
  }, []);

  function renderHeader() {
    return (
      <View style={styles.header}>
        {/* Perfil */}
        <TouchableOpacity
          style={styles.profile}
          onPress={() => console.log('Profile')}>
          <Image source={images.profile_photo} style={styles.profileImage} />
        </TouchableOpacity>

        {/* Screen Mirror */}
        <TouchableOpacity style={styles.logout} onPress={handleLogout}>
          <Feather name="log-out" size={25} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
    );
  }

  function renderNewSeasonSection() {
    return (
      <Animated.FlatList
        horizontal
        pagingEnabled
        snapToAlignment="center"
        snapToInterval={SIZES.width}
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        decelerationRate={0}
        contentContainerStyle={{
          marginTop: SIZES.radius,
        }}
        data={seasonNews}
        keyExtractor={item => `${item.id}`}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: newSeasonScrollX } } }],
          { useNativeDriver: false },
        )}
        renderItem={({ item }) => {
          return (
            <TouchableWithoutFeedback
              onPress={() => navigate('MovieDetail', { selected: item })}>
              <View style={styles.newSeason}>
                {/* Thumbnail */}
                <ImageBackground
                  source={{
                    uri: `${baseURL}/files/${item.thumbnail}`,
                  }}
                  resizeMode="cover"
                  style={styles.newSeasonBackgroundImage}
                  imageStyle={styles.backgroundImageStyle}>
                  <View style={styles.screenActions}>
                    {/* Play now */}
                    <View style={styles.play}>
                      <View style={styles.playAction}>
                        <Image
                          source={icons.play}
                          resizeMode="contain"
                          style={styles.playIcon}
                        />
                      </View>
                      <Text
                        style={{
                          marginLeft: SIZES.base,
                          color: COLORS.white,
                          ...FONTS.h3,
                        }}>
                        Assistir
                      </Text>
                    </View>
                  </View>
                </ImageBackground>
              </View>
            </TouchableWithoutFeedback>
          );
        }}
      />
    );
  }

  function renderDots() {
    const dotPosition = Animated.divide(newSeasonScrollX, SIZES.width);

    return (
      <View style={styles.dots}>
        {seasonNews.map((item, index) => {
          const opacity = dotPosition.interpolate({
            inputRange: [index - 1, index, index + 1],
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp',
          });

          const dotWidth = dotPosition.interpolate({
            inputRange: [index - 1, index, index + 1],
            outputRange: [6, 20, 6],
            extrapolate: 'clamp',
          });

          const dotColor = dotPosition.interpolate({
            inputRange: [index - 1, index, index + 1],
            outputRange: [COLORS.lightGray, COLORS.primary, COLORS.lightGray],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              key={`dot-${index}`}
              style={[
                styles.dot,
                {
                  width: dotWidth,
                  backgroundColor: dotColor,
                  opacity: opacity,
                },
              ]}
            />
          );
        })}
      </View>
    );
  }

  function renderContinueWatchingSection() {
    return (
      <View
        style={{
          marginTop: SIZES.padding,
        }}>
        {/* Header */}
        <View style={styles.headerWatchingSection}>
          <Text style={styles.headerText}>Continue assistindo</Text>

          <Image source={icons.right_arrow} style={styles.headerRightAction} />
        </View>

        {/* List */}
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            marginTop: SIZES.padding,
          }}
          data={watching}
          keyExtractor={item => `${item.id}`}
          renderItem={({ item, index }) => {
            return (
              <TouchableWithoutFeedback
                onPress={() => navigate('MovieDetail', { selected: item })}>
                <View
                  // eslint-disable-next-line react-native/no-inline-styles
                  style={{
                    marginLeft: index === 0 ? SIZES.padding : 20,
                    marginRight:
                      index === dummyData.continueWatching.length - 1
                        ? SIZES.padding
                        : 0,
                  }}>
                  {/* Thumbnail */}
                  <Image
                    source={{
                      uri: `${baseURL}/files/${item.thumbnail}`,
                    }}
                    resizeMode="cover"
                    style={styles.thumbnailImage}
                  />

                  {/* Name */}
                  <Text
                    style={{
                      marginTop: SIZES.base,
                      color: COLORS.white,
                      ...FONTS.h4,
                    }}>
                    {item.name}
                  </Text>

                  {/* Progress Bar */}
                  <ProgressBar
                    containerStyle={{
                      marginTop: SIZES.radius,
                    }}
                    barStyle={styles.barStyle}
                    barPercentage={item.progress}
                  />
                </View>
              </TouchableWithoutFeedback>
            );
          }}
        />
      </View>
    );
  }

  const handleLogout = useCallback(async () => {
    try {
      signOut();
    } catch (err) {
      Alert.alert('Erro', 'Erro ao efetuar logout: ' + err);
    }
  }, [signOut]);

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      <ScrollView contentContainerStyle={styles.scrollview}>
        {renderNewSeasonSection()}
        {renderDots()}
        {renderContinueWatchingSection()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    backgroundColor: COLORS.black,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    marginTop: 10,
  },
  profile: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  logout: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 50,
  },
  scrollview: {
    paddingBottom: 100,
  },
  newSeason: {
    width: SIZES.width,
    alignItems: 'center',
    justifyContent: 'center',
  },
  newSeasonBackgroundImage: {
    width: SIZES.width * 0.85,
    height: SIZES.width * 0.85,
    justifyContent: 'flex-end',
  },
  backgroundImageStyle: {
    borderRadius: 40,
  },
  screenActions: {
    flexDirection: 'row',
    height: 60,
    width: '100%',
    marginBottom: SIZES.radius,
    paddingHorizontal: SIZES.radius,
  },
  play: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  playAction: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.transparentWhite,
  },
  playIcon: {
    width: 15,
    height: 15,
    tintColor: COLORS.white,
  },
  dots: {
    marginTop: SIZES.padding,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    borderRadius: SIZES.radius,
    marginHorizontal: 3,

    height: 6,
  },
  headerWatchingSection: {
    flexDirection: 'row',
    paddingHorizontal: SIZES.padding,
    alignItems: 'center',
  },
  headerText: {
    flex: 1,
    color: COLORS.white,
    ...FONTS.h2,
  },
  headerRightAction: {
    width: 20,
    height: 20,
    tintColor: COLORS.primary,
  },
  thumbnailImage: {
    width: SIZES.width / 3,
    height: SIZES.width / 3 + 40,
    borderRadius: 20,
  },
  barStyle: {
    height: 3,
  },
});

export default Home;

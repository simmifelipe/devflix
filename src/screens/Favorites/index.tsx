import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React from 'react';
import { useCallback } from 'react';
import { useState } from 'react';
import { Alert } from 'react-native';
import { Image } from 'react-native';
import {
  View,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

import { COLORS, FONTS, SIZES } from '../../constants';
import { useAuth } from '../../hooks/auth';
import api, { baseURL } from '../../services/api';

type FavoriteSeason = {
  user_id: string;
  season: Season;
};

const Favorites: React.FC = () => {
  const { user } = useAuth();
  const { navigate } = useNavigation();

  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<FavoriteSeason[]>([]);

  useFocusEffect(
    useCallback(() => {
      async function loadFavorites() {
        const response = await api.get(`/seasons/favorite/${user.uid}`);
        setFavorites(response.data);

        setLoading(false);
      }

      loadFavorites();
    }, [user.uid]),
  );

  const handleRemoveFavorite = useCallback(
    async (seasonId: number) => {
      try {
        Alert.alert(
          'Confirmação',
          'Deseja realmente excluir este item dos favoritos?',
          [
            {
              text: 'Não',
              style: 'cancel',
              onPress: () => {},
            },
            {
              text: 'Excluir',
              onPress: async () => {
                await api.delete(`/seasons/favorite/${user.uid}/${seasonId}`);
                setFavorites(
                  favorites.filter(
                    item =>
                      item.user_id !== user.uid || item.season.id !== seasonId,
                  ),
                );
              },
            },
          ],
        );
      } catch (err) {
        Alert.alert(
          'Erro',
          'Erro ao remover item dos favoritos: ' + err.message,
        );
      }
    },
    [favorites, user.uid],
  );

  function renderHeader() {
    return (
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Favoritos</Text>
      </View>
    );
  }

  function renderFavoriteList() {
    return (
      <FlatList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.flatlist}
        data={favorites}
        keyExtractor={item => `${item.season.id}`}
        renderItem={({ item }) => {
          return (
            <>
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.seasonItem}
                onPress={() =>
                  navigate('MovieDetail', { selected: item.season })
                }>
                <View style={styles.contentItem}>
                  <Image
                    source={{
                      uri: `${baseURL}/files/${item.season.thumbnail}`,
                    }}
                    resizeMode="cover"
                    style={styles.thumbnailImage}
                  />

                  <View style={styles.details}>
                    <View>
                      <Text style={styles.nameText}>{item.season.name}</Text>
                      <Text style={styles.episodeText}>
                        {item.season.current_episode}
                      </Text>
                    </View>
                    <View style={styles.bottomDetails}>
                      <Text style={styles.seasonText}>
                        {item.season.season}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.removeButton}
                onPress={() => handleRemoveFavorite(item.season.id)}>
                <Feather name="trash-2" size={16} color={COLORS.white} />
              </TouchableOpacity>
            </>
          );
        }}
        ListEmptyComponent={() => {
          if (loading) {
            return (
              <View style={styles.loading}>
                <ActivityIndicator size="large" color={COLORS.primary} />
              </View>
            );
          }
          return (
            <View style={styles.empty}>
              <Text style={{ color: COLORS.white, ...FONTS.h4 }}>
                Você ainda não ainda não adicionou nada aqui
              </Text>
            </View>
          );
        }}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      {renderFavoriteList()}
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
  flatlist: {
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  seasonItem: {
    width: '100%',
    backgroundColor: COLORS.transparentWhite,
    borderRadius: 10,
    marginVertical: 8,
  },
  contentItem: {
    flexDirection: 'row',
    paddingVertical: SIZES.base,
    marginLeft: 10,
    marginRight: 10,
  },
  thumbnailImage: {
    width: SIZES.width / 5,
    height: SIZES.width / 6 + 40,
    borderRadius: 10,
  },
  tagContainer: {
    width: 60,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: SIZES.base,
    paddingHorizontal: SIZES.base,
    paddingVertical: 3,
    borderRadius: SIZES.base,
    backgroundColor: COLORS.gray1,
  },
  details: {
    justifyContent: 'space-evenly',
  },
  nameText: {
    color: COLORS.white,
    marginLeft: 10,
    ...FONTS.h3,
  },
  episodeText: {
    color: COLORS.white,
    marginLeft: 10,
    ...FONTS.h4,
  },
  bottomDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  seasonText: {
    color: COLORS.primary,
    marginLeft: 10,
    ...FONTS.h4,
  },
  removeButton: {
    position: 'absolute',
    top: 0,
    right: 0,

    padding: 4,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
  },
  loading: { flex: 1 },
  empty: {
    flex: 1,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: COLORS.transparentWhite,
  },
});

export default Favorites;

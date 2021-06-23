import { useNavigation } from '@react-navigation/native';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/mobile';
import React from 'react';
import { useState } from 'react';
import { useCallback } from 'react';
import { useRef } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  StatusBar,
  FlatList,
  TouchableOpacity,
  Image,
  Text,
  ActivityIndicator,
} from 'react-native';
import { Input } from '../../components';

import { COLORS, dummyData, FONTS, icons, SIZES } from '../../constants';

const Search: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { navigate } = useNavigation();
  const [loading, setLoading] = useState(false);

  const handleSearch = useCallback(async () => {
    setLoading(true);

    setTimeout(() => { }, 5000);

    setLoading(false);
  }, []);

  function renderHeader() {
    return (
      <View style={styles.header}>
        <Form ref={formRef} onSubmit={handleSearch}>
          <Input
            autoCorrect={true}
            autoCapitalize="none"
            keyboardType="default"
            name="search"
            icon="search"
            placeholder="Buscar"
            returnKeyType="search"
            onSubmitEditing={() => {
              console.log('Submit editing');
            }}
            style={styles.search}
          />
        </Form>
      </View>
    );
  }

  function renderSearchList() {
    return (
      <FlatList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingLeft: 20,
        }}
        data={dummyData.newSeason}
        keyExtractor={item => `${item.id}`}
        renderItem={({ item, index }) => {
          return (
            <TouchableOpacity
              onPress={() => navigate('MovieDetail', { selectedMovie: item })}>
              <View
                // eslint-disable-next-line react-native/no-inline-styles
                style={{
                  flexDirection: 'row',
                  paddingVertical: SIZES.base,
                  marginLeft: index === 0 ? SIZES.padding : 20,
                  marginRight:
                    index === dummyData.continueWatching.length - 1
                      ? SIZES.padding
                      : 0,
                }}>
                <Image
                  source={item.thumbnail}
                  resizeMode="cover"
                  style={styles.thumbnailImage}
                />

                <View style={styles.details}>
                  <Text style={styles.nameText}>{item.name}</Text>
                  <Text style={styles.seasonText}>{item.details.season}</Text>
                  <View style={styles.tagContainer}>
                    <Image
                      source={icons.star}
                      resizeMode="contain"
                      style={styles.image}
                    />
                    <Text style={styles.ratingText}>
                      {item?.details.ratings}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
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
            <View
              style={{
                flex: 1,
                height: 100,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 10,
                backgroundColor: COLORS.gray,
              }}>
              <Text style={{ color: COLORS.white, ...FONTS.h4 }}>
                Nenhum resultado encontrado
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
      {renderSearchList()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
    paddingTop: StatusBar.currentHeight,
    paddingRight: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.base,
    marginTop: 22,
  },
  search: {
    width: '100%',
    color: COLORS.white,
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
    justifyContent: 'space-between',
  },
  nameText: {
    color: COLORS.white,
    marginLeft: 10,
    ...FONTS.h3,
  },
  seasonText: {
    color: COLORS.gray,
    marginLeft: 10,
    ...FONTS.h4,
  },
  image: {
    width: 12,
    height: 12,
  },
  ratingText: {
    marginLeft: SIZES.base,
    color: COLORS.white,
    ...FONTS.h4,
  },
  loading: { flex: 1 },
});

export default Search;

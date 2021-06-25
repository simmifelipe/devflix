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
import { Input, OrderBy } from '../../components';

import { COLORS, FONTS, icons, SIZES } from '../../constants';
import api, { baseURL } from '../../services/api';

type OrderByOption = {
  value: 'ALF' | 'CLA' | 'IDA';
};

const Search: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { navigate } = useNavigation();
  const [loading, setLoading] = useState(false);

  const [query, setQuery] = useState('');
  const [finded, setFinded] = useState<Season[]>([]);
  const [orderBy, setOrderBy] = useState<OrderByOption>({ value: 'ALF' });

  const handleSearch = useCallback(async () => {
    setLoading(true);
    setFinded([]);

    const response = await api.post('/seasons/search', { query });
    setFinded(response.data);

    setLoading(false);
  }, [query]);

  const handleOrderBy = useCallback(
    (order: string) => {
      if (order === 'ALF') {
        setOrderBy({ value: 'ALF' });
        setFinded(
          finded.sort((a: Season, b: Season) => (a.name < b.name ? -1 : 1)),
        );
      } else if (order === 'CLA') {
        setOrderBy({ value: 'CLA' });
        setFinded(
          finded.sort((a: Season, b: Season) =>
            a.ratings < b.ratings ? 1 : -1,
          ),
        );
      } else if (order === 'IDA') {
        setOrderBy({ value: 'IDA' });
        setFinded(
          finded.sort((a: Season, b: Season) => (a.age < b.age ? 1 : -1)),
        );
      }
    },
    [finded],
  );

  function renderHeader() {
    return (
      <View style={styles.header}>
        <Form ref={formRef} onSubmit={handleSearch}>
          <Input
            value={query}
            onChangeText={text => setQuery(text)}
            autoCorrect={true}
            autoCapitalize="none"
            keyboardType="default"
            name="search"
            icon="search"
            placeholder="Buscar"
            returnKeyType="search"
            onSubmitEditing={() => formRef.current?.submitForm()}
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
        contentContainerStyle={styles.flatList}
        data={finded}
        keyExtractor={item => `${item.id}`}
        renderItem={({ item, index }) => {
          return (
            <TouchableOpacity
              style={styles.item}
              onPress={() => navigate('MovieDetail', { selected: item })}>
              <View
                // eslint-disable-next-line react-native/no-inline-styles
                style={{
                  flexDirection: 'row',
                  paddingVertical: SIZES.base,
                  marginLeft: 10,
                  marginRight: 10,
                }}>
                <Image
                  source={{
                    uri: `${baseURL}/files/${item.thumbnail}`,
                  }}
                  resizeMode="cover"
                  style={styles.thumbnailImage}
                />

                <View style={styles.details}>
                  <Text style={styles.nameText}>{item.name}</Text>
                  <Text style={styles.seasonText}>{item.season}</Text>
                  <View style={styles.tags}>
                    <View style={styles.tagContainer}>
                      <Image
                        source={icons.star}
                        resizeMode="contain"
                        style={styles.image}
                      />
                      <Text style={styles.ratingText}>{item.ratings}</Text>
                    </View>
                    <View style={styles.tagContainer}>
                      <Text style={styles.ratingText}>{`${item.age}+`}</Text>
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
        ListHeaderComponent={() => {
          if (finded && finded.length > 1) {
            return (
              <View style={styles.headerList}>
                <View>
                  <Text style={styles.orderBy}>Ordenar por</Text>
                </View>
                <View style={styles.orderItems}>
                  <OrderBy
                    text="A-Z"
                    active={orderBy.value === 'ALF'}
                    onPress={() => handleOrderBy('ALF')}
                  />
                  <OrderBy
                    text="Classificação"
                    active={orderBy.value === 'CLA'}
                    onPress={() => handleOrderBy('CLA')}
                  />
                  <OrderBy
                    text="Idade"
                    active={orderBy.value === 'IDA'}
                    onPress={() => handleOrderBy('IDA')}
                  />
                </View>
              </View>
            );
          }

          return <View />;
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
              <Text style={styles.emptyMessage}>
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
  flatList: {
    paddingLeft: 20,
    paddingBottom: 100,
  },
  headerList: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  orderItems: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  item: {
    borderWidth: 1,
    borderColor: COLORS.gray1,
    borderRadius: 10,
    marginVertical: 8,
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
  tags: {
    flexDirection: 'row',
    alignItems: 'center',
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
  orderBy: {
    color: COLORS.lightGray,
    ...FONTS.body4,
  },
  empty: {
    flex: 1,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: COLORS.transparentWhite,
  },
  emptyMessage: { color: COLORS.white, ...FONTS.h4 },
});

export default Search;

/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import {
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import {useQuery} from '@apollo/client';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import {STARSHIPS} from './templates';
import {Starship} from './@types/types';

const Item = ({starship}: {starship: Starship}) => {
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{starship.name}</Text>
    </View>
  );
};

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const {loading, error, data} = useQuery(STARSHIPS);

  const renderItem = ({item}: {item: Starship}) => <Item starship={item} />;

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error...</Text>;

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View
        style={{
          backgroundColor: isDarkMode ? Colors.black : Colors.white,
        }}>
        <FlatList
          data={data.allStarships.starships}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;

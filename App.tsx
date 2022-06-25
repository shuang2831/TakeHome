/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
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
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import Geolocation from 'react-native-geolocation-service';
import {getDistance} from 'geolib';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import {STARSHIPS} from './@templates/templates';
import {Starship, GeoCoords} from './@types/types';

const Item = ({starship}: {starship: Starship}) => {
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{starship.name}</Text>
    </View>
  );
};

const App = () => {
  const [currentPosition, setCurrentPosition] = useState<GeoCoords | undefined>(
    undefined,
  );
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  useEffect(() => {
    check(PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION).then(result => {
      switch (result) {
        case RESULTS.UNAVAILABLE:
          console.log(
            'This feature is not available (on this device / in this context)',
          );
          break;
        case RESULTS.DENIED:
          request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then(response => {
            if (response === RESULTS.GRANTED) {
              getCoords();
            }
          });
          break;
        case RESULTS.LIMITED:
          console.log('The permission is limited: some actions are possible');
          break;
        case RESULTS.GRANTED:
          getCoords();
          break;
        case RESULTS.BLOCKED:
          console.log('The permission is denied and not requestable anymore');
          break;
      }
    });
  }, []);
  const {loading, error, data} = useQuery(STARSHIPS);

  const getCoords = () => {
    return Geolocation.getCurrentPosition(
      position => {
        setCurrentPosition(position.coords);
      },
      err => {
        // See error code charts below.
        console.log(err.code, err.message);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  const getDistanceToSWL = () => {
    if (!currentPosition) {
      return '???';
    }
    const distanceInMeters: number = getDistance(
      {
        latitude: currentPosition.latitude,
        longitude: currentPosition.longitude,
      }, // Current Location
      {latitude: 33.814831976267016, longitude: -117.92057887641796}, // Star Wars Land
    );

    return distanceInMeters * 0.000621371;
  };

  const renderItem = ({item}: {item: Starship}) => <Item starship={item} />;

  if (loading) {
    return <Text>Loading...</Text>;
  }
  if (error) {
    return <Text>Error...</Text>;
  }

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      {!!currentPosition && (
        <>
          <Text>Latitude: {currentPosition.latitude}</Text>
          <Text>Longitude: {currentPosition.longitude}</Text>
          <Text>Distance to Star Wars Land: {getDistanceToSWL()} mi</Text>
        </>
      )}
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

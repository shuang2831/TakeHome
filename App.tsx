import React, {useEffect, useState, useMemo} from 'react';
import {
  FlatList,
  ImageBackground,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import {useQuery} from '@apollo/client';
import {
  check,
  request,
  Permission,
  PERMISSIONS,
  RESULTS,
} from 'react-native-permissions';
import Geolocation from 'react-native-geolocation-service';
import {getDistance} from 'geolib';
import {AppBar, Surface, Button} from '@react-native-material/core';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import {STARSHIPS} from './@templates/templates';
import {Starship, Film, Pilot, GeoCoords} from './@types/types';

const StarshipItem = ({starship}: {starship: Starship}) => {
  const films: [Film] = starship.filmConnection.films;
  const pilots: [Pilot] = starship.pilotConnection.pilots;
  return (
    <Surface elevation={2} category="medium" style={styles.starshipCard}>
      <Text style={styles.sectionTitle}>{starship.name}</Text>
      <Text style={styles.label}>Model</Text>
      <Text style={styles.sectionDescription}>{starship.model}</Text>
      <Text style={styles.label}>Hyperdrive Rating</Text>
      <Text style={styles.sectionDescription}>{starship.hyperdriveRating}</Text>
      <Text style={styles.label}>Appears In</Text>
      <Text style={styles.sectionDescription}>
        {films.map((film, index) => (
          <Text key={index}>
            {film.title}
            {index < films.length - 1 ? ', ' : ''}
          </Text>
        ))}
      </Text>
      {!!pilots.length && (
        <>
          <Text style={styles.label}>Piloted By</Text>
          <Text style={styles.sectionDescription}>
            {pilots.map((pilot, index) => (
              <Text key={index}>
                {pilot.name}
                {index < pilots.length - 1 ? ', ' : ''}
              </Text>
            ))}
          </Text>
        </>
      )}
    </Surface>
  );
};

const App = () => {
  const [currentPosition, setCurrentPosition] = useState<GeoCoords | undefined>(
    undefined,
  );
  const [modalVisible, setModalVisible] = useState(false);

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  useEffect(() => {
    const locationPermission: Permission =
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
        : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
    check(locationPermission).then(result => {
      switch (result) {
        case RESULTS.UNAVAILABLE:
          console.log(
            'This feature is not available (on this device / in this context)',
          );
          break;
        case RESULTS.DENIED:
          request(locationPermission).then(response => {
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

  const renderItem = ({item}: {item: Starship}) => (
    <StarshipItem starship={item} />
  );

  const memoizedValue = useMemo(() => renderItem, []);

  if (loading) {
    return <Text>Loading...</Text>;
  }
  if (error) {
    return <Text>Error...</Text>;
  }

  return (
    <SafeAreaView style={backgroundStyle}>
      <ImageBackground
        source={{
          uri: 'https://preview.redd.it/c2ke0x2jzsg11.jpg?auto=webp&s=da68a1447193d39f69464ad0f5f90e5ca01f5055',
        }}>
        <AppBar
          title="Stan's Take Home"
          color={'#045F45'}
          trailing={props =>
            !!currentPosition && (
              <Button
                variant="text"
                title="To SW Land!"
                compact
                onPress={() => setModalVisible(!modalVisible)}
                {...props}
              />
            )
          }
        />
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <FlatList
          data={data.allStarships.starships}
          renderItem={memoizedValue}
          keyExtractor={item => item.id}
        />
      </ImageBackground>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {!!currentPosition && (
              <>
                <Text style={styles.modalText}>
                  Latitude: {currentPosition.latitude}
                </Text>
                <Text style={styles.modalText}>
                  Longitude: {currentPosition.longitude}
                </Text>
                <Text style={styles.modalText}>
                  Distance to Star Wars Land: {getDistanceToSWL()} mi
                </Text>
              </>
            )}
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}>
              <Text style={styles.dismissText}>Dismiss</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 10,
  },
  sectionDescription: {
    fontSize: 18,
    fontWeight: '400',
    marginBottom: 10,
  },
  highlight: {
    fontWeight: '700',
  },
  starshipCard: {
    marginHorizontal: 20,
    marginTop: 20,
    padding: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
  },
  image: {
    flex: 1,
    justifyContent: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 5,
    padding: 10,
    elevation: 2,
    alignSelf: 'center',
  },
  buttonClose: {
    backgroundColor: '#045F45',
  },
  modalText: {
    marginBottom: 15,
    fontSize: 18,
  },
  dismissText: {
    color: 'white',
  },
});

export default App;

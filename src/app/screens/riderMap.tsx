import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Image, Platform } from 'react-native';
import MapView, { Marker, LatLng, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import * as Location from 'expo-location';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/features/store';
import { GOOGLE_MAPS_API_KEY } from '@/constants/apiUrl';
import { selectOrigin, setOrigin } from '@/features/mapSlice/mapSlice';

const RideMap = () => {
  const mapRef = useRef<MapView | null>(null);
  const ride = useSelector((state: RootState) => state.ride);
  const origin = useSelector(selectOrigin);
  const dispatch = useDispatch();

  const vehicleIcons: Record<string, any> = {
    bike: require('@/assets/icons/bike.png'),
    taxi: require('@/assets/icons/taxi.png'),
    auto: require('@/assets/icons/auto.png'),
  }

  const vehicleIcon = vehicleIcons[ride.ride?.id || 'bike'];

  const [riderCoords, setRiderCoords] = useState<LatLng>({
    latitude: origin?.location?.lat || 0,
    longitude: origin?.location?.lng || 0,
  });

  const userCoords: LatLng = {
    latitude: ride.origin?.location?.lat || 0,
    longitude: ride.origin?.location?.lng || 0,
  };

  // Watch rider location
  useEffect(() => {
    let subscriber: Location.LocationSubscription;
    const startWatching = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      subscriber = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 5, // Update every 5 meters
          timeInterval: 3000,  // Update at least every 3 seconds
        },
        (location) => {
          const newCoords = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          };
          setRiderCoords(newCoords);
          // Update Redux state too if needed
          dispatch(
            setOrigin({
              location: {
                lat: newCoords.latitude,
                lng: newCoords.longitude
              },
              description: origin?.description || 'Rider Location',
            })
          );
        }
      );
    };

    startWatching();

    return () => {
      if (subscriber) subscriber.remove();
    };
  }, []);

  // Fit map to markers on load
  useEffect(() => {
    setTimeout(() => {
      mapRef.current?.fitToSuppliedMarkers(['rider', 'user'], {
        edgePadding: { top: 70, right: 70, bottom: 70, left: 70 },
        animated: true,
      });
    }, 500);
  }, [ride.origin, ride.destination]);

  return (
    <MapView
      ref={mapRef}
      provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
      style={styles.map}
      initialRegion={{
        latitude: riderCoords.latitude,
        longitude: riderCoords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }}
    >
      {/* Rider marker */}
      <Marker
        identifier="rider"
        coordinate={riderCoords}
        title="Rider"
        description={ride.origin?.description || 'Rider Location'}
      >
        <Image
          source={vehicleIcon}
          style={styles.riderIcon}
          resizeMode="contain"
        />
      </Marker>

      {/* User marker */}
      <Marker
        identifier="user"
        coordinate={userCoords}
        title="Pickup"
        description={ride.origin?.description || 'User Location'}
      >
        <Image
          source={require('@/assets/icons/destination.png')}
          style={styles.userIcon}
          resizeMode="contain"
        />
      </Marker>

      {/* Path from rider to user */}
      <MapViewDirections
        origin={riderCoords}
        destination={userCoords}
        apikey={GOOGLE_MAPS_API_KEY}
        strokeWidth={4}
        strokeColor="#00008B"
      />
    </MapView>
  );
};

export default RideMap;

const styles = StyleSheet.create({
  map: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
  },
  riderIcon: {
    width: 35,
    height: 35,
  },
  userIcon: {
    width: 35,
    height: 35,
  },
});

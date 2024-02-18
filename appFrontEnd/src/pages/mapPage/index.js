import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';

const MapScreen = () => {
  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

const [shops, setShops] = useState([]);

useEffect(() => {
  Geolocation.getCurrentPosition(
    (position) => {
      const newRegion = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      };
      setRegion(newRegion);
      fetchShops(newRegion.latitude, newRegion.longitude);
    },
    (error) => {
      console.log(error.code, error.message);
    },
    { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
  );
}, []);

const fetchShops = async (latitude, longitude) => {
  const url = `http://10.0.2.2:8080/api/map/nearbyshops?latitude=${latitude}&longitude=${longitude}`;

  try {
    const response = await fetch(url);
    const json = await response.json();
    setShops(json);
  } catch (error) {
    console.error('Error fetching nearby shops:', error);
    Alert.alert('Error', 'Unable to fetch shops');
  }
};

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        showsUserLocation={true}
        followUserLocation={true}>

   {shops.map((shop, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: shop.geometry.location.lat,
              longitude: shop.geometry.location.lng,
            }}
            title={shop.name}
            description={shop.description}
          />
        ))}
        </MapView>

        
     
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default MapScreen;
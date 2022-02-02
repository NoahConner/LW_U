


import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, Alert, Dimensions, TouchableOpacity,ToastAndroid } from 'react-native';
import { Image, Button, Icon, Input } from 'react-native-elements';

import {  moderateScale } from 'react-native-size-matters';
import SCheader from '../components/screensheader'
import MapView, { PROVIDER_GOOGLE, Marker, AnimatedRegion, ProviderPropType } from 'react-native-maps';
import GetLocation from 'react-native-get-location'
import Cloc from '../assets/svg/clocation.svg'
import Geolocation from '@react-native-community/geolocation';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = 29.9417666;
const LONGITUDE = -95.3991524;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const SPACE = 0.01;

function log(eventName, e) {
  console.log(eventName, e.nativeEvent);
}

class MarkerTypes extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      a: {
        latitude: LATITUDE + SPACE,
        longitude: LONGITUDE + SPACE,
      },
      b: {
        latitude: LATITUDE - SPACE,
        longitude: LONGITUDE - SPACE,
      },
      region:{
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      }
    };
  }

  setRegion = (e) => {
    // console.log(e.nativeEvent)
    this.setState({
      region:{
        latitude: e.latitude,
        longitude: e.longitude,
        latitudeDelta: e.latitudeDelta,
        longitudeDelta: e.longitudeDelta,
      }
    })
  }


currentLocation = () => {
  GetLocation.getCurrentPosition({
    enableHighAccuracy: true,
    timeout: 15000,
  })
    .then(location => {
      console.log(location);
      this.setState(
        {
          region:{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        }
      }
      )
    })
    .catch(error => {
      const { code, message } = error;
      console.warn(code, message);
    })
}

  render() {
    return (
      <View style={styles.container}>
        <SCheader navigation={this.props.navigation} backbutton={true} name={'Map'} wallet={false} />
        <View style={{ position: 'absolute', bottom: 40, left: 0, zIndex: 9999, width: '100%', paddingHorizontal: 20 }}>
          <View>
            <View style={{ alignItems: 'flex-end' }}>
              <TouchableOpacity style={{ paddingVertical: 10, paddingHorizontal: 8, backgroundColor: '#fff', borderRadius: 50, elevation: 5, marginBottom: 20, width: 43 }} onPress={() => this.currentLocation()}>
                <Cloc style={{ fill: '#2196F3', height: 25, width: 25 }} />
              </TouchableOpacity>
            </View>
            <Button
              title="Save"
              type="solid"
              onPress={()=> console.log(this.state.region)}
              buttonStyle={{
                backgroundColor: '#1E3865',
                padding: 15,
                borderRadius: 15,
              }}
            />
          </View>
        </View>
        <MapView
          provider={this.props.provider}
          style={styles.map}
          initialRegion={this.state.region}
          onRegionChangeComplete={e => this.setRegion(e)}
        >
        </MapView>
          <View style={styles.markerFixed}>
            <Image source={{ uri: "https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-512.png" }} style={{ height: 35, width: 35 }} />
          </View>
      </View>
    );
  }
}

MarkerTypes.propTypes = {
  provider: ProviderPropType,
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    flex: 1,
    position: 'relative'
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  markerFixed: {
    left: '50%',
    marginLeft: -24,
    marginTop: -48,
    position: 'absolute',
    top: '50%',
    zIndex: 999,
  },
});

export default MarkerTypes;
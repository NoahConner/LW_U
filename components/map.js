


import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, Alert, Dimensions, TouchableOpacity, ToastAndroid } from 'react-native';
import { Image, Button, Icon, Input } from 'react-native-elements';

import { moderateScale } from 'react-native-size-matters';
import SCheader from '../components/screensheader'
import MapView, { PROVIDER_GOOGLE, Marker, AnimatedRegion, ProviderPropType } from 'react-native-maps';
import GetLocation from 'react-native-get-location'
import Cloc from '../assets/svg/clocation.svg'
import Geolocation from '@react-native-community/geolocation';
import AppContext from '../components/appcontext'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Geocoder from 'react-native-geocoding';

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = 29.9417666;
const LONGITUDE = -95.3991524;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = 0.0421;
const SPACE = 0.01;
const mapRef = React.createRef();

function log(eventName, e) {
  console.log(eventName, e.nativeEvent);
}

class MarkerTypes extends React.Component {
  constructor(props) {
    super(props);
    console.log(props.route.params)
    this.state = {
      a: {
        latitude: props.route.params.latitude + SPACE,
        longitude: props.route.params.longitude + SPACE,
      },
      b: {
        latitude: props.route.params.latitude - SPACE,
        longitude: props.route.params.longitude - SPACE,
      },
      region: {
        latitude: props.route.params.latitude,
        longitude: props.route.params.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      }
    };
  }

  setRegion = (e) => {
    console.log(e)
    this.setState({
      region: {
        latitude: e.latitude,
        longitude: e.longitude,
        latitudeDelta: e.latitudeDelta,
        longitudeDelta: e.longitudeDelta,
      }
    })
  }

  getPysicalAddress = (location) => {
    Geocoder.init("AIzaSyDpjC5dmFxhdUHi24y0ZH6PGD_NhOLFCMA");
    setTimeout(() => {
      Geocoder.from(location.description)
      .then(json => {
        var location = json.results[0].geometry.location;
        console.log(location);
        this.setState(
          {
            region: {
              latitude: location.lat,
              longitude: location.lng,
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA,
            }
          }
        )
        mapRef.current.animateToRegion({
          latitude: location.lat,
          longitude: location.lng,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1
        })
      })
      .catch(error => console.warn(error));
    }, 1000);
  }

  componentDidMount() {
    this.currentLocation()
  }
  currentLocation = () => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
    })
      .then(location => {
        console.log(location, 'location');
        this.setState(
          {
            region: {
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA,
            }
          }
        )
        mapRef.current.animateToRegion({
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1
        })
        console.log(this.state.region)
      })
      .catch(error => {
        const { code, message } = error;
        console.warn(code, message);
      })


  }
  saveReion() {
    // this.context.setsetcurrentLatLng(this.state.region)
    this.props.navigation.navigate('Home', this.state.region)
  }

  render() {
    return (
      <View style={styles.container}>
        <SCheader navigation={this.props.navigation} backbutton={true} name={'Map'} wallet={false} />
        <View style={{ position: 'absolute', bottom: moderateScale(50), left: 0, zIndex: 9999, width: '100%', paddingHorizontal: 20 }}>
          <View>
            <View style={{ alignItems: 'flex-end' }}>
              <TouchableOpacity style={{ paddingVertical: 10, paddingHorizontal: 8, backgroundColor: '#fff', borderRadius: 50, elevation: 5, marginBottom: 20, width: 43 }} onPress={() => this.currentLocation()}>
                <Cloc style={{ fill: '#2196F3', height: 25, width: 25 }} />
              </TouchableOpacity>
            </View>
            <Button
              title="Save"
              type="solid"
              onPress={() => this.saveReion()}
              buttonStyle={{
                backgroundColor: '#1E3865',
                padding: 15,
                borderRadius: 15,
              }}
            />
          </View>
        </View>
        <View style={{ position: 'absolute', top: moderateScale(70), left: 0, zIndex: 9999, width: '100%', paddingHorizontal: 20 }}>
          <GooglePlacesAutocomplete
            placeholder='Search'
            onPress={(data, details = null) => {
              // 'details' is provided when fetchDetails = true
              this.getPysicalAddress(data)
            }}
            // textInput={{
            //   color:'red',
            //   fontFamily:'Poppins-Medium'
            // }}
            styles={{
              textInput: {
                height: 42,
                color: '#5d5d5d',
                fontSize: 16,
                color:'#000',
                fontFamily:'Poppins-Medium',
                paddingTop:10,
                shadowColor: "#000",
shadowOffset: {
	width: 0,
	height: 4,
},
shadowOpacity: 0.32,
shadowRadius: 5.46,

elevation: 9,
              },
              predefinedPlacesDescription: {
                color: '#1faadb',
              },
            }}
            query={{
              key: 'AIzaSyDpjC5dmFxhdUHi24y0ZH6PGD_NhOLFCMA',
              language: 'en',
            }}
            currentLocation={true}
            currentLocationLabel='Current location'
          />
        </View>
        <MapView
          ref={mapRef}
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
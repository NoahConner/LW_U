import React, { useEffect, useContext, useState } from 'react';
import { View, SafeAreaView, Text, StyleSheet, RefreshControl, Platform, ActivityIndicator, TouchableOpacity, FlatList, Modal } from 'react-native';
import { Image, Button, Icon } from 'react-native-elements';
import Header from '../components/header'
import Location from '../assets/svg/location.svg';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import AppContext from '../components/appcontext'
import { moderateScale } from 'react-native-size-matters';
import GetLocation from 'react-native-get-location';
import axiosconfig from '../providers/axios';
import Geolocation from '@react-native-community/geolocation';
import Loader from './loader';
import { useIsFocused } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geocoder from 'react-native-geocoding';
// import LocationEnabler from 'react-native-location-enabler'; /* comment this on ios */

const mcCards = (d, i, navigation) => {
    if (d?.user?.status == '1') {
        return (
            <TouchableOpacity onPress={() => navigation.navigate('Resturants', d)}>
                <View style={[Platform.OS == 'ios' ? styles.mcCardIos : styles.mcCard]} key={d.id}>
                    <View style={{ backgroundColor: '#fff', borderRadius: 8, overflow: 'hidden' }}>
                        <Image
                            source={{ uri: d.user.image }}
                            style={{ width: 65, height: 70, resizeMode: 'contain' }}
                            PlaceholderContent={<ActivityIndicator />}
                        />
                    </View>
                    <View style={{ marginLeft: 15, width: '100%', paddingRight: 100 }}>
                        <Text style={{ fontFamily: 'Gilroy-Bold', fontSize: moderateScale(15), marginBottom: 5 }}>{d.user.name}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Location
                                style={{ height: 16, width: 13, marginRight: 10 }}
                            />
                            <Text numberOfLines={1} style={{ fontSize: moderateScale(12), fontFamily: 'Gilroy-Medium' }}>{d.distance_in_km_meters} </Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
}

// comment this on ios
// const {
//     PRIORITIES: { HIGH_ACCURACY },
//     useLocationSettings,
// } = LocationEnabler;

// const LocationStatus = (props: { enabled: boolean | undefined }) => (
//     <Text style={{ ...styles.status, marginBottom: 10 }}>
//         Location : [{' '}
//         {props.enabled !== undefined && props.enabled ? (
//             <Text style={{ ...styles.enabled, color: '#000' }}>Enabled</Text>
//         ) : props.enabled !== undefined && !props.enabled ? (
//             <Text style={{ ...styles.disabled, color: '#000' }}>Turn on your device location for this application</Text>
//         ) : (
//             <Text style={{ ...styles.undefined, color: '#000' }}>Undefined</Text>
//         )}{' '}
//         ]
//     </Text>
// );

// const RequestResolutionSettingsBtn = (props: { onPress: any }) => (
//     <Button
//         color="red"
//         title="Request Resolution Location Settings"
//         onPress={props.onPress}
//     />
// );
// // comment this on ios

const Home = ({ navigation, route }) => {

    const myContext = useContext(AppContext)
    const [location, setLocation] = useState()
    const [resTaurents, setresTaurents] = useState([])
    const [loader, setLoader] = useState(false);
    const isFocused = useIsFocused();
    const [locationon, setlocationon] = useState(true);
    const [address, setaddress] = useState(null);
    // const [enabled, requestResolution] = useLocationSettings({
    //     priority: HIGH_ACCURACY,
    //     alwaysShow: true,
    //     needBle: true,
    // });

    useEffect(() => {
        getCurrentLocation();
    }, [])

    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = React.useCallback(() => {
      setRefreshing(true);
      if (route.params) {
        getRestaurents(route.params);
        setLocation(route.params);
    } else {
        getCurrentLocation();
    }
    }, []);

    const getCurrentLocation = () => {
        setLoader(true)
        GetLocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 15000,
        })
            .then(location => {

                setLocation(location)
                getRestaurents(location)
            })
            .catch(error => {
                setlocationon(false)
                const { code, message } = error;


                setLoader(false)
            })
    }

    const getPysicalAddress = (location) => {
        Geocoder.init("AIzaSyDSD6okXBL6Qt0DaJJMlSFVNMuzz6ZTyWY");
        setTimeout(() => {
            Geocoder.from(location?.latitude, location?.longitude)
                .then(json => {
                    var addressComponent = json.results[0].formatted_address;

                    // myContext.setaddress(addressComponent)
                    setaddress(addressComponent)
                })
                .catch(error => console.warn(error));
        }, 1000);
    }

    const getRestaurents = async (location) => {
        setlocationon(true)
        setLoader(true)
        await axiosconfig.get(`admin/restaurents/${location.latitude},${location.longitude}`,
            {
                headers: {
                    Authorization: 'Bearer ' + myContext.userToken //the token is a variable which holds the token
                }

            }
        ).then((res: any) => {
            setresTaurents(res.data, 'resTaurents')
            setLoader(false)
            getWallet();
            getPysicalAddress(location)
            setRefreshing(false)
        }).catch((err) => {

            setLoader(false)
        })
    }

    const getWallet = async () => {

        const value = await AsyncStorage.getItem('@auth_token');
        await axiosconfig.get(`admin/current_wallet`,
            {
                headers: {
                    Authorization: 'Bearer ' + value //the token is a variable which holds the token
                }
            }
        ).then((res: any) => {
            myContext.setWalletAmount(res.data.wallet == undefined ? 0 : res.data.wallet)
        }).catch((err) => {

        })

        await axiosconfig.get(`admin/my_data`,
            {
                headers: {
                    Authorization: 'Bearer ' + value //the token is a variable which holds the token
                }
            }
        ).then((res: any) => {
            myContext.setprofileImagee(res.data.image)
        }).catch((err) => {

        })

        await axiosconfig.get(`admin/admin_data_index`,
            {
                headers: {
                    Authorization: 'Bearer ' + value //the token is a variable which holds the token
                }
            }
        ).then((res: any) => {
            myContext.setappUrl(Platform.OS === 'ios' ? res.data.app_url_ios : res.data.app_url_android);
        }).catch((err) => {

        })
    }

    useEffect(() => {
        if (route.params) {
            getRestaurents(route.params);
            setLocation(route.params);
        } else {
            getCurrentLocation();
        }

    }, [route, isFocused])

    return (

        <SafeAreaView style={styles.container}>
            <View style={{ width: '100%' }}>
                <Header navigation={navigation} routes={location} address={address} />
            </View>
            {
                loader ? (
                    <>
                        <Loader />
                    </>
                ) : null
            }
            <View style={{ ...styles.container, paddingHorizontal: 20 }}>
                {

                    <>
                        <FlatList
                            refreshControl={
                            <RefreshControl
                              refreshing={refreshing}
                              onRefresh={onRefresh}
                            />
                          }
                            data={resTaurents}
                            renderItem={({ item, index }) => (
                                mcCards(item, index, navigation)
                            )}
                            keyExtractor={item => item.id}
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                            ListHeaderComponent={
                                <View style={{ paddingHorizontal: 20 }}>
                                    <Text style={{ fontSize: moderateScale(17), fontFamily: 'Gilroy-Bold', marginTop: 20 }}>All Restaurants</Text>
                                </View>
                            }
                        />
                    </>
                }

            </View>
        </SafeAreaView>
    )
}

export default Home;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff'
    },
    mcCard: {
        backgroundColor: '#F6F8FA',
        shadowColor: 'black',
        shadowOffset: { width: 5, height: 5 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        borderRadius: 12, textAlign: 'center',
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    mcCardIos: {
        backgroundColor: '#f1f1f1',
        shadowColor: 'black',
        shadowOffset: { width: 5, height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        borderRadius: 12, textAlign: 'center',
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        width: '90%',
        marginLeft: '5%'
    },

})
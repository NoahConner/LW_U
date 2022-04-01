import React, { useEffect, useContext, useState } from 'react';
import { View, SafeAreaView, Text, StyleSheet, Alert, Platform, ActivityIndicator, TouchableOpacity, FlatList, Modal } from 'react-native';
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
// import LocationEnabler from 'react-native-location-enabler';

const mcCards = (d, i, navigation) => {
    console.log(d)
   if(d?.user?.status == '1'){
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


// const {
//     PRIORITIES: { HIGH_ACCURACY },
//     useLocationSettings,
//   } = LocationEnabler;

const Home = ({ navigation, route }) => {

    const myContext = useContext(AppContext)
    const [location, setLocation] = useState()
    const [resTaurents, setresTaurents] = useState([])
    const [loader, setLoader] = useState(false);
    const isFocused = useIsFocused();
    const [locationon, setlocationon] = useState(true);
    const [address, setaddress] = useState(null);

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
                console.warn(code, message);
                console.log(error.response);
                setLoader(false)
            })
    }

    const getPysicalAddress = (location) => {
        Geocoder.init("AIzaSyDpjC5dmFxhdUHi24y0ZH6PGD_NhOLFCMA");
        setTimeout(() => {
            Geocoder.from(location?.latitude, location?.longitude)
            .then(json => {
                    var addressComponent = json.results[0].formatted_address;
                console.log(json, 'addressComponent');
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
        }).catch((err) => {
            console.log(err.response)
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
            console.log(err.response)
        })

        await axiosconfig.get(`admin/my_data`,
            {
                headers: {
                    Authorization: 'Bearer ' + value //the token is a variable which holds the token
                }
            }
        ).then((res: any) => {
            myContext.setprofileImagee(res.data.image)
            adminData()
        }).catch((err) => {
            console.log(err.response)
        })
    }

    const adminData = async() => {
        const value = await AsyncStorage.getItem('@auth_token');
            await axiosconfig.get(`admin/admin_data_index`,
                {
                    headers: {
                        Authorization: 'Bearer ' + value //the token is a variable which holds the token
                    }
                }
            ).then((res: any) => {
                myContext.setappUrl( Platform.OS === 'ios' ? res.data.app_url_ios : res.data.app_url_android);
                setmyD(res.data)
            }).catch((err) => {
                console.log(err.response)
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

    useEffect(() => {
        getCurrentLocation();
    }, [])


    // const [enabled, requestResolution] = useLocationSettings({
    //     priority: HIGH_ACCURACY,
    //     alwaysShow: true,
    //     needBle: true,
    // });


    return (

        <View style={styles.container}>
            <View style={{ width: '100%' }}>
                <Header navigation={navigation} routes={location} address={address} />
            </View>
            {/* <LocationStatus enabled={enabled} />
            {!enabled && <RequestResolutionSettingsBtn onPress={requestResolution} />} */}
            {
                loader ? (
                    <>
                        <Loader />
                    </>
                ) : null
            }
            <SafeAreaView style={{ ...styles.container, paddingHorizontal: 20 }}>
                {
                    // !enabled ? (
                    //     <>

                    //         <View style={{width:'70%', marginLeft:'15%'}}>
                    //            <TouchableOpacity onPress={() => getCurrentLocation()}>
                    //             <Text style={{fontSize:16, fontFamily:'Gilroy-Bold', color:'#000', textAlign:'center'}}>
                    //                 Seems like your location is off! {'\n'}
                    //                 Select from the map or turn on the location and refresh.
                    //             </Text>
                    //            </TouchableOpacity>
                    //         </View>

                    //     </>
                    // ) : (
                    //     <>
                    //         <FlatList
                    //             data={resTaurents}
                    //             renderItem={({ item, index }) => (
                    //                 mcCards(item, index, navigation)
                    //             )}
                    //             keyExtractor={item => item.id}
                    //             showsVerticalScrollIndicator={false}
                    //             showsHorizontalScrollIndicator={false}
                    //             ListHeaderComponent={
                    //                 <View style={{ padding: 20 }}>
                    //                     <Text style={{ fontSize: moderateScale(17), fontFamily: 'Gilroy-Bold' }}>All Restaurants</Text>
                    //                 </View>
                    //             }
                    //         />
                    //     </>
                    // )

                        <>
                            <FlatList
                                data={resTaurents}
                                renderItem={({ item, index }) => (
                                    mcCards(item, index, navigation)
                                )}
                                keyExtractor={item => item.id}
                                showsVerticalScrollIndicator={false}
                                showsHorizontalScrollIndicator={false}
                                ListHeaderComponent={
                                    <View style={{ padding: 20 }}>
                                        <Text style={{ fontSize: moderateScale(17), fontFamily: 'Gilroy-Bold' }}>All Restaurants</Text>
                                    </View>
                                }
                            />
                        </>
                }

            </SafeAreaView>
        </View>
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
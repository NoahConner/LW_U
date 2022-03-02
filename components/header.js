import React, { useContext, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import Wallet from '../assets/svg/wallet.svg';
import Bars from '../assets/svg/bars.svg';
import Location from '../assets/svg/location.svg';
import AppContext from '../components/appcontext'
import { moderateScale } from 'react-native-size-matters';
import Geocoder from 'react-native-geocoding';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosconfig from '../providers/axios';
import { SafeAreaView } from 'react-native-safe-area-context';

const Header = ({ navigation, routes }) => {
    const myContext = useContext(AppContext);

    useEffect(() => {
        console.log(routes, 'routes')
        // Geocoder.init("AIzaSyBbYReyueMiiZMK5NnJSXlHyldmfymgrnc");

        // setTimeout(() => {
        //     Geocoder.from(29.9417666, -95.3991524)
        //     .then(json => {
        //             var addressComponent = json.results[0].address_components[0];
        //         console.log(addressComponent, 'addressComponent');
        //     })
        //     .catch(error => console.warn(error));
        // }, 1000);

    }, [routes])


    const getData = async () => {
        // const value = await AsyncStorage.getItem('@auth_token');
        // await axiosconfig.get(`admin/current_wallet`,
        // {
        //     headers: {
        //       Authorization: 'Bearer ' + myContext.userToken //the token is a variable which holds the token
        //     }
        //    }
        // ).then((res:any)=>{
        //     myContext.setWalletAmount(res.data.wallet)
        // }).catch((err)=>{
        //     console.log(err.response)
        // })

        // await axiosconfig.get(`admin/my_data`,
        // {
        //     headers: {
        //       Authorization: 'Bearer ' + myContext.userToken //the token is a variable which holds the token
        //     }
        //    }
        // ).then((res:any)=>{

        //     myContext.setMyData(res.data)
        // }).catch((err)=>{

        // })
        navigation.openDrawer();
    }

    return (
        <View style={styles.header}>
            <SafeAreaView>
            <View style={{
                width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, textAlign: 'center',
                elevation: 1,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.5,
                shadowRadius: 5,
                borderBottomEndRadius: 15,
                borderBottomStartRadius: 15
            }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', width: '90%', paddingLeft: 5 }} numberOfLines={1}>
                    <Button
                        icon={
                            <Bars style={{ height: 29, width: 40 }} />
                        }
                        title=""
                        containerStyle={{ width: 35 }}
                        buttonStyle={{ backgroundColor: 'transparent' }}
                        onPress={() => getData()}
                    />
                    <TouchableOpacity
                        // onPress={()=> myContext.setmapModal(true)}
                        onPress={() => navigation.navigate('MapModal')}
                    >
                        <View style={{ marginLeft: 25, width: '100%', paddingRight: 125 }}>
                            <Text style={{ fontSize: moderateScale(16), marginBottom: 5, fontFamily: 'Gilroy-Bold' }}>Location Radius</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Location
                                    style={{ height: 16, width: 12, marginRight: 10 }}
                                />
                                <Text style={{ fontSize: moderateScale(13), fontFamily: 'Gilroy-Medium' }} numberOfLines={1}>363 North Sam Houston Parkway East Greater Greenspoint,  </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{ width: '10%', alignItems: 'flex-end', paddingRight: 2 }}>
                    <TouchableOpacity>
                        <Button
                            icon={
                                <Wallet style={{ height: 25, width: 35 }} />
                            }
                            title=""
                            containerStyle={{ width: 30 }}
                            buttonStyle={{ backgroundColor: 'transparent' }}
                            onPress={() => navigation.navigate('Wallet')}
                        />
                    </TouchableOpacity>
                </View>
            </View>
            </SafeAreaView>
        </View>
    )
}

export default Header;

const styles = StyleSheet.create({
    header: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
    }
})




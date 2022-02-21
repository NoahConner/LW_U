import React, { useState, useRef, useContext } from 'react';
import {
    View, Text, StyleSheet, Clipboard, ImageBackground, ToastAndroid,
    Platform,
    Alert,
} from 'react-native';
import { Image, Button } from 'react-native-elements';
import Modal from "react-native-modal";
import Tick from '../assets/svg/tick.svg'
import AppContext from '../components/appcontext'
import {  moderateScale } from 'react-native-size-matters';

const Modals = ({ navigation }) => {
    const myContext = useContext(AppContext);
    const goOnDeposit = () => {
        myContext.setSorryModal(false)
        navigation.navigate('DepositeAmount')
    }
    const [copied,setcopied] = useState(false)

    var [showmodal, setshowmodal] = useState(false);
    setTimeout(() => {
        if (myContext.CongratesModalCon || myContext.SorryModalCon || myContext.CouponModalCon || myContext.closeAllSheets) {
            setshowmodal(true)
        } else {
            setshowmodal(false);
            setcopied(true);
        }
    }, 500)

    const modalConditionsClose = () => {
        if (myContext.CongratesModalCon) {
            myContext.setCongratesModal(false)
            navigation.navigate('Home')
        }
        else if (myContext.SorryModalCon) {
            myContext.setSorryModal(false)
        }
        else if (myContext.CouponModalCon) {
            myContext.setCouponModal(false);
            navigation.navigate('Home')
        }
        else if (myContext.closeAllSheets) {
            myContext.setcloseAllSheets(false)
        }
    }

    const closeCopy = ()=>{
        myContext.setCouponModal(false)
        Clipboard.setString(myContext.CurrentCoupon);
    }

    const copytxt = () => {
        Clipboard.setString(myContext.CurrentCoupon);
        setcopied(true);
        // if (Platform.OS === 'android') {
        //     ToastAndroid.show('Text copied:' + myContext.CurrentCoupon, ToastAndroid.SHORT)
        //   } else {
        //     Alert.alert('Text copy', myContext.CurrentCoupon, [
        //         {
        //             text: 'Co',
        //             onPress: str => closeCopy(),
        //         },
        //     ]);
        //   }
    }

    return (
        <View >
            <Modal isVisible={showmodal}
                onBackdropPress={() => modalConditionsClose()}
                avoidKeyboard={true}
            >
                <View style={{ backgroundColor: '#fff', minHeight: 260, borderRadius: 20 }}>
                    <ImageBackground source={require('../assets/svg/modal-back.png')} resizeMode="cover" style={styles.image}>
                        <View style={{ paddingHorizontal: myContext.CouponModalCon ? 30 : 50, alignItems: 'center' }}>
                            {
                                myContext.closeAllSheets ? (
                                    <>
                                        <Tick style={{ height: 55, width: 55, marginBottom: 20 }} />
                                        <Text style={{ color: '#FF3C40', fontSize: moderateScale(16), fontFamily: 'Poppins-SemiBold' }}>Card Added Successfully! </Text>
                                        <Text style={{ textAlign: 'center', color: '#666666', fontSize: moderateScale(13), marginTop: 10, fontFamily: 'Gilroy-Medium' }}>You have Successfully Added the Card.</Text>
                                    </>
                                ) :
                                    myContext.CongratesModalCon ? (
                                        <>
                                            <Tick style={{ height: 55, width: 55, marginBottom: 20 }} />
                                            <Text style={{ color: '#FF3C40', fontSize: moderateScale(16), fontFamily: 'Poppins-SemiBold' }}>Deposit Successful! </Text>
                                            <Text style={{ textAlign: 'center', color: '#666666', fontSize: moderateScale(13), marginTop: 10, fontFamily: 'Gilroy-Medium' }}>You have Successfully Deposited  the Amount.</Text>
                                        </>
                                    ) : myContext.SorryModalCon ? (
                                        <>

                                            <Text style={{ color: '#FF3C40', fontSize: moderateScale(16), fontFamily: 'Poppins-SemiBold' }}>Sorry :(</Text>
                                            <Text style={{ textAlign: 'center', color: '#666666', fontSize: moderateScale(13), marginTop: 10, fontFamily: 'Gilroy-Medium' }}>you don't have insufficient balance in your wallet, Please deposit money on you wallet</Text>
                                            <Button
                                                title="Deposit"
                                                type="solid"
                                                buttonStyle={{
                                                    backgroundColor: '#1E3865',
                                                    paddingHorizontal: 15,
                                                    paddingVertical: 15,
                                                    borderRadius: 15,
                                                }}
                                                titleStyle={{
                                                    fontSize: moderateScale(15),
                                                    fontFamily: 'Poppins-SemiBold'
                                                }}
                                                containerStyle={{ width: '100%', marginTop: 30 }}
                                                onPress={() => goOnDeposit()}
                                            />
                                        </>
                                    ) : myContext.CouponModalCon ? (
                                        <>

                                            <Text style={{ color: '#FF3C40', fontSize: moderateScale(16), fontFamily: 'Poppins-SemiBold' }}>Thanks For Your Donation! </Text>
                                            <Text style={{ textAlign: 'center', color: '#666666', fontSize: moderateScale(15), marginTop: 5, fontFamily: 'Gilroy-Medium' }}>Here`s the coupon code for your Leaper`s Food.</Text>
                                            <Text style={{ textAlign: 'center', color: '#1E3865', fontSize: moderateScale(17), marginTop: 25, fontFamily: 'Poppins-SemiBold' }}>Coupon Code</Text>
                                            <Button
                                                title={myContext.CurrentCoupon}
                                                type="solid"
                                                buttonStyle={{
                                                    backgroundColor: '#1E3865',
                                                    paddingHorizontal: 15,
                                                    paddingVertical: 16,
                                                    borderRadius: 15,
                                                }}
                                                titleStyle={{
                                                    fontSize: moderateScale(16),
                                                    fontFamily: 'Poppins-SemiBold'
                                                }}
                                                onPress={() => copytxt()}
                                                containerStyle={{ width: '100%', marginTop: 15 }}
                                            />
                                            {
                                                copied ? (
                                                    <>
                                                        <Text style={{ textAlign: 'center', color: '#000', fontSize: moderateScale(12), marginTop: 10, fontFamily: 'Poppins-SemiBold' }}>Copied!</Text>
                                                    </>
                                                ) : (
                                                    null
                                                )
                                            }
                                        </>
                                    ) : null
                            }
                        </View>
                    </ImageBackground>
                </View>
            </Modal>
        </View>
    )
}
export default Modals;

const styles = StyleSheet.create({
    image: {
        flex: 1,
        justifyContent: "center"
    }
})
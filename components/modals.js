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
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

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
            myContext.setCouponModal(false)
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
                <View style={{ backgroundColor: '#fff', height: 280, borderRadius: 20 }}>
                    <ImageBackground source={require('../assets/svg/modal-back.png')} resizeMode="cover" style={styles.image}>
                        <View style={{ paddingHorizontal: myContext.CouponModalCon ? 30 : 50, alignItems: 'center' }}>
                            {
                                myContext.closeAllSheets ? (
                                    <>
                                        <Tick style={{ height: 55, width: 55, marginBottom: 20 }} />
                                        <Text style={{ color: '#FF3C40', fontSize: RFPercentage(2.5), fontFamily: 'Gilroy-Bold' }}>Card Added Successfully! </Text>
                                        <Text style={{ textAlign: 'center', color: '#666666', fontSize: RFPercentage(1.8), marginTop: 10, fontFamily: 'Gilroy-Medium' }}>You have Successfully Added the Card.</Text>
                                    </>
                                ) :
                                    myContext.CongratesModalCon ? (
                                        <>
                                            <Tick style={{ height: 55, width: 55, marginBottom: 20 }} />
                                            <Text style={{ color: '#FF3C40', fontSize: RFPercentage(2.5), fontFamily: 'Gilroy-Bold' }}>Deposit Successful! </Text>
                                            <Text style={{ textAlign: 'center', color: '#666666', fontSize: RFPercentage(1.8), marginTop: 10, fontFamily: 'Gilroy-Medium' }}>You have Successfully Deposited  the Amount.</Text>
                                        </>
                                    ) : myContext.SorryModalCon ? (
                                        <>

                                            <Text style={{ color: '#FF3C40', fontSize: RFPercentage(2.5), fontFamily: 'Gilroy-Bold' }}>Sorry :(</Text>
                                            <Text style={{ textAlign: 'center', color: '#666666', fontSize: RFPercentage(1.8), marginTop: 10, fontFamily: 'Gilroy-Medium' }}>you don't have insufficient balance in your wallet, Please deposit money on you wallet</Text>
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
                                                    fontSize: RFPercentage(2.3),
                                                    fontFamily: 'Gilroy-Bold'
                                                }}
                                                containerStyle={{ width: '100%', marginTop: 30 }}
                                                onPress={() => goOnDeposit()}
                                            />
                                        </>
                                    ) : myContext.CouponModalCon ? (
                                        <>

                                            <Text style={{ color: '#FF3C40', fontSize: RFPercentage(2.5), fontFamily: 'Gilroy-Bold' }}>Thanks For Your Donation! </Text>
                                            <Text style={{ textAlign: 'center', color: '#666666', fontSize: RFPercentage(2), marginTop: 5, fontFamily: 'Gilroy-Medium' }}>Here`s the coupon code for your Leaper`s Food.</Text>
                                            <Text style={{ textAlign: 'center', color: '#1E3865', fontSize: RFPercentage(2.5), marginTop: 25, fontFamily: 'Gilroy-Bold' }}>Coupon Code</Text>
                                            <Button
                                                title={myContext.CurrentCoupon}
                                                type="solid"
                                                buttonStyle={{
                                                    backgroundColor: '#1E3865',
                                                    paddingHorizontal: 15,
                                                    paddingVertical: 20,
                                                    borderRadius: 15,
                                                }}
                                                titleStyle={{
                                                    fontSize: RFPercentage(2.5),
                                                    fontFamily: 'Gilroy-Bold'
                                                }}
                                                onPress={() => copytxt()}
                                                containerStyle={{ width: '100%', marginTop: 15 }}
                                            />
                                            {
                                                copied ? (
                                                    <>
                                                        <Text style={{ textAlign: 'center', color: '#000', fontSize: RFPercentage(2), marginTop: 10, fontFamily: 'Gilroy-Bold' }}>Copied!</Text>
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
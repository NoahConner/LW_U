import React, { useState, useRef, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Image, ActivityIndicator, Clipboard } from 'react-native';
import { Icon, CheckBox, Input, Button } from 'react-native-elements';
import RBSheet from "react-native-raw-bottom-sheet";
import SCheader from '../components/screensheader'
import { ScrollView } from 'react-native-gesture-handler';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import CalIcon from '../assets/svg/calendar.svg';
import moment from 'moment'
import AppContext from '../components/appcontext'
import Modals from '../components/modals';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { moderateScale } from 'react-native-size-matters';
import axiosconfig from '../providers/axios';
import Loader from './loader';
import Toast from 'react-native-toast-message';
import Modal from "react-native-modal";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Tick from '../assets/svg/tick.svg'

const Resturants = ({ route, navigation }) => {
    const refRBSheet = useRef();
    const [resData, setResData] = useState({})
    const [currentDeal, setcurrentDeal] = useState({})
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [datePick, setdatePick] = useState(null);
    const [loader, setLoader] = useState(false);
    const [leaperName, setleaperName] = useState(null);
    const [modalVisible1, setModalVisible1] = useState(false);
    const [modalVisible2, setModalVisible2] = useState(false);
    const [copied,setcopied] = useState(false)
    const [couponcode, setcouponcode] = useState(null)

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date) => {
        var currentTime = new Date();
        if (date < currentTime) {
            setdatePick(moment(date).format('DD MMM, yy'))
            hideDatePicker();
        } else {
            alert('Invalid Date!');
            hideDatePicker();
        }
    };

    const myContext = useContext(AppContext);

    const showToast = (t, e) => {

        Toast.show({
            type: t,
            text1: e,
        })
    }

    const generateCoupon = async () => {
       
        // return
        if (leaperName == null || leaperName.trim() == '') {
            showToast('error', 'Leaper name required!')
            return false
        }

        if (datePick == null || datePick == 'Invalid date') {
            showToast('error', 'Leaper Date of birth required!')
            return false
        }

        let coupon = Math.random().toString(36).substr(2, 8).toUpperCase()
    
        let dt = {
            deal_id: currentDeal.id,
            user_id: myContext.myData.id,
            leaper_name: leaperName.toLowerCase().trim(),
            leaper_dob:datePick,
            coupon: coupon
        }

        setLoader(true)
        await axiosconfig.post(`admin/order`, dt,
            {
                headers: {
                    Authorization: 'Bearer ' + myContext.userToken //the token is a variable which holds the token
                }
            }
        ).then((res: any) => {

            setLoader(false)
            
            setcouponcode(coupon)
            setdatePick(null)
            setleaperName(null)

            refRBSheet.current.close()

            setTimeout(() => {
                console.log('yu')
                setModalVisible2(true)
            }, 1000);
        }).catch((err) => {
           
            setLoader(false)
        })
    }

    // const getWallet = async () => {
    //     const value = await AsyncStorage.getItem('@auth_token');
    //     await axiosconfig.get(`admin/current_wallet`,
    //         {
    //             headers: {
    //                 Authorization: 'Bearer ' + value //the token is a variable which holds the token
    //             }
    //         }
    //     ).then((res: any) => {
            
    //         // myContext.setWalletAmount(res.data.wallet)
    //     }).catch((err) => {
           
    //     })
    // }

    const modalConditionsClose = () => {
        setModalVisible1(false)
    }

    const mcCards = (d, i, navigation, refRBSheet, myContext) => {

        const openSheet = (id) => {
            if (myContext.WalletAmount < parseInt(d.deal_price)) {
                // myContext.setSorryModal(true);
                setModalVisible1(true)
            } else {
                setcurrentDeal(d)
                refRBSheet.current.open()
            }
        }

        return (
            <TouchableOpacity onPress={() => openSheet(d.id)} key={i} style={{ display: d.deal_quantity > 0 && d.status == 1 ? 'flex' : 'none' }}>
                <View style={styles.mcCard} key={d.id}>
                    <View style={{ backgroundColor: '#fff', borderRadius: 8, overflow: 'hidden' }}>
                        <Image
                            source={{ uri: d.deal_image }}
                            style={{ width: 65, height: 70, resizeMode: 'cover' }}
                            PlaceholderContent={<ActivityIndicator />}
                        />
                    </View>
                    <View style={{ marginLeft: 15, width: '100%', paddingRight: 100, ...styles.flexRow, width: '100%', justifyContent: 'space-between' }}>
                        <View >
                            <Text style={{ fontFamily: 'Gilroy-Bold', fontSize: moderateScale(15), marginBottom: 5 }}>{d.deal_name}</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text numberOfLines={1} style={{ fontSize: moderateScale(11), width: '80%', fontFamily: 'Gilroy-Medium' }}>{d.deal_menu} </Text>
                            </View>
                        </View>
                        <View >
                            <Text style={{ fontFamily: 'Gilroy-Bold', fontSize: moderateScale(15), marginBottom: 5 }}>${d.deal_price}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    useEffect(() => {

        setResData(route.params)
       
    }, [])

    const goOnDeposit = () => {
        setModalVisible1(false)
        navigation.navigate('DepositeAmount')
    }

    const copytxt = () => {
        Clipboard.setString(myContext.CurrentCoupon);
        setcopied(true);
    }

    return (
        <View style={styles.container}>
            {
                loader ? (
                    <>
                        <Loader />
                    </>
                ) : null
            }
            <View>
                <SCheader navigation={navigation} backbutton={true} wallet={true} />
                <ImageBackground source={{ uri: resData?.user?.image }} resizeMode="cover" style={{ height: 220 }} >
                    <View style={{ width: '100%', height: 220, backgroundColor: '#1e3865e0', position: 'relative' }}>
                        <Text style={{ color: '#fff', fontSize: moderateScale(20), fontFamily: 'Gilroy-Bold', position: 'absolute', bottom: 40, left: 20 }}>{resData?.user?.name}</Text>
                    </View>
                </ImageBackground>

                <View>
                    <View style={{ backgroundColor: '#fff', width: '100%', height: '100%', borderTopLeftRadius: 30, borderTopRightRadius: 30, marginTop: -30, paddingHorizontal: 20 }}>
                        <Text style={{ color: '#000', fontSize: moderateScale(17), fontFamily: 'Gilroy-Bold', marginTop: 20 }}>Deals</Text>
                        <ScrollView style={{ paddingTop: 20 }}>
                            {
                                resData?.deals?.map((items, i) => {
                                    return (
                                        mcCards(items, i, navigation, refRBSheet, myContext)
                                    )
                                })
                            }
                        </ScrollView>
                    </View>
                </View>
            </View>

            <RBSheet
                ref={refRBSheet}
                closeOnDragDown={true}
                closeOnPressMask={true}
                customStyles={{
                    wrapper: {
                        backgroundColor: "#0000009e",
                    },
                    draggableIcon: {
                        backgroundColor: "#E6E6E6"
                    },
                    container: {
                        backgroundColor: "#fff",
                        borderTopEndRadius: 20,
                        borderTopStartRadius: 20
                    }
                }}
                height={moderateScale(470, 0.1)}
            >
                <ScrollView>
                    <View style={{ padding: 20 }}>
                        <View>
                            <View style={{ ...styles.mcCard, alignItems: 'flex-start', marginBottom: 40 }}>
                                <View style={{ borderRadius: 8, overflow: 'hidden' }}>
                                    <Image
                                        source={{ uri: currentDeal?.deal_image }}
                                        style={{ width: 65, height: 70, resizeMode: 'cover' }}
                                        PlaceholderContent={<ActivityIndicator />}
                                    />
                                </View>
                                <View style={{ marginLeft: 15 }}>
                                    <View style={{ width: '89%' }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <Text style={{ fontFamily: 'Gilroy-Bold', fontSize: moderateScale(15), marginBottom: 5 }}>{currentDeal?.deal_name}</Text>
                                            <Text style={{ fontFamily: 'Gilroy-Bold', fontSize: moderateScale(15), marginBottom: 5 }}>${currentDeal?.deal_price}</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Text style={{ fontSize: moderateScale(12), fontFamily: 'Gilroy-Medium', lineHeight: 20 }}>{currentDeal?.deal_menu}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View>
                            <Text style={{ fontSize: moderateScale(16), fontFamily: 'Gilroy-Bold', marginBottom: 10 }}>Leaper Details</Text>
                            <Input
                                placeholder='Full Name'
                                containerStyle={{
                                    ...styles.textContainerStyle,
                                }}
                                inputContainerStyle={{
                                    ...styles.inputContainerStyle
                                }}
                                onChangeText={value => setleaperName(value)}
                            />
                            <TouchableOpacity onPress={() => showDatePicker()}>
                                <View style={{ ...styles.textContainerStyle, marginBottom: 30, justifyContent: 'space-between', paddingHorizontal: 15, flexDirection: 'row', alignItems: 'center' }} >
                                    {
                                        datePick == null ? (
                                            <>
                                                <Text style={{ fontSize: moderateScale(16), color: 'grey' }}>DD/MM/YY</Text>
                                            </>
                                        ) : (
                                            <>
                                                <Text style={{ fontSize: moderateScale(16), color: '#000' }}>{datePick}</Text>
                                            </>
                                        )
                                    }
                                    <CalIcon style={{ height: 30, width: 30 }} />
                                </View>
                            </TouchableOpacity>
                            <DateTimePickerModal
                                isVisible={isDatePickerVisible}
                                mode="date"
                                onConfirm={handleConfirm}
                                onCancel={hideDatePicker}
                                display="default"
                                maximumDate={new Date()}
                            />
                            <View >
                                <Button
                                    title="Donate"
                                    buttonStyle={{
                                        backgroundColor: '#1E3865',
                                        padding: 20,
                                        borderRadius: 15
                                    }}
                                    onPress={() => generateCoupon()}
                                />
                            </View>
                        </View>
                    </View>
                </ScrollView>

            </RBSheet>
            {/* <Modals navigation={navigation} /> */}
            {
                modalVisible2 ? (
                    <>
                        <View >
                            <Modal isVisible={modalVisible2}
                                onBackdropPress={() => setModalVisible2(false)}
                                avoidKeyboard={true}
                            >
                                <View style={{ backgroundColor: '#fff', height: 280, borderRadius: 20 }}>
                                    <ImageBackground source={require('../assets/svg/modal-back.png')} resizeMode="cover" style={styles.image}>
                                        <View style={{ paddingHorizontal: myContext.CouponModalCon ? 30 : 50, alignItems: 'center' }}>
                                            <Text style={{ color: '#FF3C40', fontSize: moderateScale(16, 0.1), fontFamily: 'Gilroy-Bold' }}>Thanks For Your Donation! </Text>
                                            <Text style={{ textAlign: 'center', color: '#666666', fontSize: RFPercentage(2), marginTop: 5, fontFamily: 'Gilroy-Medium' }}>Here`s the coupon code for your Leaper`s Food.</Text>
                                            <Text style={{ textAlign: 'center', color: '#1E3865', fontSize: moderateScale(16, 0.1), marginTop: 25, fontFamily: 'Gilroy-Bold' }}>Coupon Code</Text>
                                            <Button
                                                title={couponcode}
                                                type="solid"
                                                buttonStyle={{
                                                    backgroundColor: '#1E3865',
                                                    paddingHorizontal: 15,
                                                    paddingVertical: 20,
                                                    borderRadius: 15,
                                                }}
                                                titleStyle={{
                                                    fontSize: moderateScale(16, 0.1),
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
                                        </View>
                                    </ImageBackground>
                                </View>
                            </Modal>
                        </View>
                    </>
                ) : null
            }
            {
                modalVisible1 ? (
                    <>
                        <View >
                            <Modal isVisible={modalVisible1}
                                onBackdropPress={() => modalConditionsClose()}
                                avoidKeyboard={true}
                            >
                                <View style={{ backgroundColor: '#fff', height: 280, borderRadius: 20 }}>
                                    <ImageBackground source={require('../assets/svg/modal-back.png')} resizeMode="cover" style={styles.image}>
                                        <View style={{ paddingHorizontal: myContext.CouponModalCon ? 30 : 50, alignItems: 'center' }}>
                                            <Text style={{ color: '#FF3C40', fontSize: moderateScale(16, 0.1), fontFamily: 'Gilroy-Bold' }}>Sorry :(</Text>
                                            <Text style={{ textAlign: 'center', color: '#666666', fontSize: RFPercentage(1.8), marginTop: 10, fontFamily: 'Gilroy-Medium' }}>You don't have insufficient money in your wallet, please deposit money on you wallet</Text>
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
                                        </View>
                                    </ImageBackground>
                                </View>
                            </Modal>
                        </View>
                    </>
                ) : null
            }




        </View>
    )
}
export default Resturants;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    mcCard: {
        backgroundColor: '#F6F8FA',
        shadowColor: 'black',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        borderRadius: 12, textAlign: 'center',
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    flexRow: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    textContainerStyle: {
        width: '100%',
        backgroundColor: '#F6F8FA',
        color: '#000',
        borderRadius: 15,
        paddingBottom: 0,
        height: 60,
        marginTop: 10
    },
    inputContainerStyle: {
        paddingBottom: 0,
        borderColor: 'transparent',
        marginTop: 6,
        fontFamily: 'Gilroy-Medium'
    },
    image: {
        flex: 1,
        justifyContent: "center"
    }
})
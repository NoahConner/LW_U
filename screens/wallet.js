import React, { useState, useRef, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Dimensions } from 'react-native';
import { Icon, CheckBox } from 'react-native-elements';
import PaymentIcon from '../assets/svg/paymentIconred.svg';
import History from '../assets/svg/historyIconred.svg';
import VisaIcon from '../assets/svg/visa.svg'
import MasterIcon from '../assets/svg/master.svg'
import AmexIcon from '../assets/svg/amex.svg'
import DiscIcon from '../assets/svg/discover.svg'
import JcbIcon from '../assets/svg/jcb.svg'
import DinnerClub from '../assets/svg/diners-club.svg'
import RBSheet from "react-native-raw-bottom-sheet";
import AddCardSheet from '../components/add-card-sheet'
import StackHeader from '../components/stackheader'
import Coupon from '../assets/svg/coupon.svg'
import { ScrollView } from 'react-native-gesture-handler';
import DepositImg from '../assets/svg/depositered.svg'
import SCheader from '../components/screensheader'
import AppContext from '../components/appcontext'
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { moderateScale } from 'react-native-size-matters';
import axiosconfig from '../providers/axios';
import Loader from '../screens/loader';
import moment from 'moment'

const defaultCad = [
    {
        'card_name': 'Visa',
        'card_no': '**** 2563',
        'id': '1'
    },
    {
        'card_name': 'Master Card',
        'card_no': '**** 8569',
        'id': '2'
    },
    {
        'card_name': 'American Express',
        'card_no': '**** 8569',
        'id': '4'
    }
]

// var donationHistory = [
//     {
//         'status':'donated',
//         'restaurant':'KFC',
//         'date':'11/11/2021',
//         'amount':'-$1.300',
//         'id':'1'
//     },
//     {
//         'status':'donated',
//         'restaurant':'KFC',
//         'date':'11/11/2021',
//         'amount':'-$1.300',
//         'id':'2'
//     },
//     {
//         'status':'donated',
//         'restaurant':'KFC',
//         'date':'11/11/2021',
//         'amount':'-$1.300',
//         'id':'3'
//     },
// ]

const Wallet = ({ navigation }) => {
    const myContext = useContext(AppContext);
    const refRBSheet = useRef();
    const refRBSheetDepos = useRef();

    const [loader, setLoader] = useState(false);
    const [donationHistory, setrecors] = useState([]);
    const [currentDeal, setcurrentDeal] = useState();
    const [dHistory, setdHistory] = useState([]);
    const [selectedCard, setselectedCard] = useState();

    const getRecords = async () => {
        setLoader(true)

        await axiosconfig.get(`admin/orders_by_id/${myContext.myData.id}`,
            {
                headers: {
                    Authorization: 'Bearer ' + myContext.userToken //the token is a variable which holds the token
                }
            }
        ).then((res: any) => {
            
            setrecors(res.data)
            setLoader(false)
        }).catch((err) => {

            setLoader(false)
        })
    }

    const splitNo = (c) => {
        var splitt = c.split(' ')
        var lenghter = splitt.length
        var cNoo = '**** ' + splitt[lenghter - 1]
        return cNoo
    }
    const totalWFee = (fee,amount,t) => {
        if(t == '$'){
            return fee+amount
        }else{
            return ((fee / 100 * amount)+amount).toFixed(2); 
        }
    }
    const cardDiv = (d, i) => {
        if (i < 4) {
            return (
                <TouchableOpacity style={{ ...styles.Ccard, marginTop: i == 0 ? 40 : 25 }} key={i} onPress={() => openSheet(d, 'deposit')}>
                    <View style={{ ...styles.flexRow, justifyContent: 'space-between', width: '100%' }} key={i}>
                        <View style={{ flexDirection: 'row', width: '100%' }}>
                            <View style={{ width: '15%' }}>
                                {
                                    d?.card.card_type == 'visa' ? <VisaIcon style={{ height: 30, width: 40, marginRight: 25 }} /> :
                                        d?.card.card_type == 'master-card' ? <MasterIcon style={{ height: 30, width: 40, marginRight: 25 }} /> :
                                            d?.card.card_type == 'discover' ? <DiscIcon style={{ height: 30, width: 40, marginRight: 25 }} /> :
                                                d?.card.card_type == 'jcb' ? <JcbIcon style={{ height: 30, width: 40, marginRight: 25 }} /> :
                                                    d?.card.card_type == 'american-express' ? <AmexIcon style={{ height: 30, width: 40, marginRight: 25 }} /> :
                                                        d?.card.card_type == 'diners-club' ? <DinnerClub style={{ height: 30, width: 40, marginRight: 25 }} /> :
                                                            <PaymentIcon style={{ height: 30, width: 40, marginRight: 25 }} />
                                }
                            </View>
                            <View style={{ flexDirection: 'column', width: '83%' }}>
                                <View style={{ ...styles.flexRow, justifyContent: 'space-between' }}>
                                    <Text style={{ fontWeight: 'bold', fontSize: moderateScale(13), marginRight: 0 }}>Deposited</Text>
                                    <Text style={{ ...styles.dater }}>{moment(d?.created_at).format('DD MMM, yy')}</Text>
                                    <Text style={{ fontWeight: 'bold', fontSize: moderateScale(15) }}>${totalWFee(Number(d?.processing_fee),Number(d?.amount),d?.fee_type)}</Text>
                                </View>
                                <View style={{ ...styles.flexRow, justifyContent: 'space-between' }}>
                                    <Text style={styles.dater}>{splitNo(d?.card?.card_no)}</Text>
                                    <Text style={styles.dater}>Processing Fee:</Text>
                                    <Text style={{ ...styles.dater, marginTop: 2 }}>{d?.fee_type}{d?.processing_fee}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            )
        }
    }
    const dCards = (d, i) => {
        if (i < 4) {
            return (
                <TouchableOpacity style={{ ...styles.flexRow, justifyContent: 'space-between', marginTop: i == 0 ? 50 : 45 }} key={i} onPress={() => openSheet(d, 'donation')}>
                    <View style={{ flexDirection: 'row', width: '100%' }}>
                        <View style={{ width: '15%' }}>
                            <Coupon />
                        </View>
                        <View style={{ flexDirection: 'column', width: '83%' }}>
                            <View style={{ ...styles.flexRow, justifyContent: 'space-between' }}>
                                <Text style={{ fontWeight: 'bold', fontSize: moderateScale(13), marginRight: 0 }}>Donated</Text>
                                <Text style={{ ...styles.dater }}>{moment(d?.created_at).format('DD MMM, yy')}</Text>
                                <Text style={{ fontWeight: 'bold', fontSize: moderateScale(15) }}>${d?.deal?.deal_price}</Text>
                            </View>
                            <Text style={styles.dater}>{d?.restaurent?.user?.name}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            )
        }
    }


    const openSheet = (d, c) => {
        if (c == 'donation') {
            refRBSheet.current.open()
            setcurrentDeal(d)
        } else {
            refRBSheetDepos.current.open()
            setselectedCard(d)
        }
      
    }

    useEffect(() => {
        getRecords()
        getHistory()
    }, [])

    const dateConverter = (d, t) => {
        if (t) {
            return moment(d).format('MMMM d, y, h:mm:ss a z')
        } else {
            return moment(d).format('MMMM d, y')
        }
    }

    const getHistory = async () => {
        setLoader(true)
        await axiosconfig.get(`admin/deposit_history`,
            {
                headers: {
                    Authorization: 'Bearer ' + myContext.userToken //the token is a variable which holds the token
                }
            }
        ).then((res: any) => {
           
            setdHistory(res.data)
            setLoader(false)

        }).catch((err) => {
            setLoader(false)
        })
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
            <SCheader navigation={navigation} backbutton={true} name={'Wallet'} wallet={false} />
            <View style={{ backgroundColor: '#1E3865', width: '100%', height: moderateScale(220) }}></View>
            <View style={{ width: '100%', paddingHorizontal: 20, position: 'absolute', top: moderateScale(120), zIndex:1 }}>
                <View style={styles.depoCard}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                        <View>
                            <Text style={{ fontSize: moderateScale(13), color: '#000', fontFamily: 'Gilroy-Medium' }}>Available Credit</Text>
                        </View>
                        <TouchableOpacity onPress={() => navigation.navigate('DepositeAmount')}>
                            <View style={{ ...styles.flexRow }}>
                                <DepositImg style={{ height: 33, width: 32 }} />
                                <Text style={{ fontSize: moderateScale(13), color: '#FF3C40', marginLeft: 10, fontFamily: 'Gilroy-Medium' }}>Deposit</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View>
                        <Text style={{ fontSize: moderateScale(18), color: '#000', fontFamily: 'Gilroy-Bold', marginTop: 5 }}>${myContext.WalletAmount}</Text>
                    </View>
                </View>
            </View>
            <ScrollView style={{ backgroundColor: '#fff', height: '100%', borderTopLeftRadius: 20, borderTopRightRadius: 20, marginTop: moderateScale(-30), paddingHorizontal: 20 }}>
                <View style={{ paddingTop: 60, paddingBottom: 30 }}>
                    <View style={{ ...styles.flexRow, marginTop: 20 }}>
                        <PaymentIcon style={{ height: 22, width: 32 }} />
                        <Text style={{ fontFamily: 'Gilroy-Bold', fontSize: moderateScale(15), marginLeft: 20 }}>Deposit History</Text>
                    </View>
                    <View style={{ marginTop: 0, width: '100%', paddingBottom: 40 }}>
                        <SafeAreaView >
                            {
                                dHistory.map((item, i) => {
                                    return (
                                        cardDiv(item, i)
                                    )
                                })
                            }
                            <TouchableOpacity style={{ marginTop: 20, alignItems:'center' }} onPress={() => navigation.navigate('DepositHistory')}>
                                <Text style={{ color: '#fff', textAlign: 'center', backgroundColor:'#00205b', width:moderateScale(90, 0.1), paddingVertical:moderateScale(8), borderRadius:10 }}>See More</Text>
                            </TouchableOpacity>
                        </SafeAreaView>
                    </View>
                    <View>
                        <View style={{ ...styles.flexRow, marginTop: 20 }}>
                            <History style={{ height: 26, width: 32 }} />
                            <Text style={{ fontFamily: 'Gilroy-Bold', fontSize: moderateScale(15), marginLeft: 20 }}>Donation History</Text>
                        </View>
                        <View>
                            {
                                donationHistory.map((items, i) => {
                                    return (
                                        dCards(items, i)
                                    )
                                })
                            }
                            <TouchableOpacity style={{ marginTop: 20, alignItems:'center' }} onPress={() => navigation.navigate('DonationHistory')}>
                            <Text style={{ color: '#fff', textAlign: 'center', backgroundColor:'#00205b', width:moderateScale(90, 0.1), paddingVertical:moderateScale(8), borderRadius:10 }}>See More</Text>
                            </TouchableOpacity>
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
                        height={425}
                    >
                        <ScrollView style={{ paddingBottom: 20 }}>
                            <View style={{ padding: 20 }}>
                                <Text style={{ fontFamily: 'Gilroy-Bold', fontSize: moderateScale(18), marginBottom: 15, borderBottomWidth: 1, borderBottomColor: "#FF3C40", paddingBottom: 15 }}>Donation Details</Text>

                                <View style={{ ...styles.flexRow, marginTop: 15 }}>
                                    <View style={{ ...styles.flexRow, alignItems: "flex-start" }}>
                                        <Text style={{ fontSize: moderateScale(15), fontFamily: 'Gilroy-Bold', marginTop: -3, ...styles.redColor }}>Date/Time:</Text>
                                        <Text style={{ fontSize: moderateScale(12), marginLeft: 16, flexShrink: 1, fontFamily: 'Gilroy-Medium', color: '#696868' }}>{moment(currentDeal?.created_at).format('DD MMM yy, h:mm:ss a z')}</Text>
                                    </View>
                                </View>
                                <View style={{ ...styles.flexRow, marginTop: 15 }}>
                                    <View style={{ ...styles.flexRow, alignItems: "flex-start" }}>
                                        <Text style={{ fontSize: moderateScale(15), fontFamily: 'Gilroy-Bold', marginTop: -3, ...styles.redColor }}>Restaurant:</Text>
                                        <Text style={{ fontSize: moderateScale(12), marginLeft: 16, flexShrink: 1, fontFamily: 'Gilroy-Medium', color: '#696868' }}>{currentDeal?.restaurent?.user?.name}</Text>
                                    </View>
                                </View>
                                <View style={{ ...styles.flexRow, marginTop: 15 }}>
                                    <View style={{ ...styles.flexRow, alignItems: "flex-start" }}>
                                        <Text style={{ fontSize: moderateScale(15), fontFamily: 'Gilroy-Bold', marginTop: -3, ...styles.redColor }}>Amount:</Text>
                                        <Text style={{ fontSize: moderateScale(12), marginLeft: 16, flexShrink: 1, fontFamily: 'Gilroy-Medium', color: '#696868' }}>${currentDeal?.deal?.deal_price}</Text>
                                    </View>
                                </View>

                                <View style={{ ...styles.flexRow, marginTop: 15 }}>
                                    <View style={{ ...styles.flexRow, alignItems: "flex-start" }}>
                                        <Text style={{ fontSize: moderateScale(15), fontFamily: 'Gilroy-Bold', marginTop: -3, ...styles.redColor }}>Coupon:</Text>
                                        <Text style={{ fontSize: moderateScale(12), marginLeft: 16, flexShrink: 1, fontFamily: 'Gilroy-Medium', color: '#696868' }}>{currentDeal?.coupon}</Text>
                                    </View>
                                </View>

                                <View style={{ ...styles.flexRow, marginTop: 15 }}>
                                    <View style={{ ...styles.flexRow, alignItems: "flex-start" }}>
                                        <Text style={{ fontSize: moderateScale(15), fontFamily: 'Gilroy-Bold', marginTop: -3, ...styles.redColor }}>Coupon Status:</Text>
                                        <Text style={{ fontSize: moderateScale(12), marginLeft: 16, flexShrink: 1, fontFamily: 'Gilroy-Medium', color: '#696868' }}>{currentDeal?.status}</Text>
                                    </View>
                                </View>

                                {
                                    currentDeal?.status == 'withdrawel' ? (
                                        <>
                                            <View style={{ ...styles.flexRow, marginTop: 15 }}>
                                                <View style={{ ...styles.flexRow, alignItems: "flex-start" }}>
                                                    <Text style={{ fontSize: moderateScale(15), fontFamily: 'Gilroy-Bold', ...styles.redColor }}>Withdrawal Time:</Text>
                                                    <Text style={{ fontSize: moderateScale(12), marginLeft: 16, flexShrink: 1, fontFamily: 'Gilroy-Medium', color: '#696868' }}>{dateConverter(currentDeal?.updated_at, true)}</Text>
                                                </View>
                                            </View>
                                        </>
                                    ) : null
                                }

                                <View style={{ ...styles.flexRow, marginTop: 15 }}>
                                    <View style={{ ...styles.flexRow, alignItems: "flex-start" }}>
                                        <Text style={{ fontSize: moderateScale(15), fontFamily: 'Gilroy-Bold', marginTop: -3, ...styles.redColor }}>Leaper Name:</Text>
                                        <Text style={{ fontSize: moderateScale(12), marginLeft: 16, flexShrink: 1, fontFamily: 'Gilroy-Medium', color: '#696868' }}>{currentDeal?.leaper_name}</Text>
                                    </View>
                                </View>

                                <View style={{ ...styles.flexRow, marginTop: 15 }}>
                                    <View style={{ ...styles.flexRow, alignItems: "flex-start" }}>
                                        <Text style={{ fontSize: moderateScale(15), fontFamily: 'Gilroy-Bold', marginTop: -3, ...styles.redColor }}>Leaper DOB:</Text>
                                        <Text style={{ fontSize: moderateScale(12), marginLeft: 16, flexShrink: 1, fontFamily: 'Gilroy-Medium', color: '#696868' }}>{currentDeal?.leaper_dob}</Text>
                                    </View>
                                </View>



                            </View>
                        </ScrollView>
                    </RBSheet>

                    <RBSheet
                        ref={refRBSheetDepos}
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
                        height={380}
                    >
                        <ScrollView style={{ paddingBottom: 20 }}>
                            <View style={{ padding: 20 }}>
                                <Text style={{ fontFamily: 'Gilroy-Bold', fontSize: moderateScale(18), marginBottom: 15, borderBottomWidth: 1, borderBottomColor: "#FF3C40", paddingBottom: 15 }}>Deposit Details</Text>

                                <View style={{ ...styles.flexRow, marginTop: 15 }}>
                                    <View style={{ ...styles.flexRow, alignItems: "flex-start" }}>
                                        <Text style={{ fontSize: moderateScale(15), fontFamily: 'Gilroy-Bold', marginTop: -3, ...styles.redColor }}>Date/Time:</Text>
                                        <Text style={{ fontSize: moderateScale(12), marginLeft: 16, flexShrink: 1, fontFamily: 'Gilroy-Medium', color: '#696868' }}>{moment(selectedCard?.created_at).format('DD MMM, yy')}</Text>
                                    </View>
                                </View>
                                <View style={{ ...styles.flexRow, marginTop: 15 }}>
                                    <View style={{ ...styles.flexRow, alignItems: "flex-start" }}>
                                        <Text style={{ fontSize: moderateScale(15), fontFamily: 'Gilroy-Bold', marginTop: -3, ...styles.redColor }}>Card:</Text>
                                        <Text style={{ fontSize: moderateScale(12), marginLeft: 16, flexShrink: 1, fontFamily: 'Gilroy-Medium', color: '#696868' }}>{selectedCard?.card?.card_type}</Text>
                                    </View>
                                </View>
                                <View style={{ ...styles.flexRow, marginTop: 15 }}>
                                    <View style={{ ...styles.flexRow, alignItems: "flex-start" }}>
                                        <Text style={{ fontSize: moderateScale(15), fontFamily: 'Gilroy-Bold', marginTop: -3, ...styles.redColor }}>Cardholder:</Text>
                                        <Text style={{ fontSize: moderateScale(12), marginLeft: 16, flexShrink: 1, fontFamily: 'Gilroy-Medium', color: '#696868' }}>{selectedCard?.card?.card_name}</Text>
                                    </View>
                                </View>
                                <View style={{ ...styles.flexRow, marginTop: 15 }}>
                                    <View style={{ ...styles.flexRow, alignItems: "flex-start" }}>
                                        <Text style={{ fontSize: moderateScale(15), fontFamily: 'Gilroy-Bold', marginTop: -3, ...styles.redColor }}>Amount:</Text>
                                        <Text style={{ fontSize: moderateScale(12), marginLeft: 16, flexShrink: 1, fontFamily: 'Gilroy-Medium', color: '#696868' }}>${selectedCard?.amount}</Text>
                                    </View>
                                </View>

                                <View style={{ ...styles.flexRow, marginTop: 15 }}>
                                    <View style={{ ...styles.flexRow, alignItems: "flex-start" }}>
                                        <Text style={{ fontSize: moderateScale(15), fontFamily: 'Gilroy-Bold', marginTop: -3, ...styles.redColor }}>Processing Fee:</Text>
                                        <Text style={{ fontSize: moderateScale(12), marginLeft: 16, flexShrink: 1, fontFamily: 'Gilroy-Medium', color: '#696868' }}>{selectedCard?.fee_type}{selectedCard?.processing_fee}</Text>
                                    </View>
                                </View>
                                <View style={{ ...styles.flexRow, marginTop: 15 }}>
                                    <View style={{ ...styles.flexRow, alignItems: "flex-start" }}>
                                        <Text style={{ fontSize: moderateScale(15), fontFamily: 'Gilroy-Bold', marginTop: -3, ...styles.redColor }}>Total:</Text>
                                        <Text style={{ fontSize: moderateScale(12), marginLeft: 16, flexShrink: 1, fontFamily: 'Gilroy-Medium', color: '#696868' }}>${totalWFee(Number(selectedCard?.processing_fee),Number(selectedCard?.amount),selectedCard?.fee_type)}</Text>
                                    </View>
                                </View>

                            </View>
                        </ScrollView>
                    </RBSheet>
                </View>
            </ScrollView>



        </View>
    )
}
export default Wallet;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'flex-start',
        backgroundColor: '#fff'
    },
    flexRow: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    Ccard: {
        // backgroundColor: '#F6F8FA',
        // borderRadius: 12,
        // paddingHorizontal: 15,
        paddingVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        justifyContent: 'space-between',
    },
    dater: {
        fontSize: moderateScale(12), color: '#666666'
    },
    depoCard: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 5,
        // height:100,
        width: '100%',
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 30,
        borderRadius: 15
    },
    redColor: {
        color: '#000'
    }
})
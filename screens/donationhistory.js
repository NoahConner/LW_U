import React, { useState, useRef, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, Button, FlatList, SafeAreaView, TouchableOpacity } from 'react-native';
import StackHeader from '../components/stackheader'
import Coupon from '../assets/svg/coupon.svg'
import RBSheet from "react-native-raw-bottom-sheet";
import { ScrollView } from 'react-native-gesture-handler';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { moderateScale } from 'react-native-size-matters';
import axiosconfig from '../providers/axios';
import Loader from '../screens/loader';
import AppContext from '../components/appcontext';
import moment from 'moment'
import Nodata from '../screens/nodata'

const DonationHistory = ({ navigation }) => {
    const refRBSheet = useRef();
    const myContext = useContext(AppContext);
    const [loader, setLoader] = useState(false);
    const [recors, setrecors] = useState([]);
    const [currentDeal, setcurrentDeal] = useState();

    const getRecords = async () => {
        setLoader(true)
        await axiosconfig.get(`admin/orders_by_id/${myContext.myData.id}`,
            {
                headers: {
                    Authorization: 'Bearer ' + myContext.userToken //the token is a variable which holds the token
                }
            }
        ).then((res: any) => {
            setLoader(false)
            setrecors(res.data)
        }).catch((err) => {
            setLoader(false)
        })
    }

    const openSheet = (d) => {
        setcurrentDeal(d)
        refRBSheet.current.open()
    }

    const dCards = (d, i, refRBSheet) => {
        return (
            <TouchableOpacity onPress={() => openSheet(d)}>
                <View style={{ ...styles.flexRow, paddingHorizontal: 20, justifyContent: 'space-between', width: '100%', marginTop: i == 0 ? 20 : 50, marginBottom: i == (recors.length -1) ? 100 : 0 }}>
                    <View style={{ ...styles.flexRow, justifyContent: 'space-between', width: '100%' }} key={i}>
                        <View style={{ flexDirection: 'row', width: '100%' }}>
                            <Coupon style={{ marginRight: 15 }} />
                            <View style={{ flexDirection: 'column', width: '83%' }}>
                                <View style={{ ...styles.flexRow, justifyContent: 'space-between' }}>
                                    <Text style={{ fontWeight: 'bold', fontSize: moderateScale(13), marginRight: 0 , textTransform: 'capitalize'}}>{d?.leaper_name}</Text>
                                    <Text style={{ ...styles.dater }}>{moment(d?.created_at).format('DD MMM, yy')}</Text>
                                    <Text style={{ fontWeight: 'bold', fontSize: moderateScale(15) }}>${d?.deal?.deal_price}</Text>
                                </View>
                                <Text style={styles.dater}>{d?.restaurent?.user?.name}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    useEffect(() => {
        getRecords()
    }, [])

    const dateConverter = (d, t) => {
        if (t) {
            return moment(d).format('MMMM d, y, h:mm:ss a z')
        } else {
            return moment(d).format('MMMM d, y')
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            {
                loader ? (
                    <>
                        <Loader />
                    </>
                ) : null
            }
            <StackHeader navigation={navigation} name={'Donation History'} />
            <View style={{ marginTop: 10 }}>

                <SafeAreaView>
                    <View style={{ paddingHorizontal: 20 }}>
                        <Text style={{ fontSize: moderateScale(18), fontFamily: 'Gilroy-Bold', marginBottom: 20 }}>Donation History</Text>
                    </View>
                    {
                        recors.length > 0 ? (
                            <>
                                <FlatList
                                    data={recors}
                                    renderItem={({ item, index }) => (
                                        dCards(item, index, refRBSheet)
                                    )}
                                    keyExtractor={item => item.id}
                                    showsVerticalScrollIndicator={false}
                                    showsHorizontalScrollIndicator={false}
                                />
                            </>
                        ) : (
                            <>
                                <Nodata title={'Seems like you have not donated yet!' } />
                            </>
                        )
                    }
                </SafeAreaView>
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
                                <Text style={{ fontSize: moderateScale(15), fontFamily: 'Gilroy-Bold', marginTop: -3, ...styles.redColor, textTransform: 'capitalize' }}>Leaper Name:</Text>
                                <Text style={{ fontSize: moderateScale(12), marginLeft: 16, flexShrink: 1, fontFamily: 'Gilroy-Medium', color: '#696868', textTransform: 'capitalize' }}>{currentDeal?.leaper_name}</Text>
                            </View>
                        </View>

                        <View style={{ ...styles.flexRow, marginTop: 15 }}>
                            <View style={{ ...styles.flexRow, alignItems: "flex-start" }}>
                                <Text style={{ fontSize: moderateScale(15), fontFamily: 'Gilroy-Bold', marginTop: -3, ...styles.redColor }}>Leaper DOB:</Text>
                                <Text style={{ fontSize: moderateScale(12), marginLeft: 16, flexShrink: 1, fontFamily: 'Gilroy-Medium', color: '#696868' }}>{
                                // moment(currentDeal?.leaper_dob).format('MMMM d, y')
                                currentDeal?.leaper_dob
                                }</Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </RBSheet>
        </SafeAreaView>
    )
}

export default DonationHistory;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'flex-start',
        backgroundColor: '#fff'
    },
    flexRow: {
        flexDirection: 'row', alignItems: 'center'
    },
    dater: {
        fontSize: moderateScale(12), color: '#666666'
    },
    redColor: {
        color: '#000'
    }
})
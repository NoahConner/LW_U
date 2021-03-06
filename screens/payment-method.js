import React, { useState, useRef,useContext, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, TouchableOpacity,Dimensions, Alert  } from 'react-native';
import { Image, Button, Icon } from 'react-native-elements';
import StackHeader from '../components/stackheader'
import VisaIcon from '../assets/svg/visa.svg'
import MasterIcon from '../assets/svg/master.svg'
import Trash from '../assets/svg/bin.svg'
import RBSheet from "react-native-raw-bottom-sheet";
import AddCardSheet from '../components/add-card-sheet'
import PaymentIcon from '../assets/svg/paymentIconred.svg';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import AppContext from '../components/appcontext'
import AmexIcon from '../assets/svg/amex.svg'
import DiscIcon from '../assets/svg/discover.svg'
import JcbIcon from '../assets/svg/jcb.svg'
import DinnerClub from '../assets/svg/diners-club.svg'
import Modals from '../components/modals';
import {  moderateScale } from 'react-native-size-matters';
import axiosconfig from '../providers/axios';
import Loader from '../screens/loader';

const PaymentMethod = ({ navigation }) => {

    const myContext = useContext(AppContext);
    const [loader, setLoader] = useState(false);
    const refRBSheet = useRef();
    // var [cards, setCards] = useState(myContext.paymentmethods)
    const [cards, setCards] = useState([]);
    const removeCard = async(i) => {
        // var fake = cards.filter(item => item.id != i)
        // myContext.setpaymentmethods(fake)
        setLoader(true)
        await axiosconfig.post(`admin/cards_edit/${i}`,{'status':0},
        {
            headers: {
              Authorization: 'Bearer ' + myContext.userToken //the token is a variable which holds the token
            }
           }
        ).then((res:any)=>{
        
            setLoader(false)
            getCards()
        }).catch((err)=>{
          
            setLoader(false)
        })
    }

    const splitNo = (c) => {
        // return c;
        var splitt = c.split(' ')
        var lenghter = splitt.length
        var cNoo = '**** '+splitt[lenghter-1]
        return cNoo
    }

    const getCards = async() => {
        setLoader(true)
        await axiosconfig.get(`admin/cards/${myContext.myData.id}`,
        {
            headers: {
              Authorization: 'Bearer ' + myContext.userToken //the token is a variable which holds the token
            }
           }
        ).then((res:any)=>{
     
            setLoader(false)
            setCards(res.data)
            // myContext.setpaymentmethods(res.data)
        }).catch((err)=>{
   
            setLoader(false)
        })
    }

    const alertFunc = (m,id) =>
    Alert.alert(
      "Warning",
      m,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { text: "OK", onPress: () => removeCard(id) }
      ]
    );

    const cardDiv = (d, i) => {
        return (
            <View style={{ ...styles.Ccard, marginTop: i == 0 ? 20 : 15 }} key={i}>
                <View style={styles.flexRow}>
                    {
                        d.card_type == 'visa' ? <VisaIcon style={{ height: 30, width: 40 }} /> :
                        d.card_type == 'master-card' ? <MasterIcon style={{ height: 30, width: 40 }} /> :
                        d.card_type == 'discover' ? <DiscIcon style={{ height: 30, width: 40 }} /> :
                        d.card_type == 'jcb' ? <JcbIcon style={{ height: 30, width: 40 }} /> :
                        d.card_type == 'american-express' ? <AmexIcon style={{ height: 30, width: 40 }} /> :
                        d.card_type == 'diners-club' ? <DinnerClub style={{ height: 30, width: 40 }} /> :
                        <PaymentIcon style={{ height: 30, width: 40 }}/>
                    }
                    <View style={{ marginLeft: 20 }}>
                        <Text style={{ fontSize: moderateScale(14), fontFamily: 'Gilroy-Bold',textTransform:'capitalize'}}>{d?.card_name}</Text>
                        <View style={{...styles.flexRow}}>
                            <Text style={{ color: '#666666', fontSize: moderateScale(12), marginTop: 5,fontFamily: 'Gilroy-Medium',textTransform:'capitalize',marginRight:20}}>{d?.card_type}:</Text>
                            <Text style={{ color: '#666666', fontSize: moderateScale(12), marginTop: 5,fontFamily: 'Gilroy-Medium'}}>{splitNo(d?.card_no)}</Text>
                        </View>
                    </View>
                </View>
                <View>
                    <TouchableOpacity>
                        <Trash style={{ height: 24, width: 24 }} onPress={() => alertFunc('Are you sure you want to delete the card?',d.id)} />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    useEffect(() => {
        getCards()
    }, [])
    

    return (
        <View style={styles.container}>
            {
                loader ? (
                    <>
                        <Loader />
                    </>
                ) : null
            }
            <StackHeader navigation={navigation} name={'Payment Method'} />
            <View style={{ marginTop: 0, paddingHorizontal: 20, width: '100%', paddingBottom: 80 }}>
                <SafeAreaView >
                    <FlatList
                        data={cards}
                        renderItem={({ item, index }) => (
                            cardDiv(item, index)
                        )}
                        keyExtractor={item => item.id}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        ListFooterComponent={
                            <TouchableOpacity style={{ ...styles.flexRow, marginTop: 20, marginBottom: 20, width: '70%' }} onPress={() => refRBSheet.current.open()}>
                                <Icon
                                    name='plus'
                                    type='font-awesome'
                                    color='#FF3C40'
                                    iconStyle={{ fontSize: moderateScale(15) }}
                                    style={{ marginRight: 24 }}
                                />
                                <Text style={{ fontWeight: 'bold', fontSize: moderateScale(15) }}>Add Payment Method</Text>
                            </TouchableOpacity>
                        }
                    />

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
                    container:{
                        backgroundColor: "#fff",
                        borderTopEndRadius:20,
                        borderTopStartRadius:20
                    }
                }}
                height={Dimensions.get('window').height-130}
            >
                <AddCardSheet navigation={navigation} statement={'payment-method'} />
            </RBSheet>

            <Modals navigation={navigation} />
        </View>
    )
}

export default PaymentMethod

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'flex-start',
        backgroundColor: '#fff'
    },
    flexRow: {
        flexDirection: 'row', alignItems: 'center'
    },
    Ccard: {
        backgroundColor: '#F6F8FA',
        borderRadius: 12,
        paddingHorizontal: 15,
        paddingVertical: 20,
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        justifyContent: 'space-between',
    }
})
import React, { useState, useRef,useContext, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, TouchableOpacity,Dimensions,ImageBackground  } from 'react-native';
import { Image, Button, Icon,Input ,CheckBox } from 'react-native-elements';
import StackHeader from '../components/stackheader';
import PaymentIcon from '../assets/svg/paymentIconred.svg';
import VisaIcon from '../assets/svg/visa.svg';
import MasterIcon from '../assets/svg/master.svg'
import Trash from '../assets/svg/bin.svg'
import RBSheet from "react-native-raw-bottom-sheet";
import AddCardSheet from '../components/add-card-sheet'
import ReviewPayment from '../components/review-pay';
import Modals from '../components/modals';
import AppContext from '../components/appcontext';
import AmexIcon from '../assets/svg/amex.svg';
import DiscIcon from '../assets/svg/discover.svg';
import JcbIcon from '../assets/svg/jcb.svg';
import DinnerClub from '../assets/svg/diners-club.svg';
import {  moderateScale } from 'react-native-size-matters';
import axiosconfig from '../providers/axios';
import Loader from '../screens/loader';

// const defaultCad = [
//     {
//         'card_name': 'Visa',
//         'card_no': '**** 2563',
//         'id': '1'
//     },

// {
//     "cvc": "636", 
//     "expiry": "03/30", 
//     "name": "Noah Conner", 
//     "number": "6011 6011 6011 6611", 
//     "type": "discover"
//   }

// ]
const ConfirmPayment = ({navigation,route })=>{

    const myContext = useContext(AppContext);
    const { amount } = route.params;
    const refRBSheet = useRef();
    const refRBSheetReview = useRef();
    const [cards, setCards] = useState([]);
    const [loader, setLoader] = useState(false);
    // const [cards, setCards] = useState(myContext.paymentmethods)
    const [cardSelect,SetcardSelect] = useState();
    const [cardSelected,SetcardSelected] = useState();

    const splitNo = (c) => {
        var splitt = c.split(' ')
        var lenghter = splitt.length
        var cNoo = '**** '+splitt[lenghter-1]
        return cNoo
    }

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
                <View style={{ position: 'relative', marginTop: 10 }}>
                    <Icon
                        name='square'
                        type='font-awesome'
                        color={cardSelect == d.id ? '#1E3865' : '#E6E6E6'}
                        iconStyle={{ fontSize: moderateScale(26) }}
                        onPress={()=> selCd(d.id, d)}
                    />
                    <CheckBox
                        title=''
                        iconType='font-awesome'
                        uncheckedIcon='square'
                        checkedColor="black"
                        uncheckedColor="transparent"
                        checked={cardSelect == d.id ? true : false}
                        containerStyle={{ position: 'absolute', right: 30, bottom: -7, padding: 0, width: 0, overflow: 'hidden', borderRadius: 50 }}
                    />
                </View>
            </View>
        )
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
            SetcardSelect(res.data[0].id)
            SetcardSelected(res.data[0])
            // myContext.setpaymentmethods(res.data)
        }).catch((err)=>{
            console.log(err)
            setLoader(false)
        })
    }

    const selCd = (i,d) => {
        SetcardSelect(i)
        SetcardSelected(d)
    }

    useEffect(() => {
        getCards()
    }, [])

    return(
        <View style={{...styles.container}}>
            {
                loader ? (
                    <>
                        <Loader />
                    </>
                ) : null
            }
            <StackHeader navigation={navigation} name={'Confirm Payment Method'} />
            <View style={{padding:20,width:'100%',height:Dimensions.get('window').height-100}}>
                <View style={{...styles.flexRow,justifyContent: 'space-between'}}>
                    <Text style={{color:'#666666',fontSize:moderateScale(16), fontFamily:'Gilroy-Medium'}}>Deposit Amont</Text>
                    <Text style={{color:'#000',fontSize:moderateScale(16),fontFamily:'Gilroy-Bold'}}>${amount}</Text>
                </View>
                <View style={{...styles.flexRow,marginTop:50}}>
                    <PaymentIcon style={{ height: 28, width: 38 }}/>
                    <Text style={{fontFamily:'Gilroy-Bold',fontSize:moderateScale(17),marginLeft:20}}>Payment Methods</Text>
                </View>

                <View style={{ marginTop: 0, width: '100%', paddingBottom: 80 }}>
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
                                        iconStyle={{ fontSize: moderateScale(17) }}
                                        style={{ marginRight: 24 }}
                                    />
                                    <Text style={{ fontFamily:'Gilroy-Bold', fontSize: moderateScale(15) }}>Add Payment Method</Text>
                                </TouchableOpacity>
                            }
                        />

                    </SafeAreaView>
                
                </View>
                <View style={{position: 'absolute',bottom:15,width:'100%',left:20}}>
                    <SafeAreaView>
                    <Button
                        title="Review"
                        buttonStyle={styles.NextBtns}
                        titleStyle={{fontSize:moderateScale(15),fontFamily:'Gilroy-Bold'}}
                        onPress={() => refRBSheetReview.current.open()}
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
                    <AddCardSheet navigation={navigation} statement={'deposite'}  />
                </RBSheet>

                {/* review */}
                <RBSheet
                    ref={refRBSheetReview}
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
                    height={560}
                >
                    <ReviewPayment navigation={navigation} amount={amount}  statement={'deposite'} cardSelect={cardSelect} cardSelected={cardSelected} />
                </RBSheet>

            </View>

                <Modals navigation={navigation} />
            
        </View>
    )
}
export default ConfirmPayment;

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
    NextBtns:{
        backgroundColor:'#1E3865',
        paddingHorizontal:26,
        paddingVertical:18
        ,borderRadius:15
    },
    image: {
        flex: 1,
        justifyContent: "center"
    }
})
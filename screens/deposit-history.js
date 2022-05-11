import React,{ useRef, useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, Button,FlatList,SafeAreaView,TouchableOpacity,ScrollView } from 'react-native';
import StackHeader from '../components/stackheader'
import VisaIcon from '../assets/svg/visa.svg'
import MasterIcon from '../assets/svg/master.svg'
import AmexIcon from '../assets/svg/amex.svg'
import DiscIcon from '../assets/svg/discover.svg'
import JcbIcon from '../assets/svg/jcb.svg'
import DinnerClub from '../assets/svg/diners-club.svg'
import PaymentIcon from '../assets/svg/paymentIconred.svg';
import RBSheet from "react-native-raw-bottom-sheet";
import {  moderateScale } from 'react-native-size-matters';
import axiosconfig from '../providers/axios';
import Loader from '../screens/loader';
import AppContext from '../components/appcontext'
import moment from 'moment';
import Nodata from '../screens/nodata'

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
    },
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
    },
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
];

const DepositHistory = ({navigation}) => {
    const refRBSheetDepos = useRef();
    const myContext = useContext(AppContext);
    const [loader, setLoader] = useState(false);
    const [dHistory, setdHistory] = useState([]);
    const [selectedCard, setselectedCard] = useState();

    const splitNo = (c) => {
        var splitt = c.split(' ')
        var lenghter = splitt.length
        var cNoo = '**** '+splitt[lenghter-1]
        return cNoo
    }
    const cardDiv = (d, i) => {
        return (
            <TouchableOpacity style={{ marginTop:30 }} key={i} onPress={() => openSheet(d)}>
                <View style={{...styles.flexRow,justifyContent:'space-between',width:'100%'}} key={i}>
                    <View style={{flexDirection:'row',width:'100%'}}>
                    {
                        d?.card.card_type == 'visa' ? <VisaIcon style={{ height: 30, width: 40, marginRight:25 }} /> :
                        d?.card.card_type == 'master-card' ? <MasterIcon style={{ height: 30, width: 40, marginRight:25 }} /> :
                        d?.card.card_type == 'discover' ? <DiscIcon style={{ height: 30, width: 40, marginRight:25 }} /> :
                        d?.card.card_type == 'jcb' ? <JcbIcon style={{ height: 30, width: 40, marginRight:25 }} /> :
                        d?.card.card_type == 'american-express' ? <AmexIcon style={{ height: 30, width: 40, marginRight:25 }} /> :
                        d?.card.card_type == 'diners-club' ? <DinnerClub style={{ height: 30, width: 40, marginRight:25 }} /> :
                        <PaymentIcon style={{ height: 30, width: 40, marginRight:25 }}/>
                    }
                        <View style={{flexDirection:'column',width:'83%'}}>
                            <View style={{...styles.flexRow,justifyContent:'space-between'}}>
                                <Text style={{fontWeight:'bold',fontSize:moderateScale(13),marginRight:0}}>Deposited</Text>
                                <Text style={{...styles.dater}}>{moment(d?.created_at).format('DD MMM, yy')}</Text>
                                <Text style={{fontWeight:'bold',fontSize:moderateScale(15)}}>${d?.amount}</Text>
                            </View>
                            {/* <Text style={styles.dater}>*** 1234</Text> */}
                            <View style={{...styles.flexRow,justifyContent:'space-between'}}>
                                <Text style={styles.dater}>{splitNo(d?.card?.card_no)}</Text>
                                <Text style={styles.dater}>Processing Fee:</Text>
                                <Text style={{...styles.dater,marginTop:2}}>${d?.processing_fee}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
    
    const openSheet = (d) => {
        setselectedCard(d);
        refRBSheetDepos.current.open();
    }

    const getHistory = async() => {
        setLoader(true)
        await axiosconfig.get(`admin/deposit_history`,
        {
            headers: {
              Authorization: 'Bearer ' + myContext.userToken //the token is a variable which holds the token
            }
        }
        ).then((res:any)=>{
            setdHistory(res.data)
            setLoader(false)
            
        }).catch((err)=>{
            setLoader(false)
        })
    }

    const dateConverter = (d,t) => {
        if(t){
            return moment(d).format('MMMM d, y, h:mm:ss a z');
        }else{
            return moment(d).format('MMMM d, y');
        }
    }
    

    useEffect(() => {
        getHistory()
    }, [])
    

    return(
        <View style={styles.container}>
            {
                loader ? (
                    <>
                        <Loader />
                    </>
                ) : null
            }
            <StackHeader navigation={navigation} name={'Deposit History'} />
            <View style={{ paddingHorizontal: 20 }}>
                <Text style={{ fontSize: moderateScale(18), fontFamily: 'Gilroy-Bold', marginBottom: 20 }}>Deposit History</Text>
            </View>
            {
                dHistory.length < 1 ? (
                    <>
                                <Nodata title={'Seems like you have not deposited yet!' } />
                            </>
                ) : null
            }
                    
            <ScrollView >
            <View style={{ marginTop: 0, width: '100%', paddingBottom:40,paddingHorizontal:20 }}>
                <SafeAreaView >
                    {
                    dHistory.length > 0 ? 

                        dHistory?.map((item,i)=>{
                            return(
                                cardDiv(item,i)
                            )
                        }) : 
                        null
                    }
                </SafeAreaView>
            </View>
            </ScrollView>

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
                    container:{
                        backgroundColor: "#fff",
                        borderTopEndRadius:20,
                        borderTopStartRadius:20
                    }
                }}
                height={380}
            >
                <ScrollView style={{paddingBottom:20}}>
                <View style={{padding:20}}>
                    <Text style={{fontFamily:'Gilroy-Bold',fontSize: moderateScale(18),marginBottom:15,borderBottomWidth:1,borderBottomColor: "#FF3C40",paddingBottom:15}}>Deposit Details</Text>
                    
                    <View style={{...styles.flexRow,marginTop:15}}>
                        <View style={{...styles.flexRow,alignItems: "flex-start"}}>
                            <Text style={{fontSize:moderateScale(15),fontFamily:'Gilroy-Bold',marginTop:-3,...styles.redColor}}>Date/Time:</Text>
                            <Text style={{fontSize:moderateScale(12),marginLeft: 16,flexShrink: 1,fontFamily:'Gilroy-Medium',color:'#696868' }}>{moment(selectedCard?.created_at).format('DD MMM, yy')}</Text>
                        </View>
                    </View>
                    <View style={{...styles.flexRow,marginTop:15}}>
                        <View style={{...styles.flexRow,alignItems: "flex-start"}}>
                            <Text style={{fontSize:moderateScale(15),fontFamily:'Gilroy-Bold',marginTop:-3,...styles.redColor}}>Card:</Text>
                            <Text style={{fontSize:moderateScale(12),marginLeft: 16,flexShrink: 1,fontFamily:'Gilroy-Medium',color:'#696868' }}>{selectedCard?.card?.card_type}</Text>
                        </View>
                    </View>
                    <View style={{...styles.flexRow,marginTop:15}}>
                        <View style={{...styles.flexRow,alignItems: "flex-start"}}>
                            <Text style={{fontSize:moderateScale(15),fontFamily:'Gilroy-Bold',marginTop:-3,...styles.redColor}}>Cardholder:</Text>
                            <Text style={{fontSize:moderateScale(12),marginLeft: 16,flexShrink: 1,fontFamily:'Gilroy-Medium',color:'#696868' }}>{selectedCard?.card?.card_name}</Text>
                        </View>
                    </View>
                    <View style={{...styles.flexRow,marginTop:15}}>
                        <View style={{...styles.flexRow,alignItems: "flex-start"}}>
                            <Text style={{fontSize:moderateScale(15),fontFamily:'Gilroy-Bold',marginTop:-3,...styles.redColor}}>Amount:</Text>
                            <Text style={{fontSize:moderateScale(12),marginLeft: 16,flexShrink: 1,fontFamily:'Gilroy-Medium',color:'#696868' }}>${selectedCard?.amount}</Text>
                        </View>
                    </View>

                    <View style={{...styles.flexRow,marginTop:15}}>
                        <View style={{...styles.flexRow,alignItems: "flex-start"}}>
                            <Text style={{fontSize:moderateScale(15),fontFamily:'Gilroy-Bold',marginTop:-3,...styles.redColor}}>Processing Fee:</Text>
                            <Text style={{fontSize:moderateScale(12),marginLeft: 16,flexShrink: 1,fontFamily:'Gilroy-Medium',color:'#696868' }}>${selectedCard?.processing_fee}</Text>
                        </View>
                    </View>
                    <View style={{...styles.flexRow,marginTop:15}}>
                        <View style={{...styles.flexRow,alignItems: "flex-start"}}>
                            <Text style={{fontSize:moderateScale(15),fontFamily:'Gilroy-Bold',marginTop:-3,...styles.redColor}}>Total:</Text>
                            <Text style={{fontSize:moderateScale(12),marginLeft: 16,flexShrink: 1,fontFamily:'Gilroy-Medium',color:'#696868' }}>${Number(selectedCard?.processing_fee)+Number(selectedCard?.amount)}</Text>
                        </View>
                    </View>

                </View>
                </ScrollView>
            </RBSheet>
        </View>
    )
}
export default DepositHistory;

const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems: 'flex-start',
        backgroundColor:'#fff'
    },
    flexRow:{
        flexDirection:'row',alignItems: 'center'
    },
    dater:{
        fontSize:moderateScale(12),color:'#666666'
    },
    redColor:{
        color:'#000'
    }
})
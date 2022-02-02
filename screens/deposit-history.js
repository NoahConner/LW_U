import React,{useRef} from 'react';
import { View, Text, StyleSheet, Button,FlatList,SafeAreaView,TouchableOpacity,ScrollView } from 'react-native';
import StackHeader from '../components/stackheader'
import VisaIcon from '../assets/svg/visa.svg'
import MasterIcon from '../assets/svg/master.svg'
import PaymentIcon from '../assets/svg/paymentIconred.svg';
import RBSheet from "react-native-raw-bottom-sheet";
import {  moderateScale } from 'react-native-size-matters';

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
]

const DepositHistory = ({navigation}) => {
    const refRBSheetDepos = useRef();
    const cardDiv = (d, i) => {
        return (
            <TouchableOpacity style={{ marginTop:30 }} key={i} onPress={() => refRBSheetDepos.current.open()}>
                <View style={{...styles.flexRow,justifyContent:'space-between',width:'100%'}} key={i}>
                    <View style={{flexDirection:'row',width:'100%'}}>
                    {
                        d.card_name == 'Visa' ? <VisaIcon style={{ height: 30, width: 32,marginRight:25 }} /> :
                            d.card_name == 'Master Card' ? <MasterIcon style={{ height: 30, width: 32,marginRight:25 }} /> :
                            <PaymentIcon style={{ height: 30, width: 32 ,marginRight:25}}/>
                    }
                        <View style={{flexDirection:'column',width:'83%'}}>
                            <View style={{...styles.flexRow,justifyContent:'space-between'}}>
                                <Text style={{fontWeight:'bold',fontSize:moderateScale(13),marginRight:0}}>Deposited</Text>
                                <Text style={{...styles.dater}}>11/11/2021</Text>
                                <Text style={{fontWeight:'bold',fontSize:moderateScale(15)}}>-$1.300</Text>
                            </View>
                            {/* <Text style={styles.dater}>*** 1234</Text> */}
                            <View style={{...styles.flexRow,justifyContent:'space-between'}}>
                                <Text style={styles.dater}>*** 1234</Text>
                                <Text style={styles.dater}>Processing Fee:</Text>
                                <Text style={{...styles.dater,marginTop:2}}>-$1.00</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    return(
        <View style={styles.container}>
            <StackHeader navigation={navigation} name={'Deposit History'} />
            <ScrollView >
            <View style={{ marginTop: 0, width: '100%', paddingBottom:40,paddingHorizontal:20 }}>
                <SafeAreaView >
                    {
                        defaultCad.map((item,i)=>{
                            return(
                                cardDiv(item,i)
                            )
                        })
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
                            <Text style={{fontSize:moderateScale(12),marginLeft: 16,flexShrink: 1,fontFamily:'Gilroy-Medium',color:'#696868' }}>4 August, 2021 5:12 am</Text>
                        </View>
                    </View>
                    <View style={{...styles.flexRow,marginTop:15}}>
                        <View style={{...styles.flexRow,alignItems: "flex-start"}}>
                            <Text style={{fontSize:moderateScale(15),fontFamily:'Gilroy-Bold',marginTop:-3,...styles.redColor}}>Card:</Text>
                            <Text style={{fontSize:moderateScale(12),marginLeft: 16,flexShrink: 1,fontFamily:'Gilroy-Medium',color:'#696868' }}>Visa</Text>
                        </View>
                    </View>
                    <View style={{...styles.flexRow,marginTop:15}}>
                        <View style={{...styles.flexRow,alignItems: "flex-start"}}>
                            <Text style={{fontSize:moderateScale(15),fontFamily:'Gilroy-Bold',marginTop:-3,...styles.redColor}}>Cardholder:</Text>
                            <Text style={{fontSize:moderateScale(12),marginLeft: 16,flexShrink: 1,fontFamily:'Gilroy-Medium',color:'#696868' }}>Noah Conner</Text>
                        </View>
                    </View>
                    <View style={{...styles.flexRow,marginTop:15}}>
                        <View style={{...styles.flexRow,alignItems: "flex-start"}}>
                            <Text style={{fontSize:moderateScale(15),fontFamily:'Gilroy-Bold',marginTop:-3,...styles.redColor}}>Amount:</Text>
                            <Text style={{fontSize:moderateScale(12),marginLeft: 16,flexShrink: 1,fontFamily:'Gilroy-Medium',color:'#696868' }}>-$1.300</Text>
                        </View>
                    </View>

                    <View style={{...styles.flexRow,marginTop:15}}>
                        <View style={{...styles.flexRow,alignItems: "flex-start"}}>
                            <Text style={{fontSize:moderateScale(15),fontFamily:'Gilroy-Bold',marginTop:-3,...styles.redColor}}>Processing Fee:</Text>
                            <Text style={{fontSize:moderateScale(12),marginLeft: 16,flexShrink: 1,fontFamily:'Gilroy-Medium',color:'#696868' }}>-$1.00</Text>
                        </View>
                    </View>
                    <View style={{...styles.flexRow,marginTop:15}}>
                        <View style={{...styles.flexRow,alignItems: "flex-start"}}>
                            <Text style={{fontSize:moderateScale(15),fontFamily:'Gilroy-Bold',marginTop:-3,...styles.redColor}}>Total:</Text>
                            <Text style={{fontSize:moderateScale(12),marginLeft: 16,flexShrink: 1,fontFamily:'Gilroy-Medium',color:'#696868' }}>-$2.300</Text>
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
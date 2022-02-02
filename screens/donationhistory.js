import React,{useRef} from 'react';
import { View, Text, StyleSheet, Button,FlatList,SafeAreaView,TouchableOpacity } from 'react-native';
import StackHeader from '../components/stackheader'
import Coupon from '../assets/svg/coupon.svg'
import RBSheet from "react-native-raw-bottom-sheet";
import { ScrollView } from 'react-native-gesture-handler';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import {  moderateScale } from 'react-native-size-matters';

var donationHistory = [
    {
        'status':'donated',
        'restaurant':'KFC',
        'date':'11/11/2021',
        'amount':'-$1.300',
        'id':'1'
    },
    {
        'status':'donated',
        'restaurant':'KFC',
        'date':'11/11/2021',
        'amount':'-$1.300',
        'id':'2'
    },
    {
        'status':'donated',
        'restaurant':'KFC',
        'date':'11/11/2021',
        'amount':'-$1.300',
        'id':'3'
    },
    {
        'status':'donated',
        'restaurant':'KFC',
        'date':'11/11/2021',
        'amount':'-$1.300',
        'id':'4'
    },
    {
        'status':'donated',
        'restaurant':'KFC',
        'date':'11/11/2021',
        'amount':'-$1.300',
        'id':'5'
    }
]

const dCards = (d,i,refRBSheet)=>{
    return(
        <TouchableOpacity onPress={() => refRBSheet.current.open()}>
            <View style={{...styles.flexRow,paddingHorizontal:20,justifyContent:'space-between',width:'100%',marginTop:i == 0 ? 20 : 50}}>
                <View style={{...styles.flexRow,justifyContent:'space-between',width:'100%'}} key={i}>
                <View style={{flexDirection:'row',width:'100%'}}>
                    <Coupon style={{marginRight:15}} />
                    <View style={{flexDirection:'column',width:'83%'}}>
                        <View style={{...styles.flexRow,justifyContent:'space-between'}}>
                            <Text style={{fontWeight:'bold',fontSize:moderateScale(13),marginRight:0}}>Donated</Text>
                            <Text style={{...styles.dater}}>11/11/2021</Text>
                            <Text style={{fontWeight:'bold',fontSize:moderateScale(15)}}>-$1.300</Text>
                        </View>
                        <Text style={styles.dater}>KFC</Text>
                    </View>
                </View>
            </View>
            </View>
        </TouchableOpacity>
    )
}
const DonationHistory = ({navigation})=>{
    const refRBSheet = useRef();
    return(
        <View style={styles.container}>
            <StackHeader navigation={navigation} name={'Donation History'} />
            <View style={{marginTop:10}}>

            <SafeAreaView >
                <FlatList
                    data={donationHistory}
                    renderItem={({ item, index }) => (
                        dCards(item,index,refRBSheet)
                    )}
                    keyExtractor={item => item.id}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
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
                height={425}
            >
                <ScrollView style={{paddingBottom:20}}>
                <View style={{padding:20}}>
                    <Text style={{fontFamily:'Gilroy-Bold',fontSize: moderateScale(18),marginBottom:15,borderBottomWidth:1,borderBottomColor: "#FF3C40",paddingBottom:15}}>Donation Details</Text>
                
                    <View style={{...styles.flexRow,marginTop:15}}>
                        <View style={{...styles.flexRow,alignItems: "flex-start"}}>
                            <Text style={{fontSize:moderateScale(15),fontFamily:'Gilroy-Bold',marginTop:-3,...styles.redColor}}>Date/Time:</Text>
                            <Text style={{fontSize:moderateScale(12),marginLeft: 16,flexShrink: 1,fontFamily:'Gilroy-Medium',color:'#696868' }}>4 August, 1821 5:12 am</Text>
                        </View>
                    </View>
                    <View style={{...styles.flexRow,marginTop:15}}>
                        <View style={{...styles.flexRow,alignItems: "flex-start"}}>
                            <Text style={{fontSize:moderateScale(15),fontFamily:'Gilroy-Bold',marginTop:-3,...styles.redColor}}>Resturant:</Text>
                            <Text style={{fontSize:moderateScale(12),marginLeft: 16,flexShrink: 1,fontFamily:'Gilroy-Medium',color:'#696868' }}>KFC</Text>
                        </View>
                    </View>
                    <View style={{...styles.flexRow,marginTop:15}}>
                        <View style={{...styles.flexRow,alignItems: "flex-start"}}>
                            <Text style={{fontSize:moderateScale(15),fontFamily:'Gilroy-Bold',marginTop:-3,...styles.redColor}}>Amount:</Text>
                            <Text style={{fontSize:moderateScale(12),marginLeft: 16,flexShrink: 1,fontFamily:'Gilroy-Medium',color:'#696868' }}>-$40.00</Text>
                        </View>
                    </View>

                    <View style={{...styles.flexRow,marginTop:15}}>
                        <View style={{...styles.flexRow,alignItems: "flex-start"}}>
                            <Text style={{fontSize:moderateScale(15),fontFamily:'Gilroy-Bold',marginTop:-3,...styles.redColor}}>Coupon:</Text>
                            <Text style={{fontSize:moderateScale(12),marginLeft: 16,flexShrink: 1,fontFamily:'Gilroy-Medium',color:'#696868' }}>B45IUOPL</Text>
                        </View>
                    </View>

                    <View style={{...styles.flexRow,marginTop:15}}>
                        <View style={{...styles.flexRow,alignItems: "flex-start"}}>
                            <Text style={{fontSize:moderateScale(15),fontFamily:'Gilroy-Bold',marginTop:-3,...styles.redColor}}>Coupon Status:</Text>
                            <Text style={{fontSize:moderateScale(12),marginLeft: 16,flexShrink: 1,fontFamily:'Gilroy-Medium',color:'#696868' }}>Withdrawal</Text>
                        </View>
                    </View>

                    <View style={{...styles.flexRow,marginTop:15}}>
                        <View style={{...styles.flexRow,alignItems: "flex-start"}}>
                            <Text style={{fontSize:moderateScale(15),fontFamily:'Gilroy-Bold',...styles.redColor}}>Withdrawal Time:</Text>
                            <Text style={{fontSize:moderateScale(12),marginLeft: 16,flexShrink: 1,fontFamily:'Gilroy-Medium',color:'#696868' }}>4 August, 1821 9:38 am</Text>
                        </View>
                    </View>

                    <View style={{...styles.flexRow,marginTop:15}}>
                        <View style={{...styles.flexRow,alignItems: "flex-start"}}>
                            <Text style={{fontSize:moderateScale(15),fontFamily:'Gilroy-Bold',marginTop:-3,...styles.redColor}}>Leaper Name:</Text>
                            <Text style={{fontSize:moderateScale(12),marginLeft: 16,flexShrink: 1,fontFamily:'Gilroy-Medium',color:'#696868' }}>Ethen James</Text>
                        </View>
                    </View>

                    <View style={{...styles.flexRow,marginTop:15}}>
                        <View style={{...styles.flexRow,alignItems: "flex-start"}}>
                            <Text style={{fontSize:moderateScale(15),fontFamily:'Gilroy-Bold',marginTop:-3,...styles.redColor}}>Leaper DOB:</Text>
                            <Text style={{fontSize:moderateScale(12),marginLeft: 16,flexShrink: 1,fontFamily:'Gilroy-Medium',color:'#696868' }}>06 Sep, 1995</Text>
                        </View>
                    </View>

                    

                </View>
                </ScrollView>
            </RBSheet>
        </View>
    )
}

export default DonationHistory;

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
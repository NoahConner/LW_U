import React, { useState, useRef,useContext, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView,ImageBackground, TouchableOpacity,Image ,ActivityIndicator } from 'react-native';
import { Icon ,CheckBox,Input,Button } from 'react-native-elements';
import RBSheet from "react-native-raw-bottom-sheet";
import SCheader from '../components/screensheader'
import { ScrollView } from 'react-native-gesture-handler';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import CalIcon from '../assets/svg/calendar.svg';
import moment from 'moment'
import AppContext from '../components/appcontext'
import Modals from '../components/modals';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import {  moderateScale } from 'react-native-size-matters';
import axiosconfig from '../providers/axios';
import Loader from './loader';
import Toast from 'react-native-toast-message';

var allRestT = [
    {
        'deal_name':'Deal 1',
        'image':'https://www.visitdanvillearea.com/wp-content/uploads/2015/08/McDonalds-Logo-square.jpg',
        'deal':'Burger, Shake, Fries',
        'amount':'20',
        'id':'1'
    },
    {
        'deal_name':'Deal 2',
        'image':'https://www.visitdanvillearea.com/wp-content/uploads/2015/08/McDonalds-Logo-square.jpg',
        'deal':'Burger, Shake, Fries',
        'amount':'30',
        'id':'2'
    },
    {
        'deal_name':'Deal 3',
        'image':'https://www.visitdanvillearea.com/wp-content/uploads/2015/08/McDonalds-Logo-square.jpg',
        'deal':'Burger, Shake, Fries,Shake, Fries',
        'amount':'40',
        'id':'3'
    },
]


const Resturants = ({route, navigation}) => {
    const refRBSheet = useRef();
    const [resData, setResData] = useState({})
    const [currentDeal, setcurrentDeal] = useState({})
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [datePick,setdatePick] = useState(null);
    const [loader, setLoader] = useState(false);
    const [leaperName, setleaperName] = useState(null);

    const showDatePicker = () => {
      setDatePickerVisibility(true);
    };
  
    const hideDatePicker = () => {
      setDatePickerVisibility(false);
    };
  
    const handleConfirm = (date) => {
        var currentTime = new Date();
        if(date < currentTime){
            setdatePick(moment(date).format('DD MMM, yy'))
            hideDatePicker();
        }else{
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

    const generateCoupon = async()=>{
        console.log('abc')
        if(leaperName == null){
            showToast('error', 'Leaper name required!')
            return false
        }
        
        if(datePick == null || datePick == 'Invalid date'){
            showToast('error', 'Leaper Date of birth required!')
            return false
        }

        let coupon = Math.random().toString(36).substr(2, 8).toUpperCase()
        console.log(currentDeal)
        let dt = {
            deal_id:currentDeal.id,
            user_id:myContext.myData.id,
            leaper_name:leaperName.toLowerCase(),
            leaper_dob:moment(datePick).format('MM-D-yy'),
            coupon:coupon
        }
        console.log(myContext.userToken, 'myContext.userToken')

        setLoader(true)
        await axiosconfig.post(`admin/order`,dt,
        {
            headers: {
              Authorization: 'Bearer ' + myContext.userToken //the token is a variable which holds the token
            }
           }
        ).then((res:any)=>{
     
            setLoader(false)
            myContext.setCurrentCoupon(coupon);
            myContext.setCouponModal(true);
            setdatePick(null)
            setleaperName(null)
            getWallet()
        }).catch((err)=>{
            console.log(err.response)
            setLoader(false)
        })
    }

    const getWallet = async() => {
        const value = await AsyncStorage.getItem('@auth_token');
        await axiosconfig.get(`admin/current_wallet`,
        {
            headers: {
              Authorization: 'Bearer ' + value //the token is a variable which holds the token
            }
           }
        ).then((res:any)=>{
            console.log('wallrt')
            myContext.setWalletAmount(res.data.wallet)
        }).catch((err)=>{
            console.log(err.response)
        })
      }

    const mcCards = (d,i,navigation,refRBSheet,myContext)=>{
    
        const openSheet = (id) =>{
            if(myContext.WalletAmount < parseInt(d.deal_price)){
                myContext.setSorryModal(true);
            }else{
                setcurrentDeal(d)
                refRBSheet.current.open()
            }
        }
    
        return (
            <TouchableOpacity onPress={()=> openSheet(d.id)} key={i} style={{display: d.deal_quantity > 0 && d.status == 1  ? 'flex' : 'none'}}>
                <View style={styles.mcCard} key={d.id}>
                    <View style={{backgroundColor:'#fff',borderRadius: 8,overflow: 'hidden'}}>
                        <Image
                            source={{ uri: d.deal_image }}
                            style={{ width: 65, height: 70,  resizeMode: 'cover' }}
                            PlaceholderContent={<ActivityIndicator />}
                        />
                    </View>
                    <View style={{marginLeft:15,width:'100%',paddingRight:100,...styles.flexRow,width:'100%',justifyContent: 'space-between'}}>
                        <View >
                            <Text style={{fontFamily:'Gilroy-Bold',fontSize:moderateScale(15),marginBottom:5}}>{d.deal_name}</Text>
                            <View style={{flexDirection: 'row',alignItems: 'center'}}>
                                <Text numberOfLines={1} style={{fontSize:moderateScale(11),width:'80%',fontFamily:'Gilroy-Medium'}}>{d.deal_menu} </Text>
                            </View>
                        </View>
                        <View >
                            <Text style={{fontFamily:'Gilroy-Bold',fontSize:moderateScale(15),marginBottom:5}}>${d.deal_price}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    useEffect(() => {

      setResData(route.params)
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
            <View>
            <SCheader navigation={navigation} backbutton={true} wallet={true}  />
            <ImageBackground source={{uri: 'data:image/png;base64,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'}} resizeMode="cover" style={{height:220}} >
                <View style={{width: '100%', height: 220,backgroundColor: '#1e3865e0',position:'relative'}}>
                    <Text style={{color:'#fff', fontSize:moderateScale(20),fontFamily:'Gilroy-Bold',position:'absolute',bottom:40,left:20}}>{resData?.user?.name}</Text>
                </View>
            </ImageBackground>
                
                <View>
                    <View style={{backgroundColor:'#fff',width:'100%',height:'100%',borderTopLeftRadius:30,borderTopRightRadius:30,marginTop:-30,paddingHorizontal:20}}>
                        <Text style={{color:'#000', fontSize:moderateScale(17), fontFamily:'Gilroy-Bold', marginTop:20}}>Deals</Text>
                        <ScrollView style={{paddingTop:20}}>
                            {
                                resData?.deals?.map((items,i)=>{
                                    return(
                                        mcCards(items,i,navigation,refRBSheet,myContext)
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
                    container:{
                        backgroundColor: "#fff",
                        borderTopEndRadius:20,
                        borderTopStartRadius:20
                    }
                }}
                height={moderateScale(470,0.1)}
            >
                <ScrollView>
                    <View style={{padding:20}}>
                        <View>
                            <View style={{...styles.mcCard,alignItems: 'flex-start',marginBottom:40}}>
                                <View style={{borderRadius: 8,overflow: 'hidden'}}>
                                    <Image
                                        source={{ uri: currentDeal?.deal_image }}
                                        style={{ width: 65, height: 70,  resizeMode: 'cover' }}
                                        PlaceholderContent={<ActivityIndicator />}
                                    />
                                </View>
                                <View style={{marginLeft:15}}>
                                    <View style={{width:'89%'}}>
                                        <View style={{flexDirection: 'row',alignItems: 'center',justifyContent: 'space-between'}}>
                                            <Text style={{fontFamily:'Gilroy-Bold',fontSize:moderateScale(15),marginBottom:5}}>{currentDeal?.deal_name}</Text>
                                            <Text style={{fontFamily:'Gilroy-Bold',fontSize:moderateScale(15),marginBottom:5}}>${currentDeal?.deal_price}</Text>
                                        </View>
                                        <View style={{flexDirection: 'row',alignItems: 'center'}}>
                                            <Text  style={{fontSize:moderateScale(12),fontFamily:'Gilroy-Medium',lineHeight:20}}>{currentDeal?.deal_menu}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View>
                            <Text style={{fontSize:moderateScale(16),fontFamily:'Gilroy-Bold',marginBottom:10 }}>Leaper Details</Text>
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
                            <TouchableOpacity onPress={()=> showDatePicker()}>
                                <View style={{...styles.textContainerStyle,marginBottom:30,justifyContent: 'space-between',paddingHorizontal:15,flexDirection: 'row',alignItems: 'center'}} >
                                    {
                                        datePick == null ? (
                                            <>
                                                <Text style={{fontSize:moderateScale(16),color:'grey'}}>DD/MM/YY</Text>
                                            </>
                                        ) : (
                                            <>
                                                <Text style={{fontSize:moderateScale(16),color:'#000'}}>{datePick}</Text>
                                            </>
                                        )
                                    }
                                    <CalIcon style={{height:30,width:30}}/>
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
                                        backgroundColor:'#1E3865',
                                        padding:20,
                                        borderRadius:15
                                    }}
                                    onPress={()=> generateCoupon()}
                                />
                            </View>
                        </View>
                    </View>
                </ScrollView>
                
            </RBSheet>
            <Modals navigation={navigation} />
        </View>
    )
}
export default Resturants;

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#fff',
    },
    mcCard:{
        backgroundColor:'#F6F8FA',
        shadowColor: 'black',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        borderRadius:12,textAlign: 'center',
        padding:12,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom:15,
    },
    flexRow: {
        flexDirection: 'row', 
        alignItems: 'center'
    },
    textContainerStyle:{
        width:'100%',
        backgroundColor:'#F6F8FA',
        color:'#000',
        borderRadius:15,
        paddingBottom:0,
        height:60,
        marginTop:10
    },
    inputContainerStyle:{
        paddingBottom:0,
        borderColor:'transparent',
        marginTop:6,
        fontFamily:'Gilroy-Medium'
    }
})
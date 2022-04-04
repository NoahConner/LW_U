import React, { useState, useRef,useContext } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, TouchableOpacity,Dimensions,ImageBackground   } from 'react-native';
import { Image, Button, Icon,Input ,CheckBox } from 'react-native-elements';
import Wallet from '../assets/svg/wallet.svg'
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import AppContext from '../components/appcontext'
import LeftArr from '../assets/svg/left-arrow.svg'
import {  moderateScale } from 'react-native-size-matters';

const SCheader = ({navigation,backbutton,name,wallet}) => {

    const appContext = useContext(AppContext)
    return(
        <View style={{position:'absolute',zIndex:1000,width:Dimensions.get('window').width}}>
           <SafeAreaView>
           <View style={{...styles.flexRow,width:'100%',paddingHorizontal:20,paddingVertical:10}}>
                <View style={styles.flexRow}>
                    {
                        backbutton != false ? (
                            <>
                            <TouchableOpacity onPress={() =>  navigation.goBack()}>
                                <View style={{backgroundColor:'#fff',paddingVertical:8,paddingHorizontal:10,borderRadius:50,marginRight:15}}>
                                    {/* <Icon
                                        name='arrow-left'
                                        type='font-awesome'
                                        color='#FF3C40'
                                        onPress={() =>  navigation.goBack()} 
                                    /> */}
                                    <LeftArr style={{width:25,height:30,stroke:'#FF3C40'}}   />
                                </View>
                            </TouchableOpacity>
                            </>
                        ):(
                            null
                        )
                    }
                    {
                        name != null || name != '' || name != undefined ? (
                            <>
                            <Text style={{fontSize:moderateScale(15),fontFamily:'Gilroy-Bold',color:'#fff'}}>{name}</Text>
                            </>
                        ):(
                            null
                        )
                    }
                </View>
                <View>
                    {
                        wallet != false ? (
                            <>
                            <TouchableOpacity onPress={()=> navigation.navigate('Wallet')}>
                                <View style={{backgroundColor:'#fff',paddingVertical:10,paddingHorizontal:8,borderRadius:50}}>
                                    <Wallet style={{height:23,width:28}} />
                                </View>
                            </TouchableOpacity>
                            </>
                        ):(
                            null
                        )
                    }
                </View>
            </View>
           </SafeAreaView>
        </View>
    )
}
export default SCheader;

const styles = StyleSheet.create({
    flexRow: {
        flexDirection: 'row', 
        alignItems: 'center',
        justifyContent: 'space-between'
    },
})
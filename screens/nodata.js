import React, { useState, useRef,useContext, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView,ImageBackground, Dimensions,Image ,ActivityIndicator } from 'react-native';
import { Icon ,CheckBox,Input,Button } from 'react-native-elements';
import { moderateScale } from 'react-native-size-matters';
const windowWidth = Dimensions.get('window').width;
const windowHeight= Dimensions.get('window').height;
const Nodata = ({navigation, title}) => {
    return(
        <View style={styles.container}>
            <Image
                style={styles.tinyLogo}
                source={require('../assets/png/datanot.png')}
            />
            <Text style={{fontSize:moderateScale(14),fontFamily:'Gilroy-Medium'}}>{title}</Text>
        </View>
    )
}

export default Nodata;

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'transparent',
        alignItems:'center',
        justifyContent:'center',
        width:moderateScale(windowWidth, 0.1),
        position:'absolute',
        height:moderateScale(windowHeight-180,0.1)
        
    },
    tinyLogo: {
        width: moderateScale(100),
        height: moderateScale(100),
        marginBottom:moderateScale(30)
      },
})
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView,Dimensions  } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import LoaderImg from '../assets/gif/index2.svg'

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Loader = ({navigation}) => {
    return(
        <View style={styles.cont}>
            <Image
                style={styles.logo}
                source={require('../assets/gif/loader1.gif')}
            />
            {/* <LoaderImg/> */}
        </View>
    )
} 

export default Loader;

const styles = StyleSheet.create({
    logo: {
      width: moderateScale(120,0.1),
      height: moderateScale(128,0.1),
    },
    cont:{
        backgroundColor:'#00000045',
        position:'absolute',
        zIndex:1,
        top:0,
        left:0,
        height:'100%',
        width:windowWidth,
        alignItems:'center',
        justifyContent:'center'
    }
  });
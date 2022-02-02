import React from 'react';
import { View, Text, StyleSheet ,Dimensions } from 'react-native';
import PreImg from '../assets/svg/preloginscreen.svg'
import { Button } from 'react-native-elements';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import {  moderateScale } from 'react-native-size-matters';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const PreLogin = ({navigation})=>{
    return(
        <View style={styles.container}>
           <View  style={{paddingLeft:30,paddingRight:30,width:'100%'}}>
               <View style={{width:'100%',alignItems: 'center'}}>
                    <PreImg style={{height:RFPercentage(32),width:'100%'}} />
                    <Text style={{color:'#FF4D4D',fontSize:moderateScale(20),fontWeight:'bold',marginTop:30}}>Donate Food</Text>
                    {/* <Text style={{color:'#666666',fontSize:moderateScale(12),marginTop:10,textAlign: 'center',width:240,marginBottom:60}}>Donate Food to Poor people in just 3 easy steps</Text> */}
                    <Text style={{color:'#666666',fontSize:moderateScale(12),marginTop:10,textAlign: 'center',width:240,marginBottom:60}}>Donate food to people in need in just 3 easy steps!!</Text>
                    <View style={{width:'100%'}}>
                        <Button
                            title="Sign Up"
                            type="solid"
                            buttonStyle={{
                                backgroundColor:'#1E3865',
                                padding:15,
                                borderRadius:15
                            }}
                            onPress={()=> navigation.navigate('SignIn')}
                        />
                        <Button
                            title="Log In"
                            type="clear"
                            buttonStyle={{
                                padding:15,
                                borderRadius:15,
                            }}
                            titleStyle={{
                                color:'#1E3865',
                                fontWeight:'bold',
                            }}
                            onPress={()=> navigation.navigate('Login')}
                        />
                    </View>
               </View>
           </View>
        </View>
    )
}

export default PreLogin;

const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:'#fff',
    }
})
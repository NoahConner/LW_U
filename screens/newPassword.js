import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Input, CheckBox, Button } from 'react-native-elements';
import { moderateScale } from 'react-native-size-matters';
import { SafeAreaView } from 'react-native-safe-area-context';
import Loader from './loader';
import Toast from 'react-native-toast-message';
import axiosconfig from '../providers/axios';

const NewPassword = ({route,navigation}) => {
    const [loader, setLoader] = useState(false);
    const [newPass, setnewPass] = useState();
    const [confirmPass, setconfirmPass] = useState();

    const changePass = async() => {
        if(newPass == '' || newPass == null){
            showToast('error', 'New Password Required')
            return false
        }
        else if(confirmPass == '' || confirmPass == null){
            showToast('error', 'Confirm password Required')
            return false
        }

        if(newPass != confirmPass){
            showToast('error', 'Password not match')
            return false
        }
        setLoader(true)
        let ide;
        // route.params.email
    
        await axiosconfig.post('app/restaurent_register',{code:'^^@$T3r*'}).then((res:any)=>{
      
            res.data.map((v)=>{
                if(v.email == route.params.email){
                    ide = v.id
                }
            })
        }).catch((err)=>{
            setLoader(false)
            showToast('error', err.response.data.message);
        })
        let data = {
            code:'^^@$T3r*>',
            password:confirmPass,
            id:ide
        }
        senh(data)
        
    }

    const senh = async(data) => {

        await axiosconfig.post('app/restaurent_register',data).then((res:any)=>{
            setLoader(false)
            navigation.navigate('Login')
        }).catch((err)=>{
            setLoader(false)
            showToast('error', err.response.data.message)
        })
    }

    const showToast = (t, e) => {
        Toast.show({
            type: t,
            text1: e,
        })
    }

    return(
        <ScrollView>
            {
                loader ? (
                    <>
                        <Loader />
                    </>
                ) : null
            }
        <View style={styles.container}>
            <View style={{alignItems: 'center',width: '100%',justifyContent: 'center'}}>
                <Text style={{color:'#E83131',fontSize:moderateScale(20),fontWeight:'bold',marginTop:30,marginBottom:60}}>New Password</Text>
                {/* <Text style={{color:'#666666',fontSize:moderateScale(12),marginTop:10,textAlign: 'center',width:240,marginBottom:60}}>Donate Food to Poor people in just 3 easy steps</Text> */}
                <View style={{width:'100%'}}>
                    <Input
                     placeholder='New Password'
                     containerStyle={{
                        ...styles.textContainerStyle,
                        marginBottom:10
                    }}
                    inputContainerStyle={{
                        ...styles.inputContainerStyle
                    }}
                    onChangeText={(e) => setnewPass(e)}
                    secureTextEntry={true}
                    />
                </View>
                <View style={{width:'100%'}}>
                    <Input
                     placeholder='Confirm Password'
                     containerStyle={{
                        ...styles.textContainerStyle,
                        marginBottom:10
                    }}
                    inputContainerStyle={{
                        ...styles.inputContainerStyle
                    }}
                    onChangeText={(e) => setconfirmPass(e)}
                    secureTextEntry={true}
                    />
                </View>
                
                <View style={{width:'100%',marginTop:20}}>
                    <Button
                        title="Save"
                        type="solid"
                        buttonStyle={{
                            backgroundColor:'#1E3865',
                            padding:15,
                            borderRadius:15
                        }}
                        onPress={() => changePass()}
                    />
                </View>
                    <View style={{flexDirection:'row',alignItems: 'center',justifyContent: 'center',marginTop:20}}>
                        <Text style={{color:'#707070',textAlign:'center'}}>Back to </Text>
                        <TouchableOpacity onPress={()=> navigation.navigate('Login')}><Text style={{color:'#0071BC',textAlign:'center'}}>Log In</Text></TouchableOpacity>
                    </View>
            </View>
            
        </View>
        </ScrollView>
    )
}

export default NewPassword;

const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems: 'center',
        // justifyContent: 'center',
        backgroundColor:'#fff',
        paddingLeft:30,
        paddingRight:30,
        paddingBottom:20,
        position:'relative',
        height:Dimensions.get('window').height,
        justifyContent: 'center'
    },
    textContainerStyle:{
        width:'100%',
        backgroundColor:'#F6F8FA',
        color:'#000',
        borderRadius:15,
        paddingBottom:0,
        height:60
    },
    inputContainerStyle:{
        paddingBottom:0,
        borderColor:'transparent',
        marginTop:6
    }
})
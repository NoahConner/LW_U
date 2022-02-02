import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Input, CheckBox, Button } from 'react-native-elements';
import { moderateScale } from 'react-native-size-matters';
import { SafeAreaView } from 'react-native-safe-area-context';
import OTPInputView from '@twotalltotems/react-native-otp-input'
import SCheader from '../components/screensheader'
import axiosconfig from '../providers/axios';
import Toast from 'react-native-toast-message';
import Loader from './loader';
import AppContext from '../components/appcontext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OPT = ({ route, navigation }) => {
  const [loader, setLoader] = useState(false);
  const context = useContext(AppContext);
  const {
    name,
    email,
    password,
    confirm_password,
    type,
    opt,
  } = route.params;

  const showToast = (t, e) => {
    console.log(t)
    Toast.show({
      type: t,
      text1: e,
    })
  }

  console.log(route.params)

  const storeData = async (value) => {
    try {
      await AsyncStorage.setItem('@auth_token', value)
      context.setuserToken(value);
      navigation.navigate('Home')
    } catch (e) {
      console.log(e)
    }
  }

  const verifycode = async (c) => {
    route.params.type == 'forgot' ? forgotPass(c) : register(c);
  }

  const register = async (c) => {
    setLoader(true)
    console.log(c)
    let data = {
      name: name,
      email: email,
      password: password,
      confirm_password: confirm_password,
      type: type,
      otp: Number(c),
    }
    console.log(data)
    await axiosconfig.post('app/register', data).then((res: any) => {
      console.log(res.data)
      setLoader(false)
      if (res.data.status == 'error') {
        showToast('error', res.data.messsage);
        return false;
      } else {
        storeData(res.data.access_token)
      }
    }).catch((err) => {
      console.log(err)
      showToast('error', err.response.data.messsage);
      setLoader(false)
    })
  }

  const forgotPass = async(c) => {
    setLoader(true)
    let data = {
      email:route.params.email,
      otp:c
    }

    axiosconfig.post('app/forgot_otp',data).then((res:any)=>{
      setLoader(false)
      navigation.navigate('NewPassword', data);
    }).catch((err)=>{
      setLoader(false)
      showToast('error',err.response.data.message)
    })
  }

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      {
        loader ? (
          <>
            <Loader />
          </>
        ) : null
      }
      <View style={{ position: 'absolute', top: 10, left: 0 }}>
        <SCheader navigation={navigation} backbutton={true} name={''} wallet={false} />
      </View>
      <Text style={{ color: '#E83131', fontSize: moderateScale(20), fontWeight: 'bold', marginTop: 30 }}>OTP Verification</Text>
      <Text style={{ color: '#666666', fontSize: moderateScale(12), marginTop: 10, textAlign: 'center', width: 240, marginBottom: 10 }}> Enter the 4 digit code we sent on email.</Text>
      <OTPInputView
        style={{ width: '80%', height: 200, color: '#000' }}
        pinCount={4}
        autoFocusOnLoad={true}
        // code={this.state.code} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
        // onCodeChanged = {code => { this.setState({code})}}
        autoFocusOnLoad
        codeInputFieldStyle={styles.underlineStyleBase}
        codeInputHighlightStyle={styles.underlineStyleHighLighted}
        onCodeFilled={(code) => verifycode(code)}
      />
    </View>
  )
}

export default OPT;

const styles = StyleSheet.create({
  borderStyleBase: {
    width: moderateScale(35),
    height: moderateScale(35)
  },

  borderStyleHighLighted: {
    borderColor: "#00205b",
  },

  underlineStyleBase: {
    width: moderateScale(48, 0.1),
    height: moderateScale(48, 0.1),
    borderWidth: 0,
    borderBottomWidth: 1,
    color: '#000',
    backgroundColor: 'lightgrey',
    borderRadius: moderateScale(8)
  },

  underlineStyleHighLighted: {
    borderColor: "#fff",
  },
});
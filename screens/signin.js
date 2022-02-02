import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input, CheckBox, Button } from 'react-native-elements';
import FacebookIcon from '../assets/svg/facebook.svg'
import GoogleIcon from '../assets/svg/google.svg'
import { moderateScale } from 'react-native-size-matters';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import axiosconfig from '../providers/axios';
import Loader from './loader';
import {
    GoogleSignin,
    GoogleSigninButton,
    statusCodes,
  } from '@react-native-google-signin/google-signin';

const windowHeight = Dimensions.get('window').height;
const SignIn = ({ navigation }) => {

    const [remember, setRemember] = useState(false);
    const [signData, setSignData] = useState([]);
    const [loader, setLoader] = useState(false)

    const showToast = (t, e) => {
        console.log(t)
        Toast.show({
            type: t,
            text1: e,
        })
    }

    useEffect(() => {
        let DoP = {
            'name': null,
            'email': null,
            'password': null,
            'confirm_password': null,
            'type': 'user',
            'opt': null
        }
        setSignData(DoP);
        GoogleSignin.configure({
            webClientId: "Your-web-client-id", 
            offlineAccess: true
        });
    }, [])

    const setFormDatat = (e, t) => {
        signData[t] = e;
        setSignData(signData);
    }

    const signUp = async () => {

        var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

        for (const property in signData) {
            if (property != 'opt') {
                if (signData[property] == null || signData[property] == '') {
                    showToast('error', `${capitalizeFirstLetter(property)} Required!`);
                    return false;
                }
            }
        }

        if (!signData.email.match(mailformat)) {
            showToast('error', 'Invalid Email!');
            return false;
        }

        setLoader(true)


        await axiosconfig.get(`app/check-mail/${signData.email}`).then((res: any) => {
            console.log(res)
            if (res.status == 200) {
                otpSend()
            } else {
                setLoader(false)
                showToast('error', res.data.message)
            }
        }).catch((err) => {
            console.log(err.response)
            setLoader(false)
            showToast('error', err.response.data.message)
        })

        console.log(signData);
    }

    const otpSend = async () => {
        await axiosconfig.post('app/otp', { email: signData.email }).then((res: any) => {
            setLoader(false)
            navigation.navigate('OPT', signData);
            console.log(res.data)
        }).catch((err) => {
            setLoader(false)
            console.log(err)
        })
    }

    const capitalizeFirstLetter = (string) => {
        if (string == 'name') {
            return `Full ${string.charAt(0).toUpperCase() + string.slice(1)}`;
        }
        else {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }
    }

    const GoogleSingUp = async () => {
        try {
          await GoogleSignin.hasPlayServices();
          await GoogleSignin.signIn().then(result => { console.log(result) });
        } catch (error) {
          if (error.code === statusCodes.SIGN_IN_CANCELLED) {
            // user cancelled the login flow
            showToast('error','User cancelled the login flow !');
          } else if (error.code === statusCodes.IN_PROGRESS) {
            showToast('error','Signin in progress');
            // operation (f.e. sign in) is in progress already
          } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
            showToast('error','Google play services not available or outdated !');
            // play services not available or outdated
          } else {
            console.log(error)
          }
        }
      };

    return (
        <ScrollView contentContainerStyle={{ height: windowHeight + 70, backgroundColor: '#fff' }}>
            {
                loader ? (
                    <>
                        <Loader />
                    </>
                ) : null
            }
            <SafeAreaView style={{ backgroundColor: '#000' }}>
                <View style={styles.container}>

                    <View style={{ alignItems: 'center', width: '100%' }}>
                        <Text style={{ color: '#E83131', fontSize: moderateScale(20), fontWeight: 'bold', marginTop: 30 }}>Sign Up</Text>
                        <Text style={{ color: '#666666', fontSize: moderateScale(12), marginTop: 10, textAlign: 'center', width: 240, marginBottom: 60 }}>Donate Food to Poor people in just 3 easy steps</Text>
                        <View style={{ width: '100%' }}>
                            <Input
                                placeholder='Full Name'
                                containerStyle={{
                                    ...styles.textContainerStyle,
                                    marginBottom: 10
                                }}
                                inputContainerStyle={{
                                    ...styles.inputContainerStyle
                                }}
                                onChangeText={(e) => setFormDatat(e, 'name')}
                            />
                            <Input
                                placeholder='Email Adress'
                                containerStyle={{
                                    ...styles.textContainerStyle,
                                    marginBottom: 10
                                }}
                                inputContainerStyle={{
                                    ...styles.inputContainerStyle
                                }}
                                onChangeText={(e) => setFormDatat(e, 'email')}
                            />
                            <Input
                                placeholder='Password'
                                containerStyle={{
                                    ...styles.textContainerStyle,
                                    marginBottom: 10
                                }}
                                inputContainerStyle={{
                                    ...styles.inputContainerStyle
                                }}
                                secureTextEntry={true}
                                onChangeText={(e) => setFormDatat(e, 'password')}
                            />
                            <Input
                                placeholder='Confirm Password'
                                containerStyle={{
                                    ...styles.textContainerStyle,
                                    marginBottom: 10
                                }}
                                inputContainerStyle={{
                                    ...styles.inputContainerStyle
                                }}
                                secureTextEntry={true}
                                onChangeText={(e) => setFormDatat(e, 'confirm_password')}
                            />
                        </View>

                        <View style={{ width: '100%', marginTop: 20 }}>
                            <Button
                                title="Sign Up"
                                type="solid"
                                buttonStyle={{
                                    backgroundColor: '#1E3865',
                                    padding: 15,
                                    borderRadius: 15
                                }}
                                onPress={() => signUp()}
                            />
                            <Text style={{ color: '#666666', textAlign: 'center', fontSize: moderateScale(16), marginTop: 10, marginBottom: 10 }}>Or</Text>
                            <Button
                                title="Continue with Facebook"
                                type="solid"
                                buttonStyle={{
                                    backgroundColor: '#F6F8FA',
                                    padding: 15,
                                    borderRadius: 15
                                }}
                                titleStyle={{
                                    color: '#1E3865',
                                    fontWeight: 'bold',
                                }}
                                icon={
                                    <FacebookIcon
                                        style={{
                                            height: 30,
                                            width: 30,
                                            position: 'absolute',
                                            left: 15
                                        }}
                                    />
                                }
                            />
                            <Button
                                title="Continue with Google"
                                type="solid"
                                buttonStyle={{
                                    backgroundColor: '#F6F8FA',
                                    padding: 15,
                                    borderRadius: 15,
                                    marginTop: 10
                                }}
                                titleStyle={{
                                    color: '#1E3865',
                                    fontWeight: 'bold',
                                }}
                                icon={
                                    <GoogleIcon
                                        style={{
                                            height: 30,
                                            width: 30,
                                            position: 'absolute',
                                            left: 15
                                        }}
                                    />
                                }
                            />
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 20 }}>
                                <Text style={{ color: '#707070', textAlign: 'center' }}>Already have an account? </Text>
                                <TouchableOpacity onPress={() => navigation.navigate('Login')}><Text style={{ color: '#0071BC', textAlign: 'center' }}>Sign In</Text></TouchableOpacity>
                            </View>
                        </View>
                    </View>

                </View>
            </SafeAreaView>
        </ScrollView>
    )
}

export default SignIn;

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        paddingLeft: 30,
        paddingRight: 30,
        paddingBottom: 20
    },
    textContainerStyle: {
        width: '100%',
        backgroundColor: '#F6F8FA',
        color: '#000',
        borderRadius: 15,
        paddingBottom: 0,
        height: 60
    },
    inputContainerStyle: {
        paddingBottom: 0,
        borderColor: 'transparent',
        marginTop: 6
    }
})
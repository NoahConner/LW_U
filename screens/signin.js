import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input, CheckBox, Button } from 'react-native-elements';
import FacebookIcon from '../assets/svg/facebook.svg';
import GoogleIcon from '../assets/svg/google.svg';
import { moderateScale } from 'react-native-size-matters';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import axiosconfig from '../providers/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppContext from '../components/appcontext';
import Loader from './loader';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {
  LoginManager,
  LoginButton,
  AccessToken,
  GraphRequest,
  GraphRequestManager,
} from 'react-native-fbsdk-next';

const windowHeight = Dimensions.get('window').height;
const SignIn = ({ navigation }) => {
  const [remember, setRemember] = useState(false);
  const [signData, setSignData] = useState([]);
  const [loader, setLoader] = useState(false);
  const context = useContext(AppContext);

  const showToast = (t, e) => {
    Alert.alert(t, e, [{ text: 'OK' }]);
  };

  useEffect(() => {
    let DoP = {
      name: null,
      email: null,
      password: null,
      confirm_password: null,
      type: 'user',
      opt: null,
    };
    setSignData(DoP);
    GoogleSignin.configure({
      androidClientId:
        '985514740212-uiai0l1g8j0ha2eqlojfubgi737vd6bd.apps.googleusercontent.com',
      webClientId:
        '781921654869-goc7pjatjjrh4vn5sllnhfchhss5hau6.apps.googleusercontent.com',
      iosClientId:
        '9781921654869-i9qh50gfnmtj2jeiqefddb9toeqo650s.apps.googleusercontent.com',
    });
    // GoogleSignin.configure()
  }, []);

  const storeData = async value => {
    try {
      await AsyncStorage.setItem('@auth_token', value);
      context.setuserToken(value);
      setTimeout(() => {
        navigation.navigate('Home');
      }, 1000);
    } catch (e) { }
  };

  const setFormDatat = (e, t) => {
    if (t == 'email') {
      signData[t] = e.toLowerCase();
    } else {
      signData[t] = e;
    }
    setSignData(signData);
  };

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

    setLoader(true);

    await axiosconfig
      .post('app/check-email', { email: signData.email })
      .then((res: any) => {
        if (res.status == 200) {
          console.log(res);
          otpSend();
        } else {
          setLoader(false);
          showToast('error', res.data.message);
        }
      })
      .catch(err => {
        setLoader(false);
        showToast('error', err.response.data.message);
      });
  };

  const otpSend = async () => {
    await axiosconfig
      .post('app/otp', { email: signData.email, forgot:0 })
      .then((res: any) => {
        setLoader(false);
        console.log(res);
        navigation.navigate('OPT', signData);
      })
      .catch(err => {
        console.log(err.response);
        setLoader(false);
        showToast('error', err.response.data.message);
      });
  };

  const capitalizeFirstLetter = string => {
    if (string == 'name') {
      return `Full ${string.charAt(0).toUpperCase() + string.slice(1)}`;
    } else {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
  };

  const _signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      checkMail(userInfo.user, 'GOOGLE');
    } catch (error) {
      console.log(error, 'error');
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  };

  const checkMail = async (d, option) => {
    setLoader(true);

    let data = {
      name: d.name,
      email: d.email,
      password: d.email+'leaperway',
      type: 'user',
      userfrom: option === 'GOOGLE' ? 'GOOGLE' : 'FACEBOOK',
      image: option === 'GOOGLE' ? d.photo : d.picture.data.url,
    };

    await axiosconfig
      .post('app/check-email', { email: data.email })
      .then((res: any) => {
        if (res.status == 200) {
          axiosconfig
            .post('app/google-register', data)
            .then((res: any) => {
              setLoader(false);
              storeData(res.data.access_token);
            })
            .catch(err => {
              setLoader(false);
              showToast('error', err.response.data.message);
            });
        } else {
          login(data);
        }
      })
      .catch(err => {
        login(data);
      });
  };

  const login = data => {
    axiosconfig
      .post('app/login', data)
      .then((res: any) => {
        setLoader(false);
        if (res.data.error) {
          showToast('login error', res.data.error_description);
        } else {
          storeData(res.data.access_token);
        }
      })
      .catch(err => {
        setLoader(false);
        showToast('error', 'Invalid Credentials');
      });
  };
  const infoRequest = new GraphRequest(
    '/me',
    {
      parameters: {
        fields: {
          string: 'email,name,picture',
        },
      },
    },
    (err, res) => {
      if (res) {

        checkMail(res, 'FACEBOOK');
      } else {

      }
    },
  );

  const facebookLogin = async () => {
    let result;
    try {
      LoginManager.setLoginBehavior('NATIVE_ONLY');
      result = await LoginManager.logInWithPermissions([
        'public_profile',
        'email',
      ]);
    } catch (error) {
      showToast('error', 'Native ' + error);
      LoginManager.setLoginBehavior('WEB_ONLY');
      result = await LoginManager.logInWithPermissions([
        'public_profile',
        'email',
      ]);
    }
    if (result.isCancelled) {
      Alert.alert('Login Cancelled');
    } else {
      new GraphRequestManager().addRequest(infoRequest).start();
    }
  };
  return (
    <ScrollView
      contentContainerStyle={{
        height: windowHeight + 70,
        backgroundColor: '#fff',
      }}>
      {loader ? (
        <>
          <Loader />
        </>
      ) : null}
      <View style={styles.container}>
        <View style={{ alignItems: 'center', width: '100%' }}>
          <Text
            style={{
              color: '#E83131',
              fontSize: moderateScale(20),
              fontWeight: 'bold',
              marginTop: 30,
            }}>
            Sign Up
          </Text>
          <Text
            style={{
              color: '#666666',
              fontSize: moderateScale(12),
              marginTop: 10,
              textAlign: 'center',
              width: 240,
              marginBottom: 60,
            }}>
            Donate Food to Poor people in just 3 easy steps
          </Text>
          <View style={{ width: '100%' }}>
            <Input
              placeholder="Full Name"
              containerStyle={{
                ...styles.textContainerStyle,
                marginBottom: 10,
              }}
              inputContainerStyle={{
                ...styles.inputContainerStyle,
              }}
              onChangeText={e => setFormDatat(e, 'name')}
            />
            <Input
              placeholder="Email Adress"
              containerStyle={{
                ...styles.textContainerStyle,
                marginBottom: 10,
              }}
              inputContainerStyle={{
                ...styles.inputContainerStyle,
              }}
              onChangeText={e => setFormDatat(e, 'email')}
            />
            <Input
              placeholder="Password"
              containerStyle={{
                ...styles.textContainerStyle,
                marginBottom: 10,
              }}
              inputContainerStyle={{
                ...styles.inputContainerStyle,
              }}
              secureTextEntry={true}
              onChangeText={e => setFormDatat(e, 'password')}
            />
            <Input
              placeholder="Confirm Password"
              containerStyle={{
                ...styles.textContainerStyle,
                marginBottom: 10,
              }}
              inputContainerStyle={{
                ...styles.inputContainerStyle,
              }}
              secureTextEntry={true}
              onChangeText={e => setFormDatat(e, 'confirm_password')}
            />
          </View>

          <View style={{ width: '100%', marginTop: 20 }}>
            <Button
              title="Sign Up"
              type="solid"
              buttonStyle={{
                backgroundColor: '#1E3865',
                padding: 15,
                borderRadius: 15,
              }}
              onPress={() => signUp()}
            />
            {/* <Text
              style={{
                color: '#666666',
                textAlign: 'center',
                fontSize: moderateScale(16),
                marginTop: 10,
                marginBottom: 10,
              }}>
              Or
            </Text> */}
            {/* <Button
              title="Continue with Facebook"
              type="solid"
              buttonStyle={{
                backgroundColor: '#F6F8FA',
                padding: 15,
                borderRadius: 15,
              }}
              titleStyle={{
                color: '#1E3865',
                fontWeight: 'bold',
              }}
              onPress={() => facebookLogin()}
              icon={
                <FacebookIcon
                  style={{
                    height: 30,
                    width: 30,
                    position: 'absolute',
                    left: 15,
                  }}
                />
              }
            /> */}
            {/* <Button
              title="Continue with Google"
              type="solid"
              buttonStyle={{
                backgroundColor: '#F6F8FA',
                padding: 15,
                borderRadius: 15,
                marginTop: 10,
              }}
              titleStyle={{
                color: '#1E3865',
                fontWeight: 'bold',
                fontSize:moderateScale(14)
              }}
              onPress={() => _signIn()}
              icon={
                <GoogleIcon
                  style={{
                    height: 30,
                    width: 30,
                    position: 'absolute',
                    left: 15,
                  }}
                />
              }
            /> */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 20,
              }}>
              <Text style={{ color: '#707070', textAlign: 'center' }}>
                Already have an account?{' '}
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={{ color: '#0071BC', textAlign: 'center' }}>
                  Sign In
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingLeft: 30,
    paddingRight: 30,
    paddingBottom: 20,
    paddingTop: 40,
  },
  textContainerStyle: {
    width: '100%',
    backgroundColor: '#F6F8FA',
    color: '#000',
    borderRadius: 15,
    paddingBottom: 0,
    height: 60,
  },
  inputContainerStyle: {
    paddingBottom: 0,
    borderColor: 'transparent',
    marginTop: 6,
  },
});

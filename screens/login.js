import React, {useState, useContext, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Input, CheckBox, Button} from 'react-native-elements';
import FacebookIcon from '../assets/svg/facebook.svg';
import GoogleIcon from '../assets/svg/google.svg';
import AppContext from '../components/appcontext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {moderateScale} from 'react-native-size-matters';
import Loader from './loader';
import Toast from 'react-native-toast-message';
import axiosconfig from '../providers/axios';
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
} from 'react-native-fbsdk';

const Login = ({navigation}) => {
  const [loader, setLoader] = useState(false);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [remember, setRemember] = useState(false);
  const myContext = useContext(AppContext);

  useEffect(() => {
    GoogleSignin.configure({
      androidClientId:
        '985514740212-uiai0l1g8j0ha2eqlojfubgi737vd6bd.apps.googleusercontent.com',
      webClientId:
        '985514740212-9eek8v9paecm235sik8nv150vcnuma2e.apps.googleusercontent.com',
    });
  }, []);

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
        console.log('response', res);
      } else {
        console.log('err', err);
      }
    },
  );

  const facebookLogin = () => {
    LoginManager.logInWithPermissions(['public_profile', 'email']).then(
      function (result) {
        if (result.isCancelled) {
          console.log('Login cancelled');
        } else {
          console.log(
            'Login success with permissions: ' +
              result.grantedPermissions.toString(),
          );
          AccessToken.getCurrentAccessToken().then(data => {
            console.log('access token', data.accessToken.toString());
          });

          new GraphRequestManager().addRequest(infoRequest).start();
        }
      },
      function (error) {
        console.log('Login fail with error: ' + error);
      },
    );
  };

  const _signIn = async () => {
    await GoogleSignin.hasPlayServices();
    await GoogleSignin.signIn()
      .then(user => {
        console.log('user', user);
        storeData(user.idToken);
        setuserInfo(user);
      })
      .catch(error => {
        if (error.code === statusCodes.SIGN_IN_CANCELLED) {
          // user cancelled the login flow
          alert('Cancel');
        } else if (error.code === statusCodes.IN_PROGRESS) {
          alert('Signin in progress');
          // operation (f.e. sign in) is in progress already
        } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
          alert('PLAY_SERVICES_NOT_AVAILABLE');
          // play services not available or outdated
        } else {
          console.log('some other', error);
          // some other error happened
        }
      });
  };

  const showToast = (t, e) => {
    Toast.show({
      type: t,
      text1: e,
    });
  };

  const storeData = async value => {
    try {
      await AsyncStorage.setItem('@auth_token', value);
      myContext.setuserToken(value);
      navigation.navigate('Home');
    } catch (e) {}
  };

  const loginForm = async () => {
    let data = {
      email: email,
      password: password,
      type: 'user',
    };
    var emailReg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (!emailReg.test(email)) {
      showToast('error', 'Email Invalid!');
      return false;
    }

    if (email == '' || email == null) {
      showToast('error', 'Email Required!');
      return false;
    }
    if (password == '' || password == null) {
      showToast('error', 'Password Required!');
      return false;
    }
    setLoader(true);
    await axiosconfig
      .post('app/login', data)
      .then((res: any) => {
        setLoader(false);
        if (res.data.error) {
          showToast('error', res.data.error_description);
        } else {
          storeData(res.data.access_token);
        }
      })
      .catch(err => {
        setLoader(false);
        showToast('error', 'Invalid Credentials');
      });
  };

  return (
    <View style={styles.container}>
      {loader ? (
        <>
          <Loader />
        </>
      ) : null}
      <View style={{alignItems: 'center', width: '100%'}}>
        <Text
          style={{
            color: '#E83131',
            fontSize: moderateScale(20),
            fontWeight: 'bold',
            marginTop: 30,
          }}>
          Log In
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
        <View style={{width: '100%'}}>
          <Input
            placeholder="Email Adress"
            containerStyle={{
              ...styles.textContainerStyle,
              marginBottom: 10,
            }}
            inputContainerStyle={{
              ...styles.inputContainerStyle,
            }}
            onChangeText={t => setEmail(t)}
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
            onChangeText={t => setPassword(t)}
            secureTextEntry={true}
          />
        </View>
        <View
          style={{
            marginTop: 0,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
          }}>
          <CheckBox
            title="Remember me"
            checked={remember}
            onPress={() => setRemember(!remember)}
            iconType="font-awesome"
            checkedIcon="square"
            checkedColor="#1E3865"
            containerStyle={{
              backgroundColor: 'transparent',
              borderColor: 'transparent',
              padding: 0,
            }}
          />
          <TouchableOpacity
            onPress={() => navigation.navigate('ForgotPassword')}>
            <Text style={{color: '#0071BC'}}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>
        <View style={{width: '100%', marginTop: 30}}>
          <Button
            title="Log In"
            type="solid"
            onPress={() => loginForm()}
            buttonStyle={{
              backgroundColor: '#1E3865',
              padding: 15,
              borderRadius: 15,
            }}
          />
          <Text
            style={{
              color: '#666666',
              textAlign: 'center',
              fontSize: moderateScale(15),
              marginTop: 10,
              marginBottom: 10,
            }}>
            Or
          </Text>

          {/* <LoginButton
            onLoginFinished={(error, result) => {
              if (error) {
                console.log('login has error: ' + result.error);
              } else if (result.isCancelled) {
                console.log('login is cancelled.');
              } else {
                AccessToken.getCurrentAccessToken().then(data => {
                  console.log(data.accessToken.toString());
                  console.log(result, 'result');
                  storeData(data.accessToken.toString());
                });
              }
            }}
            onLogoutFinished={() => console.log('logout.')}
          /> */}

          <Button
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
          />
          <Button
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
            }}
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
            onPress={() => {
              _signIn();
            }}
          />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 20,
            }}>
            <Text style={{color: '#707070', textAlign: 'center'}}>
              Don`t have an account?{' '}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
              <Text style={{color: '#0071BC', textAlign: 'center'}}>
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingLeft: 30,
    paddingRight: 30,
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
// import React, {Component} from 'react';
// import {View, Text} from 'react-native';
// import {
//   LoginButton,
//   AccessToken,
//   GraphRequest,
//   GraphRequestManager,
// } from 'react-native-fbsdk';

// export default class Login extends Component {
//   state = {userInfo: {}};

//   getInfoFromToken = token => {
//     alert('hi');
//     const PROFILE_REQUEST_PARAMS = {
//       fields: {
//         string: 'id, name,  first_name, last_name',
//       },
//     };
//     const profileRequest = new GraphRequest(
//       '/me',
//       {token, parameters: PROFILE_REQUEST_PARAMS},
//       (error, result) => {
//         if (error) {
//           console.log('login info has error: ' + error);
//         } else {
//           this.setState({userInfo: result});
//           console.log('result:', result);
//         }
//       },
//     );
//     new GraphRequestManager().addRequest(profileRequest).start();
//   };

//   render() {
//     return (
//       <View style={{flex: 1, margin: 50}}>
//         <LoginButton
//           onLoginFinished={(error, result) => {
//             if (error) {
//               console.log('login has error: ' + result.error);
//             } else if (result.isCancelled) {
//               console.log('login is cancelled.');
//             } else {
//               console.log('login is done.');
//               AccessToken.getCurrentAccessToken().then(data => {
//                 const accessToken = data.accessToken.toString();
//                 this.getInfoFromToken(accessToken);
//               });
//             }
//           }}
//           onLogoutFinished={() => this.setState({userInfo: {}})}
//         />
//         {this.state.userInfo.name && (
//           <Text style={{fontSize: 16, marginVertical: 16}}>
//             Logged in As {this.state.userInfo.name}
//           </Text>
//         )}
//       </View>
//     );
//   }
// }

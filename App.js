import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createStackNavigator, HeaderStyleInterpolators } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import axiosconfig from './providers/axios';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import AppContext from './components/appcontext';
import Home from './screens/home'
import PreLogin from './screens/prelogin'
import Login from './screens/login'
import SignIn from './screens/signin'
import DrawerContent from './screens/drawercontent';
import DonationHistory from './screens/donationhistory'
import PaymentMethod from './screens/payment-method'
import DepositeAmount from './screens/deposite-amount'
import ConfirmPayment from './screens/confirm-payment'
import Resturants from './screens/resturants'
import Wallet from './screens/wallet'
import Profile from './screens/profile'
import RNBootSplash from 'react-native-bootsplash'
import ForgotPassword from './screens/forgotpassword'
import DepositHistory from './screens/deposit-history'
import TermCondition from './screens/terms-con'
import PrivacyPolicy from './screens/privacy-policy'
import MapModal from './components/map'
import OPT from './screens/opt';
import NewPassword from './screens/newPassword';

const App = ({}) => {

  const [userToken, setuserToken] = useState(null);
  const [CongratesModal, setCongratesModal] = useState(false);
  const [SorryModal, setSorryModal] = useState(false);
  const [CouponModal, setCouponModal] = useState(false);
  const [CurrentCoupon, setCurrentCoupon] = useState('N/A');
  const [WalletAmount, setWalletAmount] = useState(0);
  const [mapModal, setmapModal] = useState(false);
  const [paymentmethods, setpaymentmethods] = useState(null);
  const [closeAllSheets, setcloseAllSheets] = useState(false)
  const [modalOpens, setmodalOpens] = useState(false);
  const [myData, setMyData] = useState()
  const [currentLatLng, setcurrentLatLng] = useState()
  const [myDat, setmyDat] = useState({});
  const [profileImagee, setprofileImagee] = useState(null);
  const [userName, setuserName] = useState(null);
  const [appUrl, setappUrl] = useState(null);
  const [cardAddModal, setcardAddModal] = useState(false);
  const userSettings = {
    userToken: userToken,
    CongratesModalCon: CongratesModal,
    SorryModalCon: SorryModal,
    CouponModalCon: CouponModal,
    CurrentCoupon: CurrentCoupon,
    WalletAmount: WalletAmount,
    profileImagee: profileImagee,
    mapModal: mapModal,
    paymentmethods: paymentmethods,
    closeAllSheets: closeAllSheets,
    modalOpens: modalOpens,
    myData: myData,
    myDat: myDat,
    userName: userName,
    currentLatLng: currentLatLng,
    appUrl: appUrl,
    cardAddModal:cardAddModal,
    setuserToken,
    setCongratesModal,
    setSorryModal,
    setCouponModal,
    setCurrentCoupon,
    setWalletAmount,
    setprofileImagee,
    setmapModal,
    setpaymentmethods,
    setcloseAllSheets,
    setmodalOpens,
    setMyData,
    setcurrentLatLng,
    setmyDat,
    setuserName,
    setappUrl,
    setcardAddModal
  };

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('@auth_token');
      if (value !== null) {
        setuserToken(value)
      }
    } catch (e) {
      setuserToken(null)
    }
  }

  const myDataR = async () => {
    const value = await AsyncStorage.getItem('@auth_token');
    await axiosconfig.get(`admin/my_data`,
      {
        headers: {
          Authorization: 'Bearer ' + value //the token is a variable which holds the token
        }
      }
    ).then((res: any) => {
      setMyData(res.data)
    }).catch((err) => {
    
    })
  }

  const isSignout = true
  const Root = ({ navigation }) => {
    if (userToken == null) {
      navigation.closeDrawer();
    }
    return (
      <Stack.Navigator >
            {/* <Stack.Screen name="LocationChecker" component={LocationChecker} options={{ headerShown: false }} /> */}
            <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} onPress={() => navigation.navigate('Home', { data: userToken })} />
            <Stack.Screen name="DonationHistory" component={DonationHistory} options={{ headerShown: false }} />
            <Stack.Screen name="PaymentMethod" component={PaymentMethod} options={{ headerShown: false }} />
            <Stack.Screen name="DepositeAmount" component={DepositeAmount} options={{ headerShown: false }} />
            <Stack.Screen name="ConfirmPayment" component={ConfirmPayment} options={{ headerShown: false }} />
            <Stack.Screen name="Resturants" component={Resturants} options={{ headerShown: false }} />
            <Stack.Screen name="Wallet" component={Wallet} options={{ headerShown: false }} />
            <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
            <Stack.Screen name="DepositHistory" component={DepositHistory} options={{ headerShown: false }} />
            <Stack.Screen name="TermCondition" component={TermCondition} options={{ headerShown: false }} />
            <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} options={{ headerShown: false }} />
            <Stack.Screen name="MapModal" component={MapModal} options={{ headerShown: false }} />
      </Stack.Navigator>
    );
  }

  useEffect(() => {
    const init = async () => {
      getData()
      myDataR()
    };

    init().finally(async () => {
      setTimeout(() => { RNBootSplash.hide({ fade: true }); }, 1000)
    });
  }, []);

  return (
    <AppContext.Provider value={userSettings}>
      <SafeAreaProvider>
        <NavigationContainer>
          {
            userToken == null ? (
              <>
                <Stack.Navigator>
                  <Stack.Screen
                    name="PreLogin"
                    component={PreLogin}
                    options={{
                      title: '',
                      animationTypeForReplace: isSignout ? 'pop' : 'push',
                      headerShown: false,
                      headerStyleInterpolator: HeaderStyleInterpolators.forUIKit,
                    }}
                  />
                  <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
                  <Stack.Screen name="SignIn" component={SignIn} options={{ headerShown: false }} />
                  <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{ headerShown: false }} />
                  <Stack.Screen name="OPT" component={OPT} options={{ headerShown: false }} />
                  <Stack.Screen name="NewPassword" component={NewPassword} options={{ headerShown: false }} />
                </Stack.Navigator>
              </>
            ) : (
              <>
                <Drawer.Navigator
                  drawerBackgroundColor={'black'}
                  screenOptions={{
                    drawerStyle: {
                      drawerBackgroundColor: 'transparent',
                      width: '80%',
                      overflow: 'hidden',
                    },
                    swipeEnabled: userToken == null ? false : true
                  }}
                  drawerContent={(props) => <DrawerContent {...props} />}
                  initialRouteName="Root"
                >
                  <Drawer.Screen name="List" options={{ headerShown: false }} component={Root} />
                </Drawer.Navigator>
              </>
            )
          }
        </NavigationContainer>
      </SafeAreaProvider>
      <Toast />
    </AppContext.Provider>
  )
}

export default App;

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})
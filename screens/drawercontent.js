import React, {useContext, useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Share
} from 'react-native';
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';
import {
  Avatar,
  Title,
  Caption,
  Paragraph,
  Drawer,
  Text,
  TouchableRipple,
  Switch,
} from 'react-native-paper';
import {Image, Button, Icon} from 'react-native-elements';
import AppContext from '../components/appcontext';
import LogOut from '../assets/svg/logoutIcon.svg';
import ProfileIcon from '../assets/svg/profileIcon.svg';
import DepositeIcon from '../assets/svg/deposite.svg';
import PaymentIcon from '../assets/svg/paymentIcon.svg';
import DonationIcon from '../assets/svg/historyIcon.svg';
import PrivacyIcon from '../assets/svg/accept.svg';
import TermsIcon from '../assets/svg/insurance.svg';
import DepoHis from '../assets/svg/deposite-history.svg';
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';
import Collapsible from 'react-native-collapsible';
import LegalIcon from '../assets/svg/legalicon.svg';
import SocialIcon from '../assets/svg/social-media.svg';
import CrossIco from '../assets/svg/x-mark.svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import {moderateScale} from 'react-native-size-matters';
import axiosconfig from '../providers/axios';
// import Share from 'react-native-share';
import {SafeAreaView} from 'react-native-safe-area-context';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {LoginManager} from 'react-native-fbsdk-next';

const DrawerContent = ({navigation}) => {
  const myContext = useContext(AppContext);
  const [toggleIcon, settoggleIcon] = useState(false);
  const [myD, setmyD] = useState(false);
  const [collapse, setCollapse] = useState(true);
  const [collapse2, setCollapse2] = useState(true);
  const storeData = async value => {
    try {
      await AsyncStorage.removeItem('@auth_token');
      myContext.setuserToken(value);
    } catch (e) {
  
    }
  };

  const nameSpliter = n => {
    if (n) {
      let c = n?.split(' ');
      let c1 = c[0][0];
      let c2 = '';
      if (c[1]) {
        c2 = c[1][0].toUpperCase();
      }
      let sp = c1 + c2;
      return sp;
    }
  };

  useEffect(() => {
    myDataR();
    setTimeout(() => {
      myDataR();
    }, 1000);
  
  }, []);

  const myDataR = async () => {
    const value = await AsyncStorage.getItem('@auth_token');
    await axiosconfig
      .get(`admin/my_data`, {
        headers: {
          Authorization: 'Bearer ' + value, //the token is a variable which holds the token
        },
      })
      .then((res: any) => {
        myContext.setMyData(res.data);
        setmyD(res.data);
      })
      .catch(err => {
        
      });
  };

  // const shareOptions = {
  //   title: 'Leaper way',
  //   // message: 'Leaper way Share Url',
  //   url: myContext.appUrl,
  // };

  // const share = async () => {
  //   Share.open(shareOptions)
  //     .then(res => {
     
  //     })
  //     .catch(err => {
        
  //     });
  // };

  const share = async () => {
    try {
      const result = await Share.share({
        message:
        myContext.appUrl,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  const logOut = async () => {
    storeData(null);
    await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      LoginManager.logOut();
    const isSignedIn = await GoogleSignin.isSignedIn();
  };

  return (
    <LinearGradient
      colors={['#FF3C40', '#FF3C40', '#C46163']}
      style={{flex: 1, paddingBottom: 20}}>
      <View style={{flex: 1, paddingBottom: 0}}>
        <View style={{alignItems: 'center', paddingTop: 20, marginBottom: 20}}>
          <SafeAreaView>
            <View
              style={{
                width: 65,
                height: 70,
                borderRadius: 10,
                backgroundColor: '#f1f1f1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
              }}>
              {myContext?.profileImagee == null ? (
                <>
                  <Text
                    style={{
                      fontSize: moderateScale(18),
                      fontFamily: 'Gilroy-Bold',
                      color: '#FF3C40',
                    }}>
                    {nameSpliter(myContext?.myData?.name)}
                  </Text>
                </>
              ) : (
                <>
                  <Image
                    source={{uri: myContext?.profileImagee}}
                    style={{width: 65, height: 70, resizeMode: 'cover'}}
                    PlaceholderContent={<ActivityIndicator />}
                  />
                </>
              )}
            </View>
          </SafeAreaView>
          <View
            style={{
              width: '100%',
              paddingHorizontal: 20,
              alignItems: 'center',
              marginTop: 10,
            }}
            numberOfLines={1}>
            <Title
              style={{
                ...styles.textStyle,
                color: '#000',
                fontSize: moderateScale(16),
                fontFamily: 'Gilroy-Bold',
                marginLeft: 0,
              }}
              numberOfLines={1}>
              {myContext?.myData?.name}
            </Title>
            <View style={{...styles.flexCon}}>
              <Title
                style={{
                  color: '#000',
                  fontSize: moderateScale(12),
                  fontFamily: 'Gilroy-Bold',
                  marginLeft: 0,
                }}
                numberOfLines={1}>
                Balance:
              </Title>
              <Title
                style={{
                  color: '#000',
                  fontSize: moderateScale(12),
                  fontFamily: 'Gilroy-Bold',
                  marginLeft: 0,
                }}
                numberOfLines={1}>
                ${myContext?.WalletAmount}
              </Title>
            </View>
          </View>
        </View>
        <DrawerContentScrollView showsVerticalScrollIndicator={false}>
          <View
            style={{
              marginTop: 0,
              paddingLeft: 20,
              paddingRight: 20,
              paddingBottom: 10,
            }}>
            <TouchableOpacity
              onPress={() => navigation.navigate('DepositeAmount')}>
              <View style={{...styles.flexCon, marginBottom: 35}}>
                <DepositeIcon style={{fill: '#fff', width: 28, height: 28}} />
                <Text style={styles.textStyle}>Deposit</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
              <View style={{...styles.flexCon, marginBottom: 35}}>
                <ProfileIcon style={{fill: '#fff', width: 28, height: 25}} />
                <Text style={styles.textStyle}>Profile</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('PaymentMethod')}>
              <View style={{...styles.flexCon, marginBottom: 35}}>
                <PaymentIcon style={{fill: '#fff', width: 28, height: 22}} />
                <Text style={styles.textStyle}>Payment Method</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('DonationHistory')}>
              <View style={{...styles.flexCon, marginBottom: 35}}>
                <DonationIcon style={{fill: '#fff', width: 28, height: 24}} />
                <Text style={styles.textStyle}>Donation History</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('DepositHistory')}>
              <View style={{...styles.flexCon, marginBottom: 35}}>
                <DepoHis style={{fill: '#fff', width: 28, height: 24}} />
                <Text style={styles.textStyle}>Deposit History</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => share('li')}>
              <View style={{...styles.flexCon, marginBottom: 35}}>
                <DepoHis style={{fill: '#fff', width: 28, height: 24}} />
                <Text style={styles.textStyle}>Share Us</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setCollapse(!collapse)}>
              <View
                style={{
                  ...styles.flexCon,
                  marginBottom: 25,
                  position: 'relative',
                }}>
                <LegalIcon style={{width: 28, height: 24}} />
                <Text style={styles.textStyle}>Legals</Text>

                <Icon
                  name="angle-down"
                  type="font-awesome"
                  color="#fff"
                  containerStyle={{
                    position: 'absolute',
                    right: 0,
                    transform: [{rotate: !collapse ? '180deg' : '360deg'}],
                  }}
                />
              </View>
            </TouchableOpacity>
            <View style={{marginBottom: collapse ? 0 : 20}}>
              <Collapsible
                collapsed={collapse}
                style={{
                  backgroundColor: '#f1f1f1',
                  padding: 20,
                  borderRadius: 10,
                }}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('PrivacyPolicy')}>
                  <View style={{...styles.flexCon, marginBottom: 20}}>
                    <TermsIcon style={{width: 28, height: 24}} />
                    <Text
                      style={{
                        ...styles.textStyle,
                        fontSize: moderateScale(12),
                        color: '#666',
                      }}>
                      Privacy Policy
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => navigation.navigate('TermCondition')}>
                  <View style={{...styles.flexCon}}>
                    <PrivacyIcon style={{width: 28, height: 24}} />
                    <Text
                      style={{
                        ...styles.textStyle,
                        fontSize: moderateScale(12),
                        color: '#666',
                      }}>
                      Terms & Condition
                    </Text>
                  </View>
                </TouchableOpacity>
              </Collapsible>
            </View>
          </View>
        </DrawerContentScrollView>
        <SafeAreaView>
          <View style={{paddingLeft: 20, marginTop: 20}}>
            <TouchableOpacity
              onPress={() => {
                logOut();
              }}>
              <View style={styles.flexCon}>
                <LogOut style={{fill: '#fff', width: 28, height: 24}} />
                <Text style={styles.textStyle}>Log out</Text>
              </View>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  flexCon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textStyle: {
    fontFamily: 'Gilroy-Medium',
    marginLeft: 20,
    fontSize: moderateScale(14),
    color: '#000',
  },
  email: {
    textAlign: 'center',
    color: '#fff',
    fontSize: moderateScale(14),
    paddingEnd: 10,
  },
});

export default DrawerContent;

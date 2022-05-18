import React, { useCallback, useState, useContext, useEffect } from "react";
import { StyleSheet, View, Switch, Modal, Alert, Linking } from "react-native";
import { CheckBox, Button, Text, Icon, Image } from 'react-native-elements'
import ReviewImg from '../assets/svg/review.svg'
import VisaIcon from '../assets/svg/visa.svg'
import MasterIcon from '../assets/svg/master.svg'
import AmexIcon from '../assets/svg/amex.svg'
import DiscIcon from '../assets/svg/discover.svg'
import JcbIcon from '../assets/svg/jcb.svg'
import DinnerClub from '../assets/svg/diners-club.svg'
import PaymentIcon from '../assets/svg/paymentIconred.svg';
import Tick from '../assets/svg/tick.svg'
import AppContext from '../components/appcontext'
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { moderateScale } from 'react-native-size-matters';
import axiosconfig from '../providers/axios';
import Loader from '../screens/loader';
import { InAppBrowser } from 'react-native-inappbrowser-reborn'
// import {openLink, tryDeepLinking} from './../utils';

const ReviewPayment = ({ navigation, amount, cardSelect, cardSelected }) => {

    const myContext = useContext(AppContext);
    const [loader, setLoader] = useState(false);
    const [url, setUrl] = useState('https://google.com');
    const [statusBarStyle] = useState('dark-content');

    const depositeAmount = () => {
        // myContext.setWalletAmount(amount)
        // myContext.setCongratesModal(true)
        deposite()
    }

    const deposite = async () => {
        let data = {
            user_id: myContext.myData.id,
            card_id: cardSelect,
            amount: amount,
            processing_fee: 1.25
        }

        setLoader(true)
        await axiosconfig.post(`admin/deposite`, data,
            {
                headers: {
                    Authorization: 'Bearer ' + myContext.userToken //the token is a variable which holds the token
                }
            }
        ).then((res: any) => {

            setLoader(false)
            getWallet()
            // openLink(res.data.url)
          
            setUrl(res.data.url)
            setTimeout(() => {
                onOpenLink(res.data.url)
            },1000);
            
            // myContext.setCongratesModal(true)
        }).catch((err) => {
          
            setLoader(false)
        })
    }

    const getWallet = async () => {

        await axiosconfig.get(`admin/current_wallet`,
            {
                headers: {
                    Authorization: 'Bearer ' + myContext.userToken //the token is a variable which holds the token
                }
            }
        ).then((res: any) => {

            myContext.setWalletAmount(res.data.wallet)
        }).catch((err) => {
           
        })
    }

    useEffect(() => {

    }, [])

    const splitNo = (c) => {
        var splitt = c?.split(' ')
        var lenghter = splitt.length
        var cNoo = '**** ' + splitt[lenghter - 1]
        return cNoo
    }

    const onOpenLink = useCallback(async (uri) => {
        await openLink(uri, statusBarStyle);
    }, [url, statusBarStyle]);

    const openLink = async(uri) => {
        try {
          const url = uri
          if (await InAppBrowser.isAvailable()) {
            const result = await InAppBrowser.open(url, {
              // iOS Properties
              dismissButtonStyle: 'cancel',
              preferredBarTintColor: '#453AA4',
              preferredControlTintColor: 'white',
              readerMode: false,
              animated: true,
              modalPresentationStyle: 'fullScreen',
              modalTransitionStyle: 'coverVertical',
              modalEnabled: true,
              enableBarCollapsing: false,
              // Android Properties
              showTitle: true,
              toolbarColor: '#6200EE',
              secondaryToolbarColor: 'black',
              navigationBarColor: 'black',
              navigationBarDividerColor: 'white',
              enableUrlBarHiding: true,
              enableDefaultShare: true,
              forceCloseOnRedirection: false,
              // Specify full animation resource identifier(package:anim/name)
              // or only resource name(in case of animation bundled with app).
              animations: {
                startEnter: 'slide_in_right',
                startExit: 'slide_out_left',
                endEnter: 'slide_in_left',
                endExit: 'slide_out_right'
              },
              headers: {
                'my-custom-header': 'Leaperway Payment'
              }
            })
            navigation.navigate('Home')
            getWallet()
            
          }
          else Linking.openURL(url)
        } catch (error) {
          Alert.alert(error.message)
        }
    }

    return (
        <View style={{ padding: 20 }}>
            {
                loader ? (
                    <>
                        <Loader />
                    </>
                ) : null
            }
            <View style={styles.flexRow}>
                <ReviewImg style={{ height: RFPercentage(7), width: RFPercentage(7) }} />
                <Text style={{ fontSize: moderateScale(18), fontFamily: 'Gilroy-Bold', marginTop: 0, color: '#000', marginLeft: 20 }}>Review and Confirm</Text>
            </View>
            <Text style={{ marginTop: 40, fontSize: moderateScale(16), color: '#666666', fontFamily: 'Gilroy-Medium' }}>Deposit Amount</Text>
            <Text style={{ marginTop: 5, fontSize: moderateScale(20), color: '#000', fontFamily: 'Gilroy-Bold' }}>${amount}</Text>

            <Text style={{ marginTop: 25, fontSize: moderateScale(16), color: '#666666', fontFamily: 'Gilroy-Medium' }}>Processing Fee</Text>
            <Text style={{ marginTop: 5, fontSize: moderateScale(20), color: '#000', fontFamily: 'Gilroy-Bold' }}>$1.25</Text>

            <View style={{ alignItems: 'flex-end', justifyContent: 'space-between', flexDirection: 'row', marginBottom: 40, marginTop: 0 }}>
                <View style={{ ...styles.flexRow }}>
                    <Text style={{ fontSize: moderateScale(16), fontFamily: 'Gilroy-Medium', marginRight: 10 }}>Pay with</Text>
                    {/* <VisaIcon style={{ height: 20, width: 30,marginLeft:10 }} /> */}
                    {
                        cardSelected.card_type == 'visa' ? <VisaIcon style={{ height: moderateScale(20), width: moderateScale(30) }} /> :
                            cardSelected.card_type == 'master-card' ? <MasterIcon style={{ height: moderateScale(20), width: moderateScale(30) }} /> :
                                cardSelected.card_type == 'discover' ? <DiscIcon style={{ height: moderateScale(20), width: moderateScale(30) }} /> :
                                    cardSelected.card_type == 'jcb' ? <JcbIcon style={{ height: moderateScale(20), width: moderateScale(30) }} /> :
                                        cardSelected.card_type == 'american-express' ? <AmexIcon style={{ height: moderateScale(20), width: moderateScale(30) }} /> :
                                            cardSelected.card_type == 'diners-club' ? <DinnerClub style={{ height: moderateScale(20), width: moderateScale(30) }} /> :
                                                <PaymentIcon style={{ height: moderateScale(20), width: moderateScale(30) }} />
                    }
                    <Text style={{ fontSize: moderateScale(16), color: '#666666', marginLeft: 5, fontFamily: 'Gilroy-Medium' }}>{splitNo(cardSelected.card_no)}</Text>
                </View>
                <View style={{ alignItems: 'flex-end', }}>
                    <Text style={{ fontSize: moderateScale(16), color: '#666666', fontFamily: 'Gilroy-Medium' }}>Total</Text>
                    <Text style={{ marginTop: 5, fontSize: moderateScale(20), color: '#000', fontFamily: 'Gilroy-Bold' }}>${parseInt(amount) + 1.25}</Text>
                </View>
            </View>

            <View>
                <Button
                    title="Confirm"
                    buttonStyle={styles.NextBtns}
                    titleStyle={{ fontSize: moderateScale(14), fontFamily: 'Gilroy-Bold' }}
                    onPress={() => depositeAmount()}
                />
                <Button
                    title="Modify"
                    buttonStyle={{ ...styles.NextBtns, backgroundColor: '#F6F8FA', marginTop: 10 }}
                    titleStyle={{ fontSize: moderateScale(14), color: '#1E3865', fontFamily: 'Gilroy-Bold' }}
                    onPress={() => navigation.goBack()}
                />
            </View>
        </View>
    )
}
export default ReviewPayment;

const styles = StyleSheet.create({
    flexRow: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    NextBtns: {
        backgroundColor: '#1E3865',
        paddingHorizontal: 26,
        paddingVertical: 15
        , borderRadius: 15
    },
})
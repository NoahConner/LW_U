import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, Alert, Dimensions } from 'react-native';
import { Image, Button, Icon, Input } from 'react-native-elements';
import StackHeader from '../components/stackheader'
import Wallet from '../assets/svg/wallet.svg';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import AppContext from '../components/appcontext'
import { moderateScale } from 'react-native-size-matters';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

const DepositeAmount = ({ navigation }) => {

    const myContext = useContext(AppContext);
    const [customAmount, SetcustomAmount] = useState(null)
    const createTwoButtonAlert = (m) =>
        Alert.alert(
            "Error",
            m,
        );
    const verifyAmont = () => {
        if (customAmount < 10) {
            createTwoButtonAlert('!Deposit amount must be greater or equal than $10.')
        } else {
            navigation.navigate('ConfirmPayment', { amount: customAmount })
        }
    }
    return (
        <SafeAreaView style={styles.container}>
            <StackHeader navigation={navigation} name={'Deposit Amount'} />
            <View style={{ padding: 20, width: '100%', height: '90%',alignItems:'center', justifyContent:'space-between' }}>
                <View>
                    <View style={styles.flexRow}>
                        <Wallet style={{ height: 25, width: 35 }} />
                        <Text style={{ fontFamily: 'Gilroy-Bold', fontSize: moderateScale(15), marginLeft: 15 }}>Wallet</Text>
                    </View>
                    <View style={{ ...styles.flexRow, marginTop: 10 }}>
                        <Text style={styles.txtAmount}>Current Balance: </Text>
                        <Text style={styles.txtAmount}>${myContext.WalletAmount}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 40, width: '100%' }}>
                        <Button
                            title="$ 10.00"
                            buttonStyle={styles.amountBtns}
                            titleStyle={{ fontSize: moderateScale(13), fontFamily: 'Gilroy-Medium' }}
                            containerStyle={{ width: '32%' }}
                            onPress={() => navigation.navigate('ConfirmPayment', { amount: '10' })}
                        />
                        <Button
                            title="$ 50.00"
                            buttonStyle={styles.amountBtns}
                            titleStyle={{ fontSize: moderateScale(13), fontFamily: 'Gilroy-Medium' }}
                            containerStyle={{ width: '32%' }}
                            onPress={() => navigation.navigate('ConfirmPayment', { amount: '50' })}
                        />
                        <Button
                            title="$ 100.00"
                            buttonStyle={styles.amountBtns}
                            titleStyle={{ fontSize: moderateScale(13), fontFamily: 'Gilroy-Medium' }}
                            containerStyle={{ width: '32%' }}
                            onPress={() => navigation.navigate('ConfirmPayment', { amount: '100' })}
                        />
                    </View>
                    <View style={{ marginTop: 25 }}>
                        <Input
                            placeholder=' Deposit Amount'
                            inputContainerStyle={{ backgroundColor: '#F6F8FA', paddingVertical: 15, borderRadius: 15, paddingHorizontal: 20, borderBottomWidth: 0 }}
                            containerStyle={{ paddingHorizontal: 0 }}
                            onChangeText={(amountt) => SetcustomAmount(amountt)}
                            inputStyle={{ padding: 0, margin: 0, fontSize: moderateScale(13), fontFamily: 'Gilroy-Medium' }}
                            leftIcon={{ type: 'font-awesome', name: 'dollar', color: '#666' }}
                            keyboardType='numeric'
                            returnKeyType="done"
                        />
                    </View>
                </View>
                <View style={{ width: '100%', }}>
                    <Button
                        title="Next"
                        buttonStyle={styles.NextBtns}
                        titleStyle={{ fontSize: moderateScale(15), fontFamily: 'Gilroy-Bold' }}
                        onPress={() => verifyAmont()}
                    />
                </View>
            </View>
        </SafeAreaView>
    )
}
export default DepositeAmount;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'flex-start',
        backgroundColor: '#fff',
    },
    flexRow: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    txtAmount: {
        color: '#666666',
        fontFamily: 'Gilroy-Medium',
        fontSize: moderateScale(12)

    },
    amountBtns: {
        backgroundColor: '#1E3865',
        paddingHorizontal: 10,
        paddingVertical: 13
        , borderRadius: 11,
    },
    NextBtns: {
        backgroundColor: '#1E3865',
        paddingHorizontal: 26,
        paddingVertical: 18
        , borderRadius: 15
    }
})
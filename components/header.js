import React,{useContext} from 'react';
import { View, Text, StyleSheet,TouchableOpacity  } from 'react-native';
import { Button,Icon } from 'react-native-elements';
import Wallet from '../assets/svg/wallet.svg';
import Bars from '../assets/svg/bars.svg';
import Location from '../assets/svg/location.svg';
import AppContext from '../components/appcontext'
import {  moderateScale } from 'react-native-size-matters';

const Header = ({navigation})=>{
    const myContext = useContext(AppContext);
    return(
        <View style={styles.header}>
            <View style={{width: '100%',flexDirection: 'row',justifyContent: 'space-between',alignItems: 'center',padding:10,textAlign:'center',
            elevation:1,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.5,
            shadowRadius: 5, 
            borderBottomEndRadius:15,
            borderBottomStartRadius:15
        }}>
                <View style={{flexDirection: 'row',alignItems: 'center',width: '90%',paddingLeft:5}} numberOfLines={1}>
                        <Button
                            icon={
                                <Bars style={{height:29,width:40}}/>
                            }
                            title=""
                            containerStyle={{width:35}}
                            buttonStyle={{backgroundColor:'transparent'}}
                            onPress={()=> navigation.openDrawer()}
                        />
                    <TouchableOpacity 
                        // onPress={()=> myContext.setmapModal(true)}
                        onPress={()=> navigation.navigate('MapModal')}
                    >
                        <View style={{marginLeft:25,width:'100%',paddingRight:125}}>
                            <Text style={{fontSize:moderateScale(16),marginBottom:5,fontFamily:'Gilroy-Bold'}}>Location Radius</Text>
                            <View style={{flexDirection: 'row',alignItems: 'center'}}>
                            <Location
                            style={{height:16,width:12,marginRight:10}}
                            />
                                <Text style={{fontSize:moderateScale(13),fontFamily:'Gilroy-Medium'}} numberOfLines={1}>363 North Sam Houston Parkway East Greater Greenspoint,  </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{width: '10%',alignItems: 'flex-end',paddingRight:2}}>
                    <TouchableOpacity>
                        <Button
                            icon={
                                <Wallet style={{height:25,width:35}} />
                            }
                            title=""
                            containerStyle={{width:30}}
                            buttonStyle={{backgroundColor:'transparent'}}
                            onPress={() => navigation.navigate('Wallet')}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default Header;

const styles = StyleSheet.create({
    header:{
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
    }
})




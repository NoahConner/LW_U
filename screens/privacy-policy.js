import React, {useContext, useState, useEffect} from 'react';
import { View, StyleSheet,Text,ScrollView } from 'react-native';
import StackHeader from '../components/stackheader'
import AppContext from '../components/appcontext'
import axiosconfig from '../providers/axios';
import Loader from '../screens/loader';
import { SafeAreaView } from 'react-native-safe-area-context';

const PrivacyPolicy = ({navigation}) => {
    const myContext = useContext(AppContext);
    const [loader, setLoader] = useState(false);
    const [para, setPara] = useState('')

    const getPrivacy = async () => {
        setLoader(true)
        await axiosconfig.get(`admin/privacy`,
            {
                headers: {
                    Authorization: 'Bearer ' + myContext.userToken //the token is a variable which holds the token
                }
            }
        ).then((res: any) => {
           
            setPara(res.data.paragraph)
            setLoader(false)

        }).catch((err) => {
            setLoader(false)
        })
    }

    useEffect(() => {
        getPrivacy()
    }, [])

    return(
        <SafeAreaView style={styles.container}>
            {
                loader ? (
                    <>
                        <Loader />
                    </>
                ) : null
            }
            <StackHeader navigation={navigation} name={'Privacy Policy'} />
            <ScrollView style={{ padding:20}} showsVerticalScrollIndicator={false}>
                <View >
                    {/* <Text style={{fontSize:20,fontFamily:'Gilroy-Bold', marginBottom:20}}>Privacy Policy</Text> */}
                    <Text style={{lineHeight:18,fontFamily:'Gilroy-Medium'}}>
                        {
                            para
                        }
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default PrivacyPolicy

const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems: 'flex-start',
        backgroundColor:'#fff'
    },
})
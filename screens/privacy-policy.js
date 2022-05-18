import React, {useContext, useState, useEffect} from 'react';
import { View, StyleSheet,Text,ScrollView } from 'react-native';
import StackHeader from '../components/stackheader'
import AppContext from '../components/appcontext'
import axiosconfig from '../providers/axios';
import Loader from '../screens/loader';

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
        <View style={styles.container}>
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
                    <Text style={{lineHeight:18,fontFamily:'Gilroy-Medium'}}>
                        {/* In publishing and graphic design, {'\n'}
                        Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. 
                        {'\n'}{'\n'}
                        Lorem ipsum may be used as a placeholder before final copy is available Lorem ipsum may be used as a placeholder before final copy is available Lorem ipsum may be used as a placeholder before final copy is available Lorem ipsum may be used as a placeholder before final copy is available. {'\n'} {'\n'}
                        In publishing and graphic design, {'\n'}
                        Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. 
                        {'\n'}{'\n'}
                        Lorem ipsum may be used as a placeholder before final copy is available Lorem ipsum may be used as a placeholder before final copy is available Lorem ipsum may be used as a placeholder before final copy is available Lorem ipsum may be used as a placeholder before final copy is available. {'\n'} {'\n'}
                        In publishing and graphic design, {'\n'}
                        Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. 
                        {'\n'}{'\n'}
                        Lorem ipsum may be used as a placeholder before final copy is available Lorem ipsum may be used as a placeholder before final copy is available Lorem ipsum may be used as a placeholder before final copy is available Lorem ipsum may be used as a placeholder before final copy is available. {'\n'} {'\n'} */}

                        {
                            para
                        }

                    </Text>
                </View>
            </ScrollView>
        </View>
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
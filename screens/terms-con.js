import React from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import StackHeader from '../components/stackheader'

const TermCondition = ({navigation}) => {
    return(
        <View style={styles.container}>
            <StackHeader navigation={navigation} name={'Terms and Condition'} />
            <ScrollView style={{ padding:20}} showsVerticalScrollIndicator={false}>
                <View >
                    <Text style={{lineHeight:18,fontFamily:'Gilroy-Medium'}}>
                        In publishing and graphic design, {'\n'}
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
                        Lorem ipsum may be used as a placeholder before final copy is available Lorem ipsum may be used as a placeholder before final copy is available Lorem ipsum may be used as a placeholder before final copy is available Lorem ipsum may be used as a placeholder before final copy is available. {'\n'} {'\n'}
                    </Text>
                </View>
            </ScrollView>
        </View>
    )
}

export default TermCondition

const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems: 'flex-start',
        backgroundColor:'#fff'
    },
})
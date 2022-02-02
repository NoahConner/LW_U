import React,{useState,useContext} from 'react';
import { View, SafeAreaView, Text, StyleSheet, Alert,Pressable, ActivityIndicator, TouchableOpacity, FlatList, Modal } from 'react-native';
import { Image, Button, Icon } from 'react-native-elements';
import Header from '../components/header'
import Location from '../assets/svg/location.svg';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import AppContext from '../components/appcontext'
import {  moderateScale } from 'react-native-size-matters';
// import MapModal from '../components/map'


var allRestT = [
    {
        'name': 'McDonald',
        'image': 'https://www.visitdanvillearea.com/wp-content/uploads/2015/08/McDonalds-Logo-square.jpg',
        'distance': '2.8 km',
        'id': '1'
    },
    {
        'name': 'Starbucks',
        'image': 'https://d1fdloi71mui9q.cloudfront.net/1vPHHK9SRKh0mUL2BjPc_RBjju5UYRJ2kCGdJ',
        'distance': '1.3 km',
        'id': '2'
    },
    {
        'name': 'Burger King',
        'image': 'https://e7.pngegg.com/pngimages/121/1018/png-clipart-hamburger-whopper-chophouse-restaurant-burger-king-cheeseburger-burger-king-logo-food-king-thumbnail.png',
        'distance': '0.5 km',
        'id': '3'
    },
    {
        'name': 'Subway',
        'image': 'https://w7.pngwing.com/pngs/852/202/png-transparent-subway-hoboken-logo-fast-food-restaurant-burger-king-thumbnail.png',
        'distance': '2.7 km',
        'id': '4'
    },
    {
        'name': 'Hardee`s',
        'image': 'https://e7.pngegg.com/pngimages/836/810/png-clipart-hardee-s-breakfast-fast-food-restaurant-eating-breakfast-thumbnail.png',
        'distance': '0.3 km',
        'id': '6'
    },
    {
        'name': 'McDonald',
        'image': 'https://www.visitdanvillearea.com/wp-content/uploads/2015/08/McDonalds-Logo-square.jpg',
        'distance': '2.8 km',
        'id': '5'
    },
    {
        'name': 'Starbucks',
        'image': 'https://d1fdloi71mui9q.cloudfront.net/1vPHHK9SRKh0mUL2BjPc_RBjju5UYRJ2kCGdJ',
        'distance': '1.3 km',
        'id': '7'
    },
    {
        'name': 'Burger King',
        'image': 'https://e7.pngegg.com/pngimages/121/1018/png-clipart-hamburger-whopper-chophouse-restaurant-burger-king-cheeseburger-burger-king-logo-food-king-thumbnail.png',
        'distance': '0.5 km',
        'id': '8'
    },
    {
        'name': 'Subway',
        'image': 'https://w7.pngwing.com/pngs/852/202/png-transparent-subway-hoboken-logo-fast-food-restaurant-burger-king-thumbnail.png',
        'distance': '2.7 km',
        'id': '9'
    },
    {
        'name': 'Hardee`s',
        'image': 'https://e7.pngegg.com/pngimages/836/810/png-clipart-hardee-s-breakfast-fast-food-restaurant-eating-breakfast-thumbnail.png',
        'distance': '0.3 km',
        'id': '10'
    },
]

const mcCards = (d, i, navigation) => {
    return (
        <TouchableOpacity onPress={() => navigation.navigate('Resturants')}>
            <View style={styles.mcCard} key={d.id}>
                <View style={{ backgroundColor: '#fff', borderRadius: 8, overflow: 'hidden' }}>
                    <Image
                        source={{ uri: d.image }}
                        style={{ width: 65, height: 70, resizeMode: 'contain' }}
                        PlaceholderContent={<ActivityIndicator />}
                    />
                </View>
                <View style={{ marginLeft: 15, width: '100%', paddingRight: 100 }}>
                    <Text style={{ fontFamily: 'Gilroy-Bold', fontSize: moderateScale(15), marginBottom: 5 }}>{d.name}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Location
                            style={{ height: 16, width: 13, marginRight: 10 }}
                        />
                        <Text numberOfLines={1} style={{ fontSize: moderateScale(12), fontFamily: 'Gilroy-Medium' }}>{d.distance} </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const Home = ({ navigation }) => {

    const myContext = useContext(AppContext)

    return (

        <View style={styles.container}>
            <View style={{ width: '100%' }}>
                <Header navigation={navigation} />
            </View>

            <SafeAreaView style={{ ...styles.container, paddingHorizontal: 20 }}>

                <FlatList
                    data={allRestT}
                    renderItem={({ item, index }) => (
                        mcCards(item, index, navigation)
                    )}
                    keyExtractor={item => item.id}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    ListHeaderComponent={
                        <View style={{ padding: 20 }}>
                            <Text style={{ fontSize: moderateScale(17), fontFamily: 'Gilroy-Bold' }}>All Restaurants</Text>
                        </View>
                    }
                />
            </SafeAreaView>

            {/* <Modal
                animationType="slide"
                transparent={true}
                visible={myContext.mapModal}
                onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                    myContext.setmapModal(!myContext.mapModal);
                }}
            >
                <MapModal navigation={navigation} />
            </Modal> */}
        </View>
    )
}

export default Home;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff'
    },
    mcCard: {
        backgroundColor: '#F6F8FA',
        shadowColor: 'black',
        shadowOffset: { width: 5, height: 5 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        borderRadius: 12, textAlign: 'center',
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    
})
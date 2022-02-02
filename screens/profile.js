import React, { useState, useRef,useContext } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity,Image ,ActivityIndicator } from 'react-native';
import { Icon ,CheckBox,Input, Button   } from 'react-native-elements';
import StackHeader from '../components/stackheader'
import EditIcon from '../assets/svg/edit.svg'
import { ScrollView } from 'react-native-gesture-handler';
import RBSheet from "react-native-raw-bottom-sheet";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import ImagePickerCropper from 'react-native-image-crop-picker';
import CameraIcon from '../assets/svg/camera.svg'
import GalleryIcon from '../assets/svg/gallery.svg'
import AppContext from '../components/appcontext'
import {  moderateScale } from 'react-native-size-matters';

const Profile = ({navigation})=>{
    const refRBSheet = useRef();
    const [editCOn,seteditCOn] = useState('camera');
    const myContext = useContext(AppContext)

    const editCard = ()=>{
        return(
            <View style={editCOn != 'camera' ? styles.mainCard : null}>
                {
                    editCOn == 'camera' ? 
                    (
                        <>
                            <TouchableOpacity style={styles.flexRow} onPress={()=> openCamer('c')}>
                                <CameraIcon style={{height:30,width:30}} />
                                <Text style={{fontFamily:'Gilroy-Medium',fontSize:moderateScale(12),marginLeft:10}}>Camera</Text>
                            </TouchableOpacity>
                                <View style={{width:'70%',height:1,backgroundColor:'lightgrey',marginVertical:15,marginLeft:'15%'}}></View>
                            <TouchableOpacity style={styles.flexRow} onPress={()=> openCamer('g')}>
                                <GalleryIcon style={{height:30,width:30}} />
                                <Text style={{fontFamily:'Gilroy-Medium',fontSize:moderateScale(12),marginLeft:10}}>Gallery</Text>
                            </TouchableOpacity>
                        </>
                    )
                    :
                    editCOn == 'frstname' ? 
                    (
                        <>
                            <Text style={{fontSize:moderateScale(12),fontFamily:'Gilroy-Medium'}}>First Name</Text>
                            <Input
                                placeholder='Jacob'
                                containerStyle={{
                                    ...styles.textContainerStyle,
                                    marginBottom:10
                                }}
                                inputContainerStyle={{
                                    ...styles.inputContainerStyle
                                }}
                            />
                        </>
                    )
                    :
                    editCOn == 'lstname' ? 
                    (
                        <>
                            <Text style={{fontSize:moderateScale(12),fontFamily:'Gilroy-Medium'}}>Last Name</Text>
                            <Input
                                placeholder='Gomez'
                                containerStyle={{
                                    ...styles.textContainerStyle,
                                    marginBottom:10
                                }}
                                inputContainerStyle={{
                                    ...styles.inputContainerStyle
                                }}
                            />
                        </>
                    )
                    : 
                    editCOn == 'email' ?
                    (
                        <>
                            <Text style={{fontSize:moderateScale(12),fontFamily:'Gilroy-Medium'}}>Email</Text>
                            <Input
                                placeholder='jacob@gmail.com'
                                containerStyle={{
                                    ...styles.textContainerStyle,
                                    marginBottom:10
                                }}
                                inputContainerStyle={{
                                    ...styles.inputContainerStyle
                                }}
                            />
                        </>
                    )
                    :
                    editCOn == 'phone' ?
                    (
                        <>
                            <Text style={{fontSize:moderateScale(12),fontFamily:'Gilroy-Medium'}}>Phone</Text>
                            <Input
                                placeholder='+1234567898'
                                containerStyle={{
                                    ...styles.textContainerStyle,
                                    marginBottom:10
                                }}
                                inputContainerStyle={{
                                    ...styles.inputContainerStyle
                                }}
                            />
                        </>
                    )
                    :
                    editCOn == 'password' ?
                    (
                        <>
                            <Text style={{fontSize:moderateScale(12),fontFamily:'Gilroy-Medium'}}>Password</Text>
                            <Input
                                placeholder='*******'
                                containerStyle={{
                                    ...styles.textContainerStyle,
                                    marginBottom:10
                                }}
                                inputContainerStyle={{
                                    ...styles.inputContainerStyle
                                }}
                            />
                        </>
                    )
                    :
                    null
                }
            </View>
        )
    }

    const openSheet = (n)=>{
        seteditCOn(n);
        setTimeout(()=>{
            refRBSheet.current.open();
        })
    }

    const openCamer = (c) =>{
        if(c == 'g'){
            ImagePickerCropper.openPicker({
                width: 300,
                height: 400,
                cropping: true,
                freeStyleCropEnabled:true
              }).then(image => {
                myContext.setprofileImagee(image.path)
              }).catch(error => {
                console.log(error);
              });;
        }else if(c == 'c'){
            ImagePickerCropper.openCamera({
                width: 300,
                height: 400,
                cropping: true,
                freeStyleCropEnabled:true
              }).then(image => {
                myContext.setprofileImagee(image.path)
              }).catch(error => {
                console.log(error);
              });
        }
        refRBSheet.current.close();
    }

    // var [profileImagee,setprofileImagee] = useState('https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png')

    return (
        <View style={styles.container}>
            <StackHeader navigation={navigation} name={'Profile'} />
            <ScrollView style={{padding:20,marginTop:10,marginBottom:0}}>

                <View style={{alignItems: 'center',marginBottom:50}}>
                    <TouchableOpacity style={{position: 'relative',height:120,width:120,backgroundColor:'#F6F8FA',borderRadius:10,overflow: 'hidden'}} onPress={() => openSheet('camera')}>
                        <Image
                            source={{ uri: myContext.profileImagee == null ? 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png' : myContext.profileImagee }}
                            style={{ width: 120, height: 120,  resizeMode: 'cover' }}
                            PlaceholderContent={<ActivityIndicator />}
                        />
                        <TouchableOpacity style={{position:'absolute',right:10,bottom:10}} onPress={() => openSheet('camera')}>
                            <EditIcon style={{height:35,width:20}}/>
                        </TouchableOpacity>
                    </TouchableOpacity>
                </View>

                <View style={styles.mainCard}>
                    <Text style={styles.nameF}>First Name</Text>
                    <Text style={styles.nameB}>Jacob</Text>
                    <TouchableOpacity style={{position:'absolute',right:15,top:10}} onPress={() => openSheet('frstname')}>
                        <EditIcon style={{height:35,width:20}}/>
                    </TouchableOpacity>
                </View>

                <View style={styles.mainCard}>
                    <Text style={styles.nameF}>Last Name</Text>
                    <Text style={styles.nameB}>Gomez</Text>
                    <TouchableOpacity style={{position:'absolute',right:15,top:10}} onPress={() => openSheet('lstname')}>
                        <EditIcon style={{height:35,width:20}}/>
                    </TouchableOpacity>
                </View>

                <View style={styles.mainCard}>
                    <Text style={styles.nameF}>Email</Text>
                    <Text style={styles.nameB}>jacob@gmail.com</Text>
                    <TouchableOpacity style={{position:'absolute',right:15,top:10}} onPress={() => openSheet('email')}>
                        <EditIcon style={{height:35,width:20}}/>
                    </TouchableOpacity>
                </View>

                <View style={styles.mainCard}>
                    <Text style={styles.nameF}>Phone</Text>
                    <Text style={styles.nameB}>+1234567898</Text>
                    <TouchableOpacity style={{position:'absolute',right:15,top:10}} onPress={() => openSheet('phone')}>
                        <EditIcon style={{height:35,width:20}}/>
                    </TouchableOpacity>
                </View>

                <View style={{...styles.mainCard,marginBottom:40}}>
                    <Text style={styles.nameF}>Password</Text>
                    <Text style={styles.nameB}>**********</Text>
                    <TouchableOpacity style={{position:'absolute',right:15,top:10}} onPress={() => openSheet('password')}>
                        <EditIcon style={{height:35,width:20}}/>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            <RBSheet
                ref={refRBSheet}
                closeOnDragDown={true}
                closeOnPressMask={true}
                customStyles={{
                    wrapper: {
                        backgroundColor: "#0000009e",
                    },
                    draggableIcon: {
                        backgroundColor: "#E6E6E6"
                    },
                    container:{
                        backgroundColor: "#fff",
                        borderTopEndRadius:20,
                        borderTopStartRadius:20
                    }
                }}
                height={editCOn != 'camera' ? 280 : 160}
            >
                <View style={{padding:20}}>
                    {editCard()}
                    {
                        editCOn != 'camera' ? 
                        (
                            <>
                                <View >
                                    <Button
                                        title="Save"
                                        buttonStyle={{
                                            backgroundColor:'#1E3865',
                                            padding:15,
                                            borderRadius:15
                                        }}
                                    />
                                </View>
                            </>
                        ) : null
                    }
                </View>
            </RBSheet>
        </View>
    )
}

export default Profile;

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#fff',
    },
    flexRow: {
        flexDirection: 'row', 
        alignItems: 'center'
    },
    mainCard:{
        backgroundColor:'#F6F8FA',padding:20,borderRadius:12,position: 'relative',marginBottom:20
    },
    textContainerStyle:{
        width:'100%',
        backgroundColor:'#fff',
        color:'#000',
        borderRadius:15,
        paddingBottom:0,
        height:60,
        marginTop:10
    },
    inputContainerStyle:{
        paddingBottom:0,
        borderColor:'transparent',
        marginTop:6,fontFamily:'Gilroy-fontFamily'
    },
    nameF:{
        fontSize:moderateScale(12),
        fontFamily:'Gilroy-Medium',color:'grey'
    },
    nameB:{
        fontSize:moderateScale(14),
        color:'#666',
        fontFamily:'Gilroy-Bold',
        marginTop:10
    }
})
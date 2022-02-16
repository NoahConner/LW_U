import { NavigationContainer } from "@react-navigation/native";
import React, { Component,useContext,useState } from "react";
import { StyleSheet, View, Switch, ScrollView } from "react-native";
import { CreditCardInput, LiteCreditCardInput } from "react-native-credit-card-input";
import { CheckBox ,Button,Text } from 'react-native-elements'
import Safe from '../assets/svg/safe.svg'
import AppContext from '../components/appcontext'
import {  moderateScale } from 'react-native-size-matters';
import axiosconfig from '../providers/axios';
import Loader from '../screens/loader';

var newCard = null;
const AddCardSheet = ({navigation,statement}) => {

    const myContext = useContext(AppContext);
    const [loader, setLoader] = useState(false);

    var allCards = myContext.paymentmethods
    const _onChange = (formData) => {
      newCard = formData
      console.log(JSON.stringify(newCard, null, " "),'sd')
    };
    const _onFocus = (field) => console.log("focusing", field);
    const [checked,setChecked] = useState(true);
    const saveCard = async() =>{
      if(newCard == null){
        alert('Please fill the card fields.')
      }
      else if(!newCard.valid){
        alert('Invalid Card!')
      }
      else if(newCard.valid){
        // var iddf = Math.floor(Math.random() * 100);
        // newCard.values["id"] = iddf
        // console.log(newCard.values);
        // allCards.push(newCard.values);
        // myContext.setpaymentmethods(allCards);
        // myContext.setcloseAllSheets(true)
        
        let cardData = {
          user_id:myContext.myData.id,
          card_cvv:newCard.values.cvc,
          card_expiry:newCard.values.expiry,
          card_no:newCard.values.number,
          card_name:newCard.values.name,
          card_type:newCard.values.type,
        }

        setLoader(true)
        await axiosconfig.post(`admin/card_add`,cardData,
        {
            headers: {
              Authorization: 'Bearer ' + myContext.userToken //the token is a variable which holds the token
            }
           }
        ).then((res:any)=>{
            console.log(res)
            setLoader(false)
            myContext.setcloseAllSheets(true)
        }).catch((err)=>{
            console.log(err)
            setLoader(false)
        })
      }
    }

  return(
        <View style={s.container}>
          {
                loader ? (
                    <>
                        <Loader />
                    </>
                ) : null
            }
            <ScrollView showsVerticalScrollIndicator={false}>
            <CreditCardInput
                autoFocus
                requiresName
                requiresCVC
                allowScroll
                labelStyle={s.label}
                inputStyle={s.input}
                validColor={"black"}
                invalidColor={"red"}
                placeholderColor={"darkgray"}
                inputContainerStyle={s.Cinput}

                onFocus={e => _onFocus(e)}
                onChange={e => _onChange(e)} />

                <View>
                  {
                    statement != 'payment-method' ?
                    (
                      <>
                      <CheckBox
                        center
                        title='Save my card'
                        checked={checked}
                        checkedColor='#1E3865'
                        textStyle={{fontSize:moderateScale(16),fontFamily:'Gilroy-Medium'}}
                        containerStyle={{width:180,backgroundColor:'transparent',borderColor:'transparent',}}
                        onPress={()=> setChecked(!checked)}
                      />
                      </>
                    ) 
                    : 
                    (
                      null
                    )
                  }
                    
                    <View style={{paddingHorizontal:20
                    }}>
                        <Button
                            title="Save"
                            onPress={()=>saveCard()}
                            buttonStyle={{backgroundColor:'#1E3865',padding:20,borderRadius:15,marginTop:10}}
                        />

                        <View style={{flexDirection:'row',alignItems: 'center',justifyContent:'center',marginTop:15,marginBottom:10}}>
                            <Safe  />
                            <Text style={{fontSize:moderateScale(16),color:'#666666',marginLeft:10}}>We`ll keep your payment details safe</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
  )
}

export default AddCardSheet

const s = StyleSheet.create({
    container: {
      backgroundColor: "#fff",
      marginTop: 10,
      paddingBottom:30
    },
    label: {
      color: "black",
      fontSize: 15,
      marginBottom:10
    },
    input: {
      fontSize: moderateScale(18),
      color: "black",
      backgroundColor: "#F6F8FA",
      height:65,
      paddingLeft:20,
      borderRadius:15
    },
    Cinput:{
        backgroundColor: "transparent",
    }
  });
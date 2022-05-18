import React, { useContext,useState, useEffect } from 'react';
import AppContext from '../components/appcontext';
import axiosconfig from '../providers/axios';

const Api = () => {
    const myContext = useContext(AppContext);

    const getWallet = async() => {
        const value = await AsyncStorage.getItem('@auth_token');
        await axiosconfig.get(`admin/current_wallet`,
        {
            headers: {
              Authorization: 'Bearer ' + value //the token is a variable which holds the token
            }
           }
        ).then((res:any)=>{
            myContext.setWalletAmount(res.data.wallet)
        }).catch((err)=>{
           
        })
    }

    const myDataR = async() => {
        const value = await AsyncStorage.getItem('@auth_token');
        await axiosconfig.get(`admin/my_data`,
        {
            headers: {
              Authorization: 'Bearer ' + value //the token is a variable which holds the token
            }
           }
        ).then((res:any)=>{
        
            myContext.setMyData(res.data)
        }).catch((err)=>{
 
        })
    }

    useEffect(() => {
        getWallet()
        myDataR()
    }, [])
    

}

export default Api
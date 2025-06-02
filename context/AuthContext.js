import { View, Text } from 'react-native'
import React, { Children } from 'react'
import { useState } from 'react';
import { createContext } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { switchTheme } from '@/constants/colors';


export const AuthContext = createContext(null);
export default function AuthProvider({children}) {
    
    const [user, setUser] = useState(null);
    const [selectedPost, setSelectedPost] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [token, setToken] = useState(null);
    const [isCheckingUser, setIsCheckingUser] =  useState(true)
    
    

    const register = async (username, email, password) => {
        setIsLoading(true);
        try{
            const response = await fetch('http://192.168.1.3:3000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    email,
                    password
                })
            })
            const data = await response.json();
            if (response.ok) {
                await AsyncStorage.setItem('user', JSON.stringify(data.user));
                await AsyncStorage.setItem('token', data.token);
                setUser(data.user);
                setToken(data.token);
                setIsLoading(false);
                return {success: true}
            } else {
                
                setIsLoading(false);
                return {success: false, message: data.message}
            }
        }catch (error) {
            console.error('Error:', error);
        }
    }
    const checkUser = async () => {
        try{
        const userData = await AsyncStorage.getItem('user');
        const tokenData = await AsyncStorage.getItem('token');
        
        const parsedUser = userData ? JSON.parse(userData) : null;
        //const parsedToken = tokenData ? JSON.parse(tokenData) : null;
        setToken(tokenData);
        setUser(parsedUser);
    }catch (error) {
        console.error('Error:', error);
    }finally {
        setIsCheckingUser(false);
    }

    }
    const logout = async () => {
        router.push('/(auth)')
        setUser(null);
        setToken(null);
        await AsyncStorage.removeItem('user');
        await AsyncStorage.removeItem('token');
        try{
            const response = await fetch('http://192.168.1.3:3000/api/auth/cleanPushToken', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: user.id
                })
            })
            console.log("DELETED TOKEN: ", JSON.stringify(user))
        }catch(e){
            console.log(e);
        }
    }
    const login = async (email, password) => {
        setIsLoading(true);
        try{
            const response = await fetch('http://192.168.1.3:3000/api/auth/login',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password
                })
            })
            const data = await response.json();
            if(response.ok){
                await AsyncStorage.setItem('user', JSON.stringify(data.user));
                await AsyncStorage.setItem('token', data.token);
                setUser(data.user);
                setToken(data.token);
                setIsLoading(false);
                return {success: true}
            }else{
                setIsLoading(false);
                console.log('Error:', response);
                return {success: false, message: data.message}
            }
        }catch (error) {
            return {success: false, message: error.message}
        }
    }
    
  return (
    <AuthContext.Provider value={{user, setUser, register, isLoading, setIsLoading, token, setToken,
     checkUser, login, logout, isCheckingUser, selectedPost, setSelectedPost}}>
        {children}
    </AuthContext.Provider>
  )
}
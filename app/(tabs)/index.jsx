import { View, Text, FlatList, ActivityIndicator, RefreshControl, TouchableOpacity } from 'react-native'
import { Image } from 'expo-image';
import React, { useCallback, useEffect } from 'react'
import { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useFocusEffect, usePathname, useRouter } from 'expo-router';
import styles from '@/assets/styles/home.styles';
import { Ionicons } from '@expo/vector-icons';
//import COLORS from '@/constants/colors';


import { formatPublishDate } from '@/lib/utils';

import { PreferencesContext } from '@/context/PreferencesContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import  {usePushNotifications}  from '@/usePushNotifications';
//import * as Device from "expo-device";


export default function Home() {
    const {user, token, selectedPost, setSelectedPost} = useContext(AuthContext);
    const { COLORS } = useContext(PreferencesContext);
    const [loading, setLoading] = useState(true);
    const [isCheckingTheme, setIsCheckingTheme] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [issues, setIssues] = useState([]);
    const [page, setPage] = useState(0);
    
    const {expoPushToken, notification} = usePushNotifications();

    const data = JSON.stringify(notification, undefined, 2)
    
    const router = useRouter()
    const timeout = (ms) => new Promise((resolve)=> setTimeout(resolve, ms));



    const getColor = async () => {
        try {
            const value = await AsyncStorage.getItem('COLORS');
            const parsedValue = JSON.parse(value);
            return parsedValue;
        } catch (e) {
            console.log("ERROR HERE: ", e);
        }
    };
    const storeColor = async (color) => {
        try {
            const prepColor = JSON.stringify(color);
            await AsyncStorage.setItem('COLORS',prepColor );
        } catch (e) {
            console.log("ERROR HERE: ", e); 
        }
    };
    useEffect(()=>{
        console.log("EXPO PUSH TOKEN: ", data)
        if(COLORS !== null){
            
            if(getColor() !== COLORS){
                storeColor(COLORS);
            }
            setIsCheckingTheme(false);
        }
    },[COLORS])

    
    useEffect(()=>{
       
        if(selectedPost){
           
           router.push(`/(details)/details`)
        }
    },[selectedPost])
    const fetchData = async (pageNum=1, refresh=false) => {
            try{
                
                //setThisPath(currentPath);
                if(refresh) setRefreshing(true);
                else if(pageNum===1) setLoading(true);
                const response = await fetch(`http://192.168.1.3:3000/api/issueRoutes/?page=${pageNum}`, {
                    method: 'GET',
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }})
                const data = await response.json();

                if (response.ok) {
                //setIssues([...issues, ...(Array.isArray(data.issues) ? data.issues : [data.issues])]);
                //setIssues((prevIssues) => [...prevIssues, ...data.issues]);
                
                const uniqueIssues = refresh || pageNum === 1 ? data.issues : 
                [...new Map([...issues, ...data.issues].map(item => [item._id, item])).values()];
                setIssues(uniqueIssues);
                setHasMore(pageNum < data.totalPages);
                //setLoading(false);
                setPage(pageNum);
                
                } else {
                console.error('Response not OK:', data);
                //setLoading(false);
                }
               
                
                
            }catch (error) {
                console.error(error);
            } finally {
                if(refresh) setRefreshing(false);
                 setLoading(false);
            }
        }
        const savePushToken = async ()=> {
            try{
                const response = await fetch("http://192.168.1.3:3000/api/notificationRoutes/", {
                    method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    token: expoPushToken.data,
                    userId: user.id
                })
                })
                
            }catch(e){
                console.log(e);
            }
        }
    useEffect(() => {
        
        fetchData();
        
    }, []);
    useEffect(()=>{
        if(!user.notificationToken){
           
            savePushToken();
        }    
    }, [expoPushToken])
    useEffect(()=>{
        if(COLORS){
            setIsCheckingTheme(false)
            
        }
    },[COLORS])
      if(isCheckingTheme) return <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size={'large'} color={'black'}></ActivityIndicator></View>;
    
    const renderItem = ({item}) => (
        <TouchableOpacity activeOpacity={0.9} onPress={()=>{ setSelectedPost(item);}}>
        <View style={styles(COLORS).bookCard}>
            <View style={styles(COLORS).bookHeader}>
                <View style={styles(COLORS).userInfo}>
                    <Image source={{uri: item.user.profileImage}} style={styles(COLORS).avatar} />                   
                        <Text style={styles(COLORS).username}>{item.user.username}</Text>                        
               </View>
            </View>
            <View style={styles(COLORS).bookImageContainer}>
                <Image source={{uri: item.image}} style={styles(COLORS).bookImage} contentFit='cover'/>
            </View>
            <View style={styles(COLORS).bookDetails}>
                <Text style={styles(COLORS).bookTitle}>{item.title}</Text>
                
                <View style={styles(COLORS).ratingContainer}>
                    {renderLevel(item.level)}
                    
                </View>
                <Text style={styles(COLORS).bookDescription} numberOfLines={2}>{item.description}</Text>
                <Text style={styles(COLORS).date}>Shared on {formatPublishDate(item.createdAt)}</Text>
            </View>
        </View>
        </TouchableOpacity>
    )
    const renderLevel = (level) => {
        const levels = [];
        for (let i = 1; i <= 5; i++) {
            levels.push(
                <Ionicons key={i} name={i<=level ? "alert-circle" : "alert-circle-outline" } size={20} 
                color={i<=level ? "#c20000" : COLORS.textSecondary} style={{marginRight: 2}} />
            );
        }
        return levels;
    }
    const handleLoadMore = async () => {
        if (hasMore) {
            //setPage((prevPage) => prevPage + 1);
            await fetchData(page+1);
        }
    }
    if(loading) return(
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator size={"small"} color={COLORS.primary}></ActivityIndicator>
        </View>
    )
    if (!COLORS) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
    //if(!user) router.replace('/(auth)/');
  return (
    <>
    {user ?
    <View style={styles(COLORS).container}>
        
      <FlatList
      data={issues}
      
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles(COLORS).listContainer}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
            <View style={styles(COLORS).header}>
                <Text style={styles(COLORS).headerTitle}>Fix My Car</Text>
                <Text style={styles(COLORS).headerSubtitle}>Find solutions for your problem</Text>
            </View>
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        ListEmptyComponent={
            <View style={styles(COLORS).emptyContainer}>
                <Ionicons name="book-outline" size={50} color={COLORS.textSecondary} />
                <Text style={styles(COLORS).emptyTitle}>No posts found</Text>
                
            </View>
        }
        ListFooterComponent={
            hasMore && issues.length > 0 ? 
                <ActivityIndicator size={"small"} color={COLORS.primary}></ActivityIndicator>: null
        }
        refreshControl={
            <RefreshControl
            refreshing={refreshing}
            onRefresh={ ()=> {
               
                fetchData(1, true)
                
            }}
            colors={[COLORS.primary]}
             />
        }
      ></FlatList>
      
    </View> : <></>}
    
    </>
  )
}
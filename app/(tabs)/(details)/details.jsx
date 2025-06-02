import { View, Text, BackHandler, ActivityIndicator } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import { Image } from 'expo-image';
import styles from '@/assets/styles/home.styles'
import { useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { router, useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { formatPublishDate } from '@/lib/utils';
import { PreferencesContext } from '@/context/PreferencesContext';

export default function Details() {
  const {setSelectedPost, selectedPost} = useContext(AuthContext);
  const {COLORS} = useContext(PreferencesContext);
  
  const detailsStyles = useMemo(()=>{
    if(!COLORS) return null;
    return styles(COLORS);
  }, [COLORS])
  
  
useFocusEffect(
  useCallback(()=>{

    return () => {setSelectedPost(null)}
  },[])
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
    if(!detailsStyles) return <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator size='large' color={"black"} />
    </View>
  return (
    <>
    {selectedPost ? <View style={[detailsStyles.container, {padding: 10}]}>
      <View style={detailsStyles.bookCard}>
        <View style={detailsStyles.bookHeader}>
                <View style={detailsStyles.userInfo}>
                    <Image source={{uri: selectedPost.user.profileImage}} style={detailsStyles.avatar} />                   
                        <Text style={detailsStyles.username}>{selectedPost.user.username}</Text>                        
               </View>
            </View>
            <View style={detailsStyles.bookImageContainer}>
                <Image source={{uri: selectedPost.image}} style={detailsStyles.bookImage} contentFit='cover'/>
            </View>
        <Text style={detailsStyles.bookTitle}>{selectedPost.title}</Text>
        <Text style={[detailsStyles.caption, {marginTop: 10}]}>Critical factor:</Text>
        <View style={detailsStyles.ratingContainer}>
                    {renderLevel(selectedPost.level)}
                    
        </View>
        <Text style={[detailsStyles.caption, {marginTop: 10}]}>{selectedPost.description}</Text>
        <View style={{justifyContent: 'flex-end', alignItems: 'flex-end'}}>
          <Text style={detailsStyles.date}>{formatPublishDate(selectedPost.createdAt)}</Text>
        </View>
      </View>
      
    </View> : <></>}
    </>
  )
}

import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Image } from 'react-native';
import { Theme } from '../../constant/theme';
import { FlatList } from 'react-native';
import axios from 'axios';
import { Base_Uri } from '../../constant/BaseUri';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LatestNews = ({ latestNewsData, navigation }: any) => {
  const LatestNewsArray = [
    {
      id: '1',
      imageSource: require('../../Assets/Images/SplashScreen.png'),
      title: 'The Status of the Teach..',
      timestamp: '16 Dec | 10:40 PM',
    },
    {
      id: '2',
      imageSource: require('../../Assets/Images/SplashScreen.png'),
      title: 'The Status of the Teach..',
      timestamp: '16 Dec | 10:40 PM',
    },
  ];
  const routeToInboxDetails = async (item: any) => {
    navigation.navigate('InboxDetail',  item.id);
    const data: any = await AsyncStorage.getItem('loginAuth');
    let loginData = JSON.parse(data);

    let { tutorID } = loginData;
    axios
      .get(
        `${Base_Uri}api/newsStatusUpdate/${item.id}/old/${tutorID}`,
      )
      .then(res => {
        console.log('successfully update tutor status');
      })
      .catch(error => {
        console.log(error, 'error');
      });
  };
  const renderItemLatestNews = ({ item }: any) => {
    return (
      (
        <TouchableOpacity onPress={() => routeToInboxDetails(item)}>
          <View
            style={{
              marginRight: 5,
              marginVertical: 10,
              gap: 2,
              marginBottom: 40,
            }}>
            <Image
              source={{ uri: item?.headerimage }}
              resizeMode='contain'
              style={{ borderRadius: 10, width: 155, height: 90 }}
            />
            <View style={{ marginTop: 3 }}></View>
            <Text style={[styles.textType3, { fontFamily: 'Circular Std Book', fontSize: 13 }]}>
              {item.subject}
            </Text>
            <Text
              style={[
                styles.textType3,
                { color: Theme.IronsideGrey, fontFamily: 'Circular Std Book', fontSize: 13 },
              ]}>
              {item.date_time}
            </Text>
          </View>
        </TouchableOpacity>
      )
    )
  }

  return (
    <View>
      <FlatList
        data={latestNewsData}
        keyExtractor={item => item.id}
        renderItem={renderItemLatestNews}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  )
}

export default LatestNews

const styles = StyleSheet.create({
  textType3: {
    color: Theme.Dune,
    fontSize: 16,
    fontFamily: 'Circular Std Medium',
  },
})
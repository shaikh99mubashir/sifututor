import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Linking,
  TouchableOpacity,
  ScrollView,
  ToastAndroid,
  ActivityIndicator,
  Image,
  Dimensions,
  StyleSheet,
} from 'react-native';
import CustomHeader from '../../Component/Header';
import { Theme } from '../../constant/theme';
import axios from 'axios';
import HTML from 'react-native-render-html';
import { Base_Uri } from '../../constant/BaseUri';
import { useSafeAreaFrame } from 'react-native-safe-area-context';
import CustomLoader from '../../Component/CustomLoader';

function InboxDetail({ navigation, route }: any) {
  let data = route.params;
  // console.log("data",data);
  
  const [loading, setLoading] = useState(false);
  const [newsData, setNewsData] = useState<any>({});
// console.log("newsData",newsData);

  // const handleLinkPress = (url: any) => {
  //     // Replace with your desired URL
  //     Linking.openURL(`https://${url}`);
  // };

  console.log("data?.id news detail",data?.id);
  

  const getDetailedNews = () => {
    setLoading(true);
    axios
      // .get(`${Base_Uri}api/detailedNews/17`)
      .get(`${Base_Uri}api/detailedNews/${data}`)
      .then(({ data }) => {
        let { detailedNEWS } = data;
        setNewsData(detailedNEWS);
        setLoading(false);
      })
      .catch(error => {
        setLoading(false);

        // ToastAndroid.show('Internal Server Error', ToastAndroid.SHORT);
      });
  };

  useEffect(() => {
    getDetailedNews();
  }, []);

  // console.log('data', data);
  const [loading1, setLoading1] = useState(true);
  const imageUrl = data?.headerimage; // Replace with your image URL

  const handleImageLoad = () => {
    setLoading(false); // Set loading to false when image is loaded
  };
  // loading ? (
  //   <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
  //     <ActivityIndicator size="large" color={'black'} />
  //   </View>
  // ) : 
  return (
    <View style={{ flex: 1, backgroundColor: Theme.GhostWhite }}>

      <View>
        <CustomHeader
          backBtn
          title={'News Detail'}
          navigation={navigation}
          containerStyle={{ height: 60 }}
        />
      </View>

      <ScrollView style={{ height: '100%' }}>
        <View style={{ paddingHorizontal: 28 }}>
          <View style={{ margin: 5 }}></View>
          {newsData?.subject && (
            <Text style={styles.textType1}>
              {newsData?.subject}
            </Text>
          )}
          <View style={{ margin: 5 }}></View>
          {newsData?.preheader && (
            <Text style={[styles.textType3, { fontSize: 18 }]}>
              {newsData?.preheader}
            </Text>
          )}
          <View style={{ margin: 2 }}></View>
          <Text
              style={[
                styles.textType3,
                { color: Theme.IronsideGrey, fontFamily: 'Circular Std Book', fontSize: 13 },
              ]}>
              {newsData?.date_time}
            </Text>
        </View>
        <View style={{ margin: 5 }}></View>

        

        {newsData?.headerimage && (
          <Image
            source={{ uri: newsData?.headerimage }}
            style={{
              // width: '95%',
              width: Dimensions.get('screen').width,
              // height: Dimensions.get('screen').height ,
              height: 400,
              // backgroundColor:'red',
              // marginVertical: 15,
              display: loading ? 'none' : 'flex', // Show the image when loading is false
            }}
            resizeMode="contain"
            onLoad={handleImageLoad}
          />
        )}



        <View style={{paddingHorizontal:25, marginBottom:25}} >

          <HTML
            source={{ html: newsData?.content }}
            ignoredDomTags={['o:p']}
            contentWidth={300} // Set the content width as per your design
            baseStyle={{
              // textAlign: 'justify',
              // fontSize: 14,
              // color: Color.textColor,
              marginTop: 10,
              fontFamily: 'Circular Std Medium',
              color: 'black',
            }}
          />
        </View>
        <CustomLoader visible={loading} />

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  textType1: {
    fontWeight: '500',
    fontSize: 24,
    color: Theme.Dune,
    fontFamily: 'Circular Std Medium',
    lineHeight: 24,
    fontStyle: 'normal',
  },
  textType3: {
    color: Theme.Dune,
    fontSize: 16,
    fontFamily: 'Circular Std Book',
    lineHeight: 22,
    fontWeight: 400,
  },
});


export default InboxDetail;

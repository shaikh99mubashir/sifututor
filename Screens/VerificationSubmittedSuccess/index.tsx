import { Image, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Theme } from '../../constant/theme'
import CustomButton from '../../Component/CustomButton'

const VerificationSubmittedSuccess = ({navigation}:any) => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContainer} showsHorizontalScrollIndicator={false}>
        <Image
          source={require('../../Assets/Images/thankyou.png')}
          style={{ resizeMode: 'contain', marginTop: 20, alignSelf: 'center' }}
        />
        <View style={{alignItems:'center', marginTop:30}}>
          <Text style={[styles.textType1,{lineHeight:30}]}>
          Thank You!
          </Text>
          <View style={{margin:5}}></View>
          <Text style={styles.textType3}>
          We have Received Your Application.
          </Text>
        </View>
      
      </ScrollView>
      <View style={{width:'80%', marginBottom:70}}>
          <CustomButton btnTitle='Done' onPress={() => navigation.navigate('Home')} />
          <View style={{margin:8}}></View>
          <Text style={[styles.textType3,{textAlign:'center', fontFamily: 'Circular Std Book',}]}>
          We will reach out to you once your profile has been verified.
          </Text>
      </View>
    </View>
  )
}

export default VerificationSubmittedSuccess

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Theme.GhostWhite,
        paddingHorizontal: 15,
      },
      scrollViewContainer: {
        flexGrow: 1,
        justifyContent: 'center',
      },
      textType3: {
        color: Theme.Dune,
        fontWeight: '500',
        fontSize: 16,
        fontFamily: 'Circular Std Medium',
        fontStyle: 'normal',
      },
      textType1: {
        fontWeight: '500',
        fontSize: 26,
        color: Theme.Black,
        fontFamily: 'Circular Std Medium',
        lineHeight: 24,
        fontStyle: 'normal',
      },
})